const express = require('express');
const router = express.Router();
const fileUpload = require("express-fileupload");
const FitParser = require('fit-file-parser').default;
const _ = require("lodash")

const isAuth = require('./authMiddleware').isAuth;
const connection = require('../config/database');
const createWorkout = require("../model/createWorkout");
const {trimTo2Digit} = require('../lib/numberUtils')
const getWorkoutObjectFromFile = require("../lib/getWorkoutObjectFromFile");
const {getWeeklyWorkout} = require("../lib/timeUtils");

const User = connection.models.User;


//get an user's workout collection with basic data
router.get("/basic", isAuth, async (req, res) => {
    const userDoc = await  User.findOne({username:req.user.username});
    const workoutsBasic = userDoc.workoutsCollection.map( 
        (workout) => {
            const {id:workoutId, workoutTimestamp, status, basic, power,} = workout;

             return {
                 workoutId,
                 status,
                 workoutTimestamp,
                 basic,
                 power,
             };
         } 
    );
 
    res.send(workoutsBasic);        
 });
 
 router.get("/get/basic/:workoutId", async (req, res) => {
    const {workoutId} = req.params
    const userDoc = await  User.findOne({username:req.user.username});
    const workout = userDoc.workoutsCollection.filter( workout => workout.id === workoutId )[0];
    res.send(workout);
 } );

 //get an particular workout's detailed data
 router.get("/get/detail/:workoutId", isAuth, async (req,res)=>{
     const workoutId = req.params.workoutId;
     
     const userDoc = await User.findOne({username:req.user.username});
 
     const workout = userDoc.workoutsCollection.find((workout)=>workout.id===workoutId);
 
     res.send(workout.detail? workout.detail : "This Workout Has No Detail");
 
 });

 router.get("/get/detail/zonePercent/:workoutId", isAuth, async (req, res) => {
    const workoutId = req.params.workoutId;
     
    const userDoc = await User.findOne({username:req.user.username});

    const workout = userDoc.workoutsCollection.find((workout)=>workout.id===workoutId);

    const workoutDetail = workout.detail;
    const trainingZones = userDoc.power.trainingZones;
    const zoneArr = [0,0,0,0,0,0,0];
    console.log("calculating zone percent")
    workoutDetail.forEach( unit => {
        if (unit.power < trainingZones.activeRecovery) {
            zoneArr[0]+=1;
        } else if (unit.power < trainingZones.endurance) {
            zoneArr[1]+=1;
        } else if (unit.power < trainingZones.tempo) {
            zoneArr[2]+=1
        } else if (unit.power < trainingZones.lactateThreshold) {
            zoneArr[3]+=1;
        } else if (unit.power < trainingZones.vo2Max) {
            zoneArr[4]+=1
         }else if (unit.power < trainingZones.anaerobicCapacity) {
            zoneArr[5]+=1;
        } else {
            zoneArr[6]+=1
        }
    } );

    const zoneSum = _.sum(zoneArr);
    const zonePercent = [];

    for (let i = 0; i < zoneArr.length; i++) {
        const zoneNum = zoneArr[i];
        const percent = trimTo2Digit(zoneNum / zoneSum);
        zonePercent.push( {
            name: i,
            percent:parseInt(percent*100),
        } );
    }

    res.send(zonePercent);
 })
 
 router.get("/weeklyWorkout",isAuth, async (req, res) => {
     const userDoc = await User.findOne({username:req.user.username});
     const weeklyWorkouts = getWeeklyWorkout(userDoc.workoutsCollection);
     let weekInfo = getWeekTemplate();
     weeklyWorkouts.forEach( workout => {
         const weekIndex = workout.weekDay === 0? 6 : workout.weekDay - 1;
         weekInfo[weekIndex].workouts.push({
             status:workout.status,
             workoutId:workout.workoutId,
             workoutTimestamp:workout.workoutTimestamp,
             weekDay:weekIndex + 1,
             planned:workout.planned,
             basic:workout.basic,
             power:workout.power,
         })
     });
     res.send(
         {
             weekInfo,
         }
     );
})

 //save a workout's basic information into the database
 router.post("/add/basic",isAuth, async (req, res) => {
     const {
         status,
         workoutTimestamp,
         planned,
         basic, 
         power, 
        } = req.body;
    
     const userDoc = await User.findOne({username:req.user.username});

     const workout = createWorkout(workoutTimestamp,status,planned,basic,power);
 
     userDoc.workoutsCollection.push(workout);

     await userDoc.save();
     const length = userDoc.workoutsCollection.length;
     res.send(userDoc.workoutsCollection[length-1].id);
 });
 
 // upload an fit file and save the interpreted data into the 
 // database and return an object contains this workout's entire data
 router.use(fileUpload())
 
 router.post("/add/upload", isAuth, (req,res)=>{
     console.log("Uploading");
     const workFile = req.files.workoutfile.data;
     const workoutTimestamp = parseInt(req.body.workoutTimestamp);
     //   Create a FitParser instance (options argument is optional)
     const fitParser = new FitParser({
         force: true,
         speedUnit: 'km/h',
         lengthUnit: 'km',
         temperatureUnit: 'kelvin',
         elapsedRecordField: true,
         mode: 'cascade',
     });
     fitParser.parse(workFile, async (err, data) => {
         if (err) {
             res.send("Error when parsing data.");
         }
 
         const currentFTP = req.user.power.FTP;
         //construct the workout object from fileData and other information
         const workout = getWorkoutObjectFromFile(data, currentFTP, workoutTimestamp, "completed");
         workout.updateNP();
         workout.updateIF();
         workout.updateTSS();
         workout.updateVI();
         if (Object.keys(workout.detail).length) {
             workout.detail.forEach( unit => {
                 unit.altitude = unit.altitude * 1000; 
             } )
         }
         const userDoc =  await User.findOne({username: req.user.username});
         userDoc.workoutsCollection.push(workout);
         await userDoc.save();
         // schedule a macro task to update the CTL,ATL and TSB
         setTimeout( async ()=>{
             // calculate the new CTL, ATL, and TSB
             await userDoc.updateTrainingLoad();
 
             await userDoc.updatePowerProfile(workout.detail);
         });
         const workoutId = userDoc.workoutsCollection[userDoc.workoutsCollection.length - 1].id;
         res.send(workoutId);
     });
 })
 
 router.post("/edit/basic/:workoutId", async (req, res)=>{
     const { workoutId }= req.params;
     const userDoc = await User.findOne({username:req.user.username});
     const workoutsCollection = userDoc.workoutsCollection;
     const editingWorkout = workoutsCollection.filter( workout => workout.id === workoutId )[0];
     Object.assign( editingWorkout, req.body );
     await userDoc.save();
     res.send(JSON.stringify(editingWorkout));
 });

 router.delete("/deleteWorkoutsCollection",async (req,res) => {
     const doc = await User.findOne({username:req.user.username});
     doc.workoutsCollection = [];
     await doc.save();
     res.send("Deleted")
 });
 
 router.post("/updatePowerProfile", async (req, res) => {
     const doc = await User.findOne({username:req.user.username});
     const workFile = req.files.workoutfile.data;
 
     const getMaxAvgPower = (duration) => (powerArr) => {
         let maxAvg;
         if (powerArr.length < duration) {
             return null;
         }
         for (let i = 0; i < powerArr.length - duration; i++) {
             let sumOfPower = 0;
             for (let j = 0; j < duration; j++) {
                 sumOfPower += powerArr[i+j];
             }
             let avg = sumOfPower/duration;
             maxAvg = maxAvg > avg? maxAvg : avg;
         }
 
         return maxAvg;
     }
 
     const getPowerProfile = (workoutDetail) => {
         const powerArr = workoutDetail.map( info => info.power );
 
         return {
             max5s : getMaxAvgPower(5)(powerArr),
             max30s: getMaxAvgPower(30)(powerArr),
             max1mins: getMaxAvgPower(60)(powerArr),
             max5mins: getMaxAvgPower(300)(powerArr),
             max20mins: getMaxAvgPower(1200)(powerArr),
             max60mins: getMaxAvgPower(3600)(powerArr),
         };
     }
     
     const needUpdate = (originalProfile, newProfile) => {
         let indicator = false;
 
         const keys = Object.keys(originalProfile);
 
         keys.forEach( key => {
             if (originalProfile[key] < newProfile[key] || !originalProfile[key]) {
                 indicator = true;
                 return false;
             }
         } )
         
         return indicator;
     }
 
     const handleUpdatePowerProfile  = async (err, data) => { 
         if (err) {
             console.log(err);
         }
         const workoutTimestamp = parseInt(req.body.workoutTimestamp);
 
         const currentFTP = req.user.power.FTP;
 
         //construct the workout object from fileData and other information
         const workout = getWorkoutObjectFromFile(data,currentFTP,workoutTimestamp);
 
         const originalPowerProfile = doc.power.powerProfile;
 
         const newPowerProfile = getPowerProfile(workout.detail);
 
         if ( needUpdate(originalPowerProfile,newPowerProfile) ) {
             doc.power.powerProfile = newPowerProfile;
             await doc.save();
             res.send(JSON.stringify(newPowerProfile));
         } else {
             res.send("No need for update");
         }
     };
 
     const fitParser = new FitParser({
         force: true,
         speedUnit: 'km/h',
         lengthUnit: 'km',
         temperatureUnit: 'kelvin',
         elapsedRecordField: true,
         mode: 'cascade',
     });
 
     fitParser.parse(workFile, handleUpdatePowerProfile);
 });

 module.exports = router;

const getWeekTemplate = () => ([
    {
        day: "Mon",
        dayNum:1,
        workouts:[]
    },
    {
        day: "Tue",
        dayNum:2,
        workouts:[],
    },
    {
        day: "Wed",
        dayNum:3,
        workouts:[],
    },
    {
        day: "Thur",
        dayNum:4,
        workouts:[],
    },
    {
        day: "Fri",
        dayNum:5,
        workouts:[],
    },
    {
        day: "Sat",
        dayNum:6,
        workouts:[],
    },
    {
        day: "Sun",
        dayNum:7,
        workouts:[],
    },
])


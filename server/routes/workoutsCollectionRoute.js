const express = require('express');
const router = express.Router();
const fileUpload = require("express-fileupload");
const FitParser = require('fit-file-parser').default;

const isAuth = require('./authMiddleware').isAuth;
const connection = require('../config/database');
const createWorkout = require("../model/createWorkout");

const getWorkoutObjectFromFile = require("../lib/getWorkoutObjectFromFile");
const {weekTimeRange} = require("../lib/timeUtils");

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
 
 //get an particular workout's detailed data
 router.get("/detail/:workoutId", isAuth, async (req,res)=>{
     const workoutId = req.params.workoutId;
     
     const userDoc = await User.findOne({username:req.user.username});
 
     const workout = userDoc.workoutsCollection.find((workout)=>workout.id===workoutId);
 
     res.send(workout.detail? workout.detail : "This Workout Has No Detail");
 
 })
 
 router.get("/weeklyWorkout",isAuth, async (req, res) => {
     const userDoc = await User.findOne({username:req.user.username});
     const [weekStart, weekEnd] = weekTimeRange();
     console.log({
         weekStart,
         weekEnd,
     })
 
     const weeklyWorkouts = userDoc.workoutsCollection
                                     .filter((workout) => ((workout.workoutTimestamp >= weekStart && workout.workoutTimestamp <=weekEnd)? true : false) )
                                     .map( workout => ({
                                         workoutId:workout.id,
                                         status: workout.status,
                                         workoutTimestamp:workout.workoutTimestamp,
                                         weekDay:new Date(workout.workoutTimestamp).getDay(),
                                         basic:workout.basic,
                                         power:workout.power,
                                     }) 
                                   )
     
     let weekInfo = [{
             day: "Mon",
             dayNum:1,
             // status:["not-scheduled","scheduled","completed"]
             workouts:[]
         },
         {
             day: "Tue",
             dayNum:2,
             // status:["not-scheduled","scheduled","completed"]
             workouts:[],
         },
         {
             day: "Wed",
             dayNum:3,
             // status:["not-scheduled","scheduled","completed"]
             workouts:[],
         },
         {
             day: "Thur",
             dayNum:4,
             // status:["not-scheduled","scheduled","completed"]
             workouts:[],
         },
         {
             day: "Fri",
             dayNum:5,
             // status:["not-scheduled","scheduled","completed"]
             workouts:[],
         },
         {
             day: "Sat",
             dayNum:6,
             // status:["not-scheduled","scheduled","completed"]
             workouts:[],
         },
         {
             day: "Sun",
             dayNum:7,
             // status:["not-scheduled","scheduled","completed"]
             workouts:[],
         },
     ];
 
     weeklyWorkouts.forEach( workout => {
         const weekIndex = workout.weekDay === 0? 6 : workout.weekDay - 1;
         weekInfo[weekIndex].workouts.push({
             status:workout.status,
             workoutId:workout.workoutId,
             workoutTimestamp:workout.workoutTimestamp,
             weekDay:weekIndex + 1,
             basic:workout.basic,
             power:workout.power,
         })
     } )
     
     res.send(
         {
             weekInfo,
         }
     )
     
 })
 
 //save a workout's basic information into the database
 router.post("/add/basic",isAuth, async (req, res) => {
     const basicWorkoutInfo = req.body.basic;
     const basicPowerInfo = req.body.power;
 
     const userDoc = await User.findOne({username:req.user.username});
 
     const workout = createWorkout({...basicWorkoutInfo},{...basicPowerInfo});
 
     userDoc.workoutsCollection.push(workout);
 
     await userDoc.save();
 
     res.send("Basic Power Info Saved")
 });
 
 // upload an fit file and save the interpreted data into the 
 // database and return an object contains this workout's entire data
 router.use(fileUpload())
 
 router.post("/add/upload", isAuth, (req,res)=>{
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
             console.log(err);
         }
 
         const currentFTP = req.user.power.FTP;
 
         //construct the workout object from fileData and other information
         const workout = getWorkoutObjectFromFile(data, currentFTP, workoutTimestamp, "completed");
   
         workout.updateNP();
         workout.updateIF();
         workout.updateTSS();
         
         //then save the workout into the collection
         const userDoc =  await User.findOne({username: req.user.username});
         userDoc.workoutsCollection.push(workout);
         
         await userDoc.save();
 
         // schedule a macro task to update the CTL,ATL and TSB
         setTimeout( async ()=>{
             // calculate the new CTL, ATL, and TSB
             await userDoc.updateTrainingLoad();
 
             await userDoc.updatePowerProfile(workout.detail);
         });
 
         res.send("Workout Saved");
     });
 
 })
 
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
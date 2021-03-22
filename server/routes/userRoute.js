const express = require('express');
const router = express.Router();
const isAuth = require('./authMiddleware').isAuth;
const connection = require('../config/database');
const User = connection.models.User;
const FitParser = require('fit-file-parser').default;
const fileUpload = require("express-fileupload");
const createWorkout = require("../model/createWorkout");
const getWorkoutObjectFromFile = require("../lib/getWorkoutObjectFromFile");


//get an user's basic information
router.get("/basicInfo",isAuth,(req,res)=>{
    res.send({
        username:req.user.username,
        avatar:req.user.avatar,
        gender:req.user.gender,
        age:req.user.age,
        weight:req.user.weight,
        FTP:req.user.power.FTP
    })
});

//get an user's basic power information
router.get("/powerInfo", isAuth, (req, res) => {
    res.send({
        ...req.user.power
    })
} );


//update an user's basic information
router.post("/updateBasicInfo",isAuth, async (req,res)=>{
    await User.updateOne({username:req.user.username},{...req.body});
    res.send("Updated");
});

//get an user's workout collection with basic data
router.get("/workoutCollection/basic", isAuth, async (req, res) => {
   const userDoc = await  User.findOne({username:req.user.username});
   const basicWorkout = userDoc.workoutsCollection.map( 
       (workout) => {
            return {
                workoutId:workout.id,
                basic: workout.basic,
                power: workout.power,
            };
        } 
   );

   res.send(basicWorkout);        
});

//save a workout's basic information into the database
router.post("/addWorkout/basic",isAuth, async (req, res) => {
    const basicWorkoutInfo = req.body.basic;
    const basicPowerInfo = req.body.power;

    const userDoc = await User.findOne({username:req.user.username});

    const workout = createWorkout({...basicWorkoutInfo},{...basicPowerInfo});

    userDoc.workoutsCollection.push(workout);

    await userDoc.save();

    res.send("Basic Power Info Saved")
});

//get an particular workout's detailed data
router.get("/workoutCollection/detail/:workoutId", isAuth, async (req,res)=>{
    const workoutId = req.params.workoutId;
    
    const userDoc = await User.findOne({username:req.user.username});

    const workout = userDoc.workoutsCollection.find((workout)=>workout.id===workoutId);

    res.send(workout.detail? workout.detail : "This Workout Has No Detail");

})

// upload an fit file and save the interpreted data into the 
// database and return an object contains this workout's entire data

router.use(fileUpload())

router.post("/uploadWorkout", isAuth, (req,res)=>{
 
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
        const workout = getWorkoutObjectFromFile(data,currentFTP,workoutTimestamp);
  
        console.log("Constructing workout object")
        workout.updateNP();
        workout.updateIF();
        workout.updateTSS();
        console.log("Construction completed")
        
        //then save the workout into the collection
        const userDoc =  await User.findOne({username: req.user.username});
        userDoc.workoutsCollection.push(workout);
        console.log("Data pushed, not saved yet")
        
        await userDoc.save();

        // schedule a macro task to update the CTL,ATL and TSB
        setTimeout( async ()=>{
            // calculate the new CTL, ATL, and TSB
            await userDoc.updateTrainingLoad();

            await userDoc.updatePowerProfile(workout.detail);
        });

        res.send("Workout Saved");
    })
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
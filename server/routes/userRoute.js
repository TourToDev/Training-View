const express = require('express');
const router = express.Router();
const isAuth = require('./authMiddleware').isAuth;
const connection = require('../config/database');
const User = connection.models.User;
const FitParser = require('fit-file-parser').default;
const fileUpload = require("express-fileupload");
const createWorkout = require("../model/createWorkout");

const {calculateNormalizedPower} = require("../lib/powerAnalysisUtils");

//get an user's basic information
router.get("/basicInfo",isAuth,(req,res)=>{
    res.send({
        username:req.user.username,
        avatar:req.user.profilepicture,
        gender:req.user.gender,
        age:req.user.age,
        weight:req.user.weight,
        FTP:req.user.power.FTP
    })
});

//get an user's basic power information



//update an user's basic information
router.post("/updateBasicInfo",isAuth, async (req,res)=>{
    const doc = await User.updateOne({username:req.user.username},{...req.body});
    res.send(doc);
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

// upload an fit file and save the interpreted data
// into the database and
// return an object contains this workout's entire data

router.use(fileUpload())

router.post("/uploadWorkout", isAuth, (req,res)=>{
 
    //console.log(req.files.workoutfile.data)
    workFile = req.files.workoutfile.data

    //   Create a FitParser instance (options argument is optional)
    var fitParser = new FitParser({
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

        //construct the workout object and calculate the workout specific data
        let workoutLap1 = data.activity.sessions[0].laps[0]

        console.log(Object.keys(data.activity.sessions[0]))
  
        const {
          total_timer_time:duration,
          total_distance:distance,
          total_ascent:elevation_gain,
  
          avg_speed,
          max_speed,
  
          avg_power,
          max_power,
  
          avg_cadence,
          max_cadence,
  
          avg_heart_rate,
          max_heart_rate,
          
        } = data.activity.sessions[0];
  
        const workoutBasic = {
          currentFTP,
          duration,
          distance,
          elevation_gain,
  
          avg_speed,
          max_speed,
  
          avg_cadence,
          max_cadence,
  
          avg_heart_rate,
          max_heart_rate,
        };
  
        const workoutDetail = workoutLap1.records.map( record => ({
          second: record.timer_time,
          power: record.power,
          speed: record.speed,
          heart_rate: record.heart_rate,
          altitude:record.altitude,
          cadence: record.cadence,
        }));
  
        const workoutPower = {
          avg_power,
          max_power,
        };
  
        const workout = createWorkout(workoutBasic,workoutPower,workoutDetail);
        console.log(Object.keys(workout))
  
        workout.updateNP();
        workout.updateIF();
        workout.updateTSS();
        
        //then save the workout into the collection
        const userDoc =  await User.findOne({username: req.user.username});
        userDoc.workoutsCollection.push(workout);
        await userDoc.save();

        res.send("Workout Saved")
        //then retrive the workout collection data to calculate CTL, ATL, and TSB

        //then save again

    })
})


//

module.exports = router;
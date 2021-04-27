const createWorkout = require("../model/createWorkout");
const { trimTo2Digit } = require("./numberUtils");

function getWorkoutObjectFromFile(fileData, FTP, workoutTimestamp, status) {
            //construct the workout object and calculate the workout specific data
            let workoutLap1 = fileData.activity.sessions[0].laps[0];
  
            // extract the basic information out of the file
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
              
            } = fileData.activity.sessions[0];
      
            const workoutBasic = {    
              FTP:FTP,
              duration,
              distance:trimTo2Digit(distance),
              elevation_gain: elevation_gain * 1000,
      
              avg_speed,
              max_speed,
      
              avg_cadence,
              max_cadence,
      
              avg_heart_rate,
              max_heart_rate,
            };
      
            const workoutDetail = workoutLap1.records.map( record => ({
              second: record.timer_time,
              power: trimTo2Digit(record.power),
              speed: trimTo2Digit(record.speed),
              heart_rate: trimTo2Digit(record.heart_rate),
              altitude:parseFloat(record.altitude.toFixed(3)),
              cadence: record.cadence,
            }));
      
            const workoutPower = {
              avg_power,
              max_power,
            };
      
        // collect the workout detail information into an array
        // records that was too big may break your server
        const workout = createWorkout(workoutTimestamp,status,{},workoutBasic,workoutPower,workoutDetail);

        return workout;
}

module.exports = getWorkoutObjectFromFile;
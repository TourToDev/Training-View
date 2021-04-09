const createWorkout = require("../model/createWorkout");

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
      
        // collect the workout detail information into an array
        // records that was too big may break your server
        const workout = createWorkout(workoutTimestamp,workoutBasic,workoutPower,workoutDetail,status);

        return workout;
}

module.exports = getWorkoutObjectFromFile;
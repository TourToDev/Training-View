const { trimTo2Digit } = require("../lib/numberUtils");
const {calculateNormalizedPower, calculateIntensityFactor, calculateTrainingStressScore} = require("../lib/powerAnalysisUtils");
//compose three cat of information into the workout object
const createWorkout = (workoutTimestamp,status,planned={},basic={}, power={}, detail=[]) => {
    const workoutObject = {
        workoutTimestamp,
        status,
        planned,
        basic:{...basic},
        power:{...power},
        detail:detail,
    }
  
    workoutObject.updateNP = function () {
  
      if (this.detail.length === 0) {
        console.log("This workout doesn's have detail");
        return;
      }
  
      this.power.NP = trimTo2Digit(calculateNormalizedPower(this.detail));
      return this.power.NP
    }
  
    workoutObject.updateIF = function () {
      if (!this.power.NP) {
        console.log("You have to calculate the NP first");
        return null;
      }
      this.power.IF = trimTo2Digit(calculateIntensityFactor(this.power.NP,this.basic.FTP));
      return this.power.IF;
    }
  
    workoutObject.updateTSS = function () {
      if (this.basic.FTP && this.power.NP && this.basic.duration && this.power.IF) {
        this.power.TSS = trimTo2Digit(calculateTrainingStressScore(this.basic.FTP,this.power.NP,this.basic.duration,this.power.IF));
        return trimTo2Digit( this.power.TSS );
      }
      console.log("Unable to calculate TSS");
      return null;
    }

    workoutObject.updateVI = function () {
      if (this.power.NP && this.power.avg_power) {
        this.VI = this.power.NP / this.power.avg_power;
      } else {
        console.log("Unable to calculate VI")
      }
    }
  
    return workoutObject;
  }

  module.exports = createWorkout;
const {calculateNormalizedPower, calculateIntensityFactor, calculateTrainingStressScore} = require("../lib/powerAnalysisUtils");
//compose three cat of information into the workout object
const createWorkout = (basic={}, power={}, detail=[]) => {
    const workoutObject = {
        basic:{...basic},
        power:{...power},
        detail:detail,
    }
  
    workoutObject.updateNP = function () {
  
      if (this.detail.length === 0) {
        console.log("This workout doesn's have detail");
        return;
      }
  
      this.power.NP = calculateNormalizedPower(this.detail);
      return this.power.NP
    }
  
    workoutObject.updateIF = function () {
      if (!this.power.NP) {
        console.log("You have to calculate the NP first");
        return null;
      }
      this.power.IF = calculateIntensityFactor(this.power.NP,this.basic.currentFTP);
      return this.power.IF;
    }
  
    workoutObject.updateTSS = function () {
      if (this.basic.currentFTP && this.power.NP && this.basic.duration && this.power.IF) {
        this.power.TSS = calculateTrainingStressScore(this.basic.currentFTP,this.power.NP,this.basic.duration,this.power.IF);
        return this.power.TSS;
      }
      console.log("Unable to calculate TSS");
      return null;
    }
  
    return workoutObject;
  }

  module.exports = createWorkout;
const _ = require('lodash')

function calculateNormalizedPower(workoutDetail=[]) {
    let recordsOfPower = workoutDetail.map( (record) => {
        return record.power
    } )

    let powered_rolling_avg = [];
    
    for (let i = 0; i < recordsOfPower.length - 30; i++) {
        let rolling_window = recordsOfPower.slice(i,i+30);
        powered_rolling_avg.push( Math.pow(_.mean(rolling_window),4) );
    }

    return Math.pow(_.mean(powered_rolling_avg),0.25);
};


function calculateIntensityFactor(NP,FTP) {
    return NP/FTP;
}

function calculateTrainingStressScore(FTP,NP,duration,IF) {
    return (duration * NP * IF) / (FTP * 36);
}

function calculateChronicTrainingLoad(params) {
    //CTL = Average TSS of last 42 days
}

function calculateAcuteTrainingLoad(params) {
    //ATL = Average TSS of last 7 days
}

function calculateTrainingStressBalance(params) {
    //TSB = CTL – ATL
}


module.exports = {
    calculateNormalizedPower,
    calculateIntensityFactor,
    calculateTrainingStressScore,
    calculateChronicTrainingLoad,
    calculateAcuteTrainingLoad,
    calculateTrainingStressBalance,
}
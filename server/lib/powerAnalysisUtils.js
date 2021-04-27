const _ = require('lodash');
const { trimTo2Digit } = require('./numberUtils');

function calculateNormalizedPower(workoutDetail=[]) {
    let recordsOfPower = workoutDetail.map( (record) => {
        return record.power
    } )

    let powered_rolling_avg = [];
    
    for (let i = 0; i < recordsOfPower.length - 30; i++) {
        let rolling_window = recordsOfPower.slice(i,i+30);
        powered_rolling_avg.push( Math.pow(_.mean(rolling_window),4) );
    }

    return trimTo2Digit(Math.pow(_.mean(powered_rolling_avg),0.25));
};


function calculateIntensityFactor(NP,FTP) {
    return trimTo2Digit(NP/FTP);
}

function calculateTrainingStressScore(FTP,NP,duration,IF) {
    return trimTo2Digit((duration * NP * IF) / (FTP * 36));
}

function calculateChronicTrainingLoad(arrOfTSS) {
    //CTL = Average TSS of last 42 days
    const CTL = trimTo2Digit(_.sum(arrOfTSS)/42);
    return !CTL? 0: CTL;
}

function calculateAcuteTrainingLoad(arrOfTSS) {
    //ATL = Average TSS of last 7 days
    const ATL = trimTo2Digit(_.sum(arrOfTSS)/7);
    return !ATL? 0: ATL;
}

function calculateTrainingStressBalance(CTL,ATL) {
    //TSB = CTL – ATL
    return trimTo2Digit(CTL - ATL);
}


module.exports = {
    calculateNormalizedPower,
    calculateIntensityFactor,
    calculateTrainingStressScore,
    calculateChronicTrainingLoad,
    calculateAcuteTrainingLoad,
    calculateTrainingStressBalance,
}
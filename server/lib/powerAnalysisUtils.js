const _ = require('lodash')

function calculateNormalizedPower(records=[]) {
    let recordsOfPower = records.map( (record) => {
        return record.power
    } )

    let powered_rolling_avg = [];
    
    for (let i = 0; i < recordsOfPower.length - 30; i++) {
        let rolling_window = recordsOfPower.slice(i,i+30);
        powered_rolling_avg.push( Math.pow(_.mean(rolling_window),4) );
    }

    return Math.pow(_.mean(powered_rolling_avg),0.25);
};


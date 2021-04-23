const mongoose = require('mongoose');
const { calculateChronicTrainingLoad, calculateAcuteTrainingLoad, calculateTrainingStressBalance } = require('../lib/powerAnalysisUtils');
const { getWeeklyWorkout } = require('../lib/timeUtils');
const _ = require("lodash");
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
    },
    salt:String,
    hash: String,
    realName:String,
    email:{
        type:String,
        unique:true,
    },
    age:Number,
    weight: Number,
    gender:{
        type:String,
        default:'male',
    },
    avatar:{
        type:String,
        default:null,
    },
    power:{
        FTP:{
            type:Number,
            default:200
        },
        powerProfile:{
            max5s:{
                type: Number,
                default: 0,
            },
            max30s:{
                type: Number,
                default: 0,
            },
            max1mins:{
                type: Number,
                default: 0,
            },
            max5mins:{
                type: Number,
                default: 0,
            },
            max20mins:{
                type: Number,
                default: 0,
            },
            max60mins:{
                type: Number || null,
                default: 0,
            },
        },
        trainingZones:{
            activeRecovery:Number,
            endurance: Number,
            tempo: Number,
            lactateThreshold:Number,
            vo2Max:Number,
            anaerobicCapacity: Number,
            neuromuscular: String,
        }
    },
    trainingLoad:{
        weeklyTSS:{
            type: Number,
            default:0
        },
        CTL:{
            type: Number,
            default:0
        },
        ATL:{
            type: Number,
            default:0
        },
        TSB:{
            type: Number,
            default:0
        },
    },
    workoutsCollection:[{
        workoutTimestamp: Number,
        status: {
            type: String,
            default:"",
        },
        planned:{
            duration:Number,
            elevation_gain:Number,
            distance:Number,
            avg_power:Number,
            TSS:Number,
            IF:Number,
        },
        basic:{
            FTP:Number,
            duration:Number,
            elevation_gain:Number,
            distance:Number,
            avg_speed:Number,
            max_speed:Number,
            avg_cadence:Number,
            max_cadence:Number,
            avg_heart_rate:Number,
            max_heart_rate:Number,
        },
        power:{
            avg_power:Number,
            max_power:Number,
            NP:Number,
            TSS:Number,
            IF:Number,
            VI:Number,
        },
        detail:[
            {
                second: Number,
                altitude: Number,
                speed: Number,
                power: Number,
                heart_rate: Number,
                cadence: Number,
            }
        ]
    }]
});

// This method usually is called after the user upload a new workout
// The general idea is, get the part of workouts that fit the required condition
// then get what we want from them.
UserSchema.methods.updateTrainingLoad = async function () {
    const workoutsCollection = this.workoutsCollection;
    const CTL = calculateChronicTrainingLoad( workoutsCollection.filter( dayFromNow(42) ).map( workout => workout.power.TSS ) );
    const ATL = calculateAcuteTrainingLoad( workoutsCollection.filter( dayFromNow(7) ).map( workout => workout.power.TSS ) );
    const TSB = calculateTrainingStressBalance(CTL,ATL);

    this.trainingLoad.CTL = CTL;
    this.trainingLoad.ATL = ATL;
    this.trainingLoad.TSB = TSB;

    const weeklyWorkoutsTSS = getWeeklyWorkout(this.workoutsCollection).map( workout => workout.power.TSS);
    this.trainingLoad.weeklyTSS = _.sum(weeklyWorkoutsTSS);

    await this.save();

    return ({
        CTL,
        ATL,
        TSB
    });
};


UserSchema.methods.updatePowerProfile = async function (workoutDetail) {

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

        return parseInt(maxAvg);
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

    const originalPowerProfile = this.power.powerProfile;
    
    const newPowerProfile = getPowerProfile(workoutDetail);

    if ( needUpdate(originalPowerProfile,newPowerProfile) ) {
        this.power.powerProfile = newPowerProfile;
        await this.save();

        return newPowerProfile
    }

}


//------------------------------------------------------

UserSchema.pre("save",function (next) {
    if (this.power.FTP) {
        this.power.trainingZones = setTrainingZone(this.power.FTP)
    }
    next();
});


function setTrainingZone (FTP) {
    const zoneToPower = {
        activeRecovery:parseInt(FTP * 0.55),
        endurance: parseInt(FTP * 0.75),
        tempo: parseInt(FTP * 0.9),
        lactateThreshold:parseInt(FTP * 1.05),
        vo2Max:parseInt(FTP * 1.2),
        anaerobicCapacity: parseInt(FTP * 1.5),
        neuromuscular: "Infinity",
    }

    return zoneToPower;
}

// Judge if workout is in a certain time limit from today
function dayFromNow(dayNum) {
    return function (workout) {
        const workoutTimestamp = workout.workoutTimestamp;
        const nowTime = Date.now();
        return nowTime - workoutTimestamp <= dayNum*24*60*60*1000? true : false;
    }
}

module.exports = UserSchema;
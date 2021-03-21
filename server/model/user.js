const mongoose = require('mongoose');
const { calculateChronicTrainingLoad, calculateAcuteTrainingLoad, calculateTrainingStressBalance } = require('../lib/powerAnalysisUtils');

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
    },
    salt:String,
    hash: String,
    realName:String,
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
        ACL:{
            type: Number,
            default:0
        },
        TSB:{
            type: Number,
            default:0
        },
    },
    workoutsCollection:[{
        basic:{
            FTP:Number,
            workoutTimestamp: String,
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

    await this.save();

    return ({
        CTL,
        ATL,
        TSB
    });
};



UserSchema.pre("save",function (next) {
    if (this.power.FTP) {
        this.power.trainingZones = setTrainingZone(this.power.FTP)
    }
    next();
})

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
        const workoutTimestamp = workout.basic.workoutTimestamp;
        const nowTime = Date.now();
        return nowTime - workoutTimestamp <= dayNum*24*60*60*1000? true : false;
    }
}

module.exports = UserSchema;
const mongoose = require('mongoose');

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
            max5s:Number,
            max30s:Number,
            max1min:Number,
            max5min:Number,
            max20min:Number,
            max60min:Number,
        },
        trainingZone:[
            {
                zoneName:String,
                zoneMaxPower: Number,
            }
        ]
    },
    trainLoad:{
        TSS:Number,
        CTL:Number,
    },
    workoutCollection:[{
        basic:{
            date:Date,
            duration:Number,
            distance:Number,
            avg_speed:Number,
            elevation_gain:Number,
        },

        power:{
            avg_power:Number,
            normalized_power:Number,
            TSS:Number,
            IF:Number,
        },

        detailedWorkoutData:[
            {
                second: Number,
                power: Number,
                altitude: Number,
                speed: Number,
                heart_rate: Number,
            }
        ]
    }]
});

UserSchema.pre("save",function (next) {
    if (this.power.FTP) {
        this.power.trainingZone = setTrainingZone(this.power.trainingZone,this.power.FTP)
    }
    next();
})

const setTrainingZone = (trainingZone,FTP) => {
    const zoneToPower = {
        activeRecovery:parseInt(FTP * 0.55),
        endurance: parseInt(FTP * 0.75),
        tempo: parseInt(FTP * 0.9),
        lactateThreshold:parseInt(FTP * 1.05),
        vo2Max:parseInt(FTP * 1.2),
        anaerobicCapacity: parseInt(FTP * 1.5),
        neuromuscular: Infinity,
    }
    for (const zoneName in zoneToPower) {
        if (Object.hasOwnProperty.call(zoneToPower, zoneName)) {
            const powerNum = zoneToPower[zoneName];
            trainingZone.push({
                zoneName,
                zoneMaxPower:powerNum,
            });
        }
    }
    return trainingZone;
}


module.exports = UserSchema;
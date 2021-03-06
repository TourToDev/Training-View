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
        trainingZones:[
            {
                zoneName:String,
                zoneMaxPower: Number,
            }
        ]
    },
    trainLoad:{
        totalTSS:Number,
        CTL:Number,
        ACL:Number,
        TSB:Number,
    },
    workoutsCollection:[{
        basic:{
            date:Date || String,
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
            normalized_power:Number,
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

UserSchema.pre("save",function (next) {
    if (this.power.FTP) {
        this.power.trainingZone = setTrainingZone(this.power.trainingZones,this.power.FTP)
    }
    next();
})

var setTrainingZone = (trainingZone,FTP) => {
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
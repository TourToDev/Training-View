const express = require('express');
const router = express.Router();


const isAuth = require('./authMiddleware').isAuth;
const connection = require('../config/database');

const User = connection.models.User;


//get an user's basic information
router.get("/basicInfo",isAuth,(req,res)=>{
    res.send({
        username:req.user.username,
        realName:req.user.realName,
        avatar:req.user.avatar,
        gender:req.user.gender,
        age:req.user.age,
        weight:req.user.weight,
        FTP:req.user.power.FTP
    });
});

//get an user's basic power information
router.get("/powerInfo", isAuth, (req, res) => {
    res.send({
        ...req.user.power
    })
} );


//update an user's basic information
router.post("/updateBasicInfo",isAuth, async (req,res)=>{
    await User.updateOne({username:req.user.username}, {...req.body});
    res.send("Updated");
});

router.post("/updatePowerInfo",isAuth, async (req,res)=>{
    const userDoc = await User.findOne({username:req.user.username});
    if (req.body.FTP) {req.body.FTP = parseInt(req.body.FTP);}
    
    Object.assign(userDoc.power,req.body)

    await userDoc.save();
    res.send("Updated");
});

module.exports = router;
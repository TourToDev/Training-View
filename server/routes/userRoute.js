const express = require('express');
const router = express.Router();
const isAuth = require('./authMiddleware').isAuth;
const connection = require('../config/database');
const User = connection.models.User;

//get an user's basic information
router.get("/basicInfo",isAuth,(req,res)=>{
    res.send({
        username:req.user.username,
        avatar:req.user.profilepicture,
        gender:req.user.gender,
        age:req.user.age,
    })
});

//update an user's basic information
router.post("/updateBasicInfo",isAuth,async (req,res)=>{
    const doc = await User.updateOne({username:req.user.username},{...req.body});
    res.send(doc);
});

//get an user's workout collection

//upload an fit file and return an object contains key information



//get an user's power information


//

module.exports = router;
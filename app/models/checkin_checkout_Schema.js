"use strict";

const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
const {validateEmail,validatePassword} = require("../utils/validate") 

var checkin_checkout_Schema = new mongoose.Schema(
    {
        empId: {
            type: String,
            required: true,
        },
        userType:{
            type:String,
        },
        userName:{
            type:String,  
        },
        checkin:{
            type:String, 
        },
        checkinStatus:{
            type: Boolean,
            required: true,
        },
        date:{
            type: Date,
            required: true,
        },
        yearMonth:{
            type:String,
        },
        checkinTime:{
            type: String,
            required: true,
        },
        checkOutTime:{
            type: String,
            required: false,
        },
        totalTime:{
            type: String,
        },
        overTime:{
            type: String,
        },
        attendanceStatus:{
            type:String,
        },
        approveStatus:{
            type:String,
        },
        approveBy:{
            type:String,
        },
        reason:{
            type:String,
        },
        token: {
            type: String,
            required: false,
        },
        todayCheck:{
            type:Boolean
        }
    }, {
        timestamps: true
    }
);
module.exports = mongoose.model("checkin_checkout", checkin_checkout_Schema, "checkin_checkout");
"use strict";

const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
const {validateEmail,validatePassword} = require("../utils/validate") 

var adminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [false, "Please enter your email"],
            unique: true,
            validate:validateEmail,
        },
        password: {
            type: String,
            required: [false, "Please enter your password"]
        },
        token: {
            type: String,
            required: false,
        },
        userType:{
            type:String,
            
        },
        otp: {
            type: String,
            required: false,
        },
        otpTimestamp:{
            type:Date,
            
        },
        userName:{
            type:String,
            
        }
    }, {
        timestamps: true
    }
);
module.exports = mongoose.model("admin", adminSchema, "admin");
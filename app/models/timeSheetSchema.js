"use strict";

const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");

var timeSheet_Schema = new mongoose.Schema(
    {
        empId:{
            type:String
        },
        date:{
            type:Date
        },
        stTime:{
            type:String
        },
        edTime:{
            type:String
        },
        jobName:{
            type:String
        },
        jobCode:{
            type:String
        },
        jobType:{
            type:String
        },
        department:{
            type:String
        },
        project:{
            type:String
        },
        billability:{
            type:String
        },
        modules:{
            type:String
        },
        note:{
            type:String
        },
        userName:{
            type:String
        },
        rptMng:{
            type:String
        },
        timesheetStatus:{
            type:String,
        },
        approveStatus:{
            type:String,
        },
        approveBy:{
            type:String,
        },
        timeDurations:{
            type:String,
        },
        stToEdTime:{
            type:String
        }

    }
)
module.exports = mongoose.model("timeSheet", timeSheet_Schema, "timeSheet");
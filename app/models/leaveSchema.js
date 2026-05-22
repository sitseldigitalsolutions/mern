"use strict";

const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
const { validateEmail, validatePassword } = require("../utils/validate");
const moment = serviceLocator.get("moment");


const leaveSchema = new mongoose.Schema(
    {
        empId: {
            type: String,
            required: true,
        },
        userType: {
            type: String,
        },
        userName: {
            type: String,
        },
        leaveType: {
            type: String,
        },
        description: {
            type: String,
        },
        attachment: {
            type: String,
        },
        date:{
            type: Date,
        },
        yearMonth:{
            type: String,
        },
        fullDayLeave: {
            startDate: {
                type: Date,
            },
            endDate: {
                type: Date,
            },
        },
        halfDayLeave: {
            leaveDate: {
                type: Date,
            },
        },
        leaveDuration: {
            type: Number,
            // You might want to validate this field, e.g., min: 0, max: 24, default: 0
        },
        approveStatus: {
            type: String,
        },
        approveBy: {
            type: String,
        },
        // leaveBalance: {
            sickLeave: {
                type: Number,
                // default: 0,
            },
            casualLeave: {
                type: Number,
                // default: 0,
            },
            medicalLeave:{
                type: Number,
            },
        // },
        leave: {
            type: Number,
            // default: 0,
        },
        reason:{
            type:String
        },
        overLeave:{
            type:String
        }
    },
    {
        timestamps: true,
    }
);

// // Pre-save hook to update sick and casual leave at the beginning of each month
// leaveSchema.pre("save", function (next) {
//     const now = moment();
//     const beginningOfMonth = moment().startOf("month");
  
//     if (now.isSame(beginningOfMonth, "day")) {
//       // If it's the beginning of the month, reset sick and casual leave to defaults
//       this.sickLeave = 2;
//       this.casualLeave = 2;
//     }
  
//     next();
//   });
  

module.exports = mongoose.model("leave", leaveSchema, "leave");

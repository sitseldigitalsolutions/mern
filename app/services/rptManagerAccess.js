"use strict";

const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
const user = mongoose.model("user");
const admin = mongoose.model("admin");
const checkin_checkout = mongoose.model("checkin_checkout");
const jsend = serviceLocator.get("jsend");
const _ = serviceLocator.get("_");
// const multer = serviceLocator.get("multer");
const jwt = serviceLocator.get("jwt");
// const student = mongoose.model("students")
const config = require("../configs/configs")();
const bcrypt = serviceLocator.get("bcrypt");
const nodemailer = serviceLocator.get("nodemailer");
const otpGenerator = serviceLocator.get("otpgenerator");
const moment = serviceLocator.get("moment");
const crypto = require('crypto');
const leave = mongoose.model("leave");
const timeSheet = mongoose.model("timeSheet");



class ADMIN {
    async punchinApproved(req, res) {
        try {
            let pendingStatus = await checkin_checkout.find({ approveStatus: "Pending" });

            let pendingDatas;
            if (pendingStatus) {
                pendingDatas = pendingStatus.map((item) => {
                    let id = item.id
                    let empId = item.empId
                    let date = moment(item.date).format("DD-MM-YYYY")
                    let checkinTime = item.checkinTime
                    let attendanceStatus = item.attendanceStatus
                    let checkOutTime = item.checkOutTime
                    let totalTime = item.totalTime

                    return {
                        id, empId, date, checkinTime, attendanceStatus, checkOutTime, totalTime
                    }
                })
            }
            else {
                pendingDatas = [];
            }

            return jsend(
                200,
                "Successfully Admin Profile was Created ", pendingDatas
            );
        } catch (e) {
            console.log(e);
            res.notAcceptable(e);
        }
    }

    // punchin approve and reject status

    async approveRejectPunchin(req, res) {
        try {
            let approveStatus = await checkin_checkout.findOne({ _id: req.payload.id });

            if (approveStatus) {
                _.each(Object.keys(req.payload), (key) => {
                    approveStatus[key] = req.payload[key];
                });

                approveStatus.reason = null

                approveStatus = await approveStatus.save();
                return jsend(200, "Attendance status successfully Approved", approveStatus)

            }
            else {
                res.jsend(400, "Not data found")
            }

        }
        catch (e) {
            console.log(e);
            res.notAcceptable(e)
        }
    }


    async pendingLeave (req,res) {
        try{


            // token validation part
            let findUser;
            // Authentication
            if (!req.query.token) {
                return jsend(406, "Token is required");
            }
            var decoded = await jwt.verify(
                req.query.token,
                process.env.JWT_SECRET_KEY,
                { algorithms: ["HS256"] }
            );

            if (decoded) {
                findUser = await user.findOne({ _id: decoded._id });
                if (!findUser) {
                    return jsend(406, "Un-Authorized Access");
                }
            } else {
                return jsend(406, "Un-Authorized Access");
            }

            let findAllUserLeaves = await leave.find({ approveStatus: "Pending" })

            let pendingLeave = findAllUserLeaves.map((item)=>{
                const id = item._id;
                return{
                    id:id,
                    empId : item.empId,
                    leaveType : item.leaveType,
                    description: item.description,
                    date: moment(item.date).format("DD-MM-YYYY"),
                    yearMonth: item.yearMonth,
                    approveStatus: item.approveStatus,
                    approveBy: item.approveBy,
                    fullDayLeave: item.fullDayLeave
                }
            })

            return jsend(200,"successfully fetch pending leaves", pendingLeave)

        }
        catch(e){
            console.log(e);
            res.notAcceptable(e)
        }
    }

    // pending timesheets

    async pendingTimesheets (req,res){
        try{


            // token validation part
            let findUser;
            // Authentication
            if (!req.query.token) {
                return jsend(406, "Token is required");
            }
            var decoded = await jwt.verify(
                req.query.token,
                process.env.JWT_SECRET_KEY,
                { algorithms: ["HS256"] }
            );

            if (decoded) {
                findUser = await user.findOne({ _id: decoded._id });
                if (!findUser) {
                    return jsend(406, "Un-Authorized Access");
                }
            } else {
                return jsend(406, "Un-Authorized Access");
            }



            let pendingTimesheet = await timeSheet.find({timesheetStatus:"Pending",rptMng:req.payload.empId})

            let allDatas = pendingTimesheet.map((item)=>{
                const id = item._id

                return{
                    id:id,
                    empId: item.empId,
                    date: moment(item.date).format("DD-MM-YYYY"),
                    jobName: item.jobName,
                    jobCode: item.jobCode,
                    jobType: item.jobType,
                    department: item.department,
                    project: item.project,
                    billability: item.billability,
                    modules: item.modules,
                    note: item.note,
                    userName: item.userName,
                    timesheetStatus: item.timesheetStatus,
                    approveStatus: item.approveStatus,
                    approveBy: item.approveBy,
                    stToEdTime: item.stToEdTime,
                    timeDurations: item.timeDurations
                }
            })

            if(allDatas){
                return jsend(200,"fetch pending timesheet successfully",allDatas)
            }
            else{
                return jsend(400,"timesheet not found")
            }

        }
        catch(e){
            console.log(e);
            res.notAcceptable(e)
        }
    }


    // timesheet approved

    async approveTimesheet(req, res) {
        try {
            let approveStatus = await timeSheet.findOne({ _id: req.payload.id });

            if (approveStatus) {
                _.each(Object.keys(req.payload), (key) => {
                    approveStatus[key] = req.payload[key];
                });

                approveStatus.reason = null

                approveStatus = await approveStatus.save();
                return jsend(200, "Timesheet status successfully Approved", approveStatus)

            }
            else {
                return jsend(400, "Not data found")
            }

        }
        catch (e) {
            console.log(e);
            res.notAcceptable(e)
        }
    }

}
module.exports = ADMIN;

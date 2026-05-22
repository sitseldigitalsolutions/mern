"use strict";

const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
const user = mongoose.model("user");
const admin = mongoose.model("admin");
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
const timeSheet = mongoose.model("timeSheet");



class TIMESHEET {
    async createTimeSheet(req, res) {
        try {
            // Token validation
            if (!req.query.token) {
                return jsend(406, "Token is required");
            }
            const decoded = await jwt.verify(req.query.token, process.env.JWT_SECRET_KEY, { algorithms: ["HS256"] });
            if (!decoded) {
                return jsend(406, "Un-Authorized Access");
            }
            const findUser = await user.findOne({ _id: decoded._id });
            if (!findUser) {
                return jsend(406, "Un-Authorized Access");
            }
    
            // Creating timesheet
            const crtTimeSheet = new timeSheet(req.payload);
            crtTimeSheet.timesheetStatus = "Pending";
            crtTimeSheet.approveStatus = "Pending";
            crtTimeSheet.approveBy = "Pending";
    
            // Parsing start and end times
            const stTimes = moment(req.payload.stTime, "HH:mm");
            const edTimes = moment(req.payload.edTime, "HH:mm");
            if (!stTimes.isValid() || !edTimes.isValid()) {
                return jsend(400, "Invalid time format");
            }
    
            // Calculating duration
            const duration = moment.duration(edTimes.diff(stTimes));
            const durationHours = Math.floor(duration.asHours());
            const durationMinutes = duration.minutes();
    
            // Formatting times
            const stTimeFormat = stTimes.format("HH:mm");
            const edTimeFormat = edTimes.format("HH:mm");
    
            crtTimeSheet.stToEdTime = `${stTimeFormat} to ${edTimeFormat}`;
            crtTimeSheet.timeDurations = `${durationHours} hrs - ${durationMinutes} mins`;
    
            // Saving timesheet
            const savedTimeSheet = await crtTimeSheet.save();
            return jsend(200, "Successfully timesheet created", savedTimeSheet);
        } catch (e) {
            res.notAcceptable(e);
        }
    }
    

    // find one user Timesheets
    async findOneUserAllTimeSheets(req, res) {
        try {

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


            // // Get the current date
            // const today = new Date();

            // // Get the month and year of the current date
            // const month = today.getMonth();
            // const year = today.getFullYear();

            // // Get the first day of the current month
            // const firstDay = new Date(year, month, 1);

            // // Get the last day of the current month
            // const lastDay = new Date(year, month + 1, 0);

            // // Print the start and end dates of the current month
            // console.log(`Start date: ${firstDay}`);
            // console.log(`End date: ${lastDay}`);
            const currentDate = moment().format("YYYY-MM-DD")
            let findUserTimeSheet
            if(req.payload.empId && req.payload.startDate && req.payload.endDate){
                 findUserTimeSheet = await timeSheet.find({
                    empId: req.payload.empId, date: {
                        $gte: new Date(req.payload.startDate),
                        $lte: new Date(req.payload.endDate)
                    }
                }).sort({ date: 'asc' })
                console.log(findUserTimeSheet);
            }
            else{
                findUserTimeSheet = await timeSheet.find({
                    empId: req.payload.empId, date: currentDate
                })
            }

            let allDatas = findUserTimeSheet.map((item)=>{
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

           

            if (findUserTimeSheet) {
                return jsend(200, "successfully fetch Timesheets", allDatas)
            }
            else {
                return jsend(400, "Timesheet not found")
            }

        }
        catch (e) {
            res.notAcceptable(e)
        }
    }

    // pending timeSheet lists
    async pendingTimeSheet (req,res){
        try{

            let pendingTimeSheets = await timeSheet({timesheetStatus:"Pending"})

        }
        catch(e){
            console.log(e);
            res.notAcceptable(e)
        }
    }
}
module.exports = TIMESHEET;

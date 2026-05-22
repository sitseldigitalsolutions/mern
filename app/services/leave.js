"use strict";

const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
const user = mongoose.model("user");
const checkin_checkout = mongoose.model("checkin_checkout");
const admin = mongoose.model("admin");
const jsend = serviceLocator.get("jsend");
const _ = serviceLocator.get("_");
const jwt = serviceLocator.get("jwt");
const leave = mongoose.model("leave");
const config = require("../configs/configs")();
const bcrypt = serviceLocator.get("bcrypt");
const nodemailer = serviceLocator.get("nodemailer");
const otpGenerator = serviceLocator.get("otpgenerator");
const moment = serviceLocator.get("moment");
const crypto = require('crypto');

class Checkin_Checkout {
    async createLeave(req, res) {
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

            // already take in leave check
            const crtDM = moment().format('YYYY-MM');
            const crtDate = moment().format('YYYY-MM-DD');
            let createLeave = new leave(req.payload);
            createLeave.date = crtDate;
            createLeave.yearMonth = crtDM;
            // logic setup
            let fullDayleave = createLeave.fullDayLeave;
            let halfDayleave = createLeave.halfDayleave;

            // fullday leave
            if (fullDayleave) {
                createLeave.approveStatus = "Pending";
                createLeave.approveBy = "Pending";
            }

            // half day leave
            if (halfDayleave) {
                createLeave.approveStatus = "Pending";
                createLeave.approveBy = "Pending";
            }

            createLeave = await createLeave.save();
            return jsend(
                200,
                "Successfully Admin Profile was Created ", createLeave
            );
        } catch (e) {
            console.log(e);
            res.notAcceptable(e);
        }
    }

    async updateLeave(req, res) {
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

            // data pass of values
            let updateleave = await leave.findOne({ _id: req.payload.id });
            if (!updateleave) {
                return jsend(400, "Failed to checkOut: Leave not found");
            }

            // Update leave properties
            _.each(Object.keys(req.payload), (key) => {
                updateleave[key] = req.payload[key];
            });

            // approval logic
            if (req.payload.approveStatus === "Approved") {
                let fullDayleave = updateleave.fullDayLeave;
                let halfDayleave = updateleave.halfDayLeave;

                // fullday leave
                if (fullDayleave && fullDayleave.startDate) {
                    const startMoment = moment(fullDayleave.startDate, 'YYYY-MM-DD');
                    const endMoment = moment(fullDayleave.endDate, 'YYYY-MM-DD');
                    const numberOfDays = endMoment.diff(startMoment, 'days');
                    updateleave.leaveDuration = numberOfDays;

                    if (updateleave.leaveType === "Casual Leave") {
                        updateleave.casualLeave = updateleave.leaveDuration;
                        updateleave.leave = updateleave.leaveDuration;
                    }
                    if (updateleave.leaveType === "Sick Leave") {
                        updateleave.sickLeave = updateleave.leaveDuration;
                        updateleave.leave = updateleave.leaveDuration;
                    }
                }

                // half day leave
                if (halfDayleave && halfDayleave.leaveDate) {
                    updateleave.leaveDuration = 0.5;
                    if (updateleave.leaveType === "Casual Leave" || updateleave.leaveType === "Sick Leave") {
                        updateleave.casualLeave = updateleave.leaveDuration;
                        updateleave.leave = updateleave.leaveDuration;
                    }
                }
            }

            // Save the updated leave
            updateleave = await updateleave.save();

            // Calculate totals for the current month
            const crtDM = moment().format('YYYY-MM');
            let checkAllreadyLeave = await leave.find({ empId: updateleave.empId, yearMonth: crtDM, approveStatus: "Approved" });
            console.log(checkAllreadyLeave, "---");
            if (checkAllreadyLeave.length > 0) {
                let totalCasualLeave = 0;
                let totalSickLeave = 0;
                let totalLeaveDuration = 0;

                for (const record of checkAllreadyLeave) {
                    totalCasualLeave += record.casualLeave || 0;
                    totalSickLeave += record.sickLeave || 0;
                    totalLeaveDuration += record.leaveDuration || 0;
                }

                if (updateleave.leave > 4) {
                    updateleave.overLeave = `Your are already on leave for ${updateleave.leave} days this month.`;
                }

                // Update leave with totals
                updateleave.casualLeave = totalCasualLeave;
                updateleave.sickLeave = totalSickLeave;
                updateleave.leave = totalLeaveDuration;

                // Save the updated leave with totals
                updateleave = await updateleave.save();
            }

            return jsend(
                200,
                "Successfully Approve Leave ", updateleave
            );
        } catch (e) {
            console.log(e);
            res.notAcceptable(e);
        }
    }

    async findOneUserLeaves (req,res) {
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

            let findAllUserLeaves = await leave.find({ empId: req.payload.id })

            let listofLeaves = findAllUserLeaves.map((item)=>{
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
                    fullDayLeave: item.fullDayLeave,
                    leaveDuration:item.leaveDuration ? item.leaveDuration : "N/A" 

                }
            })

            return jsend(200,"successfully fetch leaves", listofLeaves)

        }
        catch(e){
            console.log(e);
            res.notAcceptable(e)
        }
    }
}

module.exports = Checkin_Checkout;

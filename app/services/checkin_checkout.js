"use strict";

const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
const user = mongoose.model("user");
const checkin_checkout = mongoose.model("checkin_checkout");
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

const cron = serviceLocator.get("cron");


class Checkin_Checkout {
    async checkin(req, res) {
        try {
            // token validation part
            let findUser;
            // Authontification
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

            let checkin = new checkin_checkout(req.payload);

            // Get the current time
            const currentTime = moment();
            const currentDate = moment();
            const toDayDate = currentDate.format('YYYY-MM-DD');

            // Format the current time as hh:mm:ss
            const formattedTime = currentTime.format('HH:mm:ss');

            // checkin status
            if (checkin.checkinStatus) {
                checkin.todayCheck = false;
                checkin.checkinTime = formattedTime;
                checkin.date = toDayDate;
                checkin.attendanceStatus = "Pending";
                checkin.approveStatus = "Pending";
                checkin.approveBy = "Pending";
                checkin.reason = "Pending";
            }

            checkin = await checkin.save();
            return jsend(
                200,
                "Successfully Admin Profile was Created ", checkin
            );
        } catch (e) {
            console.log(e);
            res.notAcceptable(e);
        }
    }

    // checkout functions

    async checkOut(req, res) {
        try {
            // token validation part
            let findUser;
            // Authontification
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
            //    data pass of values
            let updateCheckin = await checkin_checkout.findOne({ _id: req.payload.id });
            if (updateCheckin) {
                _.each(Object.keys(req.payload), (key) => {
                    updateCheckin[key] = req.payload[key];
                });
                const currentTime = moment();
                // const currentDate = moment();

                // const toDayDate = currentDate.format('YYYY-MM-DD');

                // Format the current time as hh:mm:ss
                const formattedTime = currentTime.format('HH:mm:ss');


                // calculate for 9hr in complete for startTime 
                // Set check-in and check-out times
                let checkinTime = moment(updateCheckin.checkinTime, "HH:mm:ss");
                let checkOutTime = moment(formattedTime, "HH:mm:ss");

                // Handle the case where the checkout time is earlier than the checkin time (next day scenario)
                if (checkOutTime.isBefore(checkinTime)) {
                    checkOutTime.add(1, 'day');
                }
                // Calculate the duration in hours and minutes
                const durationInMinutes = checkOutTime.diff(checkinTime, 'minutes');
                const durationHours = Math.floor(durationInMinutes / 60);
                const durationMinutes = durationInMinutes % 60;

                // Calculate the duration in hours
                const durationInHours = checkOutTime.diff(checkinTime, 'hours', true);
                let totalTimes = durationInHours.toFixed(2);
                updateCheckin.totalTime = durationHours + 'hours' + ":" + durationMinutes + 'minutes';
                // checkout time
                updateCheckin.checkOutTime = formattedTime

                console.log(totalTimes, "-----------");
                // Present 
                // checkin status
                if (totalTimes >= 9) {
                    updateCheckin.attendanceStatus = "Present";
                    updateCheckin.approveStatus = "Pending";
                    updateCheckin.approveBy = "Pending";
                    updateCheckin.reason = null;
                    updateCheckin.todayCheck = null;
                    if (totalTimes > 9.30) {
                        updateCheckin.overTime = totalTimes;
                    }
                }
                if (totalTimes < 9 && totalTimes > 0) {
                    updateCheckin.attendanceStatus = "Pending";
                    updateCheckin.approveStatus = "Pending";
                    updateCheckin.approveBy = "Pending";
                    updateCheckin.reason = "Pending";
                    updateCheckin.todayCheck = null;

                }
                // else {
                //     updateCheckin.attendanceStatus = "Absent";
                //     updateCheckin.approveStatus = "Pending";
                //     updateCheckin.approveBy = "Pending";
                //     updateCheckin.reason = "Pending";
                // }
            }
            else {
                return jsend(400, "failed to checkOut")
            }
            updateCheckin = await updateCheckin.save();
            return jsend(
                200,
                "Successfully Admin Profile was Created ", updateCheckin
            );
        } catch (e) {
            console.log(e);
            res.notAcceptable(e);
        }
    }

    // find particular user
    async findOneCheckin(req, res) {
        try {
            //   // token validation part
            //   let findUser;
            //   // Authontification
            //   if (!req.query.token) {
            //     return jsend(406, "Token is required");
            //   }
            //   var decoded = await jwt.verify(
            //     req.query.token,
            //     process.env.JWT_SECRET_KEY,
            //     { algorithms: ["HS256"] }
            //   );

            //   if (decoded) {
            //     findUser = await user.findOne({ _id: decoded._id });

            //     if (!findUser) {
            //       return jsend(406, "Un-Authorized Access");
            //     }
            //   } else { 
            //     return jsend(406, "Un-Authorized Access");
            //   }

            // current Date
            const currentDate = moment().format('YYYY-MM-DD');
            // const currentDate = "2024-03-07"
            let userLogIndetails = await checkin_checkout.findOne({ empId: req.payload.id, date: currentDate });
            console.log(userLogIndetails, "---");

            if (userLogIndetails) {
                return jsend(
                    200,
                    "Successfully fetched particular user profile",
                    userLogIndetails
                );
            } else {
                return jsend(400, "Failed to fetch the user profile", userLogIndetails);
            }
        } catch (e) {
            console.log(e);
            res.notAcceptable(e);
        }
    }

    // find one user all checkin details
    async findOneUserAllCheckin(req, res) {
        try {
            //   // token validation part
            //   let findUser;
            //   // Authontification
            //   if (!req.query.token) {
            //     return jsend(406, "Token is required");
            //   }
            //   var decoded = await jwt.verify(
            //     req.query.token,
            //     process.env.JWT_SECRET_KEY,
            //     { algorithms: ["HS256"] }
            //   );

            //   if (decoded) {
            //     findUser = await user.findOne({ _id: decoded._id });

            //     if (!findUser) {
            //       return jsend(406, "Un-Authorized Access");
            //     }
            //   } else { 
            //     return jsend(406, "Un-Authorized Access");
            //   }



            // Get the current date
            const currentDate = new Date();
            // Get the first day of the current month
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            // Get the last day of the current month
            const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            // Define the aggregation pipeline
            const pipeline = [
                {
                    $match: {
                        empId: req.payload.id,
                        // Filter documents within the current month
                        date: {
                            $gte: firstDayOfMonth,
                            $lte: lastDayOfMonth
                        }
                    }
                }
            ];

            // Execute the aggregation pipeline
            let userLogIndetails = await checkin_checkout.aggregate(pipeline);



            let modifyData;
            if (userLogIndetails) {
                modifyData = userLogIndetails.map((items) => {
                    let id = items._id
                    let empId = items.empId
                    let checkinStatus = items.checkinStatus
                    let todayCheck = items.todayCheck
                    let checkinTime = items.checkinTime
                    let date = moment(items.date).format("DD-MM-YYYY")
                    let attendanceStatus = items.attendanceStatus
                    let approveStatus = items.approveStatus
                    let approveBy = items.approveBy
                    let reason = items.reason
                    let checkOutTime = items.checkOutTime
                    let totalTime = items.totalTime

                    return {
                        id, empId, checkinStatus, todayCheck, checkinTime, date, attendanceStatus, approveStatus, approveBy, reason, checkOutTime, totalTime
                    }
                })
            }
            else {
                modifyData = null
            }

            if (modifyData) {
                return jsend(
                    200,
                    "Successfully fetched particular user profile",
                    modifyData
                );
            } else {
                return jsend(400, "Failed to fetch the user profile", modifyData);
            }
        } catch (e) {
            console.log(e);
            res.notAcceptable(e);
        }
    }

    // auto logout

    async autoCheckin() {
        try {

            let currentDate = moment().add(-1, 'days').format("YYYY-MM-DD");
            // console.log(yesterDay);
            // const currentDate = moment().format('YYYY-MM-DD');

            let checkinDatas = await checkin_checkout.find({ date: currentDate, todayCheck: false });

            let allCheckinData;
            if (checkinDatas) {
                allCheckinData = checkinDatas.map((item) => {
                    return {
                        id: item._id
                    }
                })
            }

            await processCheckin(allCheckinData);

            if (checkinDatas) {
                return jsend(
                    200,
                    "Successfully fetched particular user profile",
                    checkinDatas
                );
            } else {
                return jsend(400, "Failed to fetch the user profile", checkinDatas);
            }



        }
        catch (e) {
            console.log(e);
            res.notAcceptable(e)
        }
    }

    // not activity today

    async notCheckin() {
        try {

            let currentDate = moment().add(-1, 'days').format("YYYY-MM-DD");
            // console.log(yesterDay);
            // const currentDate = moment().format('YYYY-MM-DD');

            const userList = await user.find({});
            let userId = userList.map((item) => {
                return {
                    id: item.empId
                }
            })

            let notActivity = [];

            let datas = userId.forEach(async (i) => {
                let checkinDatas = await checkin_checkout.find({ date: currentDate, empId: i.id });
                if (checkinDatas.length > 0) {
                }
                else {
                    notActivity.push({ id: i.id });
                    // console.log(notActivity,"***");
                    await processForNotActivity(notActivity)
                }
            })

            if (userList) {
                return jsend(
                    200,
                    "Successfully fetched particular user profile"
                );
            } else {
                return jsend(400, "Failed to fetch the user profile");
            }



        }
        catch (e) {
            console.log(e);
            res.notAcceptable(e)
        }
    }

}
module.exports = Checkin_Checkout;


// --------------------------- checkin---datas ------------------------------------

async function processCheckin(checkinid) {
    const batchSize = 100; // Adjust the batch size based on your system's capacity

    for (let i = 0; i < checkinid.length; i += batchSize) {
        const batch = checkinid.slice(i, i + batchSize);
        await Promise.all(batch.map(async (user) => {
            try {
                await fecthCheckinInformation(user.id);
            } catch (error) {
                console.error(`Error processing checkinid for user ${user.id}:`, error.message);
            }
        }));
    }
}

async function fecthCheckinInformation(id) {
    try {

        let userLogIndetails = await checkin_checkout.findOne({ _id: id });
        if (userLogIndetails) {
            _.each(Object.keys(userLogIndetails), (key) => {
                userLogIndetails[key] = userLogIndetails[key];
            });
            userLogIndetails.todayCheck = null;
            userLogIndetails.checkOutTime = "N/A";
            userLogIndetails.totalTime = "N/A";

            // const result = await user.save();
            userLogIndetails = await userLogIndetails.save();
            const updated = await checkin_checkout.findOne({ _id: id });
            return jsend(200, "User details updated successfully", userLogIndetails);
        } else {
            return jsend(400, "Failed to Update the User details ");
        }
    }
    catch (e) {
        console.log(e);
    }
}

// not activity
// --------------------------- checkin---datas ------------------------------------

async function processForNotActivity(checkinid) {
    const batchSize = 100; // Adjust the batch size based on your system's capacity

    for (let i = 0; i < checkinid.length; i += batchSize) {
        const batch = checkinid.slice(i, i + batchSize);
        await Promise.all(batch.map(async (user) => {
            try {
                await notCheckinInformation(user.id);
            } catch (error) {
                console.error(`Error processing checkinid for user ${user.id}:`, error.message);
            }
        }));
    }
}

// function for notactivity

async function notCheckinInformation(id) {
    try {
        let payload = {
            "empId": id,
            "checkinStatus": true
        }
        let checkin = new checkin_checkout(payload);

        // Get the current time
        // const currentTime = moment();
        const currentDate = moment();
        const toDayDate = currentDate.format('YYYY-MM-DD');
        checkin.todayCheck = null;
        checkin.checkinTime = "N/A";
        checkin.checkOutTime = "N/A";
        checkin.totalTime = "N/A";
        checkin.date = toDayDate;
        checkin.attendanceStatus = "Pending";
        checkin.approveStatus = "Pending";
        checkin.approveBy = "Pending";
        checkin.reason = "Pending";
        checkin = await checkin.save();
    }
    catch (e) {
        console.log(e);
    }
}

// auto logout
cron.schedule('10 0 * * *', async () => {
    const autoLogoutInstance = new Checkin_Checkout();
    await autoLogoutInstance.autoCheckin();
});

// not activity
cron.schedule('15 0 * * *', async () => {
    const autoLogoutInstance = new Checkin_Checkout();
    await autoLogoutInstance.notCheckin();
});
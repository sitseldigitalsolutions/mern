"use strict";

const serviceLocator = require("../lib/service_locator");
const trimRequest = serviceLocator.get("trimRequest");
const failAction = serviceLocator.get("failAction");
const timesheet = serviceLocator.get("TimeSheet");

exports.routes = (server, serviceLocator) => {
    return server.route([
        {
            path: "/LightHouse/createTimeSheet",
            method: "POST",
            handler: timesheet.createTimeSheet,
            // options: {
            //     auth: false,
            //     validate: {
            //         payload: require('../validations/user/createUserVaildation'),
            //         failAction: failAction
            //     }
            // },
        },
        {
            path: "/LightHouse/findOneUserAllTimeSheets",
            method: "POST",
            handler: timesheet.findOneUserAllTimeSheets,
            // options: {
            //     auth: false,
            //     validate: {
            //         payload: require('../validations/user/createUserVaildation'),
            //         failAction: failAction
            //     }
            // },
        },
    ]);

};
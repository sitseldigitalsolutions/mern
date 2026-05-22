"use strict";

const serviceLocator = require("../lib/service_locator");
const trimRequest = serviceLocator.get("trimRequest");
const failAction = serviceLocator.get("failAction");
const rptManager = serviceLocator.get("RptManager");
// const leave = serviceLocator.get("Leave");

exports.routes = (server, serviceLocator) => {
    return server.route([
        {
            path: "/LightHouse/punchinApproved",
            method: "POST",
            handler: rptManager.punchinApproved,
            // options: {
            //     auth: false,
            //     validate: {
            //         payload: require('../validations/user/createUserVaildation'),
            //         failAction: failAction
            //     }
            // },
        },
        {
            path: "/LightHouse/approveRejectPunchin",
            method: "POST",
            handler: rptManager.approveRejectPunchin,
            // options: {
            //     auth: false,
            //     validate: {
            //         payload: require('../validations/user/createUserVaildation'),
            //         failAction: failAction
            //     }
            // },
        },
        {
            path: "/LightHouse/pendingLeave",
            method: "POST",
            handler: rptManager.pendingLeave,
            // options: {
            //     auth: false,
            //     validate: {
            //         payload: require('../validations/user/createUserVaildation'),
            //         failAction: failAction
            //     }
            // },
        },
        {
            path: "/LightHouse/pendingTimesheets",
            method: "POST",
            handler: rptManager.pendingTimesheets,
            // options: {
            //     auth: false,
            //     validate: {
            //         payload: require('../validations/user/createUserVaildation'),
            //         failAction: failAction
            //     }
            // },
        },
        {
            path: "/LightHouse/approveTimesheet",
            method: "POST",
            handler: rptManager.approveTimesheet,
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
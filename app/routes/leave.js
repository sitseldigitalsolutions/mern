"use strict";

const serviceLocator = require("../lib/service_locator");
const trimRequest = serviceLocator.get("trimRequest");
const failAction = serviceLocator.get("failAction");
const leave = serviceLocator.get("Leave");

exports.routes = (server, serviceLocator) => {
    return server.route([
        {
            path: "/LightHouse/createLeave",
            method: "POST",
            handler: leave.createLeave,
            // options: {
            //     auth: false,
            //     validate: {
            //         payload: require('../validations/user/createUserVaildation'),
            //         failAction: failAction
            //     }
            // },
        },
        {
            path: "/LightHouse/updateLeave",
            method: "POST",
            handler: leave.updateLeave,
            // options: {
            //     auth: false,
            //     validate: {
            //         payload: require('../validations/user/createUserVaildation'),
            //         failAction: failAction
            //     }
            // },
        },
        {
            path: "/LightHouse/findOneUserLeaves",
            method: "POST",
            handler: leave.findOneUserLeaves,
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
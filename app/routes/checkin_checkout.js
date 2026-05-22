"use strict";

const serviceLocator = require("../lib/service_locator");
const trimRequest = serviceLocator.get("trimRequest");
const failAction = serviceLocator.get("failAction");
const checkin = serviceLocator.get("Checkin_Checkout");

exports.routes = (server, serviceLocator) => {
    return server.route([
        {
            path: "/LightHouse/checkin",
            method: "POST",
            handler: checkin.checkin,
            // options: {
            //     auth: false,
            //     validate: {
            //         payload: require('../validations/user/createUserVaildation'),
            //         failAction: failAction
            //     }
            // },
        },
        {
            path: "/LightHouse/checkOut",
            method: "POST",
            handler: checkin.checkOut,
            // options: {
            //     auth: false,
            //     validate: {
            //         payload: require('../validations/user/createUserVaildation'),
            //         failAction: failAction
            //     }
            // },
        },
        {
            path: "/LightHouse/findOneCheckin",
            method: "POST",
            handler: checkin.findOneCheckin,
            // options: {
            //     auth: false,
            //     validate: {
            //         payload: require('../validations/user/createUserVaildation'),
            //         failAction: failAction
            //     }
            // },
        },
        {
            path: "/LightHouse/findOneUserAllCheckin",
            method: "POST",
            handler: checkin.findOneUserAllCheckin,
            // options: {
            //     auth: false,
            //     validate: {
            //         payload: require('../validations/user/createUserVaildation'),
            //         failAction: failAction
            //     }
            // },
        },
        {
            path: "/LightHouse/autoCheckin",
            method: "POST",
            handler: checkin.autoCheckin,
            // options: {
            //     auth: false,
            //     validate: {
            //         payload: require('../validations/user/createUserVaildation'),
            //         failAction: failAction
            //     }
            // },
        },
        {
            path: "/LightHouse/notCheckin",
            method: "POST",
            handler: checkin.notCheckin,
            // options: {
            //     auth: false,
            //     validate: {
            //         payload: require('../validations/user/createUserVaildation'),
            //         failAction: failAction
            //     }
            // },
        }
    ]);

};
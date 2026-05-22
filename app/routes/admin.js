"use strict";

const serviceLocator = require("../lib/service_locator");
const trimRequest = serviceLocator.get("trimRequest");
const failAction = serviceLocator.get("failAction");
const admin = serviceLocator.get("Admin");

exports.routes = (server, serviceLocator) => {
    return server.route([
        {
            path: "/LightHouse/createAdmin",
            method: "POST",
            handler: admin.createAdmin,
            options: {
                auth: false,
                validate: {
                    payload: require('../validations/admin/createAdmin'),
                    failAction: failAction
                }
            },
        },
        {
            path: "/LightHouse/loginAdmin",
            method: "POST",
            handler: admin.loginAdmin,
            options: {
                auth: false,
                validate: {
                    payload: require('../validations/admin/loginAdmin'),
                    failAction: failAction
                }
            },

        },
        {
            path: "/LightHouse/adminChangePassword",
            method: "POST",
            handler: admin.adminChangePassword,
            options: {
                auth: false,
                validate: {
                    payload: require('../validations/admin/updateAdmin'),
                    failAction: failAction
                }
            },

        },
        {
            path: "/LightHouse/adminForgotPassword",
            method: "POST",
            handler: admin.adminForgotPassword,
            options: {
                auth: false,
                // validate: {
                //     payload: require('../validations/admin/updateAdmin'),
                //     failAction: failAction
                // }
            },

        },
        {
            path: "/LightHouse/adminGenNewPassword",
            method: "POST",
            handler: admin.adminGenNewPassword,
            options: {
                auth: false,
                // validate: {
                //     payload: require('../validations/admin/updateAdmin'),
                //     failAction: failAction
                // }
            },

        }
    ]);

};
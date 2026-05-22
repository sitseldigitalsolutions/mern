"use strict";

const serviceLocator = require("../lib/service_locator");
const trimRequest = serviceLocator.get("trimRequest");
const failAction = serviceLocator.get("failAction");
const user = serviceLocator.get("User");
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
    return server.route([
        {
            path: "/LightHouse/createUserProflie",
            method: "POST",
            options: {
                auth: false,
                validate: {
                    failAction: failAction,
                },
                payload: {
                    parse: true,
                    allow: "multipart/form-data",
                    multipart: { output: "stream" },
                },
                handler: async (request, h) => {
                    try {
                        const response = await user.createUserProflie(request, h);
                        return jsend(response);
                    } catch (error) {
                        console.error(error);
                        return jsend(406, error.message)
                    }
                },
            },
        },
        {
            path: "/LightHouse/updateUser",
            method: "POST",
            handler: user.updateUser,
            // options: {
            //     auth: false,
            //     validate: {
            //         payload: require('../validations/user/updateUserVaildation'),
            //         failAction: failAction
            //     }
            // },
        },
        {
            path: "/LightHouse/deletUser",
            method: "POST",
            handler: user.deleteUser,
            options: {
                auth: false,
                validate: {
                    payload: require('../validations/user/deleteUserVaildation'),
                    failAction: failAction
                }
            },

        },
        {
            path: "/LightHouse/findOneUser",
            method: "POST",
            handler: user.findOneUser,
            options: {
                auth: false,
                validate: {
                    payload: require('../validations/user/findOneUserDetails'),
                    failAction: failAction
                }
            },

        },
        {
            path: "/LightHouse/findAllUser",
            method: "POST",
            handler: user.findAllUser,
            options: {
                auth: false,
                validate: {
                    payload: require('../validations/user/findAllUserDetails'),
                    failAction: failAction
                }
            },

        },
        {
            path: "/LightHouse/loginDetails",
            method: "POST",
            handler: user.loginDetails,
            options: {
                auth: false,
                validate: {
                    payload: require('../validations/user/loginDetails'),
                    failAction: failAction
                }
            },

        },
        {
            path:"/LightHouse/generatorOTP",
            method:"POST",
            handler:user.generatorOTP,
            options:{
                auth:false,
                validate:{
                    payload:require("../validations/user/forgetpasswordVaildation"),
                    failAction:failAction
                }
            }
        },
        {
            path: "/LightHouse/verifyOtp",
            method: "POST",
            handler: user.verifyOtp,
            options: {
                auth: false,
                validate: {
                    payload: require('../validations/user/verifyotyuserVaildation'),
                    failAction: failAction
                }
            },
        },
        {
            path: "/LightHouse/genNewPassword",
            method: "POST",
            handler: user.genNewPassword,
            options: {
                auth: false,
                validate: {
                    payload: require('../validations/user/genNewpasswordVaildation'),
                    failAction: failAction
                }
            },
            
        },
        {
            path: "/LightHouse/changePassword",
            method: "POST",
            handler: user.changePassword,
            options: {
                auth: false,
                validate: {
                    payload: require('../validations/user/changePassword'),
                    failAction: failAction
                }
            },

        },
        {
            path: "/LightHouse/imageSender",
            method: "POST",
            handler: user.imageSender,
            config:{
                payload: {
                    maxBytes: 1000 * 1000 * 5, // 5 Mb
                    parse: true
                }
            },
        },
        {
            path: "/LightHouse/mapDetails",
            method: "POST",
            handler: user.mapDetails,
            options: {
                auth: false,
                // validate: {
                //     payload: require('../validations/user/pvtAllDetailsDelete'),
                //     failAction: failAction
                // }
            },

        },
        {
            path: "/LightHouse/health",
            method: "GET",
            handler: user.health,
            options: {
                auth: false,
                // validate: {
                //     payload: require('../validations/user/pvtAllDetailsDelete'),
                //     failAction: failAction
                // }
            },
        },
    ]);

};
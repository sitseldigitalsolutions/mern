"use strict";

const serviceLocator = require("../../lib/service_locator");
const joi = serviceLocator.get("joi");
module.exports = joi.object({
    empId: joi.string().required(),
    dob: joi.string().required(),
    gender: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    userType:joi.string().optional(),
    userName:joi.string().optional(),
    mobileNumber:joi.number().optional(),
});


"use strict";

const serviceLocator = require("../../lib/service_locator");
const joi = serviceLocator.get("joi");
module.exports = joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
    countryCode:joi.string().required(),
    userName:joi.string().optional(),
    access:joi.object().optional(),
});
"use strict";

const serviceLocator = require("../../lib/service_locator");
const joi = serviceLocator.get("joi");
module.exports = joi.object({
    password: joi.string().required(),
    email: joi.string().required(),
});
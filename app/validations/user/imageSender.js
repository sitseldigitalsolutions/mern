"use strict";

const serviceLocator = require("../../lib/service_locator");
const joi = serviceLocator.get("joi");
module.exports = joi.object({
    email: joi.string().required(),
    file:joi.binary().optional(),
    attachment:joi.string().optional(),
    crtDate:joi.string().optional(),
});
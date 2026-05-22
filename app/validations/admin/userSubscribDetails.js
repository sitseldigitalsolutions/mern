

"use strict";

const serviceLocator = require("../../lib/service_locator");
const joi = serviceLocator.get("joi");
module.exports = joi.object({
    userId: joi.string().required(),
});
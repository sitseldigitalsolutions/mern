

"use strict";

const serviceLocator = require("../../lib/service_locator");
const joi = serviceLocator.get("joi");
module.exports = joi.object({
   id: joi.string().optional(),
   password: joi.string().required(),
   countryCode:joi.string().optional(),
   conformPassword:joi.string().optional(),
});
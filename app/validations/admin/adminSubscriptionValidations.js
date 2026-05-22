

"use strict";

const serviceLocator = require("../../lib/service_locator");
const joi = serviceLocator.get("joi");
module.exports = joi.object({
    pvtOneTimePayment: joi.number().required(),
    oneTimePayment: joi.number().required(),
    monthlyPayment:joi.number().required(),
});
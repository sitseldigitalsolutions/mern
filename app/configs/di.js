"use strict";

const serviceLocator = require("../lib/service_locator");
const config = require("./configs")();


serviceLocator.register("logger", () => {
  return require("../lib/logger").create(config.application_logging);
});



serviceLocator.register("joi", () => {
  return require("joi");
});

serviceLocator.register("otpgenerator", () => {
  return require("otp-generator");
});


serviceLocator.register("jsend", () => {
  return require("../lib/jsend");
});

serviceLocator.register("failAction", () => {
  return require("../lib/failAction").verify;
});

serviceLocator.register("trimRequest", () => {
  return require("../utils/trimRequest").all;
});

serviceLocator.register("mongoose", () => {
  return require("mongoose");
});

serviceLocator.register("axios", () => {
  return require("axios");
});

serviceLocator.register("paypal", () => {
  return require("paypal-rest-sdk");
});

serviceLocator.register("cron", () => {
  return require("node-cron");
});

// serviceLocator.register("fetch", () => {
//   return require("node-fetch");
// });

serviceLocator.register("bcrypt", () => {
  return require("bcrypt");
});

serviceLocator.register("multer", () => {
  return require("multer");
});

serviceLocator.register("fs", () => {
  return require("fs");
});

serviceLocator.register("path", () => {
  return require("path");
});

serviceLocator.register("nodemailer", () => {
  return require("nodemailer");
});

serviceLocator.register("jwt", () => {
  return require("jsonwebtoken");
});

serviceLocator.register("moment", () => {
  return require("moment");
});


serviceLocator.register("_", () => {
  return require("underscore");
});

serviceLocator.register("glob", () => {
  return require("glob");
});


serviceLocator.register("cron", () => {
  return require("node-cron");
});


serviceLocator.register("User", (serviceLocator) => {

  const User = require("../services/user");

  return new User();

});


serviceLocator.register("Uploads", (serviceLocator) => {

  const Uploads = require("../services/uploadsService");

  return new Uploads();

});


serviceLocator.register("Checkin_Checkout", (serviceLocator) => {

  const Checkin_Checkout = require("../services/checkin_checkout");

  return new Checkin_Checkout();

});

serviceLocator.register("Leave", (serviceLocator) => {

  const Leave = require("../services/leave");

  return new Leave();

});


serviceLocator.register("Admin", (serviceLocator) => {

  const  Admin = require("../services/admin");

  return new Admin();

});

serviceLocator.register("RptManager", (serviceLocator) => {

  const  RptManager = require("../services/rptManagerAccess");

  return new RptManager();

});

serviceLocator.register("TimeSheet", (serviceLocator) => {

  const  TimeSheet = require("../services/timeSheet");

  return new TimeSheet();

});


module.exports = serviceLocator;

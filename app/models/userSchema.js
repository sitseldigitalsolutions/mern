"use strict";

const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
const { validateEmail, validatePassword } = require("../utils/validate")

var userSchema = new mongoose.Schema(
  {
    empId: {
      type: String,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
    },
    userType: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    joininDate: {
      type: String,
    },
    role: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      validate: validateEmail,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    mobileNumber: {
      type: Number,
      required: [false, "Please enter your Number"],
    },
    profile:{
      type:String
    },
    age:{
      type:Number
    },
    team:{
      type:String
    },
    reportingManager:{
      type:String
    },
    token: {
      type: String,
      required: false,
    },
    otp: {
      type: String,
      required: false,
    },
    otpTimestamp: {
      type: Date,
    },
    rptManager:{
      type:Boolean
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("user", userSchema, "user");
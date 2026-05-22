"use strict";

module.exports = () => ({
  app: {
    name: process.env.APP_NAME,
    port: process.env.APP_PORT || 8000,
    environment: process.env.APPLICATION_ENV,
    logpath: process.env.LOG_PATH,
  },
  mongo: {
    uri: process.env.DB_URI,
  },
  application_logging: {
    file: process.env.LOG_PATH,
    level: process.env.LOG_LEVEL || "info",
    console: process.env.LOG_ENABLE_CONSOLE || true,
  },
  jwt: {
    expiration: process.env.JWT_EXPIRATION,
    secretKey: process.env.JWT_SECRET_KEY,
    algorithms: process.env.JWT_ALGORITHMS,
  },
  email: {
    emailID: process.env.MAIL_USER,
    emailpassword: process.env.MAIL_PASSWORD,
  },
  forgotEmail:{
    emailIDforgot: process.env.MAIL_USER_Forgot,
    emailpasswordForgot: process.env.MAIL_PASSWORD_Forgot,
  },
  sms: {
    hostname: process.env.MSG91_HOSTNAME,
    authkey: process.env.MSG91_AUTHKEY,
    flowId: process.env.MSG91_FLOWID,
    senderId: process.env.MSG91_SENDER_ID,
    smsPath: process.env.MSG91_SEND_SMS_PATH,
    templateId: process.env.MSG91_TEMPLATE_ID,
  },

  s3: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    bucketName: process.env.S3_BUCKET_NAME,
  },

  resetPasswordUrl: process.env.RESET_PASSWORD_URL,
});
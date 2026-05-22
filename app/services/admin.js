"use strict";

const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
const user = mongoose.model("user");
const admin = mongoose.model("admin");
const jsend = serviceLocator.get("jsend");
const _ = serviceLocator.get("_");
// const multer = serviceLocator.get("multer");
const jwt = serviceLocator.get("jwt");
// const student = mongoose.model("students")
const config = require("../configs/configs")();
const bcrypt = serviceLocator.get("bcrypt");
const nodemailer = serviceLocator.get("nodemailer");
const otpGenerator = serviceLocator.get("otpgenerator");
const moment = serviceLocator.get("moment");
const crypto = require('crypto');


class ADMIN {
  async createAdmin(req, res) {
    try {
      // already exist
      const userExist = await admin.findOne({ email: req.payload.email });

      if (userExist) {
        return jsend(400, "Email already existing");
      }

      // Token Generate
      let jwtSecretKey = config.jwt.secretKey;
      let expiration = config.jwt.expiration;

      let users = new admin(req.payload);
      let userID = users._id;

      // set of role 
      if (req.payload.access.role === "admin") {
        users.access.admin = true;
      }

      // const salt = await bcrypt.genSalt(10);
      users.password = await bcrypt.hashSync(req.payload.password, 10);

      // Set Token
      users.token = await jwt.sign({ _id: userID }, jwtSecretKey, {
        expiresIn: expiration,
      });



      let userRegisterDetails = {
        userId: userID,
        token: users.token,
        access: users.access,
        name: users.userName,
      };

      // create-user
      users = await users.save();
      return jsend(
        200,
        "Successfully Admin Profile was Created ",
        userRegisterDetails
      );
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // update user

  async adminChangePassword(req, res) {
    try {
      let userProflie;
      userProflie = await admin.findOne({ _id: req.payload.id });
      // if (!userProflie) {
      //   userProflie = await student.findOne({ email: req.payload.email });
      // }
      if (userProflie) {
        userProflie.password = await bcrypt.hashSync(req.payload.conformPassword, 10);
        userProflie = await userProflie.save();
        return jsend(200, "New password created successfully...", userProflie);

      }
      else {
        return jsend(400, "User not found");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }


  // userLogin Details
  async loginAdmin(req, res) {
    try {
      let userLogIndetails;
      let userID = "";
      userLogIndetails = await admin.findOne({ email: req.payload.email });

      if (!userLogIndetails) {
      } else {
        userID = userLogIndetails._id;
      }
      let jwtSecretKey = config.jwt.secretKey;
      let expiration = config.jwt.expiration;
      if (userLogIndetails) {
        let passwordcheck = await bcrypt.compareSync(
          req.payload.password,
          userLogIndetails.password
        );
        if (passwordcheck) {
          userLogIndetails.token = await jwt.sign(
            { _id: userID },
            jwtSecretKey,
            { expiresIn: expiration }
          );
          let userDetails = {
            userId: userLogIndetails._id,
            token: userLogIndetails.token,
            name: userLogIndetails.userName,
            access: userLogIndetails.access
          }

          return jsend(200, "Login successful", userDetails);
        } else {
          return jsend(400, "Invalid password or email ID");
        }
      } else {
        return jsend(400, "User not found");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // generate otp for email
  async adminForgotPassword(req, res) {
    try {
      let userLogIndetails;
      userLogIndetails = await admin.findOne({ email: req.payload.email });

      if (userLogIndetails) {
        let forGetPassword = await otpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });

        userLogIndetails.otp = forGetPassword;
        userLogIndetails.otpTimestamp = moment(); // Store current timestamp
        userLogIndetails = await userLogIndetails.save();

        // Replace 'yourSecretKey' and 'yourSalt' with your actual secret key and salt
        const secretKey = crypto.pbkdf2Sync('greenfeet', 'yourSalt', 100000, 32, 'sha512');

        function encrypt(text) {
          const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, Buffer.alloc(16));
          let encrypted = cipher.update(text, 'utf-8', 'hex');
          encrypted += cipher.final('hex');
          return encrypted;
        }

        const originalText = userLogIndetails.email;
        const encryptedText = encrypt(originalText);

        let transport = nodemailer.createTransport({
          host: 'smtp.office365.com',
          port: 587,
          secure: false,
          auth: {
            user: config.forgotEmail.emailIDforgot,
            pass: config.forgotEmail.emailpasswordForgot,
          },
        });
        let info = {
          html: `<html><body>
              <p>We received a request to reset the password associated with your account. To proceed with the password reset, please follow the instructions below:</p>
              <ol>
                <li>Click on the following link to reset your password: ${`https://greenfeet.net/greenfeet/OTPGenerator/${forGetPassword}/${encryptedText}`}
                </li>
                <li>If the link does not work, copy and paste it into your browser's address bar.
                </li>
              </ol>  
              <p>Your OTP Link will expire in 10minutes</p>
              <p>Please ensure that you complete the password reset process as soon as possible.</p>
              <p>Thank you for using our service.</p>
              <p><b>Best regards,</b></p>
              <p>GreenFeet</p>
              </body></html>`,
          from: config.forgotEmail.emailIDforgot,
          to: req.payload.email,
          subject: "Password Reset Request",
          text: `https://greenfeet.net/greenfeet/OTPGenerator`,
        };
        transport.sendMail(info);
        return jsend(200, "Mail sent successfully....", info);
      } 
      else {
        return jsend(400, "email id does not exist");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // user forget password
  async adminGenNewPassword(req, res) {
    try {
       // Replace 'yourSecretKey' and 'yourSalt' with your actual secret key and salt
       const secretKey = crypto.pbkdf2Sync('greenfeet', 'yourSalt', 100000, 32, 'sha512');

       function decrypt(encryptedText) {
         const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, Buffer.alloc(16));
         let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
         decrypted += decipher.final('utf-8');
         return decrypted;
       }
 
       const decryptedText = decrypt(req.payload.email);
       // console.log('Decrypted Text:', decryptedText);

      let userProflie;
      userProflie = await admin.findOne({ email: decryptedText });
      // if (!userProflie) {
      //   userProflie = await student.findOne({ email: req.payload.email });
      // }
      if (userProflie) {
        if (userProflie.otp == req.payload.otp) {
          const timestampDiff = moment().diff(userProflie.otpTimestamp, 'minutes');
          // expired time 10 minutes
          if (timestampDiff <= 10) {
            userProflie.password = await bcrypt.hashSync(req.payload.password, 10);
            userProflie.otp = null;
            userProflie = await userProflie.save();
            return jsend(200, "New password created successfully...", userProflie);
          } else {
            return jsend(400, "OTP has expired.");
          }

        }
        else {
          return jsend(400, "Incorrect OTP");
        }

      } else {
        return jsend(400, "User not found");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }


}
module.exports = ADMIN;

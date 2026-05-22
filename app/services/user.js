"use strict";

const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
const axios = serviceLocator.get("axios");
const user = mongoose.model("user");
const jsend = serviceLocator.get("jsend");
const _ = serviceLocator.get("_");
const multer = serviceLocator.get("multer");
const jwt = serviceLocator.get("jwt");
const config = require("../configs/configs")();
const bcrypt = serviceLocator.get("bcrypt");
const nodemailer = serviceLocator.get("nodemailer");
const otpGenerator = serviceLocator.get("otpgenerator");

// deleteDetails end
const moment = serviceLocator.get("moment");
const fs = require('fs').promises;

const crypto = require('crypto');



class USER {
  async createUserProflie(req, res) {
    try {
      // already exist
      const userExist = await user.findOne({ email: req.payload.email });

      if (userExist) {
        return jsend(400, "Email already existing");
      }

      // Token Generate
      let jwtSecretKey = config.jwt.secretKey;
      let expiration = config.jwt.expiration;

      // set user detials
      const payload = req.payload;
      // const module = payload.module;


      // Accessing the uploaded file
      const file = payload.profile;
      const filename = file.hapi.filename;
      const data = file._data;

      // Save the file to the server asynchronously
      const path = `uploads/${filename}`;
      await fs.writeFile(path, data);

      let users = new user({
        ...req.payload,
        profile: path
      });
      let userID = users._id;

      let search = ["tech_trainer", "executive_accountant", "business_development_executive", "quality_assurance_expert", "creative_designer", "program_co-ordinator", "software_engineer", "software_engineer_trainee"]
      let result = search.includes(req.payload.role);
      if (result) {
        users.userType = "employee"
      }

      let searchs = ["operations_executive", "head_of_operations", "managing_director", "director_of_HR_operations", "admin"]
      let results = searchs.includes(req.payload.role);
      if(results){
        users.userType = "admin"
      }

      // calculate of age
      const today = moment();
      if (users.dob) {
        const birthDate = moment(req.payload.dob, 'YYYY-MM-DD');
        const age = today.diff(birthDate, 'years');
        users.age = age;
      }


      // const salt = await bcrypt.genSalt(10);
      users.password = await bcrypt.hashSync(req.payload.password, 10);

      // Set Token
      users.token = await jwt.sign({ _id: userID }, jwtSecretKey, {
        expiresIn: expiration,
      });

      // create-user
      users = await users.save();
      return jsend(
        200,
        "Successfully User Profile was Created ",
        users
      );
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // update user

  async updateUser(req, res) {
    try {
      // token validation part
      let findUser;
      // Authontification
      if (!req.query.token) {
        return jsend(406, "Token is required");
      }
      var decoded = await jwt.verify(
        req.query.token,
        process.env.JWT_SECRET_KEY,
        { algorithms: ["HS256"] }
      );

      if (decoded) {
        findUser = await user.findOne({ _id: decoded._id });

        if (!findUser) {
          return jsend(406, "Un-Authorized Access");
        }
      } else {
        return jsend(406, "Un-Authorized Access");
      }

      //    data pass of values
      let updateCourse = await user.findOne({ _id: req.payload.id });
      if (updateCourse || adminDetails) {
        _.each(Object.keys(req.payload), (key) => {
          updateCourse[key] = req.payload[key];
        });
        // const result = await user.save();
        updateCourse = await updateCourse.save();
        const updated = await user.findOne({ _id: req.payload.id });
        // cpnam,postcode,add,city
        let userUpadatedDetails = {
          userName: updated.userName,
          mobileNumber: updated.mobileNumber,
          dob: updated.dob,
        }
        return jsend(200, "User details updated successfully", userUpadatedDetails);
      } else {
        return jsend(400, "Failed to Update the User details ");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // delete user

  async deleteUser(req, res) {
    try {
      // token validation part

      let findUser;
      // Authontification
      if (!req.query.token) {
        return jsend(406, "Token is required");
      }
      var decoded = await jwt.verify(
        req.query.token,
        process.env.JWT_SECRET_KEY,
        { algorithms: ["HS256"] }
      );

      if (decoded) {
        findUser = await user.findOne({ _id: decoded._id });

        if (!findUser) {
          return jsend(406, "Un-Authorized Access");
        }
      } else {
        return jsend(406, "Un-Authorized Access");
      }

      // find for commercial user and private user
      let deleteUserDetails = await user.findOne({ _id: req.payload.id });
      let deleteuserDetail = await user.deleteOne({ _id: req.payload.id });

      let passwordcheck = await bcrypt.compareSync(
        req.payload.password,
        deleteUserDetails.password
      );
      if (passwordcheck) {
        return jsend(200, "User Profile deleted successfully");
      }

    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // find particular user
  async findOneUser(req, res) {
    try {
      // // token validation part
      // let findUser;
      // // Authontification
      // if (!req.query.token) {
      //   return jsend(406, "Token is required");
      // }
      // var decoded = await jwt.verify(
      //   req.query.token,
      //   process.env.JWT_SECRET_KEY,
      //   { algorithms: ["HS256"] }
      // );

      // if (decoded) {
      //   findUser = await user.findOne({ _id: decoded._id });

      //   if (!findUser) {
      //     return jsend(406, "Un-Authorized Access");
      //   }
      // } else {
      //   return jsend(406, "Un-Authorized Access");
      // }

      let userLogIndetails = await user.findOne({ empId: req.payload.id });
      console.log(userLogIndetails);

      // let userDetails = {
      //   firstName:userLogIndetails.firstName,
      //   role:userLogIndetails.role,
      //   email:userLogIndetails.email,
      //   dob:userLogIndetails.dob,
      //   age:userLogIndetails.age
      // };

      if (userLogIndetails ) {
        return jsend(
          200,
          "Successfully fetched particular user profile",
          userLogIndetails
        );
      } else {
        return jsend(400, "Failed to fetch the user profile");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // find All user
  async findAllUser(req, res) {
    try {
      // let obj = {}
      // if (req.payload.access) {
      //     obj.access = req.payload.access

      // }

      let findUser = await user.find({});
      if (findUser) {
        return jsend(
          200,
          "Successfully fetched the user profile",
          findUser
        );
      } else {
        return jsend(400, "Failed to fetch the user profile");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // userLogin Details
  async loginDetails(req, res) {
    try {
      let userLogIndetails;
      let userID = "";
      userLogIndetails = await user.findOne({ email: req.payload.email });

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
            userType: userLogIndetails.userType,
            profile: userLogIndetails.profile,
            name: userLogIndetails.firstName,
            role: userLogIndetails.role,
            empId: userLogIndetails.empId,
            rptManager: userLogIndetails.rptManager,
            reportingManager:userLogIndetails.reportingManager
          };

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
  async generatorOTP(req, res) {
    try {
      let userLogIndetails;
      userLogIndetails = await user.findOne({ email: req.payload.email });

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
              <h3><b>Dear Staff</b></h3>
              <p>We received a request to reset the password associated with your account. To proceed with the password reset, please follow the instructions below:</p>
              <ol>
                <li>Click on the following link to reset your password : ${`https://greenfeet.net/greenfeet/OTPGenerator/${forGetPassword}/${encryptedText}`}
                </li>
                <li>If the link does not work, copy and paste it into your browser's address bar.
                </li>
              </ol>  
              <p>Your OTP Link will expire in 10 minutes.</p>
              <p>Please ensure that you complete the password reset process within this stipulated time.</p>
              <p><b>Best regards,</b></p>
              <p>GreenFeet</p>
              </body></html>`,
          from: config.forgotEmail.emailIDforgot,
          to: req.payload.email,
          subject: "Password reset",
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

  // verifyOtp
  async verifyOtp(req, res) {
    try {
      let userLogIndetails;
      userLogIndetails = await user.findOne({ email: req.payload.email });

      if (userLogIndetails) {
        if (userLogIndetails.otp == req.payload.otp) {
          return jsend(200, "OTP verified successfully", userLogIndetails);
        } else {
          return jsend(400, "Invalid OTP");
        }
      } else {
        return jsend(400, "User not found");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }
  // user forget password
  async genNewPassword(req, res) {
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
      userProflie = await user.findOne({ email: decryptedText });
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

  // user change password

  async changePassword(req, res) {
    try {
      // token validation part
      let findUser;
      // Authontification
      if (!req.query.token) {
        return jsend(406, "Token is required");
      }
      var decoded = await jwt.verify(
        req.query.token,
        process.env.JWT_SECRET_KEY,
        { algorithms: ["HS256"] }
      );

      if (decoded) {
        findUser = await user.findOne({ _id: decoded._id });

        if (!findUser) {
          return jsend(406, "Un-Authorized Access");
        }
      } else {
        return jsend(406, "Un-Authorized Access");
      }

      //    data pass of values

      let updateCourse = await user.findOne({ empId: req.payload.id });
      console.log(updateCourse);

      if (updateCourse) {
        let passwordcheck = await bcrypt.compareSync(
          req.payload.oldPassword,
          findUser.password
        );
        if (passwordcheck) {
          findUser.password = await bcrypt.hashSync(req.payload.password, 10);
          findUser = await findUser.save();
          return jsend(200, "Password changed successfully");
        }
        else {
          return jsend(400, "Your Old Password Is Not Correct");
        }

      } else {
        return jsend(400, "Failed to Update the user details");
      }
    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // image send for mail

  async imageSender(req, res) {
    try {
      // Create a transporter using your email provider's SMTP settings
      // const transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   host: "smtp.gmail.com",
      //   auth: {
      //     user: config.email.emailID,
      //     pass: config.email.emailpassword,
      //   },
      // });
      const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, // Set to true if using port 465 with SSL
        auth: {
          user: config.email.emailID,
          pass: config.email.emailpassword,
        },
      });


      // Define the mail options
      const mailOptions = {
        from: config.email.emailID,
        to: req.payload.email, // Replace with the recipient's email
        subject: `Your Carbon Footprint Report ${req.payload.crtDate}`,
        text: 'Report Details- Greenfeet',
        attachments: [
          {
            filename: 'Emission-report.png',
            content: req.payload.attachment.split('base64,')[1],
            encoding: 'base64',
          },
        ],
      };

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      return jsend(200, "Mail sent successfully...");

    } catch (e) {
      res.notAcceptable(e);

    }
  }


  // map api details

  async mapDetails(req, res) {
    try {

      const apiKey = "AIzaSyA1gLsE7UKbiORSBpIJ0jgoZj6sL1A0IOU";

      const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.payload.text}&key=${apiKey}`;

      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        const responseData = response.data;
        let mapData = responseData.predictions.map((prediction) => ({
          label: prediction.description,
          value: prediction.description,
        }))

        return jsend(200, "Place predictions fetched successfully", mapData);
      } else {
        return jsend(400, "Failed to fetch place predictions");
      }


    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

  // health

  async health(req, res) {
    try {

      return jsend(200, "Place predictions fetched successfully");

    } catch (e) {
      console.log(e);
      res.notAcceptable(e);
    }
  }

}
module.exports = USER;

const serviceLocator = require("../lib/service_locator");
const trimRequest = serviceLocator.get("trimRequest");
const failAction = serviceLocator.get("failAction");
const UploadsService = serviceLocator.get("Uploads");
const jsend = serviceLocator.get("jsend");


const path = require('path');

// const serviceLocator = require('./serviceLocator');
// const failAction = () => {
//   // Your failAction logic
// };
// const UploadsService = require('../services/uploadsService');
// const DrivingQuestionModules = serviceLocator.get("DrivingQuestionModule");

// const jsend = (statusCode, data) => {
//   // Your jsend logic
// };


exports.routes = (server) => {

  return server.route([
    {
      method: 'GET',
      path: '/uploads/{filename*}',
      handler: async (request, h) => {
        const { filename } = request.params;
        try {
          const fileData = await UploadsService.serveFile(filename);
          return h.response(fileData).type('image/png');
        } catch (error) {
          console.error(error);
          return jsend(404, 'File not found');
        }
      },
    },
  ]);
};

// require("dotenv").config();
// const config = require("./app/configs/configs")();
// const Hapi = require("@hapi/hapi");
// const glob = require("glob");
// const Qs = require("qs");
// const path = require("path");
// const decorator = require("hapi-boom-decorators");

// const serviceLocator = require("./app/configs/di");

// // Initialize the database
// const Database = require("./app/configs/database");
// new Database(config.mongo.uri);
// const Jwt = require("@hapi/jwt");

// const server = Hapi.server({
//   port: config.app.port,
//   query: {
//     parser: (query) => Qs.parse(query),
//   },
//   routes: {
//     cors: true,
//   },
// });

// const main = async () => {
//   // Setup Error Decorator Handling    



//   await server.register(decorator);
//   glob
//     .sync("./app/routes/**.js", {
//       root: __dirname,
//     })
//     .forEach(async (file) => {
//       const route = require(path.join(__dirname, file));
//       await route.routes(server, serviceLocator);
//     });

//   await server.start();
//   console.log("Server running on %s", server.info.uri);

//   return server;
// };

// main()
//   .then((server) => {
//     console.log("Server running at:", server.info.uri);
//   })
//   .catch((err) => {
//     console.log(err);
//     process.exit(1);
//   });

require("dotenv").config();

const config = require("./app/configs/configs")();
const Hapi = require("@hapi/hapi");
const glob = require("glob");
const Qs = require("qs");
const path = require("path");
const decorator = require("hapi-boom-decorators");
const mongoose = require("mongoose");

const serviceLocator = require("./app/configs/di");

// Mongoose warning fix
mongoose.set("strictQuery", true);

// Initialize Database
const Database = require("./app/configs/database");
new Database(config.mongo.uri);

const Jwt = require("@hapi/jwt");

const server = Hapi.server({
  port: process.env.PORT || config.app.port || 8000,
  host: "0.0.0.0",

  query: {
    parser: (query) => Qs.parse(query),
  },

  routes: {
    cors: true,
  },
});

const main = async () => {
  try {
    // Register decorators
    await server.register(decorator);

    // Load all routes
    const routeFiles = glob.sync("./app/routes/**.js", {
      root: __dirname,
    });

    for (const file of routeFiles) {
      const route = require(path.join(__dirname, file));

      if (route.routes) {
        await route.routes(server, serviceLocator);
      }
    }

    // Start server
    await server.start();

    console.log(`✅ Server running on ${server.info.uri}`);

    return server;
  } catch (error) {
    console.error("❌ Server Error:", error);
    process.exit(1);
  }
};

main()
  .then((server) => {
    console.log(`🚀 Server started at: ${server.info.uri}`);
  })
  .catch((err) => {
    console.error("❌ Startup Failed:", err);
    process.exit(1);
  });

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

// Mongo warning fix
mongoose.set("strictQuery", true);

// Database init
const Database = require("./app/configs/database");
new Database(config.mongo.uri);

// JWT (if used later)
const Jwt = require("@hapi/jwt");

// 🔥 FINAL PORT FIX (IMPORTANT)
const PORT = Number(process.env.PORT || config.app.port || 8000);

const server = Hapi.server({
  port: PORT,
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
    // register plugins
    await server.register(decorator);

    // load routes
    const routeFiles = glob.sync("./app/routes/**.js", {
      root: __dirname,
    });

    for (const file of routeFiles) {
      const route = require(path.join(__dirname, file));

      if (route.routes) {
        await route.routes(server, serviceLocator);
      }
    }

    // start server
    await server.start();

    // 🔥 FIXED LOG (DO NOT use server.info.uri)
    console.log("ENV PORT:", process.env.PORT);
    console.log("CONFIG PORT:", config.app.port);
    console.log("FINAL PORT:", PORT);

    console.log(`🚀 Server running at: http://0.0.0.0:${PORT}`);
  } catch (error) {
    console.error("❌ Server Error:", error);
    process.exit(1);
  }
};

main().catch((err) => {
  console.error("❌ Startup Failed:", err);
  process.exit(1);
});

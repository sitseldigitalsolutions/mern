"use strict";

const serviceLocator = require("../lib/service_locator");
const logger = serviceLocator.get("logger");
const path = serviceLocator.get("path");
const fs = serviceLocator.get("fs");

class Database {
  constructor() {
    this.mongoose = serviceLocator.get("mongoose");
    this._connect();
  }

  _connect() {
    this.mongoose.Promise = global.Promise;
    this.mongoose.connect(process.env.DB_URI);

    const { connection } = this.mongoose;
    connection.on("connected", () =>
      logger.info("Database Connection was Successful")
    );
    connection.on("error", (err) =>
      logger.info("Database Connection Failed" + err)
    );
    connection.on("disconnected", () =>
      logger.info("Database Connection Disconnected") 
    );
    process.on("SIGINT", () => {
      connection.close();
      logger.info(
        "Database Connection closed due to NodeJs process termination"
      );
      process.exit(0);
    });

    // initialize Model
    fs.readdirSync("app/models").forEach((file) => {
      require(path.join(__dirname, "..", "models", file));
    });
  }
}

module.exports = Database;

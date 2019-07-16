/**
 * Config file that get env variables and makes other configurations
 */
"use strict";

require('dotenv').config({ path: __dirname + '/env/.env' });

module.exports = {
    portApi: process.env.PORT_API,
    env: process.env.ENV,

    // database variables
    mongodbUser: process.env.MONGODB_USER,
    mongodbPass: process.env.MONGODB_PASS,
    mongodbHost: process.env.MONGODB_HOST,
    mongodbPort: process.env.MONGODB_PORT,
    mongodbDatabase: process.env.MONGODB_DATABASE,

    // other variables
    eventsJsonUrl: "https://storage.googleapis.com/dito-questions/events.json"
}
'use strict';

// Express init
const express = require('express');
const server = express();

const cors = require('cors');

// Body parser config
const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Get config variables
const config = require('./config');

// Get database
const { DBConnect } = require('./services/db.service');

// Get routers
const collectorRouter = require('./routers/collector.router');
const dataManipulationRouter = require('./routers/dataManipulation.router');

DBConnect().then(
    () => {
        /*** the server is only started if connected successfully on database ***/

        server.use(cors());

        // listener to get requests for /
        server.get('/', (req, res) => {
            res.send('Autocomplete API is working!!!');
        });

        // use routers for collector and data manipulator
        server.use('/collector', collectorRouter);
        server.use('/datamanipulation', dataManipulationRouter);

        // start server on the port defined by env
        server.app = server.listen(config.portApi, () => {
            // in dev, emit an event to be catch in integration tests
            if (config.env === 'dev') {
                server.emit('server-started');
            }
            console.log(`Server listening on port ${config.portApi}`);
        });
    },
    (err) => {
        console.log(err);
    }
);

module.exports = server;
'use strict';

// Express init
const express = require('express');
const server = express();

// listener to get requests for /
server.get('/', (req, res) => {
    res.send('Autocomplete API is working!!!');
});

// start server on the port defined by env
server.app = server.listen(3000, () => {

    console.log(`Server listening on port 3000`);
});
const express = require('express');
const collectorRouter = express.Router();
const collectorController = require('../controllers/collector.controller');

collectorRouter.route('/events')
    .post(collectorController.postEvent)
    .get(collectorController.getEventsByName);

module.exports = collectorRouter;
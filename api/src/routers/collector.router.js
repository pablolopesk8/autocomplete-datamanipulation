const express = require('express');
const collectorRouter = express.Router();
const collectorController = require('../controllers/collector.controller');

/**
 * Router to get starred repos, filtering by tags or not
 */
collectorRouter.route('/events')
    .post(collectorController.postEvent);

module.exports = collectorRouter;
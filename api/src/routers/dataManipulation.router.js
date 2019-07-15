const express = require('express');
const dataManipulationRouter = express.Router();
const dataManipulationController = require('../controllers/dataManipulation.controller');

dataManipulationRouter.route('/timeline')
    .get(dataManipulationController.getTimeline);

module.exports = dataManipulationRouter;
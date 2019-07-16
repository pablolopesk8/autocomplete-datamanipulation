/**
 * File focused on exception and errors tests
 */
const should = require('should'); // eslint-disable-line
const sinon = require('sinon');
const DataManipulationController = require('../../src/controllers/dataManipulation.controller');

describe('Controller DataManipulation Test', () => {
    describe('Timeline - Get', () => {
        it('Should work properly', async () => {
            const req = { };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await DataManipulationController.getTimeline(req, res);

            res.status.calledWith(200).should.equal(true);
        });
    });
});
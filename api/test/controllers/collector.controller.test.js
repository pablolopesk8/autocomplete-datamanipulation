/**
 * File focused on exception and errors tests
 */
const should = require('should'); // eslint-disable-line
const sinon = require('sinon');
const CollectorController  = require('../../src/controllers/collector.controller');
const { DBConnect, DBCloseConnection } = require('../../src/services/db.service');
const Events = require('../../src/models/events.model');

describe('Controller Collector Test', () => {
    // force open and close connection with DB, because it's necessary to execution of this test
    before(async () => {
        await DBConnect();
    });
    after(async () => {
        await DBCloseConnection();
    });
    describe('Event - Post', () => {
        after(async () => {
            await Events.deleteMany({ event: "eventPost" });
        });
        it('Should have an event in body', async () => {
            const req = { body: {} };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.postEvent(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('event is required').should.equal(true);
        });
        it('Should have an event, in string format, in body', async () => {
            const req = { body: { event: 123 } };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.postEvent(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('event must be string').should.equal(true);
        });
        it('Should have a date in body', async () => {
            const req = { body: { event: "eventPost" } };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.postEvent(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('timestamp is required').should.equal(true);
        });
        it('Should have a timestamp, in string format, in body', async () => {
            const req = { body: { event: "eventPost", timestamp: 123 } };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.postEvent(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('timestamp must be string').should.equal(true);
        });
        it('Should have a timestamp, in date format, in body', async () => {
            const req = { body: { event: "eventPost", timestamp: "no date" } };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.postEvent(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('timestamp must be in date format').should.equal(true);
        });
        it('Should successfully if event and date in body are correct', async () => {
            const req = { body: { event: "eventPost", timestamp: "2016-09-22T13:57:31.2311892-04:00" } };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.postEvent(req, res);

            res.status.calledWith(200).should.equal(true);
        });
    });
});
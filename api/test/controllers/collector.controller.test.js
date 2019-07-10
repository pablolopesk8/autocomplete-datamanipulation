const should = require('should'); // eslint-disable-line
const sinon = require('sinon');
const CollectorController  = require('../../src/controllers/collector.controller');
const { DBConnect, DBCloseConnection } = require('../../src/services/db.service');

describe('Controller Collector Test', () => {
    // force open and close connection with DB, because it's necessary to execution of this test
    before(async () => {
        await DBConnect();
    });
    after(async () => {
        await DBCloseConnection();
    });
    describe('Event - Post', () => {
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
            const req = { body: { event: "eventName" } };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.postEvent(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('date is required').should.equal(true);
        });
        it('Should have a date, in string format, in body', async () => {
            const req = { body: { event: "eventName", date: 123 } };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.postEvent(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('date must be string').should.equal(true);
        });
        it('Should have a date, in date format, in body', async () => {
            const req = { body: { event: "eventName", date: "no date" } };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.postEvent(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('date must be in date format').should.equal(true);
        });
        it('Should successfully if event and date in body are correct', async () => {
            const req = { body: { event: "eventName", date: "2016-09-22T13:57:31.2311892-04:00" } };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.postEvent(req, res);

            res.status.calledWith(200).should.equal(true);
        });
    });
});
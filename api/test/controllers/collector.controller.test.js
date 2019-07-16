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
    describe('Events - Get', () => {
        before(async () => {
            // create events to be used in tests
            await Events.create({ event: 'buy', date: '2016-09-22T13:57:31.2311892-04:00' });
            await Events.create({ event: 'build', date: '2016-09-22T14:57:31.2311892-04:00' });
            await Events.create({ event: 'burn', date: '2016-09-22T15:57:31.2311892-04:00' });
            await Events.create({ event: 'sale', date: '2016-09-23T13:57:31.2311892-04:00' });
            await Events.create({ event: 'salt', date: '2016-09-23T14:57:31.2311892-04:00' });
            await Events.create({ event: 'say', date: '2016-09-23T15:57:31.2311892-04:00' });
            await Events.create({ event: 'sit', date: '2016-09-23T16:57:31.2311892-04:00' });
            await Events.create({ event: 'run', date: '2016-09-24T13:57:31.2311892-04:00' });
        });
        after(async () => {
            // delete events used in tests
            await Events.deleteMany({ event: "buy" });
            await Events.deleteMany({ event: "build" });
            await Events.deleteMany({ event: "salt" });
            await Events.deleteMany({ event: "burn" });
            await Events.deleteMany({ event: "say" });
            await Events.deleteMany({ event: "run" });
            await Events.deleteMany({ event: "sit" });
            await Events.deleteMany({ event: "sale" });
        });
        it('Should have a name in query parameter', async () => {
            const req = { query: {} };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.getEventsByName(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('name is required in query parameters').should.equal(true);
        });
        it('Should have a name, in string format, in query parameter', async () => {
            const req = { query: { name: 123 } };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.getEventsByName(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('name must be string').should.equal(true);
        });
        it('Should have a name, with least two characters, in query parameter', async () => {
            const req = { query: { name: "q" } };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.getEventsByName(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('name must have least two characters').should.equal(true);
        });
        it('Should successfully empty if name, in query parameter, match with no one item', async () => {
            const req = { query: { name: "none" } };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.getEventsByName(req, res);

            res.status.calledWith(204).should.equal(true);
        });
        it('Should successfully if name, in query parameter, match exactly with one item', async () => {
            const req = { query: { name: "buy" } };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.getEventsByName(req, res);

            res.status.calledWith(200).should.equal(true);
        });
        it('Should successfully if name, in query parameter, match with one item', async () => {
            const req = { query: { name: "ru" } };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.getEventsByName(req, res);

            res.status.calledWith(200).should.equal(true);
        });
        it('Should successfully if name, in query parameter, match with more than one item', async () => {
            const req = { query: { name: "sa" } };
            const res = { status: sinon.spy(), send: sinon.spy() };

            await CollectorController.getEventsByName(req, res);

            res.status.calledWith(200).should.equal(true);
        });
    });
});
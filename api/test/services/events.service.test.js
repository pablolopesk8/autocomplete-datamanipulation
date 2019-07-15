const should = require('should'); // eslint-disable-line
const { SaveEvent, GetEventsByEvent, GroupByTransaction } = require('../../src/services/events.service');
const Events = require('../../src/models/events.model');
const { DBConnect, DBCloseConnection } = require('../../src/services/db.service');
const fs = require('fs');

describe('Events Service Test', () => {
    // force open and close connection with DB, because it's necessary to execution of this test
    before(async () => {
        await DBConnect();
    });
    after(async () => {
        await DBCloseConnection();
    });
    describe('Save Event', () => {
        after(async () => {
            await Events.deleteMany({ event: "eventName" });
        });
        it(`Should get an error if pass an event with wrong event attribute`, async () => {
            const event = { event: null, date: new Date("2019-07-09T20:03:42.780Z") };
            try {
                await SaveEvent(event);
            } catch (err) {
                err.should.have.property('message').and.be.equal('required-event');
            }
        });
        it(`Should be able to save an event with correct data`, async () => {
            const event = { event: "eventName", date: new Date("2019-07-09T20:03:42.780Z") };
            const result = await SaveEvent(event);
            result.should.have.properties(['_id', 'event', 'date']);
            result.event.should.be.equal('eventName');

            const eventSaved = await Events.findOne({ event: "eventName" });
            eventSaved.should.have.properties(['_id', 'event', 'date']);
            eventSaved.event.should.be.equal('eventName');
        });
    });
    describe('Get Events By Event', () => {
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
            await Events.deleteMany({ event: "buy" });
            await Events.deleteMany({ event: "build" });
            await Events.deleteMany({ event: "salt" });
            await Events.deleteMany({ event: "burn" });
            await Events.deleteMany({ event: "say" });
            await Events.deleteMany({ event: "run" });
            await Events.deleteMany({ event: "sit" });
            await Events.deleteMany({ event: "sale" });
        });
        it(`Should get empty if string passed doesn't match with any event`, async () => {
            const string = 'x';
            const result = await GetEventsByEvent(string);
            result.should.have.length(0);
        });
        it(`Should get one item if string passed match with one event`, async () => {
            const string = 'ru';
            const result = await GetEventsByEvent(string);
            result.should.have.length(1);
            result[0].should.have.property('event').and.be.match(new RegExp(string));
        });
        it(`Should get two ordered items if string passed match with two events`, async () => {
            const string = 'al';
            const result = await GetEventsByEvent(string);
            result.should.have.length(2);
            result[0].should.have.property('event').and.be.equal('sale');
            result[1].should.have.property('event').and.be.equal('salt');
        });
        it(`Should get three ordered items if string passed match with three events`, async () => {
            const string = 'bu';
            const result = await GetEventsByEvent(string);
            result.should.have.length(3);
            result[0].should.have.property('event').and.be.equal('build');
            result[1].should.have.property('event').and.be.equal('burn');
            result[2].should.have.property('event').and.be.equal('buy');
        });
        it(`Should get one item if string passed match exactly with one event`, async () => {
            const string = 'buy';
            const result = await GetEventsByEvent(string);
            result.should.have.length(1);
            result[0].should.have.property('event').and.be.equal(string);
        });
    });
    describe('Group By Transaction', () => {
        it(`Should get an timeline array, ordened by timestamp and grouped by transaction`, async () => {
            let eventsList = await fs.readFileSync(`${__dirname}/json/mockOnlineJson.json`);
            eventsList = JSON.parse(eventsList);
            let expectedResult = await fs.readFileSync(`${__dirname}/json/mockResultGroup.json`);
            expectedResult = JSON.parse(expectedResult);

            const result = await GroupByTransaction(eventsList);

            result.should.be.deepEqual(expectedResult);
        });
    });
});
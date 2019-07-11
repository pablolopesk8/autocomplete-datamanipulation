const should = require('should'); // eslint-disable-line
const { SaveEvent } = require('../../src/services/events.service');
const Events = require('../../src/models/events.model');
const { DBConnect, DBCloseConnection } = require('../../src/services/db.service');

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
        it(`Should give an error if pass an event with wrong event attribute`, async () => {
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
});
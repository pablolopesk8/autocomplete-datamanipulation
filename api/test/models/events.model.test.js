const should = require('should'); // eslint-disable-line
const Events = require('../../src/models/events.model');

describe('Model Event Test', () => {
    describe('Model validation tests', () => {
        it('Should be have a validation for event required', () => {
            const event = new Events({});

            event.validate((err) => {
                err.errors.should.have.property('event');
                err.errors['event'].should.have.property('message').be.equal('event is required');
            });
        });

        it('Should be have a validation for date required', () => {
            const event = new Events({ event: "event name" });

            event.validate((err) => {
                err.errors.should.have.property('date');
                err.errors['date'].should.have.property('message').be.equal('date is required');
            });
        });

        it('Should be created only with event and date', () => {
            const event = new Events({ event: "event name", date: new Date("2019-07-09T20:03:42.780Z") });

            event.validate((err) => {
                should.not.exist(err);
            });
        });

        it('Should be created with event, date and any other properties', () => {
            const event = new Events({
                event: "event name",
                date: new Date("2019-07-09T20:03:42.780Z"),
                other: 123,
                anyOther: 'abc'
            });

            event.validate((err) => {
                should.not.exist(err);
            });
        });
    });
});
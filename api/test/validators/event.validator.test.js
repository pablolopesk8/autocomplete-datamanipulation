const should = require('should'); // eslint-disable-line
const { eventValidator } = require('../../src/validators/event.validator');

describe('Event Validator Test', () => {
    it(`Should be rejected if don't have event attribute`, async () => {
        const event = {};
        await eventValidator(event).should.be.rejectedWith('required-event');
    });
    it(`Should be rejected if event attribute is not string`, async () => {
        const event = { event: 123 };
        await eventValidator(event).should.be.rejectedWith('type-event');
    });
    it(`Should be rejected if don't have date attribute`, async () => {
        const event = { event: "string" };
        await eventValidator(event).should.be.rejectedWith('required-date');
    });
    it(`Should be rejected if date attribute is not string`, async () => {
        const event = { event: "string", date: 123 };
        await eventValidator(event).should.be.rejectedWith('type-date');
    });
    it(`Should be rejected if date attribute is not in date format`, async () => {
        const event = { event: "string", date: "no data format" };
        await eventValidator(event).should.be.rejectedWith('format-date');
    });
    it(`Should be accepted if has valids event and date attribues`, async () => {
        const event = { event: "string", date: "2016-09-22T13:57:31.2311892-04:00" };
        const result  = await eventValidator(event);
        result.should.be.true();
    });
});
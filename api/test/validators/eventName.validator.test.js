const should = require('should'); // eslint-disable-line
const { eventNameValidator } = require('../../src/validators/eventName.validator');

describe('Event Name Test', () => {
    it(`Should be rejected if don't have name attribute`, async () => {
        const event = {};
        await eventNameValidator(event).should.be.rejectedWith('required-name');
    });
    it(`Should be rejected if name attribute is not string`, async () => {
        const event = { name: 123 };
        await eventNameValidator(event).should.be.rejectedWith('type-name');
    });
    it(`Should be rejected if name attribute is string but has less than 2 characters`, async () => {
        const event = { name: 'a' };
        await eventNameValidator(event).should.be.rejectedWith('minLength-name');
    });
    it(`Should be accepted if has valid name attribute`, async () => {
        const event = { name: 'ab' };
        const result  = await eventNameValidator(event);
        result.should.be.true();
    });
});
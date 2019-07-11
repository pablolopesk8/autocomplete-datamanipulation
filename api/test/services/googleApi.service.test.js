const should = require('should'); // eslint-disable-line
const { GetEventsJson } = require('../../src/services/googleApi.service');

describe('Google Api Service Test', () => {
    it(`Should get a list of events and each event needs to be 'comprou' or 'comprou-produto'`, async () => {
        const result = await GetEventsJson();
        result.length.should.be.above(0);
        result.should.matchEach((item) => {
            item.event.should.be.oneOf('comprou', 'comprou-produto');
        });
    });
});
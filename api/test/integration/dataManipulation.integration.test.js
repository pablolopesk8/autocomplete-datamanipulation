/**
 * File to make tests about integration involving data manipulation api
 * Using fake data, is possible verify if the call of the methods exposed by API get the correct result
 */
const should = require('should'); // eslint-disable-line
const { DBCloseConnection } = require('../../src/services/db.service');
const fs = require('fs');

describe('DataManipulation Integration Test', () => {
    let agent;
    let server;

    before((done) => {
        // require the server only here, to avoid that its started before it is necessary
        server = require('../../src/index');
        const request = require('supertest');
        agent = request.agent(server);
        server.once('server-started', () => {
            done();
        });
    });
    after(async () => {
        server.app.close();
        await DBCloseConnection();
    });
    describe('Timeline - Get', () => {
        it('Should be able to return the right timeline', async () => {
            await agent.get(`/datamanipulation/timeline`)
                .query()
                .expect(200)
                .expect('Content-Type', /json/)
                .then(async (results) => {
                    const expectedResult = await fs.readFileSync(`${__dirname}/json/mockResultTimeline.json`);
                    results.body.should.be.deepEqual(JSON.parse(expectedResult));
                });
        });
    });
});
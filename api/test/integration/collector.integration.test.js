/**
 * File to make tests about integration involving collector api
 * Using fake data, is possible verify if the call of the methods exposed by API get the correct result
 */
const should = require('should'); // eslint-disable-line
const { DBCloseConnection } = require('../../src/services/db.service');
const Events = require('../../src/models/events.model');

describe('Controller Collector Test', () => {
    let agent;
    let server;

    before((done) => {
        // require the server only here, to avoid that its started before it is necessary
        server = require('../../src/index');
        const request = require('supertest');
        agent = request.agent(server);
        server.once('server-started' , () => {
            done();
        });
    });
    after(async () => {
        server.app.close();
        await DBCloseConnection();
    });
    describe('Event - Post', () => {
        after(async () => {
            await Events.deleteMany({ event: "eventIntegration" });
        });
        it('Should be able to insert and give back an event, with correct event and a full timestamp', async () => {
            const eventData = { event: "eventIntegration", timestamp: "2016-09-22T13:57:31.2311892-04:00" };
            await agent.post(`/collector/events`)
                .send(eventData)
                .expect(200)
                .expect('Content-Type', /json/)
                .then((results) => {
                    results.body.should.have.property('_id');
                    results.body.should.have.property('event').and.be.equal(eventData.event);
                    // in the full timestamp, has the fuso definition. Because of this, the is data saved with hour difference
                    results.body.should.have.property('date').and.be.equal("2016-09-22T17:57:31.231Z");
                });
        });
        it('Should be able to insert and give back an event, with correct event and a not full timestamp', async () => {
            const eventData = { event: "eventIntegration", timestamp: "2016-09-22T13:57:31.231Z" };
            await agent.post(`/collector/events`)
                .send(eventData)
                .expect(200)
                .expect('Content-Type', /json/)
                .then((results) => {
                    results.body.should.have.property('_id');
                    results.body.should.have.property('event').and.be.equal(eventData.event);
                    results.body.should.have.property('date').and.be.equal(eventData.timestamp);
                });
        });
    });
});
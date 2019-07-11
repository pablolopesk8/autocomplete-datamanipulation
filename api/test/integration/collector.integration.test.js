/**
 * File to make tests about integration involving collector api
 * Using fake data, is possible verify if the call of the methods exposed by API get the correct result
 */
const should = require('should'); // eslint-disable-line
const { DBCloseConnection } = require('../../src/services/db.service');
const Events = require('../../src/models/events.model');

describe('Collector Integration Test', () => {
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
    describe('Events - Post', () => {
        after(async () => {
            await Events.deleteMany({ event: "eventIntegration" });
        });
        it('Should be able to insert and get back an event, with correct event and a full timestamp', async () => {
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
        it('Should be able to insert and get back an event, with correct event and a not full timestamp', async () => {
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
        it('Should be able to get one event, sending a name that match exactly with one event', async () => {
            const name = "buy";
            await agent.get(`/collector/events`)
                .query({ name: name })
                .expect(200)
                .expect('Content-Type', /json/)
                .then((results) => {
                    results.body.should.have.length(1);
                    results.body[0].should.have.property('event').and.be.equal(name);
                });
        });
        it('Should be able to get one event, sending a name that match with one event', async () => {
            const name = "si";
            await agent.get(`/collector/events`)
                .query({ name: name })
                .expect(200)
                .expect('Content-Type', /json/)
                .then((results) => {
                    results.body.should.have.length(1);
                    results.body[0].should.have.property('event').and.be.match(new RegExp(name));
                });
        });
        it('Should be able to get a list of events, sending a name that match with more than one event', async () => {
            const name = "sal";
            await agent.get(`/collector/events`)
                .query({ name: name })
                .expect(200)
                .expect('Content-Type', /json/)
                .then((results) => {
                    results.body.length.should.be.above(0);
                    results.body.should.matchEach((item) => {
                        item.should.have.property('event').and.be.match(new RegExp(name));
                    });
                });
        });
    });
});
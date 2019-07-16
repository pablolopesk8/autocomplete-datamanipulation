/**
 * Service to provide integration with google api
 */
const config = require('../config');
const request = require('request-promise-native');

const GetEventsJson = async () => {
    try {
        const options = { uri: config.eventsJsonUrl, json: true };
        const eventList = await request(options);
        return eventList.events;
    } catch (err) {
        throw new Error('generic-eventsjson');
    }
}

module.exports = { GetEventsJson };
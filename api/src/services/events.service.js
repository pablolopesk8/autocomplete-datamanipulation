/**
 * Service to provide operations with events
 */
const Events = require('../models/events.model');

/**
 * Save an event and return the saved data
 * @param {Object} event object supposed to have event (String) and date (Date)
 * @throws {Error} required-event | generic-insert
 * @returns {Object|MongooseSchema}
 */
const SaveEvent = async (event) => {
    try {
        const eventSaved = await Events.create({ event: event.event, date: event.date });
        return eventSaved.toJSON();
    } catch (err) {
        if (err.message.indexOf('event is required') >= 0) {
            throw new Error('required-event');
        } else {
            throw new Error('generic-insert');
        }
    }
}

/**
 * Get a list of events using the event name
 * @param {String} name event name to find
 * @throws generic-get
 * @returns {Array} array of events objects
 */
const GetEventsByEvent = async (name) => {
    try {
        let events = await Events.find({ event: new RegExp(name) }).lean();

        if (events.length > 0) {
            return events.sort((a, b) => {
                if (a.event.toLowerCase() > b.event.toLowerCase()) return 1;
                else if (a.event.toLowerCase() < b.event.toLowerCase()) return -1;
                else return 0;
            });
        } else {
            return [];
        }
    } catch (err) {
        throw new Error('generic-get');
    }
}

module.exports = { SaveEvent, GetEventsByEvent };
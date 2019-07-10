/**
 * Service to provide operations with events
 */
const Events = require('../models/events.model');

/**
 * Save an event and return the saved data
 * @param {Object} event object supposed to have event (String) and date (Date)
 * @throws {Error}
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

module.exports = { SaveEvent };
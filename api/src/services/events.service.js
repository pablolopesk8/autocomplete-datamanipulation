/**
 * Service to provide operations with events
 */
const Events = require('../models/events.model');

const SaveEvent = async (event) => {
    try {
        const eventSaved = await Events.create({ event: event.event, date: event.date });
        return eventSaved.toJSON();
    } catch (err) {
        // doesn't handle the error. Only send up
        throw new Error(err.message);
    }
}

module.exports = { SaveEvent };
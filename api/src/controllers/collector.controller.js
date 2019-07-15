const { eventValidator } = require('../validators/event.validator');
const { eventNameValidator } = require('../validators/eventName.validator');
const { SaveEvent, GetEventsByEvent } = require('../services/events.service');

/**
 * Controller to define business rules related to repositories
 */
const controller = function () {
    /**
     * Post and save events
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Response}
     * @throws {Error} error according message
     */
    const postEvent = async (req, res) => {
        try {
            const { event, timestamp: date } = req.body;

            // validation
            await eventValidator({ event, date });

            // saving event
            const savedEvent = await SaveEvent({ event, date: new Date(date) });

            res.status(200);
            return res.send(savedEvent);
        } catch (err) {
            // set the message to return
            switch (err.message) {
                case "required-event":
                    res.status(422);
                    return res.send("event is required");
                case "type-event":
                    res.status(422);
                    return res.send("event must be string");
                case "required-date":
                    res.status(422);
                    return res.send("timestamp is required");
                case "type-date":
                    res.status(422);
                    return res.send("timestamp must be string");
                case "format-date":
                    res.status(422);
                    return res.send("timestamp must be in date format");
                default:
                    res.status(500);
                    return res.send("General Error");
            }
        }
    }

    /**
     * Get events making a like with event name, with least two characters
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Response}
     * @throws {Error} error according message
     */
    const getEventsByName = async (req, res) => {
        try {
            const name = req.query.name;

            // validation
            await eventNameValidator({name});

            // get events and return 204 if empty or the events array
            const events = await GetEventsByEvent(name);
            if (events.length <= 0) {
                res.status(204);
                return res.send();
            } else {
                res.status(200);
                return res.send(events);
            }
        } catch (err) {
            // set the message to return
            switch (err.message) {
                case "required-name":
                    res.status(422);
                    return res.send("name is required in query parameters");
                case "type-name":
                    res.status(422);
                    return res.send("name must be string");
                case "minLength-name":
                    res.status(422);
                    return res.send("name must have least two characters");
                default:
                    res.status(500);
                    return res.send("General Error");
            }
        }
    }

    return { postEvent, getEventsByName };
}

module.exports = controller();
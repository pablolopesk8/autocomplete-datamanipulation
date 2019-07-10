const { eventValidator } = require('../validators/event.validator');
const { SaveEvent } = require('../services/events.service');

/**
 * Controller to define business rules related to repositories
 */
const controller = function () {
    /**
     * Post and save events
     * @param {Request} req 
     * @param {Response} res 
     */
    const postEvent = async (req, res) => {
        try {
            // validation
            await eventValidator(req.body);

            // saving event
            const savedEvent = await SaveEvent({ event: req.body.event, date: new Date(req.body.date) });

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
                    return res.send("date is required");
                case "type-date":
                    res.status(422);
                    return res.send("date must be string");
                case "format-date":
                    res.status(422);
                    return res.send("date must be in date format");
                default:
                    res.status(500);
                    return res.send("General Error");
            }
        }
    }

    return { postEvent };
}

module.exports = controller();
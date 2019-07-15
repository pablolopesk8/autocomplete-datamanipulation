const { GetEventsJson } = require('../services/googleApi.service');
const { GroupByTransaction } = require('../services/events.service');

/**
 * Controller to define business rules related to repositories
 */
const controller = function () {
    /**
     * Get the timeline of events
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Response}
     * @throws {Error}
     */
    const getTimeline = async (req, res) => {
        try {
            const events = await GetEventsJson();

            const timeline = GroupByTransaction(events);

            res.status(200);
            return res.send(timeline);
        } catch (err) {
            // doesn't handle the error
            res.status(500);
            return res.send("General Error");
        }
    }

    return { getTimeline };
}

module.exports = controller();


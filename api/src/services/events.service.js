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

const GroupByTransaction = async (eventList) => {
    let transactionProducts = {};
    let transactionData = {};

    for (let i = 0, len = eventList.events.length; i < len; i++) {
        for (let j = 0, lenJ = eventList.events[i].custom_data.length; j < lenJ; j++) {
            if (eventList.events[i].custom_data[j].key === 'transaction_id') {
                let tempTransactionId = eventList.events[i].custom_data[j].value;

                if (eventList.events[i].event === 'comprou-produto') {
                    if (!transactionProducts[tempTransactionId]) {
                        transactionProducts[tempTransactionId] = [];
                    }

                    let tempProduct = {};

                    for (let k = 0, lenK = eventList.events[i].custom_data.length; k < lenK; k++) {
                        if (eventList.events[i].custom_data[k].key === 'product_name') {
                            tempProduct.name = eventList.events[i].custom_data[k].value;
                        } else if (eventList.events[i].custom_data[k].key === 'product_price') {
                            tempProduct.price = eventList.events[i].custom_data[k].value;
                        }
                    }

                    transactionProducts[tempTransactionId].push(tempProduct);
                } else if (eventList.events[i].event === 'comprou') {
                    if (!transactionData[tempTransactionId]) {
                        transactionData[tempTransactionId] = [];
                    }

                    let tempData = {
                        timestamp: eventList.events[i].timestamp,
                        revenue: eventList.events[i].revenue,
                        transactionId: tempTransactionId
                    };

                    for (let k = 0, lenK = eventList.events[i].custom_data.length; k < lenK; k++) {
                        if (eventList.events[i].custom_data[k].key === 'store_name') {
                            tempData.storeName = eventList.events[i].custom_data[k].value;
                        }
                    }

                    transactionData[tempTransactionId] = tempData;
                }
            }
        }
    }

    const orderedTimestamp = [];
    for (let item in transactionData) {
        orderedTimestamp.push(transactionData[item]);
    }
    orderedTimestamp.sort((a, b) => {
        if (a.timestamp > b.timestamp) return -1;
        else if (a.timestamp < b.timestamp) return 1;
        else return 0;
    });

    const timeline = { timeline: [] };
    for (let item of orderedTimestamp) {
        timeline.timeline.push({
            timestamp: item.timestamp,
            revenue: item.revenue,
            transaction_id: item.transactionId,
            store_name: item.storeName,
            products: transactionProducts[item.transactionId] ? transactionProducts[item.transactionId] : []
        });
    }
    
    return timeline;
}

module.exports = { SaveEvent, GetEventsByEvent, GroupByTransaction };
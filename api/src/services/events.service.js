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

/**
 * Group all events by transaction
 * @param {Array} eventList 
 * @returns {Object|Array}
 */
const GroupByTransaction = async (eventList) => {
    const transactionProducts = {};
    const transactionData = {};

    // interate over events and inside each event, iterate over the custom data
    for (let i = 0, len = eventList.length; i < len; i++) {
        for (let j = 0, lenJ = eventList[i].custom_data.length; j < lenJ; j++) {
            // the mainly data is transaction_id
            if (eventList[i].custom_data[j].key === 'transaction_id') {
                let transactionId = eventList[i].custom_data[j].value;

                // if event type is comprou-produto, get the products of the transaction
                if (eventList[i].event === 'comprou-produto') {
                    if (!transactionProducts[transactionId]) {
                        transactionProducts[transactionId] = [];
                    }
                    transactionProducts[transactionId].push(GetTransactionProducts(eventList[i].custom_data));
                }// if event type is comprou, get data about the transaction
                else if (eventList[i].event === 'comprou') {
                    if (!transactionData[transactionId]) {
                        transactionData[transactionId] = [];
                    }

                    transactionData[transactionId] = {
                        timestamp: eventList[i].timestamp,
                        revenue: eventList[i].revenue,
                        transactionId: transactionId,
                        storeName: GetTransactionStore(eventList[i].custom_data)
                    };
                }
            }
        }
    }

    // order the transactions, using the timestamp and type desc
    const orderedTransactions = OrderTransactions(transactionData);

    // generate the timeline, using ordered transactions
    const timeline = { timeline: [] };
    for (let item of orderedTransactions) {
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

/**
 * Get product informations about the transaction
 * @param {Array} customData array of objects
 * @returns {Object}
 */
const GetTransactionProducts = (customData) => {
    let product = {};

    // iterate over data getting the product name and price
    for (let i = 0, len = customData.length; i < len; i++) {
        if (customData[i].key === 'product_name') {
            product.name = customData[i].value;
        } else if (customData[i].key === 'product_price') {
            product.price = customData[i].value;
        }
    }

    return product;
}

/**
 * Get the name of the store
 * @param {Array} customData array of objects
 * @returns {String}
 */
const GetTransactionStore = (customData) => {
    for (let i = 0, len = customData.length; i < len; i++) {
        if (customData[i].key === 'store_name') {
            return customData[i].value;
        }
    }
}

/**
 * Order a list of transactions, using a by and a type
 * @param {Object} transactionData 
 * @param {String} orderBy 
 * @param {String} orderType 
 * @returns {Array}
 */
const OrderTransactions = (transactionData, orderBy = 'timestamp', orderType = 'desc') => {
    // convert the object into array
    const transactionDataArray = [];
    for (let item in transactionData) {
        transactionDataArray.push(transactionData[item]);
    }

    // returns the array ordered as necessary
    return transactionDataArray.sort((a, b) => {
        if (a[orderBy] > b[orderBy]) return orderType === 'desc' ? -1 : 1;
        else if (a[orderBy] < b[orderBy]) return orderType === 'desc' ? 1 : -1;
        else return 0;
    });
}

module.exports = { SaveEvent, GetEventsByEvent, GroupByTransaction };
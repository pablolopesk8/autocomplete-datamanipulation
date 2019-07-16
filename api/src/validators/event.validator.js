const Ajv = require('ajv');
const ajv = new Ajv({errorDataPath: 'property'});

/**
 * Method to validate event data
 * @param {Object} data 
 * @throws {Error} error specifying if field required (required-field), invalid (type-field) or malformatted
 * @returns {boolean} true
 */
const validator = async (data) => {
    // schema to validate event
    const schema = {
        properties: {
            event: { type: "string" },
            date: { type: "string", format: "date-time" }
        },
        required: ["event", "date"]
    }

    // get he result of validation
    const valid = await ajv.validate(schema, data);

    // if data is not valid, set the correct message to return
    if (!valid) {
        // set the error type according keyword and dataPath
        const errorType = `${ajv.errors[0].keyword}-${ajv.errors[0].dataPath.substr(1)}`;

        // throw an error with defined type
        throw new Error(errorType);
    } else {
        // if valid, return true
        return true;
    }
}

module.exports = { eventValidator: validator };
/** Init file to create user, database and schema**/
conn = new Mongo();
db = conn.getDB("autocompleteevents");

db.createUser(
    {
        user: "admin_autocompleteevents",
        pwd: "Xyz@789",
        roles: [{ role: "readWrite", db: "autocompleteevents" }]
    }
);

/** create users collection with a schema validator **/
/* db.runCommand( {
    collMod: "contacts", */
db.createCollection("events", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["event", "timestamp"],
            additionalProperties: true,
            properties: {
                event: {
                    bsonType: "string",
                    description: "string required"
                },
                timestamp: {
                    bsonType: "timestamp",
                    description: "timestamp required"
                }
            }
        }
    }
});

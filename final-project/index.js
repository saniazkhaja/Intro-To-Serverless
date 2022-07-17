// // Link: https://docs.microsoft.com/en-us/azure/cosmos-db/sql/sql-api-nodejs-get-started?tabs=windows
const qs = require('qs');
const CosmosClient = require("@azure/cosmos").CosmosClient;

const config = {
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
    databaseId: "SecretStorer",
    containerId: "secrets",
    partitionKey: {kind: "Hash", paths: ["/secrets"]}
  };


/*
// This script ensures that the database is setup and populated correctly
*/
async function create(client, databaseId, containerId) {
  const partitionKey = config.partitionKey;

  /**
   * Create the database if it does not exist
   */
  const { database } = await client.databases.createIfNotExists({
    id: databaseId
  });
  console.log(`Created database:\n${database.id}\n`);

  /**
   * Create the container if it does not exist
   */
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: containerId, partitionKey },
      { offerThroughput: 400 }
    );

  console.log(`Created container:\n${container.id}\n`);
}


async function createDocument(newItem) {
    const { endpoint, key, databaseId, containerId } = config;

    const client = new CosmosClient({ endpoint, key });

    const database = client.database(databaseId);
    const container = database.container(containerId);

    // Make sure Tasks database is already setup. If not, create it.
    await create(client, databaseId, containerId);
    
    console.log(`Querying container: Items`);

    // query to return all items
    const querySpec = {
    query: "SELECT * from c"
    };

    // read all items in the Items container
    const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

    const { resource: createdItem } = await container.items.create(newItem);
    return items;
  }

module.exports = async function (context, req) {
    // context.log('JavaScript HTTP trigger function processed a request.');

    // const name = (req.query.name || (req.body && req.body.name));
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";


    const queryObject = qs.parse(req.body);
    context.log(queryObject);
    let message = queryObject.Body; // this is the user's input
    let document = {"message": message} // create an object with the string `"message"` as the key, and the variable `message` as its value
    // const newItem = {
    //     id: "3",
    //     category: "fun",
    //     name: "Cosmos DB",
    //     description: "Complete Cosmos DB Node.js Quickstart ⚡",
    //     isComplete: false
    //   };
    let items = await createDocument(document)// call the createDocument function with the document we just made
    let random_value = Math.floor(items.length * Math.random());

    const responseMessage = `Thanks 😊! Stored your secret "${message}". 😯 Someone confessed that: ${JSON.stringify(items[random_value].message)}`
    context.res = {
        body: responseMessage
     };

}

// // Link: https://docs.microsoft.com/en-us/azure/cosmos-db/sql/sql-api-nodejs-get-started?tabs=windows
const qs = require('qs');
const CosmosClient = require("@azure/cosmos").CosmosClient;

const config = {
    endpoint: process.env["COSMOS_ENDPOINT"],
    key: process.env["COSMOS_KEY"],
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

  async function getItems(gmail) {
    const { endpoint, key, databaseId, containerId } = config;

    const client = new CosmosClient({ endpoint, key });

    const database = client.database(databaseId);
    const container = database.container(containerId);

    // Make sure Tasks database is already setup. If not, create it.
    await create(client, databaseId, containerId);
    
    console.log(`Querying container: Items`);

    // query to return all items
    const querySpec = {
    query: "SELECT * from c where c.userGmail = @gmail",
    "parameters": [
        {"name": "@gmail", "value": gmail},
    ]
    };

    // read all items in the Items container
    const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

    return items;
  }

  async function updateItem(data, currentItem, gmail) {
    const { endpoint, key, databaseId, containerId } = config;

    const client = new CosmosClient({ endpoint, key });

    const database = client.database(databaseId);
    const container = database.container(containerId);

     // Make sure Tasks database is already setup. If not, create it.
     await create(client, databaseId, containerId);


     const querySpec = {
        query: "SELECT * from c where c.userGmail = @gmail",
        "parameters": [
            {"name": "@gmail", "value": gmail},
        ]
        };
    
        // read all items in the Items container
        const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();
        // context.log("Checking for gmail");
        // context.log(JSON.stringify(items));

    /** Update item
     * Pull the id and partition key value from the newly created item.
     * Update the isComplete field to true.
     */
    const { id, category } = items[0];

//    createdItem.isComplete = true;

//     const { resource: updatedItem } = await container
//     .item(id, category)
//     .replace(createdItem);

//     console.log(`Updated item: ${updatedItem.id} - ${updatedItem.description}`); 
//     console.log(`Updated isComplete to ${updatedItem.isComplete}\r\n`);

console.log("What is the first item?");
console.log(items[0]);

//const { userLocationLat, userLocationLong, userParkingTime, userNotificationTime } = items[0];

    items[0].userLocationLat = data.userLocationLat;
    items[0].userLocationLong = data.userLocationLong;
    items[0].userParkingTime = data.userParkingTime;
    items[0].userNotificationTime = data.userNotificationTime;

    const { resource: updatedItem } = await container
    .item(id, category)
    .replace(items[0]);
    

    console.log ("Item updated");
  }

module.exports = async function (context, req) {
    // context.log('JavaScript HTTP trigger function processed a request.');

    // const name = (req.query.name || (req.body && req.body.name));
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";


    // const queryObject = JSON.parse(req.body);
    // console.log(queryObject);
    const data = req.body; // this is the user's input
    // let document = {"message": message}
    let document = {"userGmail": data.userGmail, 
                    "userLocationLat": data.userLocationLat,
                    "userLocationLong": data.userLocationLong,
                    "userParkingTime": data.userParkingTime,
                    "userNotificationTime": data.userNotificationTime,
                    } // create an object with the string `"message"` as the key, and the variable `message` as its value

    let currentItems = await getItems(data.userGmail);
    context.log("Current Get Items:" + currentItems);
    context.log(currentItems);
    // let items = await createDocument(document)
    // gmail does not exist in database
     if (currentItems.length == 0) {
         context.log("Item not found");
         let items = await createDocument(document)
     } else {
         context.log("item Found");
         updateItem(data, currentItems, data.userGmail);
     }
   // let items = await createDocument(document)// call the createDocument function with the document we just made
    //let random_value = Math.floor(items.length * Math.random());

    const responseMessage = `Thanks 😊! Stored your info "${JSON.stringify(data.userGmail)}"`
    context.log(responseMessage);
    context.res = {
        body: responseMessage
     };

}

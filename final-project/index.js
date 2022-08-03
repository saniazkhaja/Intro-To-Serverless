const CosmosClient = require("@azure/cosmos").CosmosClient;
const fetch = require('node-fetch');

const config = {
  endpoint: process.env["COSMOS_ENDPOINT"],
  key: process.env["COSMOS_KEY"],
  databaseId: "SecretStorer",
  containerId: "secrets",
  partitionKey: {kind: "Hash", paths: ["/secrets"]}
};


// This script ensures that the database is setup and populated correctly
async function create(client, databaseId, containerId) {
  const partitionKey = config.partitionKey;


  // Create the database if it does not exist
  const { database } = await client.databases.createIfNotExists({
    id: databaseId
  });

  // Create the container if it does not exist
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: containerId, partitionKey },
      { offerThroughput: 400 }
    );
}


// creates a new document with items also known as the user's inputs
async function createDocument(newItem) {
  const { endpoint, key, databaseId, containerId } = config;
  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(containerId);

  // Make sure Tasks database is already setup. If not, create it.
  await create(client, databaseId, containerId);

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


  // used to get items based on the user's email
async function getItems(email) {
  const { endpoint, key, databaseId, containerId } = config;
  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(containerId);

  // Make sure Tasks database is already setup. If not, create it.
  await create(client, databaseId, containerId);

  // query to return all items based on the email parameter
  const querySpec = {
    query: "SELECT * from c where c.userEmail = @email",
    "parameters": [
        {"name": "@email", "value": email},
    ]
  };

  // read all items in the Items container
  const { resources: items } = await container.items
  .query(querySpec)
  .fetchAll();

  // returns items that met query requirements
  return items;
}


// used to update an item if that email had already existed in the system
async function updateItem(data, email) {
  const { endpoint, key, databaseId, containerId } = config;
  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(containerId);

    // Make sure Tasks database is already setup. If not, create it.
  await create(client, databaseId, containerId);

  // query to return all items based on the email parameter 
  const querySpec = {
    query: "SELECT * from c where c.userEmail = @email",
    "parameters": [
        {"name": "@email", "value": email},
    ]
  };
  
  // read all items in the Items container
  const { resources: items } = await container.items
  .query(querySpec)
  .fetchAll();

  // updates all items based on user's new input
  const { id, category } = items[0];
  items[0].userCurrentLat = data.userCurrentLat;
  items[0].userCurrentLong = data.userCurrentLong;
  items[0].userLocationLat = data.userLocationLat;
  items[0].userLocationLong = data.userLocationLong;
  items[0].userDateTime = data.userDateTime;
  items[0].userParkingTime = data.userParkingTime;
  items[0].userNotificationTime = data.userNotificationTime;

  const { resource: updatedItem } = await container
  .item(id, category)
  .replace(items[0]);
}


// gets user input and updates or creates a new item
module.exports = async function (context, req) {
  const data = req.body; // this is the user's input
  let userLocationLat;
  let userLocationLong;
  await fetch('https://atlas.microsoft.com/search/address/json?&subscription-key='+process.env["AZURE_MAPS_API_KEY"]+'&api-version=1.0&language=en-US&query='+data.userEventLocation, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    method: "GET",
  }) 
  .then((response) => response.json())
    .then((theMapData) => {
      userLocationLat = theMapData.results[1].position.lat;
      userLocationLong = theMapData.results[1].position.lon;
      console.log("userLocationLat: " + userLocationLat);
      console.log("userLocationLong: " + userLocationLong);
    }).catch((error) => {
      console.error('Error:', error.message);
  });

  let document = {"userEmail": data.userEmail, 
                  "userCurrentLat": data.userCurrentLat,
                  "userCurrentLong": data.userCurrentLong,
                  "userLocationLat": userLocationLat,
                  "userLocationLong": userLocationLong,
                  "userDateTime": data.userDateTime,
                  "userParkingTime": data.userParkingTime,
                  "userNotificationTime": data.userNotificationTime,
                  } // create an object with the string as the key, and the variable as its value

  // gets all items with particular email in database
  let currentItems = await getItems(data.userEmail);

  // checks to see if item with particular email address exists
  if (currentItems.length == 0) {
      let items = await createDocument(document)
  } else {
      updateItem(data, data.userEmail);
  }

  const responseMessage = `Thanks! Stored your info "${JSON.stringify(data.userEmail)}"`
  context.res = {
      body: responseMessage
  };
}

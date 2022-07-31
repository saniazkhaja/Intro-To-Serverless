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


// used to get items based on the user's email
async function getAllItems(email) {
  const { endpoint, key, databaseId, containerId } = config;
  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(containerId);

  // Make sure Tasks database is already setup. If not, create it.
  await create(client, databaseId, containerId);

  // query to return all items based on the email parameter
  const querySpec = {
    query: "SELECT * from c",
  };

  // read all items in the Items container
  const { resources: items } = await container.items
  .query(querySpec)
  .fetchAll();

  // returns items that met query requirements
  return items;
}


async function getLeaveTime(userCurrentLat, userCurrentLong, userLocationLat, userLocationLong, userDateTime, userParkingTime) {
  let departure = 0;
  let arrival = 0;
  let calculatedLeaveTime = 0;
  await fetch('https://atlas.microsoft.com/route/directions/json?api-version=1.0&query='+userCurrentLat+','+userCurrentLong+':'+userLocationLat+','+userLocationLong+'&subscription-key='+process.env["AZURE_MAPS_API_KEY"], {
    method: 'GET',
    redirect: 'follow',
    headers: {
    'x-ms-client-id': '748406a7-9b81-43bc-9361-79a4ca6d4d19',
    'Accept': 'application/json'
    }
  })  
    .then((response) => response.json())
    .then((theMapData) => {
      departure = theMapData.routes[0].summary.departureTime;
      arrival = theMapData.routes[0].summary.arrivalTime;

      console.log(departure);
      console.log(arrival);
    }).catch((error) => {
      console.error('Error:', error.message);
  });

  return calculatedLeaveTime;
}


// used to send an email to user to notify when to leave through SendGrid
function sendEmail(userEmail, leaveTime, arriveTime) {
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: userEmail, // Change to your recipient
    from: 'saniazkhaja@gmail.com', // Change to your verified sender
    subject: 'Time To Leave For Your Event Soon',
    html: 'You will want to leave by ' + leaveTime + '<strong> to reach your event at </strong>' + arriveTime,
  }
  sgMail
  .send(msg)
  .then(() => {
      console.log('Email sent')
  })
  .catch((error) => {
      console.error(error)
  })
}


// used to read database, see when to leave based on Azure Maps API data and send email to user  
module.exports = async function (context, myTimer) {
  var timeStamp = new Date().toISOString();
  let dateNow = new Date();
  
  if (myTimer.isPastDue)
  {
      context.log('JavaScript is running late!');
  }
  context.log('JavaScript timer trigger function ran!', timeStamp);  
    
  // will get all items in container
  let allItems = await getAllItems();

  
  // will go through each item and see whether it is time to send a notification
  for (let i = 1; i < allItems.length; i++) {
    let calculatedLeaveTime = await getLeaveTime(allItems[i].userCurrentLat, allItems[i].userCurrentLong, 
                                          allItems[i].userLocationLat, allItems[i].userLocationLong,
                                          allItems[i].userDateTime, allItems[i].userParkingTime);
    let dateCalculated = new Date(calculatedLeaveTime);

    if (dateNow.getTime() > dateCalculated.getTime()) {
      console.log(dateNow.toString() + ' is more recent than ' + dateCalculated.toString());
    } else {
      console.log(dateNow.toString() + ' is less recent than ' + dateCalculated.toString());
    }
    // check and see if leave time and currentTime difference is 5 minute difference or userNoticationTime difference
    // Calls sendEmail function with email parameter, leave time and arrive time. Used for notification purposes
    sendEmail(allItems[i].userEmail, calculatedLeaveTime, allItems[i].userDateTime);
  }  
};
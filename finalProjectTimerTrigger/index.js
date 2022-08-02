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


// Calculates what time the user should leave from home based on event time and parking time needed and used to know when to notify user
async function getLeaveTime(email, userCurrentLat, userCurrentLong, userLocationLat, userLocationLong, userDateTime, userParkingTime, userNoticationTime) {
  let calculatedLeaveTime = 0;
  let travelTime = 0;
  let currentTime = new Date();
  let userEventTime = new Date(userDateTime);
  console.log("Current time: " + currentTime.toString());
  console.log("Current time in MS: " + currentTime.getTime());
  console.log("User event time: " + userEventTime.toString());
  console.log("User event time in MS:" + userEventTime.getTime());

  // getting traffic data from azure maps
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
      travelTime = theMapData.routes[0].summary.travelTimeInSeconds;

      console.log("Travel Time: " + travelTime);
    }).catch((error) => {
      console.error('Error:', error.message);
  });

  // parking time and notification time in milliseconds
  let parkingTimeMs = (parseInt(userParkingTime) * 60) * 1000;
  let notificationTimeMs = (parseInt(userNoticationTime) * 60) * 1000;
  console.log("ParkingTime in MS: " + parkingTimeMs + " Notification in MS: " + notificationTimeMs);

  // calculates time needed before notification
  let timeNeeded = parkingTimeMs + notificationTimeMs + (travelTime * 1000);
  let defaultTimeNeeded = parkingTimeMs + (travelTime * 1000);
  let timeToEvent = (userEventTime.getTime() - currentTime.getTime());
  console.log("Time Needed in MS: " + timeNeeded);
  console.log("Time To Event in MS: " + timeToEvent);

  // checking to see if it is time to notify the user when to leave
  if (timeToEvent - timeNeeded <= 300000 && timeToEvent - timeNeeded > 0) {
    console.log ("Notifying user1");
    calculatedLeaveTime = new Date(userEventTime.getTime() - (travelTime * 1000) - parkingTimeMs);
    sendEmail(email, calculatedLeaveTime, userEventTime);
  } else if (timeToEvent - defaultTimeNeeded <= 300000 && timeToEvent - defaultTimeNeeded > 0) {
    console.log ("Notifying user2");
    calculatedLeaveTime = new Date(userEventTime.getTime() - (travelTime * 1000) - parkingTimeMs);
    sendEmail(email, calculatedLeaveTime, userEventTime);
  }

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
    
  // will get all items in container
  let allItems = await getAllItems();
  
  // will go through each item and see whether it is time to send a notification
  for (let i = 0; i < allItems.length; i++) {
    console.log(" ");
    let calculatedLeaveTime = await getLeaveTime(allItems[i].userEmail,allItems[i].userCurrentLat, allItems[i].userCurrentLong, 
                                          allItems[i].userLocationLat, allItems[i].userLocationLong,
                                          allItems[i].userDateTime, allItems[i].userParkingTime, allItems[i].userNotificationTime);
  }  
};
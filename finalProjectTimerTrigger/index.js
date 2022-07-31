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


// used to read database, see when to leave based on Azure Maps API data and send email to user  
module.exports = async function (context, myTimer) {
  var timeStamp = new Date().toISOString();
  
  if (myTimer.isPastDue)
  {
      context.log('JavaScript is running late!');
  }
  context.log('JavaScript timer trigger function ran!', timeStamp);  
    
   
    
    
  await fetch('https://atlas.microsoft.com/route/directions/json?api-version=1.0&query=47.591180,-122.332700:45.591180,-122.332700&subscription-key=' + process.env["AZURE_MAPS_API_KEY"], {
    method: 'GET',
    redirect: 'follow',
    headers: {
    'x-ms-client-id': '748406a7-9b81-43bc-9361-79a4ca6d4d19',
    'Accept': 'application/json'
    }
  })  
    .then((response) => response.json())
    .then((theMapData) => {
      let departure = theMapData.routes[0].summary.departureTime;
      let arrival = theMapData.routes[0].summary.arrivalTime;

      context.log(departure);
      context.log(arrival);
    }).catch((error) => {
      console.error('Error:', error.message);
  });

   // let items = await getItems();
   // context.log(JSON.stringify(items));
    

    // const sgMail = require('@sendgrid/mail')
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    // const msg = {
    // to: 'saniazehra2@gmail.com', // Change to your recipient
    // from: 'saniazkhaja@gmail.com', // Change to your verified sender
    // subject: 'Sending with SendGrid is Fun',
    // text: 'and easy to do anywhere, even with Node.js',
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    // }
    // sgMail
    // .send(msg)
    // .then(() => {
    //     console.log('Email sent')
    // })
    // .catch((error) => {
    //     console.error(error)
    // })
};

// module.exports = function (context, input) {
//     var message = {
//         "personalizations": [ { "to": [ { "email": "sample@sample.com" } ] } ],
//         from: { email: "sender@contoso.com" },
//         subject: "Azure news",
//         content: [{
//             type: 'text/plain',
//             value: input
//         }]
//     };

//     return message;
// };


// // using Twilio SendGrid's v3 Node.js Library
// // https://github.com/sendgrid/sendgrid-nodejs
// javascript
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const msg = {
//   to: 'test@example.com', // Change to your recipient
//   from: 'saniazkhaja@gmail.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })
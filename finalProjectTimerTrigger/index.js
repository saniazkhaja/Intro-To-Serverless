
module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);   



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
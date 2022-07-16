const userGmail = document.getElementById("userGmail").value;
const userLocation = document.getElementById("userLocation").value;
const userParkingTime = document.getElementById("userParkingTime").value;
const userNotificationTime = document.getElementById(" userNotificationTime").value;
const userSubmitButton = document.getElementById("userSubmitButton").value;

button.addEventListener("click", async function() {
    userGmail = document.getElementById("userGmail").value;
    userLocation = document.getElementById("userLocation").value;
    userParkingTime = document.getElementById("userParkingTime").value;
    userNotificationTime = document.getElementById(" userNotificationTime").value;
    userSubmitButton = document.getElementById("userSubmitButton").value;
})


module.exports = async function (context, req, secrets) {
    // context.log('JavaScript HTTP trigger function processed a request.');

    // const name = (req.query.name || (req.body && req.body.name));
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: secrets
    };



}
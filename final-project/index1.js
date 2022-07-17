let userGmail = document.getElementById("userGmail").value;
let userLocationLat = document.getElementById("userLocationLat").value;
let userLocationLong = document.getElementById("userLocationLong").value;
let userParkingTime = document.getElementById("userParkingTime").value;
let userNotificationTime = document.getElementById("userNotificationTime").value;
const userSubmitButton = document.getElementById("userSubmitButton");

userSubmitButton.addEventListener("click", async function() {
    userGmail = document.getElementById("userGmail").value;
    userLocation = document.getElementById("userLocationLat").value;
    userLocation = document.getElementById("userLocationLong").value;
    userParkingTime = document.getElementById("userParkingTime").value;
    userNotificationTime = document.getElementById("userNotificationTime").value;

    console.log("email:", userGmail);
});

//https://jurgenonazure.com/2020/05/post-html-forms-to-cosmos-db-with-azure-functions-for-free/
// https://docs.microsoft.com/en-us/azure/azure-functions/functions-integrate-store-unstructured-data-cosmosdb?tabs=javascript
//https://developers.google.com/maps/documentation/distance-matrix/distance-matrix#maps_http_distancematrix_bicycling-js
//https://docs.microsoft.com/en-us/azure/cosmos-db/sql/sql-api-nodejs-get-started?tabs=windows
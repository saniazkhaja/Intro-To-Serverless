// let userGmail = document.getElementById("userGmail").value;
// let userLocationLat = document.getElementById("userLocationLat").value;
// let userLocationLong = document.getElementById("userLocationLong").value;
// let userParkingTime = document.getElementById("userParkingTime").value;
// let userNotificationTime = document.getElementById("userNotificationTime").value;
const userSubmitButton = document.getElementById("userSubmitButton");

userSubmitButton.addEventListener("click", async function() {
    let userGmail = document.getElementById("userGmail").value;
    let userLocationLat = document.getElementById("userLocationLat").value;
    let userLocationLong = document.getElementById("userLocationLong").value;
    let userParkingTime = document.getElementById("userParkingTime").value;
    let userNotificationTime = document.getElementById("userNotificationTime").value;

    console.log("email:", userGmail);


    fetch("http://localhost:7071/api/final-project",
    {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
                        "userGmail": userGmail,
                        "userLocationLat": userLocationLat,
                        "userLocationLong": userLocationLong,
                        "userParkingTime": userParkingTime,
                        "userNotificationTime": userNotificationTime
                        })

                        
})
.then(function(res){ console.log(res) })
.catch(function(res){ console.log(res) })

document.getElementById("userGmail").value = "";
document.getElementById("userLocationLat").value = "";
document.getElementById("userLocationLong").value = "";
document.getElementById("userParkingTime").value = "";
document.getElementById("userNotificationTime").value = "";
document.getElementById("submittedText").innerHTML = "Your form successfully submitted!";

});

//https://jurgenonazure.com/2020/05/post-html-forms-to-cosmos-db-with-azure-functions-for-free/
// https://docs.microsoft.com/en-us/azure/azure-functions/functions-integrate-store-unstructured-data-cosmosdb?tabs=javascript
//https://developers.google.com/maps/documentation/distance-matrix/distance-matrix#maps_http_distancematrix_bicycling-js
//https://docs.microsoft.com/en-us/azure/cosmos-db/sql/sql-api-nodejs-get-started?tabs=windows
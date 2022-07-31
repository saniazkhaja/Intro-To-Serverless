const userSubmitButton = document.getElementById("userSubmitButton");

// runs when submit button is clicked
userSubmitButton.addEventListener("click", async function() {
  // used to get all user inputs ans store those values in variables
  let userEmail = document.getElementById("userEmail").value;
  let userCurrentLat = document.getElementById("userCurrentLat").innerText;
  let userCurrentLong = document.getElementById("userCurrentLong").innerText;
  let userLocationLat = document.getElementById("userLocationLat").value;
  let userLocationLong = document.getElementById("userLocationLong").value;
  let userParkingTime = document.getElementById("userParkingTime").value;
  let userNotificationTime = document.getElementById("userNotificationTime").value;
  let userDateTime = document.getElementById("userDateTime").value;

  // used to get request and responses from HTML page. Converts user input into JSON data
  fetch("http://localhost:7071/api/final-project",
  {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: "POST",
  body: JSON.stringify({
                      "userEmail": userEmail,
                      "userCurrentLat": userCurrentLat,
                      "userCurrentLong": userCurrentLong,
                      "userLocationLat": userLocationLat,
                      "userLocationLong": userLocationLong,
                      "userDateTime": userDateTime,
                      "userParkingTime": userParkingTime,
                      "userNotificationTime": userNotificationTime
                      })
})
.then(function(res){ console.log(res) })
.catch(function(res){ console.log(res) })

// resets values after submitting form
document.getElementById("userEmail").value = "";
document.getElementById("userCurrentLat").innerHTML = "";
document.getElementById("userCurrentLong").innerHTML = "";
document.getElementById("userLocationLat").value = "";
document.getElementById("userLocationLong").value = "";
document.getElementById("userDateTime").value = "";
document.getElementById("userParkingTime").value = "";
document.getElementById("userNotificationTime").value = "";
document.getElementById("submittedText").innerHTML = "Your form successfully submitted!";
});

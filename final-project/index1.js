const form = document.getElementById("userForm");

// runs when submit button is clicked
form.addEventListener("submit", async function(event) {
  event.preventDefault();
  // used to get all user inputs ans store those values in variables
  let userEmail = document.getElementById("userEmail").value;
  let userCurrentLat = document.getElementById("userCurrentLat").innerText;
  let userCurrentLong = document.getElementById("userCurrentLong").innerText;
  let userEventLocation = document.getElementById("userEventLocation").value;
  let userParkingTime = document.getElementById("userParkingTime").value;
  let userNotificationTime = document.getElementById("userNotificationTime").value;
  let userDateTime = document.getElementById("userDateTime").value;

  // used to get request and responses from HTML page. Converts user input into JSON data
  fetch("https://bitprojectweek1.azurewebsites.net/api/final-project?",
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
                      "userEventLocation": userEventLocation,
                      "userDateTime": moment(userDateTime).format(),
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
// document.getElementById("userLocationLat").value = "";
// document.getElementById("userLocationLong").value = "";
document.getElementById("userEventLocation").value = "";
document.getElementById("userDateTime").value = "";
document.getElementById("userParkingTime").value = "";
document.getElementById("userNotificationTime").value = "";
document.getElementById("submittedText").innerHTML = "Your form successfully submitted!";
document.getElementById("submittedText").classList.remove("d-none");
});

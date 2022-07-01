const bunnForm = document.getElementById('bunnForm');

bunnForm.addEventListener('submit', function (event) {
   event.preventDefault()
   const username = document.getElementById("username").value
   if (username == "") {
        alert("No name error.")
   }
   const output = document.getElementById("output")
   //output.textContent = username + "❤"
   output.textContent = "Thanks!"
});
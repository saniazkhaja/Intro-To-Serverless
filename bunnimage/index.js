const bunnForm = document.getElementById('bunnForm');

bunnForm.addEventListener('submit', async function (event) {
   event.preventDefault()
   const username = document.getElementById("username").value
   const output = document.getElementById("output")
   if (username == "") {
        alert("No name error.")
        return;
   }
   
   let fileInput = document.getElementById("image")
   const file = fileInput.files[0]
   var payload = new FormData(bunnForm)
   payload.append("file", file);
   const endpoint = "https://bitprojectweek1.azurewebsites.net/api/bunnimage-upload?code=gxnvy2NkM3UhRSk5_gSc14a0LkKmxM92XF6GBi_LH02SAzFuKCa3Ow=="
   const options = {
        "method": "POST",
        "body": payload,
        headers: {
            "codename": username,
            "Content-Type": "multipart/form-data"
        }
   }
   const resp = await fetch(endpoint, options)
   const data = await resp.text();
   output.textContent = "Your image has been stored successfully!";
   //output.textContent = username + "❤"
   // output.textContent = "Thanks!"
});
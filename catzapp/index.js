const button = document.getElementById("button1");

button.addEventListener("click", async function() {
    // will assume that user will put in a value
    // this if statemnt accounts for if the user does not put in a value
    // if (document.getElementById("name")) {
    //     let cat = document.getElementById("name").value;
    //     document.getElementById("image").src = "https://cataas.com/cat/says/" + cat;
    // }
    const name1 = document.getElementById("name1").value;
    const name2 = document.getElementById("name2").value;
    const name3 = document.getElementById("name3").value;
    const name4 = document.getElementById("name4").value;

    const AZURE_URL = "https://bitprojectweek1.azurewebsites.net/api/twocatz?code=zs0ktDYVqvvU4HtXDzHrBjv2AcxfUh7AnyorYOdFJz8OAzFuXyltWw==";
    const fetch_url = `${AZURE_URL}&name1=${name1}&name2=${name2}&name3=${name3}&name4=${name4}`;

    const resp = await fetch(fetch_url, {
        method: "GET",
    });

    const data = await resp.json();

    // document.getElementById("image").src = "https://cataas.com/cat/says/" + cat;
    
    setSourceOfBase64("image1", data.cat1);
    setSourceOfBase64("image2", data.cat2);
    setSourceOfBase64("image3", data.cat3);
    setSourceOfBase64("image4", data.cat4);
    // document.getElementById("image1").src = "data:image/png;base64," + data.cat1;
    // document.getElementById("image2").src = "data:image/png;base64," + data.cat2;
    // document.getElementById("image3").src = "data:image/png;base64," + data.cat3;
    // document.getElementById("image4").src = "data:image/png;base64," + data.cat4;
})

function setSourceOfBase64(id, base64String) {
    document.getElementById(id).src = "data:image/png;base64," + base64String;
}
const button = document.getElementById("button1");

button.addEventListener("click", function() {
    if (document.getElementById("name")) {
        let cat = document.getElementById("name").value;
        document.getElementById("image").src = "https://cataas.com/cat/says/" + cat;
    }
})
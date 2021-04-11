let socket = io();

socket.on("register_fail", ()=>{
    alert("Username taken!");
})

socket.on("register_success", ()=>{
    alert("Successful registration!");
})

function register(e){
    e.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let password2 = document.getElementById("password2").value;
    let type;
    if (document.getElementById("type1").checked) type = "Customer";
    if (document.getElementById("type2").checked) type = "Seller";

    if (type == undefined) alert("No type selected!");
    else if (password != password2) alert("Passwords do not match!");
    else socket.emit("register", username, password, type);
}
let socket = io();

let myName = "", myId;

function addP(name, msg){
    let messages = document.getElementById("messages");
    let p = document.createElement("p");
    p.innerHTML = name + ": " + msg;
    messages.appendChild(p);
    document.getElementById("bottom").scrollIntoView();
}

socket.on("init", (msg)=>{
    for (let i=0; i<msg.length; ++i){
        addP(msg[i].name, msg[i].msg);
    }
});

socket.on("msg", addP);

socket.on("success", (id)=>{
    myId = id;
    let loginDiv = document.getElementById("loginDiv")
    loginDiv.style.display = "none";
    let chatHistory = document.getElementById("chatHistory");
    chatHistory.style.display = "block";
    document.getElementById("heading").innerHTML = "Hello, " + myName;
    document.getElementById("bottom").scrollIntoView();
});

socket.on("fail", ()=>{
    alert("Password is not correct.");
});

function saveName(e){
    e.preventDefault();
    myName = document.getElementById("name").value;
    let password = document.getElementById("password").value;
    socket.emit("login", myName, password);
}

function newName(e){
    e.preventDefault();
    myName = document.getElementById("name").value;
    let password = document.getElementById("password").value;
    let passwordconfirm = document.getElementById("passwordconfirm").value;
    if (password != passwordconfirm) return;
    socket.emit("check", myName, password);
}

socket.on("check", (myName, password) => {
    socket.emit("login", myName, password);
});

function send(e){
    e.preventDefault();
    let toSend = document.getElementById("toSend");
    socket.emit("msg", myId, myName, toSend.value);
    toSend.value = "";
}
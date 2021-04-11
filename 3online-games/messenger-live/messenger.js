let socket = io();

let myName = "";

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

function saveName(e){
    e.preventDefault();
    myName = document.getElementById("name").value;
    let nameInputDiv = document.getElementById("nameInputDiv")
    nameInputDiv.style.display = "none";
    let chatHistory = document.getElementById("chatHistory");
    chatHistory.style.display = "block";
    document.getElementById("heading").innerHTML = "Hello, " + myName;
    document.getElementById("bottom").scrollIntoView();
}

function send(e){
    e.preventDefault();
    let toSend = document.getElementById("toSend");
    socket.emit("msg", myName, toSend.value);
    toSend.value = "";
}
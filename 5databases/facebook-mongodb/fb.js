let socket = io();

socket.on("register_fail", ()=>{
    alert("Username taken!");
})

socket.on("register_success", (user)=>{
    alert("Successful registration!");
    showInfo(user);
});

socket.on("login_username_fail", ()=>{
    alert("Username incorrect!");
});

socket.on("login_password_fail", ()=>{
    alert("Password incorrect!");
});

socket.on("login_success", (user)=>{
    alert("Successful login!");
    showInfo(user);
});


socket.on("users", (users, username) => {
    for (let i=0; i<users.length; i++) {
        if (users[i].username != username) {
            let usersDiv = document.getElementById("users");
            let thisUserDiv = document.createElement("div");

            let userName = document.createElement("h3");
            userName.innerHTML = users[i].username;
            userName.style.fontWeight = "bold";
            userName.id = users[i].username + "Name";
            thisUserDiv.appendChild(userName);

            let userAbout = document.createElement("p");
            userAbout.innerHTML = users[i].about;
            userAbout.style.fontStyle = "italic";
            userAbout.id = users[i].username + "About";
            thisUserDiv.appendChild(userAbout);

            let userButton = document.createElement("button");
            userButton.innerHTML = "Make friend";
            userButton.id = users[i].username + "Button";
            userButton.addEventListener("submit", (button, e) => {
                e.preventDefault;
                socket.emit("makeFriend", username, users[i].username);
            });
            thisUserDiv.appendChild(userButton);

            thisUserDiv.style.display = "inline-block";
            thisUserDiv.className = "user";
            thisUserDiv.id = "user" + users[i].username + "Box";
            usersDiv.appendChild(thisUserDiv);
        }
    }
});

socket.on("friends", (friends) => {
    let allFriendsDiv = document.getElementById("friends");
    for (let friend of friends) {
        let friendDiv = document.getElementById("user" + friend.username + "Box");
        if (friendDiv!=null){
            friendDiv.classList.remove("user");
            friendDiv.className = "friend";
            friendDiv.removeAttribute("id");
            friendDiv.id = "friend" + users[i].username + "Box";

            allFriendsDiv.appendChild(friendDiv);
        }
    }
});

socket.on("changedBio", (username, newBio) => {
    let changedDiv = document.getElementById(username + "About");
    changedDiv.innerHTML = newBio;
});

socket.on("found", (res, searchType) => {
    // clean previous search
    let friendsDivs = document.getElementsByClassName("friend");
    for (let box of friendsDivs) {
        box.style.backgroundColor = "lightskyblue";
        box.style.color = "black";
    }
    let usersDivs = document.getElementsByClassName("user");
    for (let box of usersDivs) {
        box.style.backgroundColor = "lightskyblue";
        box.style.color = "black";
    }
    // color new search
    for (let i=0; i<res.length; i++) {
        let foundDiv = document.getElementById(searchType + res[i].username + "Box");
        if (foundDiv!=null) {
            foundDiv.style.backgroundColor = "purple";
            foundDiv.style.color = "whitesmoke";
        }
    }
});

function register(e) {
    e.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let password2 = document.getElementById("password2").value;
    let about = document.getElementById("about").value;
    if (password != password2) alert("Passwords do not match!");
    else socket.emit("register", username, password, about);
}

function saveName(e) {
    e.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    socket.emit("login", username, password);
}

function showInfo(user) {
    let loginDiv = document.getElementById("loginDiv");
    loginDiv.style.display = "none";
    let infoDiv = document.getElementById("infoDiv");
    infoDiv.style.display = "block";
    let profileName = document.getElementById("profileName");
    profileName.innerHTML=user.username;
    let profileAbout = document.getElementById("profileAbout");
    profileAbout.innerHTML=user.about;
}

function editBio(e){
    e.preventDefault();
    let editBioDiv = document.getElementById("profileEdit");
    let textArea = document.getElementsByTagName("textarea");
    let profileAbout = document.getElementById("profileAbout");
    textArea.innerHTML = profileAbout.innerHTML;
    editBioDiv.style.display="block";
}

function saveBio(e){
    e.preventDefault();
    let text = document.getElementById("bioTextarea").value;
    socket.emit("bio", text);
    let profileAbout = document.getElementById("profileAbout");
    profileAbout.innerHTML = text;
    let editDiv = document.getElementById("profileEdit");
    editDiv.style.display = "none";
}

function searchFriend(e) {
    e.preventDefault();
    let username = document.getElementById("friendSearch").value;
    let searchType = "friend";
    socket.emit("search", username, searchType);
}

function searchUser(e) {
    e.preventDefault();
    let username = document.getElementById("userSearch").value;
    let searchType = "user";
    socket.emit("search", username, searchType);
}
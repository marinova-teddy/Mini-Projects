var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var MongoClient = require("mongodb").MongoClient;

let db;

MongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, con) => {
    if (err) throw err;
    db = con.db("fb");

    http.listen(80, function(){
        console.log("server started");
    });
})


app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});
app.get('/register', function(req, res){
    res.sendFile(__dirname + "/register.html");
})
app.get('/fb.js', function(req, res){
    res.sendFile(__dirname + "/fb.js");
});

io.on('connection', function(socket){
    let myUsername = "";
    socket.on("register", (username, password, about)=>{
        db.collection("users").insertOne({username, password, about}, (err, res)=>{
            if (err) socket.emit("register_fail");
            else socket.emit("register_success");
        });
    });
    socket.on("login", (username, password) => {
        db.collection("users").findOne({username}, (err, res) => {
            if (err || res===null) socket.emit("login_username_fail");
            else if (password!=res.password) socket.emit("login_password_fail");
            else {
                socket.emit("login_success", {username,password,about:res.about});
                myUsername = username;
                db.collection("users").find({}).toArray((err, resUsers) => {
                    if (err) throw err;
                    socket.emit("users", resUsers, myUsername);
                });
                db.collection("friends").find({username}).toArray((err, res) => {
                        if (err) throw err;
                        resFriends = res;
                        console.log("friends")
                        console.log(res);
                        socket.emit("friends", res);
                    });
            }
        });
    }); 
    socket.on("bio", (text) => {
        db.collection("users").updateOne({username: myUsername}, {$set:{about: text}}, (err, res) => {
            if (err) throw err;
            io.emit("changedBio", myUsername, text)
        });
    });
    socket.on("search", (username, searchType) => {
        db.collection("users").find({username}).toArray((err, res) => {
            if (err) throw err;
            socket.emit("found", res, searchType);
        });
    });
    socket.on("makeFriend", (user, friend) => {
        let friendship = {
            username: user,
            friend: friend
        }
        db.collection("friends").insertOne(friendship, (err, res)=>{
            if (err) throw err;
            io.emit("changedFriends", user, friend);
        });
    });
});
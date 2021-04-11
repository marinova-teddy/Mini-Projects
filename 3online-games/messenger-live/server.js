var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});
app.get('/messenger.js', function(req, res){
    res.sendFile(__dirname + "/messenger.js");
});

let msg = []
io.on('connection', function(socket){
    socket.emit("init", msg);
    socket.on("msg", (username, message) => {
        msg.push({name: username, msg: message});
        io.emit("msg", username, message);
    });
});

http.listen(80, function(){
    console.log("server started");
});
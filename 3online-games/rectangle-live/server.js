var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + "/start.html");
});
app.get('/game.js', function(req, res){
    res.sendFile(__dirname + "/game.js");
});

let n=0, players = [];

io.on('connection', function(socket){
    let id = n;
    n++;
    players[id] = {x: Math.random()*800, y: Math.random()*600, b: [], alive: true};
    socket.emit("init", id, players);
    io.emit("move", id, players[id]);
    
    socket.on("move", function(player){
        players[id] = player;
        io.emit("move", id, player);
    });

    socket.on("kill", function(recieved_id){
        players[recieved_id].alive = false;
        io.emit("move", recieved_id, players[recieved_id]);
    });

    socket.on("disconnect", function(){
        players[id].alive = false;
        io.emit("move", id, players[id]);
    })
});

http.listen(3000, function(){
    console.log("server started");
});
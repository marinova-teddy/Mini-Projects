var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + "/start.html");
});
app.get('/game.js', function(req, res){
    res.sendFile(__dirname + "/game.js");
});
app.get('/three.min.js', function(req, res){
    res.sendFile(__dirname + "/three.min.js");
});
app.get('/ThreeCSG.js', function(req, res){
    res.sendFile(__dirname + "/ThreeCSG.js");
});

let players = [];
let walls = [];
for (let i=0; i<20; ++i){
    walls[i] = {x: Math.random()*200-100, z: Math.random()*200-100};
}

io.on('connection', function(socket){
    let id = players.length;
    players.push({x: Math.random()*200-100, z: Math.random()*200-100, alpha: Math.random()*2*Math.PI});
    socket.emit("init", id, players, walls);
    io.emit("newpl", id, players[id]);
    socket.on("move", (id, player) => {
        players[id] = player;
        io.emit("move", id, player);
    })
});

http.listen(3000, function(){
    console.log("server started");
});
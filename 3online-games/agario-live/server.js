var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + "/start.html");
});
app.get('/game.js', function(req, res){
    res.sendFile(__dirname + "/game.js");
});


let n = 0, players = [];
let pellets = [];
io.on('connection', function(socket){
    let id = n;
    n++;
    //ako n e 1 suzdavame 10k peleti , zashtoto inache shte se suzdavat pri vseki lognat player
    if(n == 1){
        //pravene na peletki
        for(i = 0;i < 10000;i++){
            pellets[i] = {
                x: Math.random()*7995,
                y: Math.random()*5995,
                color: "white",
                alive: true
            };
        }
    }
    //pravene na playeri
    players[id] = {
        x: Math.random()*7995, 
        y: Math.random()*5995, 
        r: 10, 
        mass: 5, 
        pieces: [], 
        alive: true
    };

    socket.emit("init", id, players, pellets);
    io.emit("coordinates", id, players[id]);
    io.emit("users", n);

    socket.on("move", function(player, recieved_id){
        players[recieved_id] = player;
        io.emit("coordinates", id, players[recieved_id]);
    });

    socket.on("PelletDead", function(pellets1){
        pellets = pellets1;
        //ciklim mejdu vsichki peleti i ako ima nqkoq umrqla q sujivqvame i i davame novi random coordinati
        io.emit("DiedPellet", pellets);
    });

    socket.on("EatPlayers",function(players1, id1, players2, id2){
        players[id1] = players1;
        players[id2] = players2;
        io.emit("PlayerEating", players[id1], id1, players[id2], id2);
    });
});

http.listen(3000, function(){
    console.log("server started");
});


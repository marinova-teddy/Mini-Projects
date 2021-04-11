// Creating variables
var socket = io();

let isMouseDown = false, reload = 0;
let speed = 3, bulletspeed = 7;
let id = -1, players = [];

socket.on("init", function(recieved_id, recieved_players){
    id = recieved_id;
    players = recieved_players;
});

socket.on("move", function(recieved_id, player){
    players[recieved_id] = player;
});

function update() {
    if (id == -1) return;
    if (!players[id].alive) return;
    if (isKeyPressed[87]){players[id].y -= speed;}
    if (isKeyPressed[83]){players[id].y += speed;}
    if (isKeyPressed[65]){players[id].x -= speed;}
    if (isKeyPressed[68]){players[id].x += speed;}

    --reload;
    if (isMouseDown && reload<=0){
        reload = 10;
        let d = Math.sqrt((mouseX-players[id].x)*(mouseX-players[id].x) + (mouseY-players[id].y)*(mouseY-players[id].y));
        players[id].b.push(
            { x: players[id].x, 
              y: players[id].y, 
              dx: (mouseX-players[id].x)/d*bulletspeed, 
              dy: (mouseY-players[id].y)/d*bulletspeed
            }
        );
    }
    for (let i=0; i<players[id].b.length; ++i){
        players[id].b[i].x += players[id].b[i].dx;
        players[id].b[i].y += players[id].b[i].dy;
        for (let j=0; j<players.length; ++j){
            if (areColliding(
                players[id].b[i].x, players[id].b[i].y, 5, 5, 
                players[j].x, players[j].y, 30, 30
            ) && j!=id ){
                socket.emit("kill", j);
            }
        }
    }
    
    socket.emit("move", players[id]);
}

function draw() {
    for (let i=0; i<players.length; ++i){
        if (!players[i].alive) continue;
        if (i==id){
            context.fillStyle = "blue";
        }else{
            context.fillStyle = "red";
        }
        context.fillRect(players[i].x, players[i].y, 30, 30);
        for (let j=0; j<players[i].b.length; ++j){
            context.fillRect(players[i].b[j].x, players[i].b[j].y, 5, 5);
        }
    }
}

function keyup(key) {
	
}
function mouseup() {
    isMouseDown = false;
}
function mousedown(){
    isMouseDown = true;
}

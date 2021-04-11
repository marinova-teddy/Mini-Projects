// Creating variables
var socket = io();

//Proverqvame dali po golqmata ot 2 okryjnosti minava centura na druga
function circles(x1, y1, r1, x2, y2, r2){
    if(r1 > r2){
        if(r1*r1 >= (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)){
            return false;
        }else{
            return true;
        }
    }

    if(r2 > r1){
        if(r2*r2 >= (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)){
            return false;
        }else{
            return true;
        }
    }
}
let speed, RegenTime;
let id = -1, players = [], pellets = [];
let n;

//poluchavane na peleti i igrachi
socket.on("init", function(recieved_id, recieved_players, recieved_pellets){
    id = recieved_id;
    players = recieved_players;
    pellets = recieved_pellets;
});

//poluchavame harakteristikite na chovek izvurshil nqkoe destvie vleznal chovek
socket.on("coordinates", function(recieved_id, player){
    if (recieved_id!=id) players[recieved_id] = player;
});

//poluchavane na broi hora (no nikude ne izpolzvam n)
socket.on("users", function(received_n){
    n = received_n;
});

//poluchaame dali nqkoq pelletka e umrqla
socket.on("DiedPellet", function(pellets1){
    pellets = pellets1;
});

//poluchavame dali nqkoiplayer e izql drug player
socket.on("PlayersEating",function(players1, id1, players2, id2){
    if(id1 != id)players[id1] = players1;
    if(id2 != id)players[id2] = players2;
});

function update(){
    if (id == -1) return;
    if (!players[id].alive) return;
    //Smqtame kolko e razstoqnieto ot mishkata do choveka
    let d = Math.sqrt((mouseX-400)*(mouseX-400) + (mouseY-300)*(mouseY-300));
    //Dvijim se s tolkova kum mishkata
    players[id].x = players[id].x + (mouseX - 400) / d * 2;
    players[id].y = players[id].y - (mouseY - 300) / d * 2;
    if(players[id].x > 8000 - players[id].r)players[id].x = 8000 - players[id].r;
    if(players[id].x < players[id].r)players[id].x = players[id].r;

    if(players[id].y > 6000 - players[id].r)players[id].y = 6000 - players[id].r;
    if(players[id].y < players[id].r)players[id].y = players[id].r;
    //prashtame na servera che sme se mrudnali
    socket.emit("move", players[id], id);

    //izqjdane na peletki
    for(i = 0;i < pellets.length;i++){
        //peletite sa po malki ot horata znachi kakvoto vurne funkciqta circle
        //tova e i za peletite 
        pellets[i].alive = circles(players[id].x, players[id].y, players[id].r,pellets[i].x, pellets[i].y, 3);
        //ako ima izqdena peletka se sluchva tova dolu
        if(pellets[i].alive == false){
            pellets[i].alive = true;
            pellets[i].x = Math.random()*7995;
            pellets[i].y = Math.random()*5995;
            players[id].r+=0.2;
            players[id].mass+=1
            socket.emit("move", players[id], id);
            socket.emit("PelletDead", pellets);
        }
    }

    //izqjdane na hora
    //analogichno na peletkite 
    for(i = 0;i < players.length;i++){
        if(players[i].mass > players[id].mass){
            players[id].alive = circles(players[i].x, players[i].y, players[i].r,players[id].x, players[id].y, players[id].r);
        }
        if(players[i].mass < players[id].mass){
            players[i].alive = circles(players[i].x, players[i].y, players[i].r,players[id].x, players[id].y, players[id].r);
        }
        socket.emit("EatPlayers", players[i], i, players[id], id);
    }
}


function draw() {
    if(id == -1)return;
    if (!players[id].alive) return;
    //risuvane na peletki
    for(let i = 0;i < pellets.length;i++){
        if (!pellets[i].alive) continue;
        context.beginPath();
        let bfg = Math.floor(Math.random()*5);
        //ako peletkata e bqla v nachaloto , programata q pravi random cvqt
        if(pellets[i].color == "white"){
            if(bfg == 0){context.fillStyle = "red";pellets[i].color = "red";}
            if(bfg == 1){context.fillStyle = "blue";pellets[i].color = "blue";}
            if(bfg == 2){context.fillStyle = "green";pellets[i].color = "green";}
            if(bfg == 3){context.fillStyle = "yellow";pellets[i].color = "yellow";}
            if(bfg == 4){context.fillStyle = "purple";pellets[i].color = "purple";}
            context.arc(400 + pellets[i].x - players[id].x,300 + players[id].y - pellets[i].y , 3, 0, Math.PI*2);
            context.fill();
        }else{
            //ako ne znachi si q ocvetqva  neiniqt cvqt
            context.fillStyle = pellets[i].color;
            context.arc(400 + pellets[i].x - players[id].x,300 + players[id].y - pellets[i].y , 3, 0, Math.PI*2);
            context.fill();
        }
    }

    //risuvane na playeri
    for (let i=0; i<players.length; ++i){
        if (!players[i].alive) continue;
        context.beginPath();
        if (i==id){
            context.fillStyle = "blue";
            context.arc(400, 300, players[id].r, 0, Math.PI*2);
            context.fill();
        }else{
            context.fillStyle = "red";
            context.arc(400 + players[i].x - players[id].x, 300 + players[id].y - players[i].y, players[i].r, 0, Math.PI*2);
            context.fill();
        }
        
    }


}

function keyup(key) {
	
}

function mouseup() {
    
}
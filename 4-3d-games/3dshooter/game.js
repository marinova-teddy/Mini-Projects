var socket = io();
let canvas = document.getElementsByTagName("canvas")[0];

var floorg = new THREE.BoxGeometry(200, 1, 200);
var floorm = new THREE.MeshPhongMaterial({color: "green"});
var floor = new THREE.Mesh(floorg, floorm);
floor.position.set(0, -0.5, 0);
scene.add(floor);

var playerg = new THREE.BoxGeometry(2, 4, 1);
var playerm = new THREE.MeshPhongMaterial({color: "red"});

var wallg = new THREE.BoxGeometry(5, 5, 5);
var wallm = new THREE.MeshPhongMaterial();

var light = new THREE.PointLight( );
var light2 = new THREE.PointLight( );
light.position.set(0,200,300);
light2.position.set(200, 200, -200);
scene.add( light );
scene.add( light2 );
light = new THREE.PointLight( );
light2 = new THREE.PointLight( );
light.position.set(-200,200,-200);
scene.add( light );

let id, players = [], walls = [];

socket.on("init", (id_, players_, walls_) => {
	id = id_;
	for (let i=0; i<players_.length; ++i){
		players[i] = new THREE.Mesh(playerg, playerm);
		players[i].position.set(players_[i].x, 2, players_[i].z);
		players[i].rotation.y = players_[i].alpha;
		scene.add(players[i]); //тук1
	}
	for (let i=0; i<walls_.length; ++i){
		walls[i] = new THREE.Mesh(wallg, wallm);
		walls[i].position.set(walls_[i].x, 2.5, walls_[i].z);
		scene.add(walls[i]);
	}
	camera.position.set(players_[id].x, 3.5, players_[id].z);
	camera.rotation.y = players_[id].alpha;
});

socket.on("newpl", (ind, player) => {
	if (ind == id) return;
	players[ind] = new THREE.Mesh(playerg, playerm);
	players[ind].position.set(player.x, 2, player.z);
	players[ind].rotation.y = player.alpha;
	scene.add(players[ind]); //тук2
});

socket.on("move", (ind, player) => {
	players[ind].position.set(player.x, 2, player.z);
	players[ind].rotation.y = player.alpha;
});

let move = false;

function update() {
	if (isKeyPressed[87]){
		camera.position.x -= Math.sin(camera.rotation.y)*0.1;
		camera.position.z -= Math.cos(camera.rotation.y)*0.1;
		move = true;
	}
	if (isKeyPressed[83]){
		camera.position.x += Math.sin(camera.rotation.y)*0.1;
		camera.position.z += Math.cos(camera.rotation.y)*0.1;
		move = true;
	}
	if (isKeyPressed[65]){
		camera.position.x -= Math.cos(camera.rotation.y)*0.1;
		camera.position.z += Math.sin(camera.rotation.y)*0.1;
		move = true;
	}
	if (isKeyPressed[68]){
		camera.position.x += Math.cos(camera.rotation.y)*0.1;
		camera.position.z -= Math.sin(camera.rotation.y)*0.1;
		move = true;
	}
	if (move){
		socket.emit("move", id, {x: camera.position.x, z: camera.position.z, alpha: camera.rotation.y});
		move = false;
	}
}

function keyup(key) {
	// Show the pressed keycode in the console
	console.log("Pressed", key);
}
function mouseup() {
	// Show coordinates of mouse on click
	console.log("Mouse clicked at", mouseX, mouseY);
	canvas.requestPointerLock()
}
function mousemove(event){
	camera.rotation.y -= event.movementX/500;
	move = true;
}

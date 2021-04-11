
let walls = [];
function putWall(x, z, w, l, walls) {
	var wall = new THREE.Mesh( new THREE.BoxGeometry( w, 5, l ), material );
	wall.position.set(x, 0, z);
	scene.add(wall);
	walls.push(wall);
}

function collision(camera, walls) {
	value=false;
	for (let i=0;i<90;i++) {
		if (areColliding((camera.position.x-2.5), (camera.position.z-2.5), 5, 5, (walls[i%9][i%10].position.x+0.25), (walls[i%9][i%10].position.z+10)))
			return true;
	}
	for (let i=90;i<180;i++) {
		if (areColliding((camera.position.x-2.5), (camera.position.z-2.5), 5, 5, (walls[90+i%10][90+i%9].position.x+10), (walls[90+i%10][90+i%9].position.z+0.25)))
			return true;
	}
	return false;
}

// Creating variables
var geometry = new THREE.BoxGeometry( 2, 2, 2 );
var material = new THREE.MeshPhongMaterial();
var cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

var light = new THREE.PointLight( );
var light2 = new THREE.PointLight( );
light.position.set(200, 200, 300);
light2.position.set(-200, -200, 300);
// light.position.set(0, 1000, -200);
// light2.position.set(0, 1000, 200);
scene.add( light );
scene.add( light2 );
camera.position.set(10, 0, 10);

//generateMaze
//borders
var rightBorder = new THREE.Mesh( new THREE.BoxGeometry( 0.5, 5, 200 ), material );
rightBorder.position.set(100,0,0);
var leftBorder = new THREE.Mesh( new THREE.BoxGeometry( 0.5, 5, 200 ), material );
leftBorder.position.set(-100, 0, 0);
var backBorder = new THREE.Mesh( new THREE.BoxGeometry( 180, 5, 0.5 ), material );
backBorder.position.set(10, 0, -100);
var frontBorder = new THREE.Mesh( new THREE.BoxGeometry( 180, 5, 0.5 ), material );
frontBorder.position.set(-10,0,100);
var bottomBorder = new THREE.Mesh( new THREE.BoxGeometry( 200.5, 0.5, 200.5 ), material );
bottomBorder.position.set(0,-2.5,0);
scene.add(rightBorder);
scene.add(leftBorder);
scene.add(backBorder);
scene.add(frontBorder);
scene.add(bottomBorder);


//inside walls
let horizontal = []; //x walls
for (let i=0;i<9;i++) { 
	for (let j=0;j<10;j++) {
		let putThisWall=false;
		if (Math.round(Math.random())==1) putThisWall=true;
		if (putThisWall) putWall((-80+i*20), (-90+j*20), 0.5, 20, walls);
	}
}

let vertical = []; //z walls
for (let i=0;i<10;i++) { 
	for (let j=0;j<9;j++) {
		let putThisWall=false;
		if (Math.round(Math.random())==1) putThisWall=true;
		if (putThisWall) putWall((-90+i*20), (-80+j*20), 20, 0.5, walls);
	}
}

//smart maze: generate path + rearrange walls
let front = "z";
function update() {
	// if (isKeyPressed[69]) camera.position.y += 0.1;
	// if (isKeyPressed[81]) camera.position.y -= 0.1;
	if (isKeyPressed[65]) {
		camera.rotate.y -= 90;
		if (front=="z") front="y";
		if (front=="y") front="z";
	}
	if (isKeyPressed[68]) {
		camera.rotate.y += 90;
		if (front=="z") front="y";
		if (front=="y") front="z";
	}
	if (isKeyPressed[83]) {
		if (!collision(camera, walls)) {
			if (front=="z") camera.position.z += 0.1;
			if (front=="y") camera.position.y += 0.1;
		}
	}
	if (isKeyPressed[87]) {
		if (!collision(camera, walls)) {
			if (front=="z") camera.position.z -= 0.1;
			if (front=="y") camera.position.y -= 0.1;
		}
	}
}

let pressedHelp=false;
function keyup(key) {
	if (key==72) {
		pressedHelp=!pressedHelp;
		if (pressedHelp) {
			camera.position.y=100;
			camera.lookAt(camera.position.x, 0, camera.position.z);
		}
		if (!pressedHelp) {
			camera.position.y=0;
			camera.lookAt(-100, 0, camera.position.z);
		}
	}
}
function mouseup() {
	// Show coordinates of mouse on click
	console.log("Mouse clicked at", mouseX, mouseY);
}

//camera.position.set(1,44,400);
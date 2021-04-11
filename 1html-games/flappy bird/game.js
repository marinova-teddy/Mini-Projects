// Creating variables
var myX = 0, myY = 0, updates=0;
let x=[], boxHeight=[];
let ybird=300, acc=0.3, points=0;
let gameOver=false, start=true, jump=false, jumpHeight=0, jumpAcc=0.3, jumpMax=100;   //betweenBoxes= horizontal space between paris of boxes
const birdWidth=60, boxWidth=80, boxes=4, betweenBoxes=250, spaceBird=250;  //spaceBird=space between upper and lower box
for (let i=0;i<boxes;i++) {
    x[i]=800+boxWidth+i*betweenBoxes;
    boxHeight[i]=randomInteger(250)+50;
}
function update() {
    // Napisanoto tuk se izpulnqva otnovo i otnovo mnogo puti v sekunda
    if (gameOver) return;
    else if (jump) {
        ybird-=2+jumpAcc;
        jumpAcc-=0.07;
        if (ybird<=0 || jumpAcc==-0.3) {jump=false; console.log("too big jump")} 
    } else {
        if (ybird>=0 && ybird<=600-birdWidth) {
                ybird+=0.05+acc;
                acc+=0.02;
        }
    }
    for (let i=0;i<boxes;i++) {
        x[i]-=2;
        if (x[i]==-boxWidth) {
            x[i]=800+boxWidth;
            points++;
            console.log(points+" points!");
        }
    }
    
    for (let i=0;i<boxes;i++) {
        if (areColliding(80, ybird, birdWidth, birdWidth, x[i], 0, boxWidth, boxHeight[i]) || areColliding(80, ybird, birdWidth, birdWidth, x[i], (boxHeight[i]+spaceBird), boxWidth, (600-boxHeight[i]-spaceBird))) {
            console.log("Game over!");
            gameOver=true;
        }
    }
    
}
function draw() {
    // tuk naprogramirai kakvo da se risuva
    drawImage(backSun, 0, 0, 800, 600);
    drawImage(jelly[5], 80, ybird, birdWidth, birdWidth); //pileto
    for (let i=0;i<boxes;i++) {
        drawImage(boxItem, x[i], 0, boxWidth, boxHeight[i]); //gorna stena
        drawImage(boxItem, x[i], (boxHeight[i]+spaceBird), boxWidth, (600-boxHeight[i]-spaceBird)); //dolna stena
    }
};
function keyup(key) {
    // Show the pressed keycode in the console
    if (gameOver) return;
    if (key==32) {
        jump=true;
        // jumpHeight=0;
        // jumpMax=(ybird>=100?100:ybird);
        jumpAcc=0.3;
        acc=0.3;
    }
    // console.log("Pressed", key);
};
function mouseup() {
    // Show coordinates of mouse on click
    // console.log("Mouse clicked at", mouseX, mouseY);
};

let px=400, py=300, phealth=200, points=0; //na tretata bomba umirash
let zx=800, zy=600;
let gx=20+randomInteger(700), gy=20+randomInteger(500);
let n=0, bx = [], by = [], t = [];
let pspeed=4, zspeed=1.5, stage=1, zombiesKilled=0;
let gameOver=false;

function update() {
    if (gameOver) return;

    if (isKeyPressed[87]) py-=pspeed;
    if (isKeyPressed[83]) py+=pspeed;
    if (isKeyPressed[65]) px-=pspeed;
    if (isKeyPressed[68]) px+=pspeed;

    if (py < 0) py=0;
    if (py > 480) py=480;
    if (px < 0) px=0;
    if (px > 720) px=720;

    let d = Math.sqrt( (zx-px)*(zx-px) + (zy-py)*(zy-py) )
    if (d >= zspeed){
        zx += (px-zx)/d*zspeed;
        zy += (py-zy)/d*zspeed;
    }

    for (let i=0;i<n;i++) {
        t[i]--;
        if ((t[i]<0 && t[i]>=-20 && areColliding(zx,zy,80,80, bx[i],by[i],40,40)) || (t[i]>=-40 && t[i]<=-20 && areColliding(zx,zy,80,80, bx[i]-5,by[i]-5,50,50))) {
            console.log("The bomb killed the zombie!");
            zx=800; zy=600; points+=stage; zombiesKilled++;
            console.log(points + " points!");
            if (zombiesKilled==5) {
                zombiesKilled=0;
                stage++;
                zspeed+=0.5;
                console.log("Stage " + stage);
            }
        }
        if ((t[i]<0 && t[i]>=-20 && areColliding(px,py,80,80, bx[i],by[i],40,40)) || (t[i]>=-40 && t[i]<=-20 && areColliding(px,py,80,80, bx[i]-5,by[i]-5,50,50))) {
            phealth--;
            if (phealth<=0) {
                console.log("The bomb killed you!");
                gameOver=true;
            } //else console.log("The bomb hit you! You have " + Math.floor(phealth/60) + " lives left.");
        }
        
    }
    if (areColliding(px,py,80,80, zx,zy,80,80)) {
        phealth--;
        if (phealth<=0) {
            console.log("The zombie ate you!");
            gameOver=true;
        } //else console.log("The zombie hit you! You have " + Math.floor(phealth/60) + " lives left.");
    }

    if (areColliding(px, py, 80, 80, gx, gy, 25, 20)) {
        points++;
        gx=20+randomInteger(700); gy=20+randomInteger(500);
        console.log(points + " points!");
    }
}
function draw() {
    drawImage(backStars, 0, 0, 800, 600);
    
    for (let i=0; i<n; ++i){
        if (t[i]>=0) drawImage(bomb, bx[i], by[i], 40, 40);
        else if (t[i]>=-20) drawImage(explosion2, bx[i], by[i], 40, 40);
        else if (t[i]>=-40) drawImage(explosion2, bx[i]-5, by[i]-5, 50, 50);
    }
    
    drawImage(crystal, gx, gy, 25, 20);

    drawImage(zombie, zx, zy, 80, 80);
    drawImage(jelly[4], px, py, 80, 80);
    switch (Math.floor(phealth/60)) {
        case 3: drawImage(heartSmall, 670, 5, 40, 40);
        case 2: drawImage(heartSmall, 710, 5, 40, 40);
        case 1: drawImage(heartSmall, 750, 5, 40, 40);
    }
};
function keyup(key) {
    if (key==32){
        bx[n] = px;
        by[n] = py;
        ++n;
        t[n]=200;
    }
};
function mouseup() {
    
};

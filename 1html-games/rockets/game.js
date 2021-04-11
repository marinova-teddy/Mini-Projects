let px=400, py=300, points=0, gameOver=false;
let rx = [], ry = [], d;
let bx = [], by = [];
let gx=20+randomInteger(700), gy=20+randomInteger(500);
let pspeed=4, rspeed=2, bspeed=3;

function update() {
    if (gameOver) return;

    //player movement
    if (isKeyPressed[87]) py-=pspeed;
    if (isKeyPressed[83]) py+=pspeed;
    if (isKeyPressed[65]) px-=pspeed;
    if (isKeyPressed[68]) px+=pspeed;

    if (py < 0) py=0;
    if (py > 480) py=480;
    if (px < 0) px=0;
    if (px > 720) px=720;

    //collecting gems
    if (areColliding(px, py, 80, 80, gx, gy, 25, 20)) {
        points++;
        gx=20+randomInteger(400); gy=20+randomInteger(500);
        console.log(points + " points!");
    }

    //rocket movement
    rx.push(800); ry.push(randomInteger(580));
    for (let i=0;i<rx.length;i++) {
        d = Math.sqrt( (rx[i]-px)*(rx[i]-px) + (ry[i]-py)*(ry[i]-py) )
        if (d >= rspeed) {
            rx[i] += (px-rx[i])/d*rspeed;
            ry[i] += (py-ry[i])/d*rspeed;
        }
    }
    //rocket collisions
    for (let i=0;i<rx.length;i++) {
        //rocket with player
        if (areColliding(px, py, 80, 80, rx[i]+50, ry[i], 50, 20)) {gameOver=true; console.log("A rocket hit you!")}

        //rocket with another rocket
        for (let j=i+1;j<rx.length;j++) {
            if (areColliding(rx[i], ry[i], 50, 20, rx[j], ry[j], 50, 20)) {
                if (j==rx.length-1) {rx.pop(); ry.pop();}
                else {
                    rx[j]=rx[rx.length-1]; rx.pop();
                    ry[j]=ry[ry.length-1]; ry.pop();
                }
                rx[i]=rx[rx.length-1]; rx.pop();
                ry[i]=ry[ry.length-1]; ry.pop();
            }
        }
    }

    //bullet movement
    for (let i=0;i<bx.length;i++) {
        bx[i]+=bspeed;
    }
    //bullet with rocket collisions
    for (let i=0;i<rx.length;i++) {
        for (let j=0;j<bx.length;j++) {
            if (areColliding(bx[j], by[j], 30, 20, rx[i], ry[i], 50, 20)) {
                console.log("The bullet hit a rocket.")
                if (j==rx.length-1) {rx.pop(); ry.pop();}
                else {
                    rx[j]=rx[rx.length-1]; rx.pop();
                    ry[j]=ry[ry.length-1]; ry.pop();
                }
                if (i==bx.length-1) {bx.pop(); by.pop();}
                else {
                    bx[i]=bx[bx.length-1]; bx.pop();
                    by[i]=by[by.length-1]; by.pop();
                }
            }
        }
    }
    //bullet is harmless for the player
}
function draw() {
    drawImage(backStars, 0, 0, 800, 600);
    drawImage(crystal, gx, gy, 25, 20);
    drawImage(jelly[2], px, py, 60, 60);
    
    //draw rockets rotated
    for (let i=0;i<rx.length;i++) {
        context.save();
        context.translate(rx[i],ry[i]);
        context.rotate(Math.PI);
        drawImage(rocket[3], -50, 0, 50, 20); //teleporting
        context.restore();
    }

    //draw bullets
    for (let i=0;i<bx.length;i++) {
        drawImage(explosion, bx[i], by[i], 30, 20);
    }
};
function keyup(key) {
    //release a bullet
    if (key==32) {
        bx.push(px); by.push(py);
    }
};
function mouseup() {
    
};

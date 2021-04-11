function areCirclesColliding(x1, y1, r1, x2, y2, r2){
  return (r1 + r2 >= Math.sqrt((x1 - x2) * (x1 - x2 ) + (y1 - y2) * (y1 - y2)));
}

function positionNotOk(babyX, babyY) {
  for (let i=0;i<e.length;i++) {
    if (areCirclesColliding(babyX, babyY, 15, e[i].x, e[i].y, e[i].radius+10)) return true;
  } 
  if (areCirclesColliding(babyX, babyY, 15, player.x, player.y, player.radius+20)) return true;
  return false;
}

class Tank{
  constructor(x, y, c="red"){
      this.x = x;
      this.y = y;
      this.color = c;
      this.hp = 50;
      this.speed = 5;
      this.reload = 0;
      this.radius = 30;
      this.bullet = 5;
  }

  move()
  {
      if(this.x <= (800-this.radius)){
          if(isKeyPressed[68]){
            if (this.x+this.radius+this.speed<=800) this.x+=this.speed;
            else {this.x=800-this.radius;}
          }
      }
      if(this.x >= this.radius){
          if(isKeyPressed[65]){
            if (this.x-this.radius-this.speed>=0) this.x-=this.speed;
            else {this.x=0+this.radius;}
          }
      }
      if(this.y <= (600-this.radius)){ 
          if(isKeyPressed[83]){
            if (this.y+this.radius+this.speed<=600) this.y+=this.speed;
            else {this.y=600-this.radius;}
          }
      }
      if(this.y >= this.radius){
          if(isKeyPressed[87]){
            if (this.y-this.radius-this.speed>=0) this.y-=this.speed;
            else {this.y=0+this.radius;}
          }
    
      }
      this.reload--;
      if (isMousePressed) this.shoot(mouseX, mouseY);
  }

  draw(TargetX, TargetY){
      context.beginPath();
      context.fillStyle = this.color;
      context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
      context.fill();
      context.beginPath();
      context.moveTo(this.x, this.y);
      let d = Math.sqrt((TargetX - this.x) * (TargetX - this.x) + (TargetY - this.y) * (TargetY - this.y));
      let gunX = this.x + (TargetX - this.x) / d * (5/3)*this.radius;
      let gunY = this.y + (TargetY - this.y) / d * (5/3)*this.radius;
      context.lineTo(gunX, gunY);
      context.stroke();
      context.fillRect(this.x-this.hp/2, this.y-this.radius-15, this.hp, 5);
  }

  shoot(TargetX, TargetY){
      if(this.reload < 0)
      {
          b.push(new Bullet(this.x, this.y, TargetX, TargetY, this.color, this.bullet));
          this.reload = 15;
      }
    }
}

class Enemy extends Tank{
  move(){
      this.x += Math.random()*4-2
      this.y += Math.random()*4-2
      if (this.x < this.radius) this.x = this.radius;
      if (this.x > 800-this.radius) this.x = 800-this.radius;
      if (this.y < this.radius) this.y = this.radius;
      if (this.y > 600-this.radius) this.y = 600-this.radius;
      this.reload-=0.3;
      this.shoot(player.x, player.y);
  }
}

class BigEnemy extends Enemy{
  constructor(x, y, c){
      super(x, y, c);
      this.hp = 100;
      this.radius = 45;
      this.bullet = 15;
      this.color = "orange";
  }
  move(){
      this.x += Math.random()*4-2
      this.y += Math.random()*4-2
      this.reload-=0.1;
      this.shoot(player.x, player.y);
  }
}

class Mom extends Enemy{
  constructor(x, y, c){
      super(x, y, c);
      this.radius = 35;
      this.bullet = 5;
      this.reload = 200;
      this.color = "pink";
  }
  move(){
      this.reload-= 1;
      let babyX, babyY;
      if(this.reload <= 0){
          while (true) {
            babyX=randomInteger(785);
            babyY=randomInteger(585);
            if (!positionNotOk(babyX, babyY)) break;
          }
          e.push(new Critter(babyX, babyY,"pink"));
          this.reload = 200;
      }
  }
}

class TeleportingEnemy extends Enemy{
  constructor(x_, y_, c_){
      super(x_, y_, c_);
      this.color = "purple";
  }
  move(){
      super.move();
      if (Math.random() < 0.001){
          this.x = Math.random()*800;
          this.y = Math.random()*600;
      }
  }
}

class SmartEnemy extends Enemy{
  constructor(x_, y_, c_){
    super(x_, y_, c_);
    this.color = "black";
  }
  move(){
      super.move();
      for (let i=0; i<b.length; ++i){
          if (areCirclesColliding(b[i].x + b[i].dx*20, b[i].y + b[i].dy*20, b[i].bullet, this.x, this.y, 40) && b[i].color == "blue"){
              this.x -= b[i].dy;
              this.y += b[i].dx;
              break;
          }
      }
  }
}

class Critter extends Enemy{
  constructor(x, y, c){
      super(x, y, c);
      this.radius = 15;
      this.bullet = 3;
      this.hp = 20;
  }
}

class Bullet{
  constructor(x, y, TargetX, TargetY, color, bullet){   
      this.x = x;
      this.y = y;
      this.color = color;
      this.bullet = bullet; 
      let d = Math.sqrt((TargetX - this.x) * (TargetX - this.x) + (TargetY - this.y) * (TargetY - this.y));
      this.dx = (TargetX - x)/d*5;
      this.dy = (TargetY - y)/d*5;
  }
  move(){
      this.x += this.dx;
      this.y += this.dy;
  }
  draw(){
      context.beginPath();
      context.fillStyle = this.color;
      context.arc(this.x, this.y, this.bullet, 0, 2*Math.PI);
      context.fill();
  }

}



let player = new Tank(200, 300, "blue");
let e = [new Enemy(600, 100, "red"), new BigEnemy(600, 300, "red"), new Mom(600, 500, "red"), new SmartEnemy(500,400), new TeleportingEnemy(500,200)];
let b = [];
let a;
let isMousePressed = false;
function update() {
  if (player.hp <= 0) return;

  for(i = 0; i < b.length;i++)
  {
    if(b[i].color != "blue" && areCirclesColliding(player.x , player.y, player.radius, b[i].x, b[i].y, b[i].bullet)){
      player.hp -= 10;
      b[i] = b[b.length-1];
      b.pop();
      i--;
    }
  }


  for(let i = 0; i < b.length;i += 1)b[i].move();
  for(let i = 0; i < e.length;i += 1){
    e[i].move();
    for (let j=0; j<b.length; ++j){
      if(b[j].color == "blue" && areCirclesColliding(e[i].x , e[i].y, e[i].radius, b[j].x, b[j].y, b[j].bullet)){
        e[i].hp -= 10;
        b[j] = b[b.length-1];
        b.pop();
        j--;
      }
    }
    if (e[i].hp <= 0){
      e[i] = e[e.length-1];
      e.pop();
      --i;
    }
  }
  player.move();

}
function draw() {
  player.draw(mouseX, mouseY);
  
  for(let i = 0;i < e.length;i += 1)e[i].draw(player.x, player.y);
  for(let i = 0;i < b.length;i += 1)b[i].draw();
};
function keyup(key) {
  console.log(key);
};
function mouseup() {
  isMousePressed = false;
};
function mousedown(){
  isMousePressed = true;
}
/*

Final Game Project 

DC inspired AVOID THE METEORS game  

...In honor of Zack Snyder's Justice League 2021...

use the mouse and try not to hit the metors 

you can toggle between Batman and Wonder woman themes with A or B

A:Wonder Woman 1984
B:The Dark Knight Rises

Each theme sound included

the bits I found difficult -> everything . I had to referenced almost everything from outside p5.js and other documents. I also found out that chrome has disabled Auto sound play without a user interaction.

Sound Credits :
Wonder Woman: Original Motion Picture Soundtrack -Rupert Gregson-Williams
nirvana -something in the way-Sound track for The Batman

Logo Credits :
DC Comics, Inc

If : the assets are not loading ,please try to reload the browser
If : the key press is not working , please try to reload the game

Enjoy the DC universe 
*/

const meteorCount = 2
const maxMeteors = 128;
let meteors, me;
let startTime, nowMinStr, nowSecStr, nowMilSecStr;
let tmpLvupTime = 0, lvupTime = false;
let fo = 200;
let stageAlpha = .2;
let crashSE;
let displaywwSound= true;
let displaybmSound= true;
var ww;
var bat;

//load all the assets 

function preload() {  
    
img = loadImage('assets/wwlogo.png'); 
img2 = loadImage('assets/batman.png');           
soundFormats('mp3');    
crashSE = loadSound('assets/sf_laser_explosion.mp3');    
spaceSound = loadSound('assets/Wonder Woman Theme (Batman v Superman) on Guitar + TAB');    
batSound = loadSound('assets/batman');        
  
}
 
function setup() {
//background setup    
createCanvas(windowWidth, windowHeight);
    
    //set up the font 
    textFont("Anton");
    colorMode(HSB);
    meteors = Array.from(new Array(meteorCount).fill(new Meteor(random(width), random(height))));
    me = new Me();
    startTime = Date.now();
}

//for toggling between themes
function keyTyped() {
  if (key === 'a') {
    spaceSound.play();
    batSound.pause();  
    ww=true;  
    bat=false;  
    displaywwSound=false;
    displaybmSound=false;  
   }else if(key === 'b'){
       bat=true;
       ww=false;
       displaybmSound=false;
       displaywwSound=false;
       batSound.play(); 
       spaceSound.pause();
       displaySoundInstr=false;
   } 
  }


function draw() {
    

//background senory code 

var color1 = color(255,255,0);
var color2 = color(50,100,100); 
if(bat){
    //bat man theme
   color1 = color(255,255,0);
   color2 = color(0,0,0); 
}else if(ww){
    //wonder woman theme 
    color1 = color(255,255,20);
    color2 = color(50,100,100); 
}
setGradient(0, 0, windowWidth, windowHeight, color1, color2, "Y");  
    if(ww){
       image(img,700,100,300,200);         
    }else if(bat){
        image(img2,700,100,300,200);   
    }
    
//for rotating icons    
 push();
  translate(width * 0.2, height * 0.5);
  rotate(frameCount / 200.0);
  star(0, 0, 5, 70, 3);
  pop();

  push();
  translate(width * 0.5, height * 0.5);
  rotate(frameCount / 50.0);
  star(0, 0, 80, 100, 40);
  pop();

  push();
  translate(width * 0.8, height * 0.5);
  rotate(frameCount / -100.0);
  star(0, 0, 30, 70, 5);
  pop();    
    
getTime();    
//game interaction code below     
    if(displaywwSound){
         text('press A to start with wonder woman theme', 152, height / 2 + 140);   
    }
    if(displaybmSound){
          text('press B to start with batman theme', 152, height / 2+100);   
    }
 
    if(ww){
         text('press B to change batman darknight mode', 152, height / 2+100);   
    } 
    
    if(bat){
         text('press A to change wonder woman mode', 152, height / 2+100);   
    }  
 
    noStroke();
    fill(0, 0, 0, stageAlpha);
    rect(0, 0, width, height);
    if (me.isAlive) {
        for (let i = 0; i < meteors.length; i++) {
            meteors[i].update();
            meteors[i].checkEdges(i);
            meteors[i].disp(225, 22, 100);
        }
        me.checkEdges();
        me.disp(0, 50, 100);
        checkLocs();
        if (lvupTime) { lvup(); }
    }
    if (!me.isAlive) {
        if (fo >= 0) {
            meteors.forEach(meteo => { meteo.endSq(fo); });
            fo -= 2;
        }
        me.disp(240, 40, 40);
        if (fo < 0) {
            noStroke();
            fill(0, 0, 100, 1);
            textSize(80);
            text('GAME OVER', 130, height / 2 - 90);
            text(nowMinStr, 165, height / 2 + 40);
            text(':' + nowSecStr, 250, height / 2 + 40);
            text(':' + nowMilSecStr, 400, height / 2 + 40);
            textSize(40);
            text('RELOAD TO TRY AGAIN', 152, height / 2 + 140);
            noLoop();
            spaceSound.pause()
            batSound.pause()
        }
    }
}
 
//for checking the player's live 
function checkLocs() {
    for (var i = 0; i < meteors.length; i++) {
        if (dist(me.loc.x, me.loc.y, meteors[i].loc.x, meteors[i].loc.y) < me.rad / 4) {
            stageAlpha = 1;
            me.isAlive = false;
            crashSE.play();
        }
    }
}
 
//put more meteors into screen as the player lasts longer 
function lvup() {
    let nowLength = meteors.length;
    for (let i = 0; i < nowLength; i++) {
        meteors.push(new Meteor(meteors[i].loc.x, meteors[i].loc.y))
    }
    lvupTime = false;
}
 
//constructor class for meteor 
class Meteor {
    constructor(ex, why) {
        this.accel;
        this.loc = createVector(ex, why);
        this.vel = createVector(0, 0);
        this.rad = 8;
        this.topsp = 3.8;
    }
    update() {
        var mouse = createVector(mouseX, mouseY);
        var dir = p5.Vector.sub(mouse, this.loc);
        var magn = p5.Vector.mag(dir);
        dir.normalize();
        dir.mult(10 / magn);
        this.accel = dir;
        this.vel.add(this.accel);
        this.vel.limit(this.topsp);
        this.loc.add(this.vel);
    }
    disp(h, s, b) {
        noStroke();
        fill(h, s, b, 1);
        ellipse(this.loc.x, this.loc.y, this.rad);
    }
    checkEdges(i) {
        if (i < 64) {
            if (this.loc.x > width) {
                this.loc.x = 0;
            } else if (this.loc.x < 0) {
                this.loc.x = width;
            }
            if (this.loc.y > height) {
                this.loc.y = 0;
            } else if (this.loc.y < 0) {
                this.loc.y = height;
            }
        } else {
            if (this.loc.x > width) {
                this.loc.x = width;
            } else if (this.loc.x < 0) {
                this.loc.x = 0;
            }
            if (this.loc.y > height) {
                this.loc.y = height;
            } else if (this.loc.y < 0) {
                this.loc.y = 0;
            }
        }
    }
    endSq(fo) {
        for (let rotAngle = 0; rotAngle < 360; rotAngle += 45) {
            push();
            translate(this.loc.x, this.loc.y);
            rotate(radians(rotAngle));
            noStroke();
            fill(random(180, 300), 100, 100, fo / 100);
            ellipse(0, 105 - fo / 2, this.rad * map(fo, 200, 0, 10, 1));
            pop();
        }
    }
}
 
//constructor class for player 

class Me {
    constructor() {
        this.loc = createVector(0, 0);
        this.rad = 15;
        this.isAlive = true;
    }
    checkEdges() {
        var mX = mouseX, mY = mouseY;
        if (mX > width) {
            mX = width;
        } else if (mX < 0) {
            mX = 0;
        }
        if (mY > height) {
            mY = height;
        } else if (mY < 0) {
            mY = 0;
        }
        this.loc = createVector(mX, mY);
    }
    disp(h, s, b) {
        fill(h, s, b, 1);
        noStroke();
        ellipse(me.loc.x, me.loc.y, this.rad);
        noFill();
        stroke(h, s, b, 1);
        strokeWeight(2);
        ellipse(me.loc.x, me.loc.y, this.rad + 7);
    }
}

//getting the time 

function getTime() {
    let justnow = Date.now() - startTime;
    let nowMin = floor(justnow / 1000 / 60);
    let nowSec = floor(justnow / 1000 % 60);
    let nowMilSec = floor((justnow - nowMin * 60000 - nowSec * 1000) / 10);
    nowMinStr = setzero(nowMin);
    nowSecStr = setzero(nowSec);
    nowMilSecStr = setzero(nowMilSec);
    if (nowSec % 10 == 0 && nowSec != tmpLvupTime) {
        if (meteors.length < maxMeteors) { lvupTime = true; }
        tmpLvupTime = nowSec;
    }
    noStroke();
    fill(255);
    textSize(30);
    text(nowMinStr, 165, height / 2 + 40);
    text(':' + nowSecStr, 250, height / 2 + 40);
    text(':' + nowMilSecStr, 350, height / 2 + 40);
}
 
function setzero(num) {
    let addzero;
    if (num < 10) {
        addzero = "0" + num;
    } else { addzero = num; }
    return addzero;
}

//for background color 
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis == "Y") {  // Top to bottom gradient
    for (let i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }  
  else if (axis == "X") {  // Left to right gradient
    for (let j = x; j <= x+w; j++) {
      var inter2 = map(j, x, x+w, 0, 1);
      var d = lerpColor(c1, c2, inter2);
      stroke(d);
      line(j, y, j, y+h);
    }
  }
}

//for rotating stars in background 

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}


 
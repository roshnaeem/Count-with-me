var ctx = canvas.getContext('2d');
var apple_img = document.getElementById("apple");
var pine_img = document.getElementById("pine");
var character_img = document.getElementById("character");


var counts= [{key: 'count1', value: 0, score:0}, {key :'count2', value:0, score:0}, {key :'count3', value:0, score:0},
             {key: 'count4', value: 0, score:0}, {key :'count5', value:0, score:0}, {key :'count6', value:0, score:0},
             {key: 'count7', value: 0, score:0}, {key :'count8', value:0, score:0}, {key :'count9', value:0, score:0},
             {key: 'count10', value: 0, score:0}];

const keyboardController = (() => {
  document.addEventListener("keydown", inputEvent);
  document.addEventListener("keyup", inputEvent);
  const keyboardController = {
    right: false,
    left: false,
    up: false,
    any : false,
  };

  function inputEvent(event) {
  const status = event.type === "keydown"
    if (event.keyCode == 39) // up controller
    {
      keyboardController.right = status;
    } else if (event.keyCode == 37) { // right controller
      keyboardController.left = status;
    } else if (event.keyCode == 38) { //left controller
      keyboardController.up = status;
      event.preventDefault(); // to prevent the default functionality of event
    }
    if(status) { keyboardController.any = true } // must reset when used
  }
  return keyboardController;

})();


//Character creation
const character = {
  x: 10,
  y: 0,
  deltaX: 0, 
  deltaY: 0,
  size: 40,
  score:0,
  color: 'black',
  groundCollision: false,
  jump: -5.8,  // you can change this value to control the jump power
  acceleration: 2,
  rflag:1,lflag:1,uflag:1,dflag:1,

  collision(obj) {
    if((this.y > obj.y+3 && this.y < obj.y + obj.h - 3) || (this.y + this.size > obj.y + 3 && this.y + this.size < obj.y + obj.h - 3))
    {
      // right collision
      if((Math.floor(this.x) <= obj.x + obj.w) && (Math.floor(this.x) >= obj.x + obj.w - 5))
      {
        this.rflag = 0;
        this.deltaX = 0;
      }
      // left collison
      if((Math.floor(this.x + this.size) >= obj.x) && (Math.floor(this.x + this.size) <= obj.x + 5))
      {
        this.lflag = 0;
        this.deltaX = 0;
      } 
    }
  
    if((this.x > obj.x + 3 && this.x < obj.x + obj.w - 3) || (this.x + this.size > obj.x + 3 && this.x + this.size < obj.x + obj.w - 3))
    {
      // downward collision
      if((Math.floor(this.y) <= obj.y + obj.h) && (Math.floor(this.y) >= obj.y + obj.h - 5))
      {
        this.deltaY = -this.deltaY;
      }
      //upward collision
      if((Math.floor(this.y + this.size) >= obj.y) && (Math.floor(this.y + this.size) <= obj.y + 5))
      {
        this.y = obj.y - this.size;
        this.deltaY = 0;
        this.groundCollision = true;
      }
    }
    
  },
  // this will calculate the  characters new positions
  update() {
    if (keyboardController.up && this.groundCollision) { this.deltaY = this.jump; }
    if (keyboardController.left && this.rflag) { this.deltaX = -this.acceleration;this.lflag = 1; }
    if (keyboardController.right && this.lflag) { this.deltaX = this.acceleration;this.rflag=1; }

    // the code is here to provide gravity effect
    this.deltaY += model.gravity;
    this.deltaY *= model.force;
    this.deltaX *= this.groundCollision ? model.groundforce : model.force;
    this.x += this.deltaX;
    this.y += this.deltaY;
    this.lflag = 1;this.rflag = 1;
    // test ground contact and left and right limits
    //console.log(this.deltaX);
    if(this.x>=1260){
      this.x=1260;
    }
    else if(this.y >= 700) {
      this.y=700;
    }
    else if(this.x<=0){
      this.x=0;
    }
    else if(this.y<=0){
      this.y=0;
    }
    else if(this.x<=0 && this.y<=0){
      this.x=0;
      this.y=0;
    }
    else if(this.y>=700 && this.x>=1260){
      this.y=700;
      this.x = 1260
    }

    if (this.y + this.size >= model.ground) {
      this.y = model.ground - this.size;
      this.deltaY = 0;
      this.groundCollision = true;
    } else {
      this.groundCollision = false;
    }
    if (this.x > ctx.canvas.width) {
      this.x -= ctx.canvas.width;

    } else if (this.x + this.size < 0) {
      this.x += ctx.canvas.width;
    }
  },

  draw() {
    //component( this.size, this.size, this.color, this.x, this.y);
    ctx.drawImage(character_img, this.x, this.y, this.size, this.size);
  },

  init() {
    this.x = 10;
    this.y = model.ground - this.size;
    this.groundCollision = true;
    this.deltaX = 0;
    this.deltaY = 0;
  }
}
// define model
const model = {
  gravity: 0.2, 
  force: 0.999, 
  groundforce: 0.9, 
  ground: 620,
}

// set init
character.init();
// call first frame. This will run after all the rest of the code has run
requestAnimationFrame(mainLoop); // init when readeltaY

function component(w,h,color,x,y){
  this.w=w;
  this.h=h;
  this.x=x;
  this.y=y;
  ctx.beginPath();
  ctx.fillStyle=color;
  ctx.fillRect(this.x, this.y, this.w, this.h);
  ctx.closePath();
}

// Food items creation
function keycomponent(w,h,x,y, img, obj){
  
  this.w=w;
  this.h=h;
  this.x=x;
  this.y=y;

  if(this.x<=character.x+character.size && this.y+ this.h >= character.y){
    obj.value = 1;
    obj.score = 1;
  }

  this.update= function(){
    if(obj.value==0){
      ctx.drawImage(img, this.x, this.y, this.w, this.h);

    }
  }
}


function countScore(){

  var score =0;
  for(let i=0; i< counts.length;i++) {
    score += counts[i].score;
  }
  ctx.fillStyle="black";
  ctx.font = "50px Georgia";
  ctx.fillText(score, 200, 70,200);

  for (let j=1; j<=score; j++) {
    ctx.fillStyle="#853535";
    ctx.font = "50px sans-serif";
    ctx.fillText("l", 50 + (30*j), 140, 200);

  }
}


//draw all the objects inside of canvas 
function drawGround(hFactor, x, y)  {
  ground1 = new component( 1280, 100, '#684027',x, y); //w,h,color,x,y
  ground2 = new component( 1280, 20, 'green', x, y);

  //Stairs 10 step
  obsground1 = new component( 1180,50, "#a874b3",150 , 570); //w, h , color, x,y
  obsground2 = new component(1130, 50,"#b8639a", 200 + hFactor, 515);
  obsground3 =new component(1080,50,"#ba4e5d",300 + hFactor,460);
  obsground4 = new component( 1080,50, "#8c434b",400 + hFactor, 405);
  obsground5 = new component(1080, 50,"#D5D500", 500 + hFactor, 350);
  obsground6 =new component(1080,50,"#94E000",600 + hFactor,295);
  obsground7 = new component( 1080,50, "#54AA10",700 + hFactor, 240);
  obsground8 = new component(1080, 50,"#67DCE2", 800 + hFactor, 185);
  obsground9 =new component(1080,50,"#226EAA",900 + hFactor,130);
  obsground10 =new component(1080,50,"#624e99",1000 + hFactor,75);


  // 10 food items
  var pineW = 40; var pineH = 50;
  var appleW = 40; var appleH = 50;
  key1 = new keycomponent(appleW,appleH,200,515, apple_img, counts[0]); //w, h, color, x,y 
  key2 = new keycomponent(pineW,pineH,310,460, pine_img, counts[1]);
  key3 = new keycomponent(appleW,appleH,400,405, apple_img, counts[2]);
  key4 = new keycomponent(appleW,appleH,500,350, apple_img, counts[3]); //w, h, color, x,y 
  key5 = new keycomponent(pineW,pineH,610, 295, pine_img, counts[4]);
  key6 = new keycomponent(pineW,pineH,710,240, pine_img, counts[5]);
  key7 = new keycomponent(appleW,appleH,800,185, apple_img, counts[6]); //w, h, color, x,y 
  key8 = new keycomponent(pineW,pineH,910,130, pine_img, counts[7]);
  key9 = new keycomponent(pineW,pineH,1010,75, pine_img, counts[8]);
  key10 = new keycomponent(pineW,pineH,1110,20, pine_img, counts[9]);
  key1.update(); key2.update(); key3.update();
  key4.update(); key5.update(); key6.update();
  key7.update(); key8.update(); key9.update();
  key10.update();

}

// main animation loop
function mainLoop() { // time passed by requestAnimationFrame        
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  countScore();
  //components and character
  drawGround(75,0, model.ground);
  character.update();
  
  character.collision(obsground1);
  character.collision(obsground2);
  character.collision(obsground3);
  character.collision(obsground4);
  character.collision(obsground5);
  character.collision(obsground6);
  character.collision(obsground7);
  character.collision(obsground8);
  character.collision(obsground9);
  character.collision(obsground10);
  
  character.draw();
  
  requestAnimationFrame(mainLoop);
}

// make sure window has focus for keyboardController input.
window.focus();
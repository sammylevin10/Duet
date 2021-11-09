// https://editor.p5js.org/sahanasripadanna/sketches/nH6cVX539

let spread;
let inc;
let margin;
let vertOffset;
// extra flat line at either end
let extraLine = 70;
// steps between vertexes
let step = 3;
// spacing between lines
let ySpacing = 2.6;

// noise settings
let offset = 0;
let offsetInc = 0.09;
let rowOffset = 40;
let lineMultiplier = 47;

// fuzz settings
let fuzzOffset = 1000;
let fuzzInc = offsetInc;
let fuzzMultiplier = 3.5;
let mic;

let circle1, particle;

function setup() {
  createCanvas(600, 600);
  background(200);

  margin = width / 3;
  vertOffset = width / 4.6;
  spread = width - margin * 2;
  inc = (TWO_PI * step) / spread;

  // stroke(255);
  // strokeWeight(1.2);
  noStroke();

  //frameRate(24);
  ellipseMode(CENTER);
  angleMode(DEGREES); 

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  circle1 = new Rects-(width/2, height/2);
 //particle = new Particle(width/2, height/2);
}

function draw() {
  background(0);
  let vol = mic.getLevel();
  //console.log("volume", vol);
  lineMultiplier = vol * 10;  
  fill(227, 223, 255, 155);
  circle1.update(10);
  circle1.display();
  console.log(circle1.particle);


  //particle.move();
  //particle.display();



  // increment the noise and fuzz
  offset += offsetInc;
  fuzzOffset += fuzzInc;

  let spectrum = fft.analyze();
  //fill(255, 0, 255);
  for (let i = 0; i < spectrum.length; i++) {
    x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    //rect(x, height, width / spectrum.length, h );
  }
}

class Circles{

  constructor(x, y){
    this.x = x;
    this.y = y;
    this.size = 60;
    this.particles = new Array(100);
    
    //this.particle = new Particle(this.x, this.y);
    this.particles.push(1);
    //console.log(this.particles[0]);
  }

  update(mult){
    //this.size += mult;
    //rotate(PI);
    for (var i =0; i<1; i++){
      if (this.particles[i]){
        //this.particles[i].move();
        console.log(this.particles[i]);
      }
    }
   
  }

  display(){
    ellipse(this.x,this.y, this.size);
    ellipse(this.x,this.y-30, this.size);
    ellipse(this.x+25,this.y+15, this.size);
    ellipse(this.x-25,this.y+15, this.size);

    ellipse(this.x-25,this.y-15, this.size);
    ellipse(this.x+25,this.y-15, this.size);
    ellipse(this.x,this.y+30, this.size);
    for (var i =0; i<1; i++){
      //console.log(this.particles[0]);
      if (this.particles[0]){
        
        //this.particles[i].display();
      }
    }
    //particle.display();
  }
}

class Rects{

  constructor(x, y){
    this.x = x;
    this.y = y;
    this.size = 60;
    
  }

  update(mult){
    //this.size += mult;
  }

  display(){
    rect(this.x,this.y, this.size);
    rect(this.x,this.y-30, this.size);
    rect(this.x+25,this.y+15, this.size);
    rect(this.x-25,this.y+15, this.size);

    rect(this.x-25,this.y-15, this.size);
    rect(this.x+25,this.y-15, this.size);
    rect(this.x,this.y+30, this.size);
  }
}

class Particle{
  constructor(x, y){
      this.x = x;
      this.y = y;
      this.size = 60;
      this.ySpeed = random(-3, -6);
      this.xSpeed = random(2, 6);

      var xDir = random(1,3);
      if (xDir>2){
        this.xDirection = "right";
      }
      else{
        this.xDirection = "left";
      }

      var yDir = random(1,3);
      if (yDir>2){
        this.yDirection = "right";
      }
      else{
        this.yDirection = "left";
      }
  }
  move(){
    if (this.xDirection === "right"){
      this.x += this.xSpeed;
    }
    else{
      this.x -= this.xSpeed;
    }
    if (this.yDirection === "right"){
      this.y += this.ySpeed;
    }
    else{
      this.y -= this.ySpeed;
    }
  }

  display(){
    ellipse(this.x,this.y, this.size);
  }

}

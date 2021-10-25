// Notes
// Audio Input Detection using p5.AudioIn
// Largely adapted from https://p5js.org/reference/#/p5.AudioIn

// Sound
let mic;


function setup() {
  let cnv = createCanvas(500, 500);
  cnv.parent("#canvas-container");
  cnv.mousePressed(userStartAudio);
  background(0);
  noStroke();

  mic = new p5.AudioIn(); 
}

function draw() {
  background(0);
  fill(255);
  textAlign(CENTER);


  text('tap to start', width/2, 20);

  micLevel = mic.getLevel();
  let y = height - micLevel * height;
  ellipse(width/2, y, 10, 10);
}


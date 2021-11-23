// Notes
// Audio Input Detection using p5.AudioIn
// Largely adapted from https://p5js.org/reference/#/p5.AudioIn

// Sound
let mic;
let fft, peakDetect;
var ellipseWidth = 0;

let blooms = [];

function setup() {
  let cnv = createCanvas(600, 600);
  cnv.parent("#canvas-container");
  cnv.mousePressed(userStartAudio);
  background(0);
  noStroke();
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  peakDetect = new p5.PeakDetect();
  colorMode(HSB, 100, 100, 100, 100);
  // testBloom = new Bloom1(width / 2, height / 2, 14, 100);
}

function draw() {
  background(0, 0, 0, 10);
  text("Click to start", 0, 0);
  micLevel = mic.getLevel();
  console.log(micLevel);
  // testBloom = new Bloom1(width / 2, height / 2, 14, micLevel * 100);
  // testBloom.moveAndDisplay();

  let spectrum = fft.analyze();
  // stroke(1);
  // beginShape();
  // for (i = 0; i < spectrum.length; i++) {
  //   vertex(i, map(spectrum[i], 0, 255, height, 0));
  // }
  // endShape();

  peakDetect.update(fft);
  console.log(peakDetect.isDetected);

  if (peakDetect.isDetected) {
    temp = new Bloom1(
      random(width),
      random(height),
      floor(random(5, 10)),
      floor(random(30, 60))
    );
    blooms.push(temp);
  }

  for (let i = 0; i < blooms.length; i++) {
    console.log("displaying");
    blooms[i].moveAndDisplay();
    if (blooms[i].isDead()) {
      blooms.splice(i, 1);
      console.log("deleting " + i);
      i--;
    }
  }
}

class Bloom1 {
  // x position, y position, rotation count, size
  constructor(x, y, c, s) {
    this.x = x;
    this.y = y;
    this.c = c;
    this.s = s;
    this.velocity = 5;
    this.acceleration = -0.5;
    this.rotation = 0;
    this.rotationVelocity = random(0.2, 1);
    this.startColor = color(random(100), 70, 70, 50);
    this.endColor = color(random(100), 70, 70, 50);
    this.colorPosition = 0;
    this.particles = [];
    for (let i = 0; i < random(10, 20); i++) {
      let temp = new Particle1(x, y, s / 5, this.startColor, this.endColor);
      this.particles.push(temp);
    }
  }
  moveAndDisplay() {
    this.colorPosition += 0.05;
    let color = lerpColor(this.startColor, this.endColor, this.colorPosition);
    fill(color);
    this.s += this.velocity;
    this.velocity += this.acceleration;
    noStroke();
    this.rotation += this.rotationVelocity;
    // rotate(radians(this.rotation));
    push();
    translate(this.x, this.y);
    for (let i = 0; i < this.c; i++) {
      rotate(radians(360 / this.c + this.rotation));
      ellipse(this.s, 0, this.s);
      ellipse(this.s / 2, 0, this.s / 2);
      ellipse(this.s / 4, 0, this.s / 4);
    }
    pop();
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].moveAndDisplay();
      if (this.particles[i].isOffScreen()) {
        this.particles.splice(i, 1);
        console.log("deleting " + i);
        i--;
      }
    }
  }
  isDead() {
    return this.s < 1;
  }
}

class Particle1 {
  constructor(x, y, s, startColor, endColor) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.startColor = endColor;
    this.endColor = startColor;
    this.colorPosition = 0;
    this.xVelocity = random(-5, 5);
    this.yVelocity = random(-5, 5);
    this.xAcceleration = this.xVelocity * -1 * 0.01;
    this.yAcceleration = this.yVelocity * -1 * 0.01;
  }
  moveAndDisplay() {
    this.colorPosition += 0.05;
    let color = lerpColor(this.startColor, this.endColor, this.colorPosition);
    fill(color);
    this.x += this.xVelocity;
    this.y += this.yVelocity;
    this.xVelocity += this.xAcceleration;
    this.yVelocity += this.yAcceleration;
    ellipse(this.x, this.y, this.s, this.s);
  }
  isOffScreen() {
    let beyondX = this.x > width + 50 || this.x < -50;
    let beyondY = this.y > height + 50 || this.y < -50;
    if (beyondX || beyondY) {
      return true;
    }
    return false;
  }
}

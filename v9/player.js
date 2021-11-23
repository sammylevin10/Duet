let playing = false;

// Sound
let mic;
let fft, peakDetect;
var ellipseWidth = 0;

let sound;

let blooms = [];

function preload() {
  sound = loadSound("testsong.mp3");
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("#canvas-container");
  background(0);
  noStroke();
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  //fft.setInput(mic);
  peakDetect = new p5.PeakDetect();
  colorMode(HSB, 100, 100, 100, 100);

  rectMode(CENTER);
}

function draw() {
  background(0, 0, 0, 5);
  //micLevel = mic.getLevel();
  //console.log(micLevel);
  // testBloom = new Bloom1(width / 2, height / 2, 14, micLevel * 100);
  // testBloom.moveAndDisplay();

  let spectrum = fft.analyze();

  stroke(255, 255, 255, 20);
  // strokeWeight(0.5);
  noFill();
  // if (playing) {
  //   beginShape();
  //   for (i = 0; i < spectrum.length; i++) {
  //     vertex(
  //       map(i, 0, spectrum.length, 0, width),
  //       map(spectrum[i], 0, 255, height - 100, 0)
  //     );
  //   }
  //   endShape();
  // }

  peakDetect.update(fft);
  // console.log(peakDetect.isDetected);

  if (peakDetect.isDetected) {
    let bass;
    bass = map(spectrum[250], 0, 255, 0, 100);
    console.log("Bass: " + bass);
    temp = new Bloom2(
      random(width / 5, (width * 4) / 5),
      random(height / 5, (height * 4) / 5),
      floor(random(5, 10)),
      floor(400 * map(bass, 0, 100, 0, 1)),
      map(bass, 0, 100, 0, 70)
    );
    blooms.push(temp);
  }

  for (let i = 0; i < blooms.length; i++) {
    // console.log("displaying");
    blooms[i].moveAndDisplay();
    if (blooms[i].isDead()) {
      blooms.splice(i, 1);
      // console.log("deleting " + i);
      i--;
    }
  }
}

class Bloom1 {
  // x position, y position, rotation count, size
  constructor(x, y, c, s, saturation) {
    this.x = x;
    this.y = y;
    this.c = c;
    this.s = s;
    this.saturation = saturation;
    this.velocity = 5;
    this.acceleration = -0.5;
    this.rotation = 0;
    this.rotationVelocity = random(0.2, 1);
    this.startColor = color(random(100), this.saturation, 65, 30);
    this.endColor = color(random(100), this.saturation, 65, 60);
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
        // console.log("deleting " + i);
        i--;
      }
    }
  }
  isDead() {
    return this.s < 1;
  }
}

class Bloom2 {
  // x position, y position, rotation count, size
  constructor(x, y, c, s, saturation) {
    this.x = x;
    this.y = y;
    this.c = c;
    this.s = s;
    this.saturation = saturation;
    this.velocity = 5;
    this.acceleration = -0.5;
    this.rotation = 0;
    this.rotationVelocity = random(0.2, 1);
    this.startColor = color(random(100), this.saturation, 65, 30);
    this.endColor = color(random(100), this.saturation, 65, 60);
    this.colorPosition = 0;
    this.particles = [];
    for (let i = 0; i < random(10, 20); i++) {
      let temp = new Particle2(x, y, s / 5, this.startColor, this.endColor);
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
      rect(this.s, 0, this.s);
      rect(this.s / 2, 0, this.s / 2);
      rect(this.s / 4, 0, this.s / 4);
    }
    pop();
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].moveAndDisplay();
      if (this.particles[i].isOffScreen()) {
        this.particles.splice(i, 1);
        // console.log("deleting " + i);
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

    this.xVelocity = random(-15, 15);
    this.yVelocity = random(-15, 15);
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
    let beyondX = this.x > width + 100 || this.x < -100;
    let beyondY = this.y > height + 100 || this.y < -100;
    if (beyondX || beyondY) {
      return true;
    }
    return false;
  }
}

class Particle2 {
  constructor(x, y, s, startColor, endColor) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.startColor = endColor;
    this.endColor = startColor;
    this.colorPosition = 0;

    this.xVelocity = random(-15, 15);
    this.yVelocity = random(-15, 15);
    this.xAcceleration = this.xVelocity * -1 * 0.01;
    this.yAcceleration = this.yVelocity * -1 * 0.01;
  }
  moveAndDisplay() {
    console.log("particle movin!");
    this.colorPosition += 0.05;
    let color = lerpColor(this.startColor, this.endColor, this.colorPosition);
    fill(color);

    // let xMovement = map( noise(this.xVelocity), 0, 1, -1, 1 );
    // let yMovement = map( noise(this.yVelocity), 0, 1, -1, 1 );

    this.x += this.xVelocity;
    this.y += this.yVelocity;
    this.xVelocity += this.xAcceleration;
    this.yVelocity += this.yAcceleration;
    rect(this.x, this.y, this.s, this.s);
  }
  isOffScreen() {
    let beyondX = this.x > width + 100 || this.x < -100;
    let beyondY = this.y > height + 100 || this.y < -100;
    if (beyondX || beyondY) {
      return true;
    }
    return false;
  }
}

function mousePressed() {
  if (sound.isPlaying()) {
    // .isPlaying() returns a boolean
    sound.stop();
  } else {
    sound.play();
  }
}

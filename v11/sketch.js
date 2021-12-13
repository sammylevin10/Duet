// Duet - sketch.js
// Sahana Sripadanna and Sammy Levin 2021
// Handles music visualization via p5

// Sound
// let mic;
// let fft, peakDetect;
// var ellipseWidth = 0;
//
// let blooms = [];
//
// function setup() {
//   let cnv = createCanvas(windowWidth, windowHeight);
//   cnv.parent("#canvas-container");
//   background(0);
//   noStroke();
//   mic = new p5.AudioIn();
//   mic.start();
//   fft = new p5.FFT();
//   fft.setInput(mic);
//   // Min frequency, max frequency, amplitude threshold, frames to wait
//   peakDetect = new p5.PeakDetect(20, 300, 0.9, 40);
//   colorMode(HSB, 100, 100, 100, 100);
// }
//
// function draw() {
//   // Current track features extracted from Spotify
//   let energy = currentTrackFeatures.energy;
//   let acousticness = currentTrackFeatures.acousticness;
//   background(50, 50, 50, 5);
//   micLevel = mic.getLevel();
//   let spectrum = fft.analyze();
//   peakDetect.update(fft);
//
//   // When a peak is detected, create a bloom with parameters that are responsive to track features and FFT features
//   if (peakDetect.isDetected) {
//     background(map(acousticness, 0, 1, 15, 85), 70, 90, 5);
//     let bass;
//     bass = map(spectrum[250], 0, 255, 0, 1);
//     temp = new Bloom(
//       random(width / 5, (width * 4) / 5),
//       random(height / 5, (height * 4) / 5),
//       floor(random(5, 10)),
//       floor(400 * map(bass, 0, 1, 0, 1)),
//       map(acousticness, 0, 1, 10, 90),
//       map(bass, 0, 1, 0, 90),
//       map(energy, 0, 1, -0.1, -0.6)
//     );
//     blooms.push(temp);
//   }
//   // Display the blooms
//   for (let i = 0; i < blooms.length; i++) {
//     blooms[i].moveAndDisplay();
//     if (blooms[i].isDead()) {
//       blooms.splice(i, 1);
//       i--;
//     }
//   }
// }
//
// class Bloom {
//   // x position, y position, rotation count, size
//   constructor(x, y, c, s, hue, saturation, acceleration) {
//     this.x = x;
//     this.y = y;
//     this.c = c;
//     this.s = s;
//     this.hue = hue;
//     this.saturation = saturation;
//     this.velocity = 5;
//     this.acceleration = acceleration;
//     this.rotation = 0;
//     this.rotationVelocity = random(0.2, 1);
//     this.colorPosition = 0;
//     this.generateColors(hue);
//     this.particles = [];
//     // Create a few particles that spawn with the bloom
//     for (let i = 0; i < random(10, 20); i++) {
//       let temp = new Particle(x, y, s / 5, this.startColor, this.endColor);
//       this.particles.push(temp);
//     }
//   }
//   // Creates a starting and ending color loosely based off of the hue param
//   generateColors(hue) {
//     let start = hue - random(10);
//     let end = hue + random(10);
//     if (start < 0) {
//       start = 100 + start;
//     }
//     if (end > 100) {
//       end = end - 100;
//     }
//     this.startColor = color(min(start, end), this.saturation, 65, 30);
//     this.endColor = color(max(start, end), this.saturation, 65, 60);
//   }
//   moveAndDisplay() {
//     // Advance the color over time
//     this.colorPosition += 0.05;
//     let color = lerpColor(this.startColor, this.endColor, this.colorPosition);
//     fill(color);
//     // Velocity, acceleration, rotation updates
//     this.s += this.velocity;
//     this.velocity += this.acceleration;
//     noStroke();
//     this.rotation += this.rotationVelocity;
//     push();
//     translate(this.x, this.y);
//     for (let i = 0; i < this.c; i++) {
//       rotate(radians(360 / this.c + this.rotation));
//       ellipse(this.s, 0, this.s);
//       ellipse(this.s / 2, 0, this.s / 2);
//       ellipse(this.s / 4, 0, this.s / 4);
//     }
//     pop();
//     // Display the particles that are a part of this bloom
//     for (let i = 0; i < this.particles.length; i++) {
//       this.particles[i].moveAndDisplay();
//       if (this.particles[i].isOffScreen()) {
//         this.particles.splice(i, 1);
//         i--;
//       }
//     }
//     // Prevent blooms from regrowing from death
//     if (this.s < 1) {
//       this.s = 0;
//     }
//   }
//   // Once all particles are off screen, the bloom is dead
//   isDead() {
//     return this.particles.length == 0;
//   }
// }
//
// class Particle {
//   constructor(x, y, s, startColor, endColor) {
//     this.x = x;
//     this.y = y;
//     this.s = s;
//     this.startColor = endColor;
//     this.endColor = startColor;
//     this.colorPosition = 0;
//     this.xVelocity = random(-15, 15);
//     this.yVelocity = random(-15, 15);
//     this.xAcceleration = this.xVelocity * 0.03;
//     this.yAcceleration = this.yVelocity * 0.03;
//   }
//   moveAndDisplay() {
//     this.colorPosition += 0.05;
//     let color = lerpColor(this.startColor, this.endColor, this.colorPosition);
//     fill(color);
//     this.x += this.xVelocity;
//     this.y += this.yVelocity;
//     this.xVelocity += this.xAcceleration;
//     this.yVelocity += this.yAcceleration;
//     ellipse(this.x, this.y, this.s, this.s);
//   }
//   isOffScreen() {
//     let beyondX = this.x > width + 50 || this.x < -50;
//     let beyondY = this.y > height + 50 || this.y < -50;
//     if (beyondX || beyondY) {
//       return true;
//     }
//     return false;
//   }
// }
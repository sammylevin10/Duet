// A Frame
let world;

// Color
let hue;
let lightness = 50;
let minLightness = 50;
let maxLightness = 60;

// Sound
let fft, peakDetect, peakDetected, amplitude, currLevel, song;

// Blooms
let blooms = [];
let bloomsCount = 15;

function preload() {
  song = loadSound("assets/sound/song1.mp3");
}

function setup() {
  window.alert("Use the enter key to play/pause the music.");

  // Canvas
  let canvas = createCanvas(5376, 2688).id();
  hue = random(100);
  colorMode(HSL, 100, 100, 100, 100);

  // Sound
  //fft = new p5.FFT();
  fft = new p5.FFT(0.9, 128);
  w = width/64;

  peakDetect = new p5.PeakDetect(20, 500, 0.7, 15);
  song.play();
  amplitude = new p5.Amplitude();

  // A-Frame
  world = new World('VRScene');
  // Sky with dynamic texture
  let sky = new Sky({
    asset: canvas,
    dynamicTexture: true,
    dynamicTextureWidth: 5376,
    dynamicTextureHeight: 2688
  });
  world.add(sky);
}

function draw() {
  // Sky color
  hue += 0.05;
  if (hue > 100) {
    hue = 0;
  }
  background(hue, 70, lightness);
  if (peakDetected) {
    lightness -= 1;
    if (lightness < minLightness) {
      peakDetected = false;
      lightness = minLightness;
    }
  }
  var spectrum = fft.analyze();
  for (var i = 0; i < spectrum.length; i++) {
    var angle = map(i, 0, spectrum.length, 0, 64);
    var amp = spectrum[i];
    var r = map(amp, 0, 256, 20, 100);
    //fill(100, 100, 100);
    //var x = r * cos(angle);
    //var y = r * sin(angle);
    stroke(i, i, 100);
    //line(0, 0, x, y);
    //vertex(x, y);
    var y = map(amp, 0, 256, height, 0);
    rect(i * w, y, w - 2, height - y);
  }

  // circle primitive
  var c = new Circle({
            x: 2, y:2, z:0,
            radius: 1,
            red:random(255), green:random(255), blue:random(255),
            side:'double'
          });
  world.add(c);


  

  // Sound
  // currLevel = amplitude.getLevel();
  // let spectrum = fft.analyze();
  // peakDetect.update(fft);
  // if (peakDetect.isDetected) {
  //   for (let i = 0; i < bloomsCount; i++) {
  //     let position = generateBloomPosition();
  //     let temp = new Bloom(random(position.x - 50, position.x + 50), random(position.y - 50, position.y + 50), random(position.z - 50, position.z + 50), random(3, 7), 2.2, hue, 80, -0.01);
  //     blooms.push(temp);
  //   }
  //   peakDetected = true;
  //   lightness = maxLightness;
  // }

  // Movement and garbage collection
  // for (let i = 0; i < blooms.length; i++) {
  //   blooms[i].move();
  //   if (blooms[i].isDead() == true) {
  //     blooms[i].remove();
  //     blooms.splice(i, 1);
  //     i--;
  //   }
  // }
}

// Enables Blooms to spawn near but not overtop a user
function generateBloomPosition() {
  let buffer = 30;
  let range = 50;
  let position = world.getUserPosition();
  let coords = {};
  if (random(2) < 1) {
    coords.x = random(position.x - range, position.x - buffer);
  } else {
    coords.x = random(position.x + buffer, position.x + range)
  }
  if (random(2) < 1) {
    coords.y = random(position.y - range, position.y - buffer);
  } else {
    coords.y = random(position.y + buffer, position.y + range)
  }
  if (random(2) < 1) {
    coords.z = random(position.z - range, position.z - buffer);
  } else {
    coords.z = random(position.z + buffer, position.z + range)
  }
  return coords;
}

// Pressing enter starts/stops music;
function keyPressed() {
  if (keyIsDown(13)) {
    if (song.isPlaying()) {
      song.pause();
    } else {
      song.play();
    }
  }
}

// Particles eminate from Blooms
class Particle {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.speedX = random(-0.7, 0.7);
    this.speedY = random(-0.7, 0.7);
    this.speedZ = random(-0.7, 0.7);

    // OBJ with material
    this.shape = new OBJ({
      asset: 'icosahedron',
      mtl: 'material',
      x: this.x,
      y: this.y,
      z: this.z,
      scaleX: 0.4,
      scaleY: 0.4,
      scaleZ: 0.4,
      red: 255,
      green: 255,
      blue: 255,
    });

    world.add(this.shape);
  }

  move() {
    this.shape.nudge(this.speedX, this.speedY, this.speedZ);
  }

  remove() {
    world.remove(this.shape);
  }
}

// Composite object which contains a core and particles
class Bloom {
  constructor(x, y, z, count, size, hue, saturation, acceleration) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.count = count;
    this.size = size;
    this.hue = hue;
    this.saturation = saturation;
    this.speed = 1;
    this.acceleration = acceleration;
    this.velocity = 5;
    this.rotation = 0;
    this.rotationVelocity = random(0.2, 1);
    this.generateColors(hue);
    this.containers = [];
    this.shapes = [];
    this.particles = [];
    this.amplitude;
    let levelWithRandom = currLevel + random(-0.1, 0.1);

    for (let i = 0; i < 5; i++) {
      let temp = new Particle(this.x, this.y, this.z);
      this.particles.push(temp);
    }

    for (let i = 0; i < this.count; i++) {
      let tempContainer = new Container3D({
        x: this.x,
        y: this.y,
        z: this.z,
      });
      this.containers.push(tempContainer);
      world.add(this.containers[i]);
      let currColor = lerpColor(this.startColor, this.endColor, i / this.count);
      let shape = this.generateShape(i, currColor, levelWithRandom);
      this.shapes.push(shape);
      this.containers[i].add(shape);
    }
  }

  // Chooses a primitive to generate, with # of vertices loosely proportional to amplitude
  generateShape(i, currColor, levelWithRandom) {
    let shape;
    let that = this;
    if (levelWithRandom < 0.1) {
      shape = new Sphere({
        x: 0,
        y: 0,
        z: 0,
        opacity: 1 / (i + 1),
        red: red(currColor),
        green: green(currColor),
        blue: blue(currColor),
        radius: this.size * (i + 1) / 5,
        overFunction: function(shape) {
          that.hoverAction();
        }
      });
    } else if (levelWithRandom < 0.2) {
      shape = new Tetrahedron({
        x: 0,
        y: 0,
        z: 0,
        opacity: 1 / (i + 0.3),
        red: red(currColor),
        green: green(currColor),
        blue: blue(currColor),
        radius: this.size * (i + 1) / 5,
        overFunction: function(shape) {
          that.hoverAction();
        }
      });
    } else if (levelWithRandom < 0.4) {
      shape = new Octahedron({
        x: 0,
        y: 0,
        z: 0,
        opacity: 1 / (i + 1),
        red: red(currColor),
        green: green(currColor),
        blue: blue(currColor),
        radius: this.size * (i + 1) / 5,
        overFunction: function(shape) {
          that.hoverAction();
        }
      });
    } else if (levelWithRandom < 1) {
      shape = new Dodecahedron({
        x: 0,
        y: 0,
        z: 0,
        opacity: 1 / (i + 1),
        red: red(currColor),
        green: green(currColor),
        blue: blue(currColor),
        radius: this.size * (i + 1) / 5,
        overFunction: function(shape) {
          that.hoverAction();
        }
      });
    } else {
      shape = new Box({
        x: 0,
        y: 0,
        z: 0,
        opacity: 1 / (i + 1),
        red: red(currColor),
        green: green(currColor),
        blue: blue(currColor),
        width: this.size * (i + 1) / 5,
        height: this.size * (i + 1) / 5,
        depth: this.size * (i + 1) / 5,
        overFunction: function(shape) {
          that.hoverAction();
        }
      });
    }
    return shape;
  }

  // Blooms that are hovered over will decay slower and spin
  hoverAction() {
    for (let i = 0; i < this.shapes.length; i++) {
      this.speed -= (this.acceleration * 0.6);
      this.shapes[i].spinX(2);
      this.shapes[i].spinY(2);
      this.shapes[i].spinZ(2);
    }
  }

  generateColors(hue) {
    let start = hue - random(10);
    let end = hue + random(10);
    if (start < 0) {
      start = 100 + start;
    }
    if (end > 100) {
      end = end - 100;
    }
    this.startColor = color(min(start, end), this.saturation, 65, 30);
    this.endColor = color(max(start, end), this.saturation, 65, 30);
  }

  move() {
    for (let i = 0; i < this.shapes.length; i++) {
      let currScale = this.shapes[i].getScale();
      this.speed += this.acceleration;
      this.shapes[i].setScale(currScale.x + this.speed, currScale.y + this.speed, currScale.z + this.speed);
    }
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].move();
    }
  }

  isDead() {
    if (this.shapes[0].getScale().x < 0) {
      return true;
    }
    return false;
  }

  remove() {
    for (let i = 0; i < this.containers.length; i++) {
      world.remove(this.containers[i]);
    }
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].remove();
    }
  }
}
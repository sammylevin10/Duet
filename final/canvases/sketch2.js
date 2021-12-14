let currentTrackFeatures = {};

// A Frame
let world;

// Color
let targetHue = 50;
let hue;
let hueVelocity = 0.05;
let lightness = 50;
let minLightness = 50;
let maxLightness = 60;

// Sound
let mic, fft, peakDetect, peakDetected, amplitude, currLevel, song;

// Blooms
let blooms = [];
let bloomsCount = 15;

function handleMessage(e) {
  if (typeof e == "object") {
    currentTrackFeatures = e.data;
    targetHue = map(currentTrackFeatures.acousticness, 0, 1, 10, 90);
    hue = targetHue;
  }
}

window.addEventListener('message', handleMessage, false);

const _log = console.log;
console.log = function(...rest) {
  window.parent.postMessage({
      source: 'iframe',
      message: rest,
    },
    '*'
  );
  _log.apply(console, arguments);
};

function setup() {
  // Canvas
  let canvas = createCanvas(5376, 2688).id();

  colorMode(HSL, 100, 100, 100, 100);

  // Sound
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  // Min frequency, max frequency, amplitude threshold, frames to wait
  peakDetect = new p5.PeakDetect(20, 300, 0.4, 40);

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
  // Sound
  currLevel = mic.getLevel();
  let spectrum = fft.analyze();
  peakDetect.update(fft);

  // Sky color
  hue += hueVelocity;
  if (hue > (targetHue + 10)) {
    hueVelocity *= -1;
    hue = targetHue + 9.5;
  } else if (hue < (targetHue - 10)) {
    hueVelocity *= -1;
    hue = targetHue - 9.5;
  }
  background(hue, 50, lightness);
  if (peakDetected) {
    lightness -= 1;
    if (lightness < minLightness) {
      peakDetected = false;
      lightness = minLightness;
    }
  }

  if (peakDetect.isDetected) {
    for (let i = 0; i < bloomsCount; i++) {
      let position = generateBloomPosition();
      // x, y, z, count, size, hue, saturation, acceleration
      let temp = new Bloom(
        random(position.x - 50, position.x + 50),
        random(position.y - 50, position.y + 50),
        random(position.z - 50, position.z + 50),
        random(3, 7),
        2.2,
        targetHue,
        80,
        -0.01);
      blooms.push(temp);
    }
    peakDetected = true;
    lightness = maxLightness;
  }

  // Movement and garbage collection
  for (let i = 0; i < blooms.length; i++) {
    blooms[i].move();
    if (blooms[i].isDead() == true) {
      blooms[i].remove();
      blooms.splice(i, 1);
      i--;
    }
  }
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
    let levelWithRandom = map(currLevel, 0, 0.1, 0, 1) + random(-0.1, 0.1);

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
    } else if (levelWithRandom < 0.3) {
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
      this.speed -= (this.acceleration * 0.3);
      this.shapes[i].spinX(2);
      this.shapes[i].spinY(2);
      this.shapes[i].spinZ(2);
    }
  }

  generateColors(hue) {
    console.log(hue);
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
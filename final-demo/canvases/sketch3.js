let currentTrackFeatures = {};

// A Frame
let world;

// Color
let targetHue = 65;
let hue;
let hueVelocity = 0.05;
let lightness = 15;
let minLightness = 15;
let maxLightness = 30;

// Sound
let fft, peakDetect, peakDetected, currLevel, song;

// Console logs are passed to parent window
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
  hue = random(100);
  colorMode(HSL, 100, 100, 100, 100);

  // Sound
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  // Min frequency, max frequency, amplitude threshold, frames to wait
  peakDetect = new p5.PeakDetect(20, 300, 0.4, 40);

  w = width / 64;
  noStroke();

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
  spectrum = fft.analyze();

  // Sky color
  hue += hueVelocity;
  if (hue > (targetHue + 10)) {
    hueVelocity *= -1;
    hue = targetHue + 9.5;
  } else if (hue < (targetHue - 10)) {
    hueVelocity *= -1;
    hue = targetHue - 9.5;
  }
  background(hue, 60, lightness, 5);
  if (peakDetected) {
    lightness -= 1;
    if (lightness < minLightness) {
      peakDetected = false;
      lightness = minLightness;
    }
  }

  if (peakDetect.isDetected) {
    peakDetected = true;
    lightness = maxLightness;
  }
  // For each frequency in the spectrum, graph the amplitude
  for (var i = 0; i < spectrum.length; i++) {
    var amp = spectrum[i];
    if (i < 32) {
      fill((targetHue + map(i, 0, 32, -5, 5)), 50, 50);
    } else {
      fill((targetHue + map(i, 32, 64, 5, -5)), 50, 50);
    }
    var y = map(amp, 0, 256, height, 0);
    rect(i * w, y, w - 2, height - y);
  }
}
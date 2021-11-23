// Notes
// Beat detection using p5.Amplitude();
// Largely adapted from https://therewasaguy.github.io/p5-music-viz/demos/01d_beat_detect_amplitude/

// Sound
let amplitude;
// :: Beat Detect Variables
// how many draw loop frames before the beatCutoff starts to decay
// so that another beat can be triggered.
// frameRate() is usually around 60 frames per second,
// so 20 fps = 3 beats per second, meaning if the song is over 180 BPM,
// we wont respond to every beat.
var beatHoldFrames = 30;
// what amplitude level can trigger a beat?
var beatThreshold = 0.1;
// When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
var beatCutoff = 0;
var beatDecayRate = 0.98; // how fast does beat cutoff decay?
var framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.

// Visuals
let bg_color;

// Assets
let image1;
let song1;

function preload() {
  image1 = loadImage("assets/images/image1.png");
  song1 = loadSound("assets/sound/song1.wav");
}

function setup() {
  let cnv = createCanvas(500, 500);
  cnv.parent("#canvas-container");
  background(0);
  // song1.play();
  // image(image1, 0, 0);
  bg_color = color(0, 0, 0);
  amplitude = new p5.Amplitude();
  song1.play();
  amplitude.setInput(song1);
  amplitude.smooth(0.9);
}

function draw() {
  background(bg_color);

  let level = amplitude.getLevel();
  console.log(level);
  detectBeat(level);
}

function detectBeat(level) {
  // console.log(level);
  if (level > beatCutoff && level > beatThreshold) {
    onBeat();
    beatCutoff = level * 1.2;
    framesSinceLastBeat = 0;
  } else {
    bg_color = color(0, 0, 0);
    if (framesSinceLastBeat <= beatHoldFrames) {
      framesSinceLastBeat++;
    } else {
      beatCutoff *= beatDecayRate;
      beatCutoff = Math.max(beatCutoff, beatThreshold);
    }
  }
}

function onBeat() {
  bg_color = color(255, 255, 255);
  // background(bg);
}

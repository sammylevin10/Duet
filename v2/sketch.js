// Notes
// Beat detection using p5.PeakDetect();
// Largely adapted from https://p5js.org/reference/#/p5.PeakDetect

// Sound
let fft, peakDetect;
var ellipseWidth = 0;

// Assets
let image1;
let song;
let songs = [];

function preload() {
  for (let i = 1; i <= 3; i++) {
    temp = loadSound("assets/sound/song" + i + ".wav");
    songs.push(temp);
  }
  song = songs[0];
}

function setup() {
  let cnv = createCanvas(500, 500);
  cnv.parent("#canvas-container");
  background(0);
  noStroke();

  // p5.PeakDetect requires a p5.FFT
  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect();
}

function draw() {
  background(0);
  fill(255);
  textAlign(CENTER);
  text("Click to play/pause", width / 2, height / 10);

  // peakDetect accepts an fft post-analysis
  fft.analyze();
  peakDetect.update(fft);

  if (peakDetect.isDetected) {
    ellipseWidth = width / 2;
  } else {
    ellipseWidth *= 0.95;
  }

  ellipse(width / 2, height / 2, ellipseWidth, ellipseWidth);
}

function mouseClicked() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (song.isPlaying()) {
      song.stop();
    } else {
      song.play();
    }
  }
}

function changeSong(i) {
  song.stop();
  song = songs[i];
  song.play();
}

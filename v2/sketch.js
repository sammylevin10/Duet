// Notes
// Beat detection using p5.PeakDetect();
// Largely adapted from https://p5js.org/reference/#/p5.PeakDetect

// Sound
let mic, fft, peakDetect;
var ellipseWidth = 0;

// Assets
let image1;
let song;
let songs = [];

function preload() {
  // temp = loadSound("assets/sound/song1.wav");
  // songs.push(temp);
  // for (let i = 1; i <= 3; i++) {
  //   temp = loadSound("assets/sound/song" + i + ".wav");
  //   songs.push(temp);
  // }
  // song = songs[0];
}

function setup() {
  let cnv = createCanvas(500, 500);
  cnv.parent("#canvas-container");
  background(0);
  noStroke();

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  // p5.PeakDetect requires a p5.FFT
  // fft = new p5.FFT();
  peakDetect = new p5.PeakDetect();
}

function draw() {
  background(0);
  fill(255);
  textAlign(CENTER);
  text("Click to play/pause", width / 2, height / 10);

  // peakDetect accepts an fft post-analysis
  let spectrum = fft.analyze();
  peakDetect.update(fft);

  stroke(1);
  beginShape();
  for (i = 0; i < spectrum.length; i++) {
    vertex(i, map(spectrum[i], 0, 255, height, 0));
  }
  endShape();

  console.log(peakDetect.isDetected);
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

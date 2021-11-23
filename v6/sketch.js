let spread;
let inc;
let margin;
let vertOffset;
// extra flat line at either end
let extraLine = 70;
// steps between vertexes
let step = 3;
// spacing between lines
let ySpacing = 2.6;

// noise settings
let offset = 0;
let offsetInc = 0.09;
let rowOffset = 40;
let lineMultiplier = 47;

// fuzz settings
let fuzzOffset = 1000;
let fuzzInc = offsetInc;
let fuzzMultiplier = 3.5;
let mic;

function setup() {
  createCanvas(600, 600);
  background(200);

  margin = width / 3;
  vertOffset = width / 4.6;
  spread = width - margin * 2;
  inc = (TWO_PI * step) / spread;
  stroke(255);
  strokeWeight(1.2);
  fill(0);
  // noFill()
  frameRate(24);

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
}

function draw() {
  background(0);
  let vol = mic.getLevel();
  console.log("volume", vol);
  lineMultiplier = vol * 1000;

  // make rows
  for (let y = 0; y <= 50 * ySpacing; y += ySpacing) {
    let a = 0.0;
    // begin the line
    beginShape();
    for (let x = -extraLine; x <= spread + extraLine; x += step) {
      // perlin noise
      let n = noise(offset + x / rowOffset + y) * lineMultiplier;
      // flatten the line if not in the 'spread' area
      if (x < 0 || x > spread) a = 0;
      // use a sine wave to multiply the noise
      let vert = (1 - sin(a + PI / 2)) * n;
      // add some extra fuzz to the line
      let fuzz = noise(fuzzOffset + x / rowOffset + y) * fuzzMultiplier;
      // draw the line
      vertex(
        x + margin,
        height - vert - (height - y * ySpacing) + vertOffset + fuzz
      );
      //increment the angle for the sine wave.
      a = a + inc;
    }
    endShape();
  }
  // increment the noise and fuzz
  offset += offsetInc;
  fuzzOffset += fuzzInc;

  let spectrum = fft.analyze();
  // noStroke();
  //fill(255, 0, 255);
  for (let i = 0; i < spectrum.length; i++) {
    x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    //rect(x, height, width / spectrum.length, h );
  }
}

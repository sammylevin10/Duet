// NOTE: this demo showcases how a p5 sketch can be used in conjunction with an
// HTML document.  Please open up the 'index.html' file and refer to it as necessary

function handleMessage(e) {
  console.log("CANVAS 4 RECEIVED MESSSAGE");
  if (typeof e == "object") {
    console.log("I received an object");
    currentTrackFeatures = e;
  } else {
    console.log(e.data);
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
  // create our canvas
  createCanvas(windowWidth, windowHeight);

  // erase the background
  background(0, 0, 255);
}

function draw() {
  // just draw some random rectangles
  // fill(random(255));
  rectMode(CENTER);
  // rect(random(25, width - 25), random(25, height - 25), 25, 25);
}
// NOTE: this demo showcases how a p5 sketch can be used in conjunction with an
// HTML document.  Please open up the 'index.html' file and refer to it as necessary

function handleMessage(e) {
  console.log("CANVAS 2 RECEIVED MESSSAGE");
  console.log(e.data);
  // color = 255;
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
  background(0, 255, 0);
}

function draw() {
  // just draw some random rectangles
  // fill(random(255));
  rectMode(CENTER);
  // rect(random(25, width - 25), random(25, height - 25), 25, 25);
}
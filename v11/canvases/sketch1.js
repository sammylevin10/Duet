let color = 128;

function handleMessage(e) {
  console.log("CANVAS 1 RECEIVED MESSSAGE");
  console.log(e.data);
  color = 255;
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

// console.log("This is a message passed from sketch1.js to the main window");

function setup() {
  // color = 255;
  // create our canvas
  createCanvas(windowWidth, windowHeight);

  // erase the background


}

function draw() {
  background(color);
  // just draw some random ellipses
  // fill(random(255));
  // ellipse(random(25, width - 25), random(25, height - 25), 25, 25);
}
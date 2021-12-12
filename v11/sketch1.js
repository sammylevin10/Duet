// NOTE: this demo showcases how a p5 sketch can be used in conjunction with an
// HTML document.  Please open up the 'index.html' file and refer to it as necessary

// window.parent.window.alert(globalVariable);
// window.parent.console.log("aaaaa");
// parent.console.log("aaaaa");
// parent.window.alert("aaaa");

let color = 0;

function testFunction(e) {
  console.log("RECEIVED FROM MAIN FRAME");
  console.log(e.data);
}

// window.postMessage()

window.addEventListener('message', testFunction, false);

const _log = console.log;
// Override the console
console.log = function(...rest) {
  // window.parent is the parent frame that made this window
  window.parent.postMessage({
      source: 'iframe',
      message: rest,
    },
    '*'
  );
  // Finally applying the console statements to saved instance earlier
  _log.apply(console, arguments);
};

// window.addEventListener('message', function(response) {
//   // Make sure message is from our iframe, extensions like React dev tools might use the same technique and mess up our logs
//   if (response) {
//     color = 128;
//     console.log("RECEIVED RESPONSE");
//   }
//   if (response.data) {
//     // Do whatever you want here.
//     color = 255;
//     console.log("RECEIVED RESPONSE DATA");
//     // console.log(response.data.message);
//   }
// });

// function receiveResponse(e) {
//   console.log(e.data);
//   color = 255;
//   console.log("sketch1 received message from main frame");
//   // console.log(e);
// }

// if (window.addEventListener) {
//   window.addEventListener("message", displayMessage, false);
// } else {
//   window.attachEvent("onmessage", receiveResponse);
// }

// window.addEventListener("message", (event) => {
//   console.log("sketch1 received message from main frame");
//   if (event.origin !== "http://localhost:8888") {
//     receiveResponse(1);
//     return;
//   }
// }, false);

// window.addEventListener('message', receiveResponse, false);
// receiveResponse();

// receiveResponse(1);


console.log("This is a message passed from sketch1.js to the main window");

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
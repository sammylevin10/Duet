// variable to hold a reference to our A-Frame world
let world;

// array to hold our blooms
let blooms = [];

// in-memory image buffer
let buffer1;

// control variable to prevent click spamming
let countDownTimer = 0;

function setup() {
	// no canvas needed
	noCanvas();

	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');

	// teleport the user
	// world.setUserPosition(0, 0, 0);

  world.setBackground(173, 216, 230);

	// create a floor for the user
	let floor = new Plane({
		rotationX: -90,
		red: 0,
    green: 0,
    blue: 0,
		repeatX: 100,
		repeatY: 100,
		width: 100,
		height: 100
	});
	world.add(floor);

	// create 50 Bloom objects to populate the world
	// for (let i = 0; i < 50; i++) {
	// 	let temp = new Bloom(random(-50,50), random(0, 50), random(-50,50));
	// 	blooms.push( temp );
	// }

  let colorr = color(random(255), random(255), random(255));
  let sphere = new Sphere({
    x: 0,
    y: 0,
    z: 0,
    red: red(colorr),
    green: green(colorr),
    blue: blue(colorr),
    radius: 10
  });
  world.add(sphere);

  var b = new Box({
						x:-10, y:1, z:0,
						width:1, height: 1.2, depth: 2,
						red:random(255), green:random(255), blue:random(255)
					});
	world.add(b);
}

function draw() {
	//
	// for (let i = 0; i < robots.length; i++) {
	// 	robots[i].move();
	// 	robots[i].reportPosition();
	// }

}


class Bloom {

	constructor(x,y,z) {
		this.x = x;
		this.y = y;
		this.z = z;

		// 3D container to hold parts
		this.container = new Container3D({
			x: this.x,
			y: this.y,
			z: this.z
		});
		world.add(this.container);

		this.color = color(random(255), random(255), random(255));
		this.sphere = new Sphere({
			x: 0,
			y: 0,
			z: 0,
			red: red(this.color),
			green: green(this.color),
			blue: blue(this.color),
			width: 0.5, height: 0.5, depth: 0.5
		});

		// add primitives to our container
		this.container.add(this.sphere);
	}

	move() {}
		// move our container
		this.container.nudge(xMove, 0, zMove);
	}
}

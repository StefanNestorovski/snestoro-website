let canvas = document.getElementById('gameCanvas');
let canvasContext;

let planets = [];

let counterID = 0;

let cx = 0;
let cy = 0;
let mouseDown = false;
let mousePos = [0, 0];

const simSpeed = 1;

const gG = 1 / simSpeed;
const addTimer = 1000;
const spread = 10000;
const ZOOM_STEP = .05;
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2;
const centerX = canvas.width/2;
const centerY = canvas.height/2;

let scale = DEFAULT_ZOOM;

class Hero {
    constructor(name, level) {
        this.name = name;
        this.level = level;
    }

    // Adding a method to the constructor
    greet() {
        return `${this.name} says hello.`;
    }
}

class Planet {
  constructor(mass, locX, locY, speedX, speedY) {
      this.mass = mass * simSpeed;
			this.locX = locX;
			this.locY = locY;
			this.speedX = speedX;
			this.speedY = speedY;
			this.accX = 0;
			this.accY = 0;
			this.id = counterID++;
			this.fXSum = 0;
			this.fYSum = 0;
			this.delete = false;
  }

	size() {
		return Math.cbrt(this.mass);
	}

  render() {
    canvasContext.beginPath();
    let x = this.locX + cx;
    let y = this.locY + cy;
    x = (centerX - x) * scale + centerX;
    y = (centerY - y) * scale + centerY;
    canvasContext.arc(x, y, this.size() * scale, 0, 2 * Math.PI);
		canvasContext.fillStyle = "red";
		canvasContext.fill();
	}

	addForces() {
		this.fXSum = 0,
		this.fYSum = 0;
		planets.forEach ( p => {
			if (p.id !== this.id &&
			(Math.abs(p.locX - this.locX) > (p.size() + this.size()) ||
			Math.abs(p.locY - this.locY) > (p.size() + this.size())) &&
			(this.locX - p.locX !== 0 ||
			this.locY - p.locY !== 0)) {
				let rx = p.locX - this.locX;
				let ry = p.locY - this.locY;
				let r2 = Math.pow(rx,2) + Math.pow(ry,2)
				let fx = gG * (Math.sign(rx) * (p.mass*this.mass)) / r2;
				let fy = gG * (Math.sign(ry) * (p.mass*this.mass)) / r2;
				this.fXSum += fx;
				this.fYSum += fy;
			}
		});
	}

	move() {
		this.accX = this.fXSum / this.mass;
		this.accY = this.fYSum / this.mass;
		this.speedX += this.accX;
		this.speedY += this.accY;
		this.locX += this.speedX;
		this.locY += this.speedY;
	}
}

window.onload = function() {
	canvasContext = canvas.getContext('2d');

	const player = new Hero('Bob', 2);
	let stopped = false;
	console.log(player.greet());
  let speeed = 10;
  //planets.push(new Planet(500, 500, 450, 0, speeed));
  planets.push(new Planet(20000, centerX, centerY, 0, 1.2));
  planets.push(new Planet(1000, centerX-400, centerY, 0, -speeed));
  planets.push(new Planet(2000, centerX+1000, centerY, 0, -speeed+4));
  for (let i = 0; i < 20; i++) {
		addRandomPlanet();
	}

	let gameInterval = setInterval(function(){
		clearScreen();
		planets.forEach( p => {
			p.render();
			p.addForces();
			p.move();
		});
		collisions();
	}, 5);
	let addMoreInterval = setInterval(function(){
		for (let i = 0; i < 3; i++) {
      addRandomPlanet();
		}
		console.log(planets.length);
	}, addTimer);

  onkeydown = function(e) {
    if(e.keyCode === 32 && !e.repeat) {
			if(!stopped) {
				stopped = true;
				clearInterval(gameInterval);
				clearInterval(addMoreInterval);
			} else {
				stopped = false;
				gameInterval = setInterval(function(){
					clearScreen();
					planets.forEach( p => {
						p.render();
						p.addForces();
						p.move();
					});
					collisions();
				}, 10);
				addMoreInterval = setInterval(function(){
					for (let i = 0; i < 1; i++) {
            addRandomPlanet();
					}
					console.log(planets.length);
				}, addTimer);
			}
		}
		if(e.keyCode === 37) { // left
			cx-=5;
		}
		if(e.keyCode === 38) { // up
			cy-=5;
		}
		if(e.keyCode === 39) { // right
			cx+=5;
		}
		if(e.keyCode === 40) { // down
			cy+=5;
		}
	}

	canvas.addEventListener("mousewheel", zoom, false);
  canvas.addEventListener("mousedown", setMouseDown, false);
  canvas.addEventListener("mouseup", setMouseUp, false);
  canvas.addEventListener("mousemove", move, false);

  function zoom(e) {
    if (e.wheelDelta > 0) {
      zoomIn();
    }
    else {
      zoomOut();
    }
    clearScreen();
    planets.forEach( p => {
      p.render();
    });
  }
  // Zoom in
  function zoomIn(e) {
    if (scale < MAX_ZOOM) {
      scale += ZOOM_STEP;
    }
  }

  // Zoom out
  function zoomOut(e) {
    if (scale > MIN_ZOOM) {
      scale -= ZOOM_STEP;
    }
  }

  // Toggle mouse status
  function setMouseDown(e) {
    mouseDown = true;
    mousePos = [e.x, e.y];
  }
  function setMouseUp(e) {
    mouseDown = false;
  }

  // Move
  function move(e) {
    if (mouseDown) {
      let dX = e.x - mousePos[0];
      let dY = e.y - mousePos[1];
      cx -= dX/(1.5*scale);
      cy -= dY/(1.5*scale);
      mousePos = [e.x, e.y]
      clearScreen();
      planets.forEach( p => {
        p.render();
      });
    }
  }
};

function addRandomPlanet() {
//	planets.push(new Planet(Math.random()*50, Math.random()*1400, Math.random()*200-200, Math.random()*4-2, Math.random()*4-2));
//	planets.push(new Planet(Math.random()*50, Math.random()*1400-200, Math.random()*200+900, Math.random()*4-2, Math.random()*4-2));
//	planets.push(new Planet(Math.random()*50, Math.random()*200-200, Math.random()*1100-200, Math.random()*4-2, Math.random()*4-2));
//	planets.push(new Planet(Math.random()*50, Math.random()*200+1200, Math.random()*1100, Math.random()*4-2, Math.random()*4-2));
}

function collisions() {
	let deleter = false; //bool if a planet needs to be deleted
	for (let i = 0; i < planets.length; i++) {
		p1 = planets[i];
		for (let c = 0; c < planets.length; c++) {
			p2 = planets[c];
			if(p1.id !== p2.id &&
			(p1.locX - p2.locX !== 0 ||
			p1.locY - p2.locY !== 0) &&
			Math.abs(p1.locX - p2.locX) < (p1.size() + p2.size()) &&
			Math.abs(p1.locY - p2.locY) < (p1.size() + p2.size()) &&
			p1.mass >= p2.mass &&
			!p1.delete &&
			!p2.delete) {
				//combine into the bigger planet
				deleter = true;
				p2.delete = true;
				p1.speedX = ((p2.speedX*p2.mass) + (p1.speedX*p1.mass)) / (p1.mass + p2.mass);
				p1.speedY = ((p2.speedY*p2.mass) + (p1.speedY*p1.mass)) / (p1.mass + p2.mass);
				p1.mass += p2.mass;
			}
		}

    if(p1.locX < -200-spread || p1.locX > 1400+spread ||
      p1.locY < -200-spread || p1.locY > 1100+spread) {
      p1.delete = true;
    }
	}
	if(deleter) {
		for (let i = planets.length - 1; i >= 0; i--) {
			p = planets[i];
			if(p.delete) {
				planets.splice(i, 1);
			}
		}
	}
}

function clearScreen() {
	canvasContext.fillStyle = 'black';
  canvasContext.fillRect(0,0 ,canvas.width,canvas.height);
}

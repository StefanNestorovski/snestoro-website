let canvas = document.getElementById('gameCanvas');
let ctx;
let flameWidth = 50;
let mouseLoc = {
	x: null,
	y: null
}

let size = 204;

let n = new Array(size);
let m = new Array(size);
for (let i = 0; i < n.length; i++) {
	n[i] = new Array(size);
	m[i] = new Array(size);
	for (let j = 0; j < n.length; j++) {
		n[i][j] = (j > n.length - 3 && i > 100 - flameWidth && i < 100 + flameWidth) ? 255 : 0;
		m[i][j] = (j > n.length - 3 && i > 100 - flameWidth && i < 100 + flameWidth) ? 255 : 0;
	}
}

canvas.addEventListener('mousemove', function(e) {
  // important: correct mouse position:
  let rect = this.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;
	mouseLoc.x = Math.floor(size * (x / canvas.width));
	mouseLoc.y = Math.floor(size * (y / canvas.height));
});

canvas.onmouseout = function(e) {
	mouseLoc.x = null;
	mouseLoc.y = null;
}

window.onload = (() => {
	ctx = canvas.getContext('2d');

	setInterval(function() {
		clearScreen();
		movePixels();
		drawPixels();
		copyAll();
	}, 20);
});

function movePixels() {
	if (mouseLoc.x && mouseLoc.y) {
		let mouseTemp = 0;
		try {
			m[mouseLoc.x][mouseLoc.y] = mouseTemp;
			m[mouseLoc.x - 1][mouseLoc.y - 1] = mouseTemp;
			m[mouseLoc.x][mouseLoc.y - 1] = mouseTemp;
			m[mouseLoc.x + 1][mouseLoc.y - 1] = mouseTemp;
			m[mouseLoc.x + 1][mouseLoc.y] = mouseTemp;
			m[mouseLoc.x + 1][mouseLoc.y + 1] = mouseTemp;
			m[mouseLoc.x][mouseLoc.y + 1] = mouseTemp;
			m[mouseLoc.x - 1][mouseLoc.y + 1] = mouseTemp;
			m[mouseLoc.x - 1][mouseLoc.y] = mouseTemp;
		} catch (e) {}
	}
	for (let i = 1; i < n.length - 1; i++) {
		for (let j = 1; j < n.length - 2; j++) {
			n[i][j] = (m[i][j] + 0.5*m[i-1][j] + 0.5*m[i+1][j] + 0.5*m[i][j-1] + 10*m[i][j+1] + 1*m[i][j+2]) / 13.5;
			n[i][j] = n[i][j] - Math.floor(Math.random()*30);
			if(m[i][j+1] > 90) {
				n[i][j] = n[i][j] + 10;
			}
			if(m[i][j] > 90) {
				n[i][j] = n[i][j] + 2;
			}
		}
	}
}

function drawPixels(){
	for (let i = 0; i < n.length; i++) {
		for (let j = 0; j < n.length; j++) {
			if(n[i][j] > 10) {
				ctx.fillStyle = heatToColor(n[i][j]);
				ctx.fillRect((i-2)*4, j*4, 4, 4);
			}
		}
	}
}

function heatToColor(heat) {
	let r = heat;
	let g = heat-70;
	let b = (heat - 150) * 1.66;

	return "rgb(" + r + ", " + g + ", " + b + ")";
}

function copyAll() {
	for (let i = 0; i < n.length; i++) {
		for (let j = 0; j < n.length; j++) {
			m[i][j] = n[i][j];
		}
	}
}

function clearScreen(){
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0 ,canvas.width,canvas.height);
}

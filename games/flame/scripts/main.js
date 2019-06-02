let canvas = document.getElementById('gameCanvas');
let ctx;
let flameWidth = 60;

let n = new Array(204);
let m = new Array(204);
for (let i = 0; i < n.length; i++) {
	n[i] = new Array(202);
	m[i] = new Array(202);
	for (let j = 0; j < n.length; j++) {
		n[i][j] = (j > n.length - 3 && i > 100 - flameWidth && i < 100 + flameWidth) ? 255 : 0;
		m[i][j] = (j > n.length - 3 && i > 100 - flameWidth && i < 100 + flameWidth) ? 255 : 0;
	}
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

function movePixels(){
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
				ctx.fillStyle = "rgb(" + n[i][j] + ", 0, 0)";
				ctx.fillRect((i-2)*4, j*4, 4, 4);
			}
		}
	}
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

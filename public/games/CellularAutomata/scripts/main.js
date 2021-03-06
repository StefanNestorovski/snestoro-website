let canvas = document.getElementById('gameCanvas');
let ctx;

ratio = canvas.width / canvas.height;

let numXPoints = 300;
let numYPoints = Math.round(numXPoints / ratio);

//This value msut be between 0 and 255
let ruleSet = 110;
let binaryRule;

let BOX_WIDTH = canvas.width/numXPoints;
let BOX_HEIGHT = canvas.height/numYPoints;

let generation;
let cells = [];

function reinitialize(index) {
	initialize();
	clearScreen();
	drawSquares();
}

window.onload = (() => {
	ctx = canvas.getContext('2d');
	clearScreen();
	$("#ruleSet").val(ruleSet);
	drawSquares();
	initialize();
	function intervaler(timestamp) {
		drawGeneration();
		calculateGeneration();
		window.requestAnimationFrame(intervaler);
	}
	window.requestAnimationFrame(intervaler);
});

function initialize() {
	ruleSet = $("#ruleSet").val();
	binaryRule = toBinaryArray(ruleSet);
	generation = 0;
	for (let i = 0; i < numXPoints; i++) {
		cells[i] = 0;
	}
	cells[Math.round(numXPoints/2)] = 1;
}

function ruleSetFunction(left, middle, right) {
	let value = 4 * left + 2 * middle + 1 * right;
	return binaryRule[value];
}

function calculateGeneration() {
	let newGen = [];
	for (let i = 0; i < numXPoints; i++) {
		if (i === 0) {
			newGen[i] = ruleSetFunction(cells[cells.length-1], cells[i], cells[i+1]);
		} else if (i === numXPoints - 1) {
			newGen[i] = ruleSetFunction(cells[i-1], cells[i], cells[0]);
		} else {
			newGen[i] = ruleSetFunction(cells[i-1], cells[i], cells[i+1]);
		}
	}
	cells = newGen;
	generation++;
}

function drawSquares() {
	for (let i = 0; i < numXPoints; i++) {
		for (let j = 0; j < numYPoints; j++) {
			drawSquare(i, j, false);
		}
	}
}

function drawGeneration() {
	for (let i = 0; i < numXPoints; i++) {
		if(generation > numYPoints-2) {
			let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			ctx.putImageData(imageData, 0, -BOX_HEIGHT);
			generation--;
		}
		if (cells[i]) {
			drawSquare(i, generation, true);
		} else {
			drawSquare(i, generation, false);
		}
	}
}

function drawSquare(x,y,fill) {
	let startX = x * (canvas.width / numXPoints);
	let startY = y * (canvas.height / numYPoints);
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.fillStyle = 'black';
	ctx.strokeStyle = "white";
	ctx.rect(startX, startY, BOX_WIDTH, BOX_HEIGHT);
	ctx.stroke();
	if (fill) {
		ctx.fill();
	}
}

function clearScreen(){
	ctx.fillStyle = 'white';
	ctx.fillRect(0,0 ,canvas.width,canvas.height);
}

//Convert number into 8-bit binary array
function toBinaryArray(numb) {
	let binArr = [];
	for (let i = 7; i >= 0; i--) {
		binArr[i] = +(numb >= 2**i);
		numb = numb >= 2**i ? numb - 2**i : numb;
	}
	return binArr;
}

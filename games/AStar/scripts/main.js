let canvas = document.getElementById('gameCanvas');
let ctx;

var State = {
	unchecked: 1,
	checked: 2,
	calculated: 3,
	used: 4,
	wall: 5
};

let createWalls = false;
let removeWalls = false;

let boxColor = {
	1: 'white',
	2: 'red',
	3: 'blue',
	4: 'green',
	5: 'black'
}

let numXPoints;
let numYPoints;

let BOX_WIDTH;
let BOX_HEIGHT;

let start;
let end;
let pathLength;
let checkedPoints;
let LINES;
let points;
let reachedEnd;
let lastDrawnLine;

let chosenPreset = presets[0];

let interval;

function reinitialize(index) {
	if(index != null) {
		chosenPreset = presets[index];
	}
	clearInterval(interval);
	initialize();
	clearScreen();
	drawSquares();
}

window.onload = (() => {
	ctx = canvas.getContext('2d');
	clearScreen();
	for (let preset of presets) {
		$("#presets").append(
			`<option value="${preset.name}">
				${preset.name}
			</option>`);
	}
	initialize();
	drawSquares();
	beginPathing();
});

function beginPathing() {
	interval = setInterval(function() {
		if(!reachedEnd) {
			pathingV2();
		} else {
			drawPath();
		}
	}, 0);
}

function initialize() {
	numXPoints = chosenPreset.numXPoints;
	numYPoints = chosenPreset.numYPoints;

	BOX_WIDTH = (canvas.width / numXPoints);
	BOX_HEIGHT = (canvas.height / numYPoints)

	start = chosenPreset.start;
	end = chosenPreset.end;

	pathLength = 0;
	checkedPoints = [];
	LINES = [];
	reachedEnd = false;
	lastDrawnLine = {};

	points = new Array(numXPoints);
	for (let i = 0; i < numXPoints; i++) {
		points[i] = new Array(numYPoints);
		for (let j = 0; j < numYPoints; j++) {
			if(i === start.x && j === start.y) {
				points[i][j] = {
					x: i,
					y: j,
					lengthFromStart: 0,
					lengthToEnd: Math.round(10*Math.sqrt((end.x - start.x)**2 + (end.y - start.y)**2))/10,
					state: State.checked
				}
				checkedPoints.push({
					x: i,
					y: j
				});
			} else if(i === end.x && j === end.y) {
				points[i][j] = {
					x: i,
					y: j,
					lengthFromStart: Math.round(10*Math.sqrt((end.x - start.x)**2 + (end.y - start.y)**2))/10,
					lengthToEnd: 0,
					state: State.unchecked
				}
			} else if (isWall(i, j)) {
				points[i][j] = {
					x: i,
					y: j,
					lengthFromStart: 0,
					lengthToEnd: 0,
					state: State.wall
				};
			} else {
				points[i][j] = {
					x: i,
					y: j,
					lengthFromStart: 0,
					lengthToEnd: 0,
					state: State.unchecked
				};
			}
		}
	}
}

function isWall(x, y) {
	let isItWall = false
	chosenPreset.walls.forEach(wall => {
		for(let i = 0; i <= 5; i++) {
			for(let j = 0; j <= 5; j++) {
				if(x >= wall.minX + 25 * i && x <= wall.maxX + 25 * i && y >= wall.minY + 25 * j && y <= wall.maxY+ 25 * j ) {
					isItWall = true;
					return;
				}
			}
		}
	});
	if(x === 0 || x === numXPoints - 1 || y === 0 || y === numYPoints - 1) {
		isItWall = true;
	}
	return isItWall;
}

//Regular A* with heuristic being distance from point to end
function pathingV1() {
	let lowestChecked = {};
	let valueOfLowestCheck = -1;
	for (let i = 0; i < numXPoints; i++) {
		for (let j = 0; j < numYPoints; j++) {
			if(points[i][j].state === State.checked) {
				if(valueOfLowestCheck < 0 || valueOfLowestCheck > points[i][j].lengthFromStart + points[i][j].lengthToEnd) {
					lowestChecked = points[i][j];
					valueOfLowestCheck = points[i][j].lengthFromStart + points[i][j].lengthToEnd;
				} else if (valueOfLowestCheck === points[i][j].lengthFromStart + points[i][j].lengthToEnd && lowestChecked.lengthToEnd > points[i][j].lengthToEnd) {
					lowestChecked = points[i][j];
					valueOfLowestCheck = points[i][j].lengthFromStart + points[i][j].lengthToEnd;
				}
			}
		}
	}
	//look at the 8 points around your point
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			if(i != 0 || j != 0) {
				currentPoint = points[lowestChecked.x + i][lowestChecked.y + j];
				let lengthFromLowest = dist(lowestChecked, currentPoint);
				if(currentPoint.state === State.unchecked) {
					currentPoint = {
						x: lowestChecked.x + i,
						y: lowestChecked.y + j,
						lengthFromStart: (lengthFromLowest + lowestChecked.lengthFromStart),
						lengthToEnd: dist(currentPoint, end),
						state: State.checked
					};
				} else if(currentPoint.state === State.checked && currentPoint.lengthFromStart > lengthFromLowest + lowestChecked.lengthFromStart) {
					currentPoint.lengthFromStart = lengthFromLowest + lowestChecked.lengthFromStart;
				}
				points[lowestChecked.x + i][lowestChecked.y + j] = currentPoint;
			}
			drawSquare(points[lowestChecked.x + i][lowestChecked.y + j]);
		}
	}
	if (lowestChecked.x === end.x && lowestChecked.y === end.y) {
		reachedEnd = true;
		lastDrawnLine = {
			x: end.x,
			y: end.y,
			lengthFromStart: lowestChecked.lengthFromStart
		}
	}
	lowestChecked.state = State.calculated;
	drawSquare(points[lowestChecked.x][lowestChecked.y]);
}

//Same as pathing V1 but with more emphasis on distance from end and less on distance from start
function pathingV2() {
	let lowestChecked = {};
	let valueOfLowestCheck = -1;
	for (let i = 0; i < numXPoints; i++) {
		for (let j = 0; j < numYPoints; j++) {
			if(points[i][j].state === State.checked) {
				if(valueOfLowestCheck < 0 || valueOfLowestCheck > points[i][j].lengthFromStart + points[i][j].lengthToEnd) {
					lowestChecked = points[i][j];
					valueOfLowestCheck = points[i][j].lengthFromStart + points[i][j].lengthToEnd;
				} else if (valueOfLowestCheck === points[i][j].lengthFromStart + points[i][j].lengthToEnd && lowestChecked.lengthToEnd > points[i][j].lengthToEnd) {
					lowestChecked = points[i][j];
					valueOfLowestCheck = points[i][j].lengthFromStart + points[i][j].lengthToEnd;
				}
			}
		}
	}
	//look at the 8 points around your point
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			if((i === 0 || j === 0) && (i + j != 0)) {
				currentPoint = points[lowestChecked.x + i][lowestChecked.y + j];
				let lengthFromLowest = dist(lowestChecked, currentPoint);
				if(currentPoint.state === State.unchecked) {
					currentPoint = {
						x: lowestChecked.x + i,
						y: lowestChecked.y + j,
						lengthFromStart: (lengthFromLowest/10 + lowestChecked.lengthFromStart),
						lengthToEnd: dist(currentPoint, end),
						state: State.checked
					};
				} else if(currentPoint.state === State.checked && currentPoint.lengthFromStart > lengthFromLowest + lowestChecked.lengthFromStart) {
					currentPoint.lengthFromStart = lengthFromLowest + lowestChecked.lengthFromStart;
				}
				points[lowestChecked.x + i][lowestChecked.y + j] = currentPoint;
			}
			drawSquare(points[lowestChecked.x + i][lowestChecked.y + j]);
		}
	}
	if (lowestChecked.x === end.x && lowestChecked.y === end.y) {
		reachedEnd = true;
		lastDrawnLine = {
			x: end.x,
			y: end.y,
			lengthFromStart: lowestChecked.lengthFromStart
		}
	}
	lowestChecked.state = State.calculated;
	drawSquare(points[lowestChecked.x][lowestChecked.y]);
}

function pathingV3() {
	let lowestCheckedIndex = 0;
	let lowestLTE = -1;
	let valueOfLowestChecked = -1;
	checkedPoints.forEach((cp,i) => {
		let lfs = points[cp.x][cp.y].lengthFromStart;
		let lte = points[cp.x][cp.y].lengthToEnd;
		if(valueOfLowestChecked < 0 || valueOfLowestChecked > lfs + lte) {
			lowestCheckedIndex = i;
			valueOfLowestChecked = lfs + lte;
			lowestLTE = lte;
		} else if (valueOfLowestChecked === lfs + lte && lowestLTE > lte) {
			lowestCheckedIndex = i;
			valueOfLowestChecked = lfs + lte;
		}
	});

	let lowestChecked = checkedPoints[lowestCheckedIndex];
	//look at the 8 points around your point
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			if(i != 0 || j != 0) {
				currentPoint = points[lowestChecked.x + i][lowestChecked.y + j];
				let lengthFromLowest = dist(lowestChecked, currentPoint);
				if(currentPoint.state === State.unchecked) {
					currentPoint = {
						x: lowestChecked.x + i,
						y: lowestChecked.y + j,
						lengthFromStart: lengthFromLowest + lowestChecked.lengthFromStart,
						lengthToEnd: dist(currentPoint, end),
						state: State.checked
					};
					checkedPoints.push({
						x: lowestChecked.x + i,
						y: lowestChecked.y + j
					});
				} else if(currentPoint.state === State.checked && currentPoint.lengthFromStart > lengthFromLowest + lowestChecked.lengthFromStart) {
					currentPoint.lengthFromStart = lengthFromLowest + lowestChecked.lengthFromStart;
				}
				points[lowestChecked.x + i][lowestChecked.y + j] = currentPoint;
			}
			drawSquare(points[lowestChecked.x + i][lowestChecked.y + j]);
		}
	}
	if (lowestChecked.x === end.x && lowestChecked.y === end.y) {
		reachedEnd = true;
		lastDrawnLine = {
			x: end.x,
			y: end.y,
			lengthFromStart: lowestChecked.lengthFromStart
		}
	}
	console.log(checkedPoints)
	points[lowestChecked.x][lowestChecked.y].state = State.calculated;
	drawSquare(points[lowestChecked.x][lowestChecked.y]);
	checkedPoints.splice(lowestCheckedIndex, 1);
}

function drawPath() {
	let closestToStart = {
		x: lastDrawnLine.x,
		y: lastDrawnLine.y,
		lengthFromStart: lastDrawnLine.lengthFromStart
	};
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			if(i != 0 || j != 0) {
				currentPoint = points[lastDrawnLine.x + i][lastDrawnLine.y + j];
				if (currentPoint.lengthFromStart < closestToStart.lengthFromStart && currentPoint.state != State.unchecked && currentPoint.state != State.wall) {
					closestToStart = {
						x: currentPoint.x,
						y: currentPoint.y,
						lengthFromStart: currentPoint.lengthFromStart
					}
				}
			}
		}
	}
	points[lastDrawnLine.x][lastDrawnLine.y].state = State.used;
	drawSquare(points[lastDrawnLine.x][lastDrawnLine.y]);
	LINES.push({
		from: {
			x: lastDrawnLine.x * (canvas.width / numXPoints) + (BOX_WIDTH / 2),
			y: lastDrawnLine.y * (canvas.height / numYPoints) + (BOX_HEIGHT / 2)
		},
		to: {
			x: closestToStart.x * (canvas.width / numXPoints) + (BOX_WIDTH / 2),
			y: closestToStart.y * (canvas.height / numYPoints) + (BOX_HEIGHT / 2)
		}
	})
	LINES.forEach(line => {
		ctx.beginPath();
		ctx.lineWidth = "2";
		ctx.moveTo(line.from.x, line.from.y);
		ctx.lineTo(line.to.x, line.to.y);
		ctx.stroke();
	});
	pathLength += dist(lastDrawnLine, closestToStart);
	lastDrawnLine = {
		x: closestToStart.x,
		y: closestToStart.y,
		lengthFromStart: closestToStart.lengthFromStart
	}
	document.getElementById("pathLength").innerHTML="Length: " + pathLength;
}

function dist(p1, p2) {
	return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
}

function drawSquares() {
	for (let i = 0; i < numXPoints; i++) {
		for (let j = 0; j < numYPoints; j++) {
			drawSquare(points[i][j]);
		}
	}
}

function drawSquare(point) {
	let startX = point.x * (canvas.width / numXPoints);
	let startY = point.y * (canvas.height / numYPoints);
	ctx.beginPath();
	ctx.lineWidth = '1';
	ctx.fillStyle = boxColor[point.state];
	ctx.strokeStyle = "black";
	ctx.rect(startX + 1, startY + 1, BOX_WIDTH - 1, BOX_HEIGHT - 1);
	ctx.stroke();
	ctx.fill();
	//scoreText(point);
}

function scoreText(point) {
	ctx.fillStyle = point.state === State.wall ? "black" : "white";
	ctx.font = "2px Arial";
	ctx.textAlign = "center";
	let sum = point.lengthFromStart + point.lengthToEnd;
	ctx.fillText(Math.round(10*sum) / 10, point.x * (canvas.width / numXPoints) + (BOX_WIDTH / 2) , point.y * (canvas.height / numYPoints) + (BOX_HEIGHT / 2) + 5);
}

function clearScreen() {
	ctx.fillStyle = 'white';
	ctx.fillRect(0,0 ,canvas.width,canvas.height);
}

canvas.onmousemove = function(e) {
  // important: correct mouse position:
  let rect = this.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

	let i = Math.floor(x / BOX_WIDTH);
	let j = Math.floor(y / BOX_HEIGHT);
	let point = points[i][j];
	document.getElementById("x").innerHTML="X: " + point.x;
	document.getElementById("y").innerHTML="Y: " + point.y;
	document.getElementById("lengthFromStart").innerHTML="Length From Start: " + point.lengthFromStart;
	document.getElementById("lengthToEnd").innerHTML="Length To End: " + point.lengthToEnd;
	toggleWall(point);
};

canvas.onmousedown = function(e) {
  // important: correct mouse position:
  let rect = this.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

	let i = Math.floor(x / BOX_WIDTH);
	let j = Math.floor(y / BOX_HEIGHT);
	let point = points[i][j];
	if (point.state === State.wall) {
		removeWalls = true;
	} else {
		createWalls = true;
	}
	toggleWall(point);
};

canvas.onmouseup = function(e) {
  // important: correct mouse position:
  let rect = this.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

	let i = Math.floor(x / BOX_WIDTH);
	let j = Math.floor(y / BOX_HEIGHT);
	let point = points[i][j];
	removeWalls = false;
	createWalls = false;
};

function toggleWall(point) {
	if (removeWalls && point.state === State.wall) {
		point.state = State.unchecked;
		drawSquare(point)
	}
	if (createWalls && point.state != State.wall) {
		point.state = State.wall;
		drawSquare(point)
	}
}

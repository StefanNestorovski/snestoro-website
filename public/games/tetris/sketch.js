const pieces = [];
let activePiece;
let interval;

let size = 15;

let squares = new Array(40);
for (let squareRow of squares) {
    squareRow = new Array (20);
}

function setup() {
    createCanvas(300,600);
    stroke(255);
    noFill(0);

    activePiece = new TetrisPiece();

    interval = setInterval(() => {
        for (let piece of pieces) {
            piece.move();
        }
        activePiece.move();
    }, 100);

    setInterval(() => {
        pieces.push(activePiece);
        activePiece = new TetrisPiece();
    }, 2000);
}

function draw() {
    background(0);
    for (let piece of pieces) {
        piece.draw();
    }
    if (activePiece) {
        activePiece.draw();
    }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    activePiece.x--;
  } else if (keyCode === RIGHT_ARROW) {
    activePiece.x++;
  }
}

// Utilities

function collision() {
    if (activePiece.y) {

    }
}

// Classes

class TetrisPiece {
    constructor() {
        this.type = Math.floor(Math.random() * 5);
        this.x = 10;
        this.y = 0;
    }

    draw() {
        switch(this.type) {
            case 0:
                rect((this.x) * size, (this.y) * size, size, size);
                rect((this.x) * size, (this.y - 1) * size, size, size);
                rect((this.x) * size, (this.y - 2) * size, size, size);
                rect((this.x) * size, (this.y - 3) * size, size, size);
                break;
            case 1:
                rect((this.x - 1) * size, (this.y - 1) * size, size, size);
                rect((this.x - 1) * size, (this.y) * size, size, size);
                rect((this.x) * size, (this.y) * size, size, size);
                rect((this.x + 1) * size, (this.y) * size, size, size);
                break;
            case 2:
                rect((this.x - 1) * size, (this.y) * size, size, size);
                rect((this.x) * size, (this.y) * size, size, size);
                rect((this.x + 1) * size, (this.y) * size, size, size);
                rect((this.x + 1) * size, (this.y + 1) * size, size, size);
                break;
            case 3:
                rect((this.x - 1) * size, (this.y - 1) * size, size, size);
                rect((this.x - 1) * size, (this.y) * size, size, size);
                rect((this.x) * size, (this.y - 1) * size, size, size);
                rect((this.x) * size, (this.y) * size, size, size);
                break;
            case 4:
                rect((this.x - 1) * size, (this.y) * size, size, size);
                rect((this.x) * size, (this.y) * size, size, size);
                rect((this.x) * size, (this.y - 1) * size, size, size);
                rect((this.x + 1) * size, (this.y - 1) * size, size, size);
                break;
        }
    }

    move() {
        this.y++;
    }
}
var background1 = new Image();
background1.src = 'background1.png';
var background1canvas;

var background2 = new Image();
background2.src = 'background2.png';
var background2canvas;

var background3 = new Image();
background3.src = 'background3.png';
var background3canvas;

var ship1 = new Image();
ship1.src = 'ship1.png';
var ship1canvas;

var laserShot = new Audio('shot.wav');

var canvas;
var context;

var ship;
var bullets = [];

var globalX = 0;
var globalY = 0;

window.onload = function(){
	canvas = document.getElementById('gameCanvas');
	context = canvas.getContext('2d');
	
	background1canvas = document.createElement("canvas");
	background1canvas.width = background1.width;
	background1canvas.height = background1.height;
	background1canvas.getContext("2d").drawImage(background1, 0, 0);
	
	background2canvas = document.createElement("canvas");
	background2canvas.width = background2.width;
	background2canvas.height = background2.height;
	background2canvas.getContext("2d").drawImage(background2, 0, 0);
	
	background3canvas = document.createElement("canvas");
	background3canvas.width = background3.width;
	background3canvas.height = background3.height;
	background3canvas.getContext("2d").drawImage(background3, 0, 0);
	
	ship1canvas = document.createElement("canvas");
	ship1canvas.width = ship1.width;
	ship1canvas.height = ship1.height;
	ship1canvas.getContext("2d").drawImage(ship1, 0, 0);
	
	ship = ship();
	
	setInterval(gameLoop, 20);
}

var map = {}; // You could also use an array
onkeydown = onkeyup = function(e){
	e = e || event; // to deal with IE
	map[e.keyCode] = e.type == 'keydown';
}
	
function gameLoop() {
	renderBackground();
	
	for(var i = 0; i < bullets.length; i++){
		bullets[i].update();
		bullets[i].render();
	}
	
	ship.render();
	
	context.fillStyle = 'white';
	context.fillText('Use arrow keys to move around',10,10)
	context.fillText('Use space to shoot',10,20)
	
	if(map[32]){//space bar
		ship.shootLaser();
	}
	if(map[37]){//left
		ship.rotCC();
	}
	if(map[39]){//right
		ship.rotC();
	}
	if(map[38]){//up
		ship.moveForward();
	}
	if(map[40]){//down
		ship.moveBackward();
	}
}

function renderBackground() {
	for(var i = -1; i <= 1; i++){
		for(var j = -1; j <= 1; j++){
			context.drawImage(background1canvas, i*background1canvas.width + (globalX%background1canvas.width)*1, j*background1canvas.width + (globalY%background1canvas.height)*1);
		}
	}
	for(var i = -1; i <= 1; i++){
		for(var j = -1; j <= 1; j++){
			context.drawImage(background2canvas, i*background2canvas.width + (globalX%(background2canvas.width/2))*2, j*background2canvas.width + (globalY%(background2canvas.height/2))*2);
		}
	}
	for(var i = -1; i <= 1; i++){
		for(var j = -1; j <= 1; j++){
			context.drawImage(background3canvas, i*background3canvas.width + (globalX%(background3canvas.width/4))*4, j*background3canvas.width + (globalY%(background3canvas.height/4))*4);
		}
	}
}

function ship() {
	var that = {};
	that.rotation = 0;
	that.speed = 10;
	that.size = 1;
	that.reload = 0;
		
	that.moveForward = function (){
		var rotRad = that.rotation*Math.PI/180;
		
		globalX -= that.speed*Math.sin(rotRad);
		globalY += that.speed*Math.cos(rotRad);
	}
	
	that.moveBackward = function (){
		var rotRad = that.rotation*Math.PI/180;
		
		globalX += that.speed*Math.sin(rotRad);
		globalY -= that.speed*Math.cos(rotRad);
	}
	
	that.rotC = function (){
		that.rotation += 3;
	}
	
	that.rotCC = function (){
		that.rotation -= 3;
	}
	
	that.shootLaser = function (){
		if(!that.reload > 0){
			var b = bullet({
				rotation: that.rotation
				});
				
			bullets.push(b);
			laserShot.load();
			laserShot.play();
			that.reload = 10;
		}
	}
	
	that.render = function (){
		if(that.reload > 0) that.reload--;
		
		context.translate(canvas.width/2, canvas.height/2);
		context.rotate(that.rotation*Math.PI/180);
		context.drawImage(ship1canvas, -ship1canvas.width/2, -ship1canvas.height/2);
		context.rotate(-that.rotation*Math.PI/180);
		context.translate(-(canvas.width/2), -(canvas.height/2));
	}
	
	return that;
}

function bullet(values) {
	var that = {};
	that.rotation = values.rotation;
	that.speed = 30;
	that.size = 1;
	that.xShot = globalX - canvas.width/2;
	that.yShot = globalY - canvas.height/2;
	that.dist = -5;
	that.width = 10;
	that.length = 60;
	
	that.update = function (){
		that.dist -= that.speed;
	}
	
	that.render = function (){
		context.translate(globalX-that.xShot, globalY-that.yShot);
		context.rotate(that.rotation*Math.PI/180);
		context.fillStyle = 'white';
		context.fillRect(-that.width/2, that.dist-ship1canvas.height/2, that.width, that.length);
		context.rotate(-that.rotation*Math.PI/180);
		context.translate(-(globalX-that.xShot), -(globalY-that.yShot));
	}
	return that;
}
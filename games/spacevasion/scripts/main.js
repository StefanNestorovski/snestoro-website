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

var enemy1 = new Image();
enemy1.src = 'ship2.png';
var enemy1canvas;

var youDied = new Image();
youDied.src = 'youdied.png';

var laserShot = new Audio('shot.wav');

var canvas;
var context;

var ship;
var bullets = [];
var enemies = [];

var globalX = 0;
var globalY = 0;
var score = 0;
var isDead = false;
var deadLength = 0;

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
	
	enemy1canvas = document.createElement("canvas");
	enemy1canvas.width = enemy1.width;
	enemy1canvas.height = enemy1.height;
	enemy1canvas.getContext("2d").drawImage(enemy1, 0, 0);
	
	ship = ship();
	
	setInterval(gameLoop, 20);
	setInterval(createEnemy,500);
}

function createEnemy(){
	var e = enemy(enemies.length);
	enemies.push(e);
}

var map = {}; // You could also use an array
onkeydown = onkeyup = function(e){
	e = e || event; // to deal with IE
	map[e.keyCode] = e.type == 'keydown';
}
	
function gameLoop() {
	if(!isDead){
		renderBackground();
		hitEnemy();
		
		for(var i = 0; i < bullets.length; i++){
			bullets[i].update();
			bullets[i].render();
		}
		
		for(var i = 0; i < enemies.length; i++){
			enemies[i].render();
		}
		
		ship.render();
		
		context.fillStyle = 'white';
		context.font = '10px Verdana';
		context.fillText('Use arrow keys to move around',10,10)
		context.fillText('Use space to shoot',10,20)
		context.fillText('Score: ' + score,10,30);
	}else{
		deadLength++;
		context.drawImage(youDied, 0, 100, 800, 200);
		context.font = '20px Verdana';
		context.fillText('Your score was: ' + score, 300,560);
		context.fillText('Press space to play again', 260,600);
	}
	
	if(map[32]){//space bar
		ship.shootLaser();
		if(deadLength > 50){
			isDead = false;
			globalX = 0;
			globalY = 0;
			score = 0;
			deadLength = 0;
			enemies = [];
			bullets = [];
		}
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

function hitEnemy(){
	for(var i = 0; i < enemies.length; i++){
		for(var j = 0; j < bullets.length; j++){
			//50px hitbox for enemy, 10px hitbox for bullet
			var bulletX = bullets[j].globalPosX + globalX;
			var bulletY = bullets[j].globalPosY + globalY;
			var enemyX = enemies[i].globalPosX + globalX - 30;
			var enemyY = enemies[i].globalPosY + globalY - 30;
			
			if(bulletX > enemyX && bulletX < enemyX + 50 && bulletY > enemyY && bulletY < enemyY + 50){
				bullets[j].dead = true;
				enemies[i].dead = true;
			}				
		}
	}
	for(var i = 0; i < enemies.length; i++){
		
		if(enemies[i].dead){
			enemies.splice(i,1);
			score++;
		}else{
			var enemyX = enemies[i].globalPosX + globalX - 30;
			var enemyY = enemies[i].globalPosY + globalY - 30;
			if(canvas.width/2-10 < enemyX + 60 && canvas.width/2+10 > enemyX && canvas.height/2-10 < enemyY + 60 && canvas.height/2+10 > enemyY){
				isDead = true; 
			}
		}
	}
	for(var i = 0; j < bullets.length; i++){
		if(bullets[i].dead){
			bullets.splice(i,1);
		}
	}
}

function ship() {
	var that = {};
	that.rotation = 0;
	that.speed = 10;
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
		that.rotation += 5;
	}
	
	that.rotCC = function (){
		that.rotation -= 5;
	}
	
	that.shootLaser = function (){
		if(!that.reload > 0){
			var b = bullet({
				rotation: that.rotation,
				i: bullets.length
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

function enemy(i){
	var that = {};
	that.rotation = Math.random()*360;
	that.speed = 8;
	that.reload = 0;
	that.x = Math.floor(Math.random()*2) * canvas.width - globalX;
	that.y = Math.floor(Math.random()*2) * canvas.height - globalY;
	that.dead = false;
	that.rotRad = that.rotation*Math.PI/180;
	that.globalPosX = that.x + 5*Math.sin(that.rotRad);
	that.globalPosY = that.y - 5*Math.cos(that.rotRad);
	
	that.moveForward = function (){		
		that.x += that.speed*Math.sin(that.rotRad);
		that.y -= that.speed*Math.cos(that.rotRad);
		
		that.globalPosX += that.speed*Math.sin(that.rotRad);
		that.globalPosY -= that.speed*Math.cos(that.rotRad);
	}
	
	that.rotC = function (){
		that.rotation += 3;
		that.rotRad = that.rotation*Math.PI/180;
	}
	
	that.rotCC = function (){
		that.rotation -= 3;
		that.rotRad = that.rotation*Math.PI/180;
	}
	
	that.render = function (){
		if(!that.dead){
			that.moveForward();
			Math.random() >= 0.5 ? that.rotC() : that.rotCC();
			
			if(that.reload > 0) that.reload--;
			
			context.translate(that.x + globalX, that.y + globalY);
			context.rotate(that.rotation*Math.PI/180);
			context.drawImage(enemy1canvas, -enemy1canvas.width/2, -enemy1canvas.height/2);		
			context.rotate(-that.rotation*Math.PI/180);
			context.translate(-(that.x + globalX), -(that.y + globalY));
		}
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
	that.dead = false;
	that.rotRad = that.rotation*Math.PI/180;
	that.globalPosX = -globalX + canvas.width/2 + 30*Math.sin(that.rotRad);
	that.globalPosY = -globalY + canvas.height/2 - 30*Math.cos(that.rotRad);
	
	that.update = function (){
		that.dist -= that.speed;
		
		that.globalPosX += that.speed*Math.sin(that.rotRad);
		that.globalPosY -= that.speed*Math.cos(that.rotRad);
	}
	
	that.render = function (){
		if(!that.dead){
			context.translate(globalX-that.xShot, globalY-that.yShot);
			context.rotate(that.rotation*Math.PI/180);
			context.fillStyle = 'white';
			context.fillRect(-that.width/2, that.dist-ship1canvas.height/2, that.width, that.length);
			context.rotate(-that.rotation*Math.PI/180);
			context.translate(-(globalX-that.xShot), -(globalY-that.yShot));
		}
	}
	return that;
}
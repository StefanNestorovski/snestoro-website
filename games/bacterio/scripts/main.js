var canvas;
var context;
//800 by 800

var initBacterias = 100;
var initFood = 2;
var deathAge = 50;
var blockSize = 10;

const gameSpeed = 100;
const renderSpeed = 20;

const rates = {
	birth: 0.9, //Higher = less births 
	death: 0.9, //Higher = less death of old age
	murder: 0.5, //Higher = less same colour murders
	eatFood: 0.97 //Higher = less food eaten
	}

const colorGroups = ['blue', 'red', 'yellow', 'green', 'black', 'pink', 'orange'];

bacterias = [];
foods = [];

function bacteria (options = 0) {
	var that = {};
	that.alive = true;
	that.deathT = 20;
	that.size = blockSize;
	that.delta = 0;
	
	if(options == 0){
		that.color = colorGroups[Math.floor(Math.random() * colorGroups.length)];
		that.x = Math.floor(Math.random() * (canvas.width / blockSize)) * blockSize;
		that.y = Math.floor(Math.random() * (canvas.height / blockSize)) * blockSize;
		that.strength = Math.random() * 20;
	}else{
		that.color = options.color;
		that.x = options.x //+ Boolean(Math.round(Math.random())) ? blockSize : -blockSize;
		that.y = options.y //+ Boolean(Math.round(Math.random())) ? blockSize : -blockSize;
		that.strength = options.strength + Math.random () * 3 - 1;
	}
	
	that.xr = that.x;
	that.yr = that.y;
	
	that.age = 0;
	
	that.update = function(){
		if(that.alive){
			that.age += Math.random();
			
			that.x += Math.floor(Math.random() * 3 - 1) * blockSize;
			that.y += Math.floor(Math.random() * 3 - 1) * blockSize;
			
			if(that.x < 0){
				that.x = 0;
			}  
			else if (that.x >= canvas.width){
				that.x = canvas.width - blockSize;
			}
			
			if(that.y < (0 + blockSize)){
				that.y = 0 + blockSize;
			}
			else if (that.y >= canvas.height){
				that.y = canvas.height - blockSize;
			}
			
			//Mans is sexually active
			if(Math.random() > rates.birth){
				if(Boolean(Math.round(Math.random())))
					that.createChild();
			}
		}
	}
	
	that.updateMovement = function(){
		
	}
	
	that.render = function(){
		if(that.alive){
			that.xr += (blockSize*renderSpeed/gameSpeed)*Math.sign(that.x - that.xr);
			that.yr += (blockSize*renderSpeed/gameSpeed)*Math.sign(that.y - that.yr);
		}else{	
			that.delta = ((that.size/that.deathT) + 0.3)/2;
			that.size -= that.delta*2;
			that.xr += that.delta;
			that.yr += that.delta;
		}
		
		context.fillStyle = that.color;
		context.fillRect(that.xr, that.yr, that.size, that.size);
		
		//if(that.alive){
			//context.fillStyle = 'white'
			//context.fillText(Math.floor(this.strength), that.xr, that.yr+10);
			//context.fillText(Math.floor(this.age), that.xr, that.yr+20);
		//}
	}
	
	that.createChild = function() {
		var child = bacteria({
			color: that.color,
			x: that.x,
			y: that.y,
			strength: that.strength
			});
		bacterias.push(child);
	}
	
	return that;
}

function food () {
	var that = {};
	that.x = Math.floor(Math.random() * (canvas.width / blockSize)) * blockSize;
	that.y =  Math.floor(Math.random() * (canvas.height / blockSize)) * blockSize;
	that.size = 60;
	
	that.update = function () {
	}
	
	that.render = function () {
		context.fillStyle = 'black';
		context.beginPath();
		context.arc(that.x,that.y,that.size,0,2*Math.PI);
		context.fill();
	}
	
	that.eaten = function () {
		that.size -= 2;
	}
	
	return that;
}

window.onload = function(){
	canvas = document.getElementById('gameCanvas');
	context = canvas.getContext('2d');

	//Create the initial bacterias
	for(var i = 0; i < initBacterias; i++){
		bacterias.push(bacteria());
	}
	
	for(var i = 0; i < initFood; i++){
		foods.push(food());
	}
	
	setInterval(gameLoop, gameSpeed);
	setInterval(drawAll, renderSpeed);
};

function drawAll(){
	clearScreen();
	for(var i = 0; i < bacterias.length; i++){
		//bacterias[i].updateMovement();
		bacterias[i].render();
	}
	for(var i = 0; i < foods.length; i++){
		foods[i].render();
	}
	context.fillStyle = 'black'
	context.fillText("bacterias: " + bacterias.length,10,10);
}

function gameLoop(){
	for(var i = 0; i < bacterias.length; i++){
		bacterias[i].update();
	}
	checkCollisions();
	checkFood();
	removeNodes();
}

function checkCollisions(){
	for(var i = 0; i < bacterias.length; i++){
		for(var j = 0; j < bacterias.length; j++){
			if(i != j){
				if(bacterias[i].alive && bacterias[j].alive && 
				Math.abs(bacterias[i].xr - bacterias[j].xr) < blockSize*0.75 && 
				Math.abs(bacterias[i].yr - bacterias[j].yr) < blockSize*0.75){
					
					//See who should win, different colors always fight, same colour only sometimes
					if(bacterias[i].color != bacterias[j].color){
						compareStrength(bacterias[i], bacterias[j], i, j);
					}else{
						if(Math.random() > rates.murder){
							compareStrength(bacterias[i], bacterias[j], i, j);		
						}
					}
				}
			}
		}
		//Starting at the age of 80, they are able to die of old age
		if(bacterias[i].age > deathAge && Math.random() > rates.death){
			bacterias[i].alive = false;
		}
	}
}

function checkFood(){
	for(var i = 0; i < bacterias.length; i++){
		for(var j = 0; j < foods.length; j++){
			if(Math.sqrt(Math.pow(bacterias[i].xr - foods[j].x,2) + Math.pow(bacterias[i].yr - foods[j].y,2)) < foods[j].size ||
			Math.sqrt(Math.pow(bacterias[i].xr + blockSize - foods[j].x,2) + Math.pow(bacterias[i].yr - foods[j].y,2)) < foods[j].size ||
			Math.sqrt(Math.pow(bacterias[i].xr - foods[j].x,2) + Math.pow(bacterias[i].yr + blockSize - foods[j].y,2)) < foods[j].size ||
			Math.sqrt(Math.pow(bacterias[i].xr + blockSize - foods[j].x,2) + Math.pow(bacterias[i].yr + blockSize - foods[j].y,2)) < foods[j].size){
				if(Math.random() > rates.eatFood){
					foods[j].eaten();
					bacterias[i].strength++;
				}
			}
		}
	}
}

function compareStrength(b1 , b2){
	if(b1.strength > b2.strength){
		b2.alive = false;
	}else if(b1.strength < b2.stregth){
		b1.alive = false;
	}else{
		if(b1.age < b2.age){
			b2.alive = false;
		}else if(b1.age > b2.age){
			b1.alive = false;
		}
	}
}

function removeNodes(i){
	for(var i = 0; i < bacterias.length; i++){
		if(bacterias[i].size <= 0)
			bacterias.splice(i, 1);
	}
}

function clearScreen(){
	context.fillStyle = 'white';
    context.fillRect(0,0 ,canvas.width,canvas.height);
}
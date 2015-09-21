var canvas;
var canvasContext;
var ballX = 400;
var ballY = 300;
var ballSpeedX = 5;
var ballSpeedY = 2;
const RADIUS = 10;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;
var startScreen = true;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

function handleMouseClick(evt) {
	if(startScreen) {
		startScreen = false;
	}

	if(showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}
window.onload = function(){
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	//draw frame how many times per second
	var framesPerSecond = 60;

	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000 / framesPerSecond);

	canvas.addEventListener('mousedown', handleMouseClick);

	canvas.addEventListener('mousemove', 
		function(evt) {
			var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
		});
}

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function ballReset() {
	if(player1Score >= WINNING_SCORE ||
	   player2Score >= WINNING_SCORE) {
		showingWinScreen = true;
	}

	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function computerMovement() {
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT)/2;
	if(paddle2YCenter < ballY - 35) {
		paddle2Y += 6;
	} else if(paddle2YCenter > ballY + 35){
		paddle2Y -= 6;
	}
}

function moveEverything() {
	if(showingWinScreen || startScreen) {
		return;
	}
	computerMovement();
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if(ballX - RADIUS < PADDLE_THICKNESS) {
		if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.2;
		}
		else {
			player2Score++;	//must before ballReset
			ballReset();	
		}
	}

	if(ballX + RADIUS > canvas.width - PADDLE_THICKNESS) {
		if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.2;
		}
		else {
			player1Score++;
			ballReset();	
		}
	}

	if(ballY - RADIUS < 0) {
		ballSpeedY = -ballSpeedY;
	}
	if(ballY + RADIUS > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet() {
	for(var i = 0; i < canvas.height; i += 40){
		colorRect(canvas.width/2 - 1, i, 2, 20, "white");
	}
}

function drawEverything() {
	//next line blanks out the screen with black
	colorRect(0,0,canvas.width,canvas.height,'black');

	if(showingWinScreen) {
		canvasContext.fillStyle = "red";
		canvasContext.font = "20px Georgia";
		canvasContext.textAlign = "center";
		if(player1Score >= WINNING_SCORE){
			canvasContext.fillText("You Won!", 400, 100);
		} else if(player2Score >= WINNING_SCORE){
			canvasContext.fillText("Computer Won!", 400, 120);
		}
		canvasContext.fillStyle = "white";
		canvasContext.font = "15px Georgia";
		canvasContext.fillText("click to continue", 400, 520);
		return;
	}

	if(startScreen) {
		canvasContext.fillStyle = "white";
		canvasContext.font = "15px Georgia";
		canvasContext.textAlign = "center";
		canvasContext.fillText("click to start", 400, 300);
		return;
	}

	drawNet();
	
	//next line is left player paddle
	colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

	//next line is computer paddle
	colorRect(canvas.width - PADDLE_THICKNESS,paddle2Y,
		PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

	//next line draws the ball
	colorCircle(ballX,ballY,RADIUS,'white');

	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, 2*Math.PI, true);
	canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawcolor) {
	canvasContext.fillStyle = drawcolor;
	canvasContext.fillRect(leftX, topY, width, height);
}
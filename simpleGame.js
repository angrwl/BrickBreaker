
// https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Move_the_ball
// These are global variables accessed by any function

let canvas = document.getElementById('myCanvas'); //creates a variable canvas in JS under the id name of myCanvas
let ctx = canvas.getContext('2d'); //tells JS that this canvas is of style '2D' not other styles
let ballRadius = 20;
let x = canvas.width/2; //assigning x and y value for the centre of the ball
let y = canvas.height-50;  //y value is equal to the height of canvas - some number so its not directly at the bottom (note y starts from top-left)
let dx = (Math.round(Math.random()) * 2 - 1)*((Math.random() * 2) + 2); //change in x and y value (i.e. no. of px)
let dy = -((Math.random() * 2) + 2); //generate randomly (Math.round(Math.random()) * 2 - 1) gives -1 or 1

// setting up bricks
var brickRowCount = 4;  //number of rows
var brickColumnCount = 5; // number of columns
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brickPadding = 10; //difference between adjacent bricks
var brickWidth = (canvas.width - (brickColumnCount-2)*brickOffsetLeft - 2*brickPadding)/brickColumnCount;
var brickHeight = 25;
var brickcolours = ['orange','green','red','magenta','blue'];  // different colours for bricks

// Now we will draw the paddle
let paddleImage = new Image();
paddleImage.src = 'untitled.png'
let paddleHeight = 35;
let paddleWidth = 170;
let paddleX = (canvas.width-paddleWidth)/2; //centre the paddle on the canvas
let paddleY = canvas.height - paddleHeight; // to make sure paddle is at the bottom
var rightPressed = false; //boolean variables telling JS whether a key is pressed or not
var leftPressed = false;  // for both right and left key

document.addEventListener("keydown", keyDownHandler, false);  //initially set to false because we assume at the start the key is not pressed
document.addEventListener("keyup", keyUpHandler, false); // we have defined keyUp and keyDownHandler below
document.addEventListener("mousemove", mouseMoveHandler, false); //we can use our mouse to play too

function keyDownHandler(e) {
    if(e.keyCode == 39) {  //keyCode online for rightarrow key is 39
        rightPressed = true;
    }
    else if(e.keyCode == 37) { //keyCode for left key is 37
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function drawPaddle() {
  ctx.drawImage(paddleImage,paddleX, paddleY, paddleWidth, paddleHeight)
  //ctx.beginPath();
  //ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  //ctx.fillStyle = "#0095DD";
  //ctx.fill();
  //ctx.closePath();
}

function drawBall() {
  // draw a ball at a given position
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = '#f47142';
  ctx.strokeStyle = '#808080';
  ctx.lineWidth = 7;
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}
// bricks in a two-dimensional array. It will contain the brick columns (c), which in turn will contain the brick rows (r)
let bricks = []; //empty array
for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = []; //creating an empty array inside bricks
    for(let r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1}; //creating object (dictionary) inside bricks[c] at rth position
    }  // status section tells us if brick should be on the canvas or not
}

// function to draw bricks

function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status === 1) { //draws bricks iff status = 1
        var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        let index = (c+r)%5  // I did the math on paper to see that I get a diagonal coloured bricks if I choose each index as this
        ctx.fillStyle = brickcolours[index];  // I have done this to get a multicoloured bricks
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

let score = 0;
let lives = 3;

function drawScore() {
    ctx.font = "16px Arial";  //font
    ctx.fillStyle = "#0095DD"; //colour
    ctx.fillText("Score: "+score, 8, 20); //position
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

/*
for collision detection, we need to check 4 things:
The x position of the ball is greater than the x position of the brick.
The x position of the ball is less than the x position of the brick plus its width.
The y position of the ball is greater than the y position of the brick.
The y position of the ball is less than the y position of the brick plus its height.
*/

function collisionDetection() {  //detects collisions
  let noOfOnes = [];
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status == 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
          score++; //add one to each score
          if(score === brickRowCount*brickColumnCount) {
                        alert(`YOU WIN, CONGRATULATIONS!\n you have made maximum score of ${score} points`);
                        document.location.reload(); }
        }
      }
    }
  }
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clears the whole canvas frame every 10ms (as stated in setInterval)
  drawBall()
  drawScore();
  drawLives();
  //drawPause();
  // below allows the ball to bounce around in the canvas
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  // we only want to ball bounce freely on 3 sides (not the bottom)
  if(y < ballRadius) {
    dy = -dy;
  } else if (y > canvas.height-ballRadius){
    // check whether the center of the ball is between the left and right edges of the paddle.
    let eps = ballRadius; //to make sure at the edge, i do not get out in the game, so i have added some epsilon above and below
    if(x > paddleX - eps && x < paddleX + paddleWidth + eps) {
        dy = -dy;
        y -= (paddleHeight);

    }
    else { //taking care of lives
      lives--;
      if(lives===0) {
        alert(`GAME OVER !!!! \nYou have scored ${score} points`);
        document.location.reload();
      }
    else {
      x = canvas.width/2;
      y = canvas.height-30;
      dx = (Math.round(Math.random()) * 2 - 1)*((Math.random() * 2) + 2);
      dy =  -((Math.random() * 2) + 2);
      paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }
  x += dx;
  y +=dy;

  // same thing for paddle in the same function
  drawPaddle()
  if(rightPressed && paddleX < canvas.width-paddleWidth) { //checks if rightPressed===true and makes sure paddleX is less than width of canvas
    paddleX += 6;
  }
  else if(leftPressed && paddleX > 0) { //checks if leftPressed===true and x is positive
    paddleX -= 6;
    }
  drawBricks();
  collisionDetection();
  // requestAnimationFrame(draw);
  }

let pause = document.getElementById('pause');  // allows you to pause the game
pause.onclick = function () {
  alert('You have paused the gam\nClick OK to resume with the game');
}
setInterval(draw,5); // execute the draw function every 5 milliseconds
// draw();  //this is useful if I uncomment the requestAnimationFrame(draw) inside draw

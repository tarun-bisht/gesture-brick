let video;
let posenet;
let tracker = 0;
let tracker_types={
  "head":0,
  "hand":10,
  "hip":11
};
let type=tracker_types["head"];

let playerScore = 0
let paddle
let ball
let bricks
let gameState

function setup() {
  createCanvas(800, 600)
  video = createCapture(VIDEO);
  video.size(1000, 1000);
  video.hide();
  gameState='';
  let colors = createColors()
  
  paddle = new Paddle()
  ball = new Ball(paddle)

  bricks = createBricks(colors)
  poseNet = ml5.poseNet(video, modelLoaded);
}

function createColors() {
  const colors = []
  colors.push(color(265, 165, 0))
  colors.push(color(135, 206, 250))
  colors.push(color(147, 112, 219))
  for (let i = 0; i < 10; i++) {
    colors.push(color(random(0, 255), random(0, 255), random(0, 255)))
  }
  return colors
}

function createBricks(colors) {
  const bricks = []
  const rows = 10
  const bricksPerRow = 10
  const brickWidth = width / bricksPerRow
  for (let row = 0; row < rows; row++) {
    for (let i = 0; i < bricksPerRow; i++) {
      brick = new Brick(createVector(brickWidth * i, 25 * row), brickWidth, 25, colors[floor(random(0, colors.length))])
      bricks.push(brick) 
    }
  }
  return bricks
}

function draw() {
  background(0)
  for (let i = bricks.length - 1; i >= 0; i--) {
      const brick = bricks[i]
      if (brick.isColliding(ball)) {
        ball.reverse('y')
        bricks.splice(i, 1)
        playerScore += brick.points
      } else {
        brick.display()
      }
    }

    paddle.display()
    ball.display()
  
    textSize(32)
    fill(255)
    text(`Score:${playerScore}`, width - 150, 50)
  
  if(gameState === 'playing') {
    ball.bounceEdge()
    ball.bouncePaddle()
    
    ball.update()
    paddle.update()
    paddle.location.x=lerp(paddle.location.x,width-tracker,0.6);
    ellipse(paddle.location.x,height/2,20,10);


    if (ball.belowBottom()) {
      gameState = 'Lose'
    }

    if (bricks.length === 0) {
      gameState = 'Win'
    }
  } 
  else if(gameState===''){
    textSize(100)
    text(`Welcome !!!`, width / 2 - 220, height / 2)
  }
  else {
    textSize(100)
    gameState === 'Lose' ? fill(255, 0, 255) : fill(255)
    text(`You ${gameState}!!!`, width / 2 - 220, height / 2)
    button = createButton('Restart');
    button.mousePressed(gameover_console);
    button.size(150,75);
    button.style('font-size', '32px');
    button.position(width / 2 + 220, height / 3);
  }
}
function modelLoaded() {
  console.log("Model Loaded!");
  button = createButton('Play');
  button.mousePressed(game_console);
  button.size(150,75);
  button.style('font-size', '32px');
  button.position(width / 2 + 220, height / 3);
  sel = createSelect();
  sel.size(150,50);
  sel.position(width / 2 + 220, height-100);
  sel.option('head');
  sel.option('hand');
  sel.option('hip');
  sel.changed(selectEvent);
  poseNet.on("pose", function(results) {
    if (results.length > 0) {
      tracker=results[0].pose.keypoints[type].position.x;
    }
  });
}
function selectEvent() {
  type=tracker_types[sel.value()];
}
function game_console()
{
  gameState = 'playing';
  button.style('display', 'none');
  sel.style('display','none');
}
function gameover_console()
{
  location.reload();
}
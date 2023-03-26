const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const buttonCache = {}

const player = {
  x: 64,
  y: canvas.height / 2 - 100 / 2,
  width: 32,
  height: 100,
  dy: 5,
};

const wall = {
  x: canvas.width - 10 - player.width,
  y: 0,
  width: canvas.width,
  height: canvas.height,
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 32,
  height: 32,
  dx: 4,
  dy: 4,
};

function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawPlayer() {
  drawRect(player.x, player.y, player.width, player.height, "white");
}

function drawBall() {
  drawRect(ball.x, ball.y, ball.width, ball.height, "white");
}

function resetBall() {
  ball.dx = 4
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
}

function checkWallCollision() {
  // check for top wall or bottom wall collision
  if (
    ball.y <= 0 ||
    ball.y + ball.width >= canvas.height
  ) {
    ball.dy *= -1;
  }

  // right Wall collision
  if (ball.x + ball.width >= canvas.width) {
    ball.dx *= -1;
  }

  // ball outside canvas handler
  if (ball.x <= -100) {
    resetBall();
  }
}

function checkPaddleCollision() {
  if (
    // if left side of ball collides with paddle
    (ball.x === player.x + player.width) &&
    // if ball height is contained inside player height
    (ball.y >= player.y && ball.y <= player.y + player.height)
  ) {
    ball.dx *= -1;
  }
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  checkWallCollision();
  checkPaddleCollision();
}

function movePlayer() {
  if (buttonCache["ArrowUp"]) {
    if (player.y >= 0) {
      player.y -= 10
    }
  }

  if (buttonCache["ArrowDown"]) {
    if (player.y + player.height <= canvas.height) {
      player.y += 10
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBall();
  moveBall();
  movePlayer();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
  buttonCache[event.key] = true
});

document.addEventListener("keyup", (event) => {
  buttonCache[event.key] = false
});

document.getElementById("controlslider").addEventListener("input", (event) => {
  player.y = (canvas.height / 100) * event.target.value
})

gameLoop();
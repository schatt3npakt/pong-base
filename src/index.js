import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  transparent: true,
  physics: {
    default: "arcade"
  },
  scene: {
    create: create,
    update: update
  }
}

const gameConfig = {
  players: {
    speed: 5,
    sprintSpeed: 15
  },
  ball: {
    maxVelocity: 1000,
    speed: 200
  }
}

const buttonCache = {}

const game = new Phaser.Game(config)

function create() {
  // walls
  this.walls = this.physics.add.staticGroup();
  const wallTop = this.add.rectangle(0, 0, config.width, 16, 0xff0000).setOrigin(0, 0);
  const wallBottom = this.add.rectangle(0, config.height - 16, config.width, 16, 0xff0000).setOrigin(0, 0);
  const wallRight = this.add.rectangle(config.width - 16, 0, 16, config.height, 0xff0000).setOrigin(0, 0);

  this.walls.add(wallTop);
  this.walls.add(wallBottom);
  this.walls.add(wallRight);

  // balls
  this.ball = 
    this.add.rectangle(config.width/2, config.height/2, 16, 16, 0xff0000).setOrigin(0, 0);
  this.physics.add.existing(this.ball);
  this.ball.body.setVelocity(gameConfig.ball.speed, getRandomServe()).setBounce(1, 1);

  //players
  this.players = this.physics.add.staticGroup();
  this.player1 = this.add.rectangle(32, config.height/2, 16, 104, 0xff0000).setOrigin(0, 0);
  this.players.add(this.player1)

  //colliders
  this.physics.add.collider(this.ball, this.walls);
  this.physics.add.collider(this.walls, this.players);
  this.physics.add.collider(this.ball, this.players, () => {
    if (this.ball.body.velocity.x < gameConfig.ball.maxVelocity) {
      this.ball.body.velocity.x = this.ball.body.velocity.x * 1.2
      this.ball.body.velocity.y = this.ball.body.velocity.y * 1.2
    }
  });

  window.addEventListener("keydown", (event) => {
    buttonCache[event.key] = true;
  })

  window.addEventListener("keyup", (event) => {
    buttonCache[event.key] = false;
  })

  document.getElementById("controlslider").addEventListener("input", (event) => {
    this.player1.body.y = (config.height / 100) * event.target.value
    this.player1.y = (config.height / 100) * event.target.value
  })
}

function update() {
  if (this.ball.x < -32) {
    this.ball.x = config.width/2;
    this.ball.y = config.height/2;
    this.ball.body.setVelocity(gameConfig.ball.speed, getRandomServe());
  }

  // player controls
  // set sprint speed if shift is pressed
  const playerSpeed = (buttonCache["Shift"]) ? gameConfig.players.sprintSpeed : gameConfig.players.speed

  // up movement
  if (
    this.player1.body.y >= 16 &&
    buttonCache["ArrowUp"] ||
    buttonCache["W"]
  ) {
    this.player1.body.y = this.player1.body.y - playerSpeed
    this.player1.y = this.player1.y - playerSpeed
  }

  // down movement
  if (
    this.player1.body.y <= config.height - (104 + 16) &&
    buttonCache["ArrowDown"] ||
    buttonCache["S"]
  ) {
    this.player1.body.y = this.player1.body.y + playerSpeed
    this.player1.y = this.player1.y + playerSpeed
  }
}

// document.documentElement.style.setProperty('--hue-rotation', (getRandomIntInRange(0, 360) + 'deg'));

// function getRandomIntInRange(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

function getRandomServe () {
  return Math.random() < 0.5 ? -200 : 200;
}
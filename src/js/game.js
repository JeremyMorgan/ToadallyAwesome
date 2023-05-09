var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [OpeningScene,GameScene, GameOverScene]
};

// todo: player health
// todo: fix enemy collisions
// todo: Levels? 

let game = new Phaser.Game(config);
let score = 0;
let scoreText = "score is: "
let playerHealth = 100;
let healthText;
let directionFacing = "right";

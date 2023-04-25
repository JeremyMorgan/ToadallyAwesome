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
var game = new Phaser.Game(config);
var score = 0;
var directionFacing = "right";

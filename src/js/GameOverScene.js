class GameOverScene extends Phaser.Scene {

    constructor() {
        super({ key: 'GameOverScene' });
    }

    preload() {
        this.load.image('titleScreen', 'assets/titleScreen.png');
        this.load.image('resetButton', 'assets/resetButton.png');
        this.load.image('gameOverImage', 'assets/gameOver.png');
    }

    create(){
        // do stuff!
        console.log('Game Over!');
        
        const background = this.add.image(0, 0, 'titleScreen').setOrigin(0, 0);

        /*const gameOverText = this.add.text(400, 300, 'Game Over', {
            fontSize: '32px',
            color: '#ff0000',
            fontweight: 'bold'
        });*/

        const gameOverImage = this.add.image(400, 200, 'gameOverImage');
        gameOverImage.setOrigin(0.5);
        //gameOverText.setOrigin(0.5);

        const gameOverScore = this.add.text(400, 100, 'Score:  '+ this.score);

        const resetButton = this.add.image(400, 400, 'resetButton').setInteractive();
        resetButton.on('pointerdown', this.resetGame, this);
    }

    resetGame(){
        this.scene.start('GameScene');
    }    
}


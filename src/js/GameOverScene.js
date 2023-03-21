class GameOverScene extends Phaser.Scene {

    constructor() {
        super({ key: 'GameOverScene' });
    }

    create(){
        // do stuff!
        console.log('Game Over!');

        const gameOverText = this.add.text(400, 300, 'Game Over', {
            fontSize: '32px',
            color: '#ff0000',
            fontweight: 'bold'
        });

        gameOverText.setOrigin(0.5);
    }

    
}


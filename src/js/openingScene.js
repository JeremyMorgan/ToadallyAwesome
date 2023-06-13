class OpeningScene extends Phaser.Scene {

    constructor() {
        super({ key: 'OpeningScene' });
    }

    preload() {
    
        this.load.image('titleScreen', 'assets/titleScreen.png');
        this.load.image('titleLogo', 'assets/titleLogo.png');
        this.load.image('startButton', 'assets/startButton.png');
    }

    create(){

        this.add.image(0, 0, 'titleScreen').setOrigin(0, 0);
        this.add.image(150, 15, 'titleLogo').setOrigin(0, 0);
        this.add.image(300, 245, 'startButton').setOrigin(0, 0);

        const startButton = this.add.image(300, 245, 'startButton').setOrigin(0, 0);
        
        startButton.setInteractive();

        startButton.on('pointerdown', () => {
            console.log("Starting Main Game Scene");            
            this.scene.start('GameScene');    
            this.scene.start('CollisionManager');        
        });
    }
}
class GameScene extends Phaser.Scene {

    constructor() {
        super({ key: 'GameScene' });
    }
    preload() {

        // background image
        this.load.image('sky', 'assets/sky.png');

        // ground 
        this.load.image('tiles', 'assets/terrain.png');
        this.load.tilemapTiledJSON('tilemap', 'assets/terrain.json');

        // player 
        this.load.spritesheet('dude_run', 'assets/run.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('dude_idle', 'assets/idle.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('dude_jump', 'assets/jump.png', { frameWidth: 32, frameHeight: 32 });

        // enemy (blue bird)
        this.load.spritesheet('bird', 'assets/bird-flying.png', { frameWidth: 32, frameHeight: 32 });
        
        // another enemy 
        this.load.spritesheet('madbird', 'assets/madbird.png', { frameWidth: 32, frameHeight: 32 });
    
    }
    create() {
        // add the background image
        this.add.image(400, 300, 'sky');

        // add the ground 
        this.map = this.make.tilemap({ key: 'tilemap' });
        this.tileset = this.map.addTilesetImage('terrain', 'tiles');

        // create the ground layer
        this.groundlayer = this.map.createLayer('GroundLayer', this.tileset);
        this.groundlayer.setCollisionByExclusion(-1, true);

        // create platform layer
        this.platformlayer = this.map.createLayer('Platforms', this.tileset);
        this.platformlayer.setCollisionByExclusion(-1, true);

        // create the player
        this.player = this.physics.add.sprite(32, 384, 'dude');
        //player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);

        // create an enemy (blue bird)
        this.enemy = this.physics.add.sprite(750, 0, 'bird');
        this.enemy.setBounce(0.2);

        // create an enemy (blue bird)
        this.madbird = this.physics.add.sprite(400, 0, 'madbird');
        this.madbird.setBounce(0.2);


        // colliders 
        this.physics.add.collider(this.player, this.groundlayer);
        this.physics.add.collider(this.player, this.platformlayer);
        // enemy
        this.physics.add.collider(this.enemy, this.groundlayer);
        this.physics.add.collider(this.enemy, this.platformlayer);

        // enemy
        this.physics.add.collider(this.madbird, this.groundlayer);
        this.physics.add.collider(this.madbird, this.platformlayer);

        this.physics.add.collider(this.enemy, this.player, () => { this.scene.start('GameOverScene') });
        this.physics.add.collider(this.madbird, this.player, () => { this.scene.start('GameOverScene') });


        // player movement 
        // running left 
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude_run', { start: 19, end: 24 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude_run', { start: 0, end: 5 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude_run', frame: 5 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'facing_right',
            //TODO: IDLE
            frames: this.anims.generateFrameNumbers('dude_idle', { start: 11, end: 20 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            //TODO: IDLE
            key: 'facing_left',
            frames: this.anims.generateFrameNumbers('dude_idle', { start: 0, end: 10 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: 'dude_jump', frame: 0 }],
            //frames: this.anims.generateFrameNumbers('dude_run', { start: 0, end: 0 }),
            frameRate: 20,
            repeat: -1
        });

        // enemy animation
        this.anims.create({
            key: 'bird_fly',
            frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 8 }),
            frameRate: 20,
            repeat: -1
        });

        // enemy animation
        this.anims.create({
            key: 'madbird_fly',
            frames: this.anims.generateFrameNumbers('madbird', { start: 0, end: 8 }),
            frameRate: 20,
            repeat: -1
            });

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.directionFacing = "right";


    }
    update() {
        this.inMotion = false;

        this.camera = this.cameras.main;
    
        // check if player is offscreen
        if (this.player.x < this.camera.worldView.x || 
            this.player.x > this.camera.worldView.x + this.camera.worldView.width ||
            this.player.y < this.camera.worldView.y ||
            this.player.y > this.camera.worldView.y + this.camera.worldView.height) {
    
            if (this.player.x < this.camera.worldView.x)
            {
                this.player.x = this.camera.worldView.x + this.camera.worldView.width;
            }else 
            if (this.player.x > this.camera.worldView.x)
            {
                this.player.x = this.camera.worldView.x;
            }
        }
        
        if (this.cursors.left.isDown)
        {
            this.directionFacing = "left";
            this.player.setVelocityX(-160);
            this.inMotion = true;
            this.player.anims.play('left', true);
            
        }
        else if (this.cursors.right.isDown)
        {
            this.directionFacing = "right";
            this.player.setVelocityX(160);
            this.inMotion = true;
            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);
    
            if (this.directionFacing == "right"){
                this.player.anims.play('facing_right', true);
            }else {
                this.player.anims.play('facing_left', true);
            }        
        }
    
        //console.log(player.body.onFloor());
        //if (cursors.up.isDown)
        if (this.cursors.up.isDown && this.player.body.onFloor())
        {
            this.player.setVelocityY(-250);
            this.player.anims.play('jump', true);
        }
        
        // move the enemy
        this.enemy.x -=2;
        this.enemy.y -=1.5;
    
        this.enemy.anims.play('bird_fly', true);
    
        if (this.enemy.x < -this.enemy.width / 2) {
            this.enemy.x = this.sys.game.config.width + this.enemy.width / 2;   
        }    

        // move the enemy
        this.madbird.x -=2;
        this.madbird.y -=1.5;
    
        this.madbird.anims.play('madbird_fly', true);
    
        if (this.madbird.x < -this.madbird.width / 2) {
            this.madbird.x = this.sys.game.config.width + this.madbird.width / 2;   
        }   

        //madbird_fly


    }
}
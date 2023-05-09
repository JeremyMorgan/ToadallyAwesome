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
        this.load.spritesheet('bluebird', 'assets/bird-flying.png', { frameWidth: 32, frameHeight: 32 });
        
        // another enemy 
        this.load.spritesheet('madbird', 'assets/madbird.png', { frameWidth: 32, frameHeight: 32 });

        // cherry
        this.load.spritesheet('cherry', 'assets/cherry.png', { frameWidth: 32, frameHeight: 32 });
        
        // ball 
        this.load.spritesheet('ball', 'assets/ball.png', { frameWidth: 32, frameHeight: 32 });

        // explosion 
        this.load.spritesheet('explosion', 'assets/explosion.png', { frameWidth: 32, frameHeight: 32 });


    }
    create() {

        this.enemyhit = 0;        
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

        // create a cherry group
        this.cherries = this.physics.add.group();

        // create a mad bird group
        this.madBirds = this.physics.add.group();

        // create a bluebird group 
        this.blueBirds = this.physics.add.group();

        // create the player
        this.player = this.physics.add.sprite(64, 384, 'dude');
        //player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);

        // create an enemy (blue bird)
        //this.enemy = this.physics.add.sprite(750, 0, 'bird');
        //this.enemy.setData('health', 100);
        //this.enemy.setData("Name", "Blue Bird")
        //this.enemy.setBounce(0.2);

        // create a ball for the player to throw 
        this.ball = this.physics.add.sprite(this.player.x, this.player.y, 'ball');
        this.ball.setBounce(0.8);
        this.ball.setCollideWorldBounds(true);
        this.ball.setVisible(false);
        
        // player colliders 
        this.physics.add.collider(this.player, this.groundlayer);
        this.physics.add.collider(this.player, this.platformlayer);
        
        // enemy colliders
        //this.physics.add.collider(this.enemy, this.groundlayer);
        //this.physics.add.collider(this.enemy, this.platformlayer);

        // if you touch an enemy 
        //this.physics.add.collider(this.enemy, this.player, this.hitPlayer);
        
        // ball colliders
        this.physics.add.collider(this.ball, this.groundlayer);
        this.physics.add.collider(this.ball, this.platformlayer);
        this.physics.add.collider(this.ball, this.blueBirds, this.destroyEnemy, null, this);
        this.physics.add.collider(this.ball, this.madBirds, this.destroyEnemy, null, this);
       
        // if the ball hits a mad bird
        // TODO: See if we can tune this       
        if (this.madBirds.countActive(true) > 0){
            this.madBirds.children.iterate((madbird) => {
                // TODO: how can I change settings with this.physics.add.overlap                                
                this.physics.add.overlap(this.ball, madbird, this.destroyEnemy, null, this);
            })
        }

        if (this.blueBirds.countActive(true) > 0){
            this.blueBirds.children.iterate((blueBird) => {
                // TODO: how can I change settings with this.physics.add.overlap                                
                this.physics.add.overlap(this.ball, blueBird, this.destroyEnemy, null, this);
            })
        }

        // when the player collides with a cherry
        this.physics.add.overlap(this.player, this.cherries, this.collectCherry, null, this);

        // player running left 
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude_run', { start: 19, end: 24 }),
            frameRate: 20,
            repeat: -1
        });

        // player running right
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

        // player standing facing right
        this.anims.create({
            key: 'facing_right',
            //TODO: IDLE
            frames: this.anims.generateFrameNumbers('dude_idle', { start: 11, end: 20 }),
            frameRate: 20,
            repeat: -1
        });

        // player standing facing left
        this.anims.create({
            //TODO: IDLE
            key: 'facing_left',
            frames: this.anims.generateFrameNumbers('dude_idle', { start: 0, end: 10 }),
            frameRate: 20,
            repeat: -1
        });

        // player jump
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
            frames: this.anims.generateFrameNumbers('bluebird', { start: 0, end: 8 }),
            frameRate: 20,
            repeat: -1
        });

        // mad bird animation
        this.anims.create({
            key: 'madbird_fly',
            frames: this.anims.generateFrameNumbers('madbird', { start: 0, end: 8 }),
            frameRate: 20,
            repeat: -1
        });

        // cherry animation
        this.anims.create({
            key: 'cherry_spin',
            frames: this.anims.generateFrameNumbers('cherry', { start: 0, end: 16 }),
            frameRate: 20,
            repeat: -1
        });
        // explosion when enemy is hit 
        this.anims.create({
            key: 'enemyexplode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 4 }),
            frameRate: 20,
            repeat: 0
        });


        // Scoring 
        score = 0;
        scoreText = this.add.text(16, 16,'score: 0', { fontSize: '16px', fill: '#ffffff', fontFamily: 'Arial' });
        
        //this.playerHealth = 100;
        this.healthText = this.add.text(16, 50, 'health: 100', { fontSize: '16px', fill: '#ffffff', fontFamily: 'Arial' });
        
        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.directionFacing = "right";

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // create stuff 
        this.spawnCherries(7);
        this.createMadBird();
        this.createBlueBird();

    }

    update() {

        this.healthText.setText('health: ' + playerHealth);
        
        // player movement
        this.inMotion = false;
        this.camera = this.cameras.main;
    
        // check if player is offscreen
        if (this.player.x < this.camera.worldView.x || 
            this.player.x > this.camera.worldView.x + this.camera.worldView.width ||
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
        
        // move player
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
    
        // player jump
        if (this.cursors.up.isDown && this.player.body.onFloor())
        {
            this.player.setVelocityY(-250);
            this.player.anims.play('jump', true);
        }

        // launch the ball
        if (this.spacebar.isDown) {
        
            this.ball.setVisible(true);
            this.ball.setPosition(this.player.x, this.player.y);
            this.ball.setVelocityY(-50);
            this.ball.setVelocityX(this.directionFacing == "right" ? 200 : -200);
        }        

        let screenWidth = this.sys.game.config.width;

        // mad bird 
        if (this.madBirds.countActive(true) > 0){
            this.madBirds.children.iterate(function (child) {
                //child.enableBody(true, child.x, 0, true, true);
                child.x -=2;
                child.y -=1.5;
                if (child.x < - child.width / 2) {
                    child.x = screenWidth + child.width / 2;   
                }
            });            
        }
        // mad bird 
        if (this.blueBirds.countActive(true) > 0){
            this.blueBirds.children.iterate(function (child) {
                //child.enableBody(true, child.x, 0, true, true);
                child.x -=2;
                child.y -=1.5;
                if (child.x < - child.width / 2) {
                    child.x = screenWidth + child.width / 2;   
                }
            });            
        }
  
    } // end update

    spawnCherries(cherryAmount) {

        for (let i = 0; i < cherryAmount; i++) {
            let x = Phaser.Math.Between(0, this.sys.game.config.width);
            let y = Phaser.Math.Between(0, 300);

            let cherry = this.cherries.create(x, y, 'cherry');

            cherry.setBounce(.5);
            
            cherry.setCollideWorldBounds(true);
            cherry.anims.play('cherry_spin', true);

            this.physics.add.collider(cherry, this.groundlayer);
            this.physics.add.collider(cherry, this.platformlayer);
        }
    }

    collectCherry(player, cherry) {
        // called when player collides with a cherry

        cherry.disableBody(true, true);
        score += 100;
        scoreText.setText('score: ' + score);

        if (this.cherries.countActive(true) === 0) {
            this.spawnCherries(7);
            this.createMadBird();
            this.createBlueBird();
        }
    }

    createMadBird() {
            // create an enemy (mad bird)

            //console.log(this.madBirds.countActive());
            let x = Phaser.Math.Between(0, this.sys.game.config.width);
            let y = Phaser.Math.Between(0, 300);

            let madbird = this.madBirds.create(x, y, 'madbird');
            madbird.setData("health", 100);
            madbird.setData("Name", "Mad Bird");          
            madbird.setBounce(.2);
           
            this.physics.add.collider(madbird, this.groundlayer);
            this.physics.add.collider(madbird, this.platformlayer);
            this.physics.add.collider(madbird, this.player, this.hitPlayer);

    }

    createBlueBird() {
        // create a blue bird
        let x = Phaser.Math.Between(0, this.sys.game.config.width);
        let y = Phaser.Math.Between(0, 300);

        let bluebird = this.blueBirds.create(x, y, 'bluebird');
        bluebird.setData("health", 100);
        bluebird.setData("Name", "Blue Bird");          
        bluebird.setBounce(.2);
       
        this.physics.add.collider(bluebird, this.groundlayer);
        this.physics.add.collider(bluebird, this.platformlayer);
        this.physics.add.collider(bluebird, this.player, this.hitPlayer);
    }    

    destroyEnemy(ball, enemy) {

        // after ball hits enemy, it takes off
        ball.setVelocityX(-500);

        this.enemyhit = this.enemyhit + 1;

        let health = enemy.getData("health");

        enemy.setData("health", health - 50);

        enemy.setVelocityX("-30");

        if (health == 0) {
            console.log('destroying enemy' + enemy.getData("Name"));
            score = score + 100;
            scoreText.setText('score:'+ score);
            const explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
            explosion.anims.play('enemyexplode', true);
            explosion.once('animationcomplete', () => { explosion.destroy(); });
            enemy.disableBody(true, true);
            this.enemyhit = 0;            
        } else {            
            enemy.setVelocityX("-30");
            ball.setVelocityX("30");
        }             
    }

    hitPlayer(){

        console.log("Player was hit!");
        console.log("Player Health: " + playerHealth);
        console.log("Score: " + score);

        if (playerHealth == 100){
            playerHealth = playerHealth - 50;
            console.log("Player Health: " + playerHealth);
        }else if (playerHealth == 50){
            console.log("Should be Game Over!")
            game.scene.start('GameOverScene', { score: score })
        }
    }

    gaveOver(){
        
    }
}
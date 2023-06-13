class CollisionManager {

    //create constructor function
    constructor(scene, player, groundlayer, platformlayer, blueBirds, madBirds, ball, cherries, physics) {
        this.scene = scene;
        this.player = player;
        this.groundlayer = groundlayer;
        this.platformlayer = platformlayer;
        this.blueBirds = blueBirds;
        this.madBirds = madBirds;
        this.ball = ball;
        this.cherries = cherries;
        this.physics = physics;
    }

    // create some colliders

    create() {

        // keep the player on the ground and platform
        // Status: Working
        this.physics.add.collider(this.player, this.groundlayer);
        this.physics.add.collider(this.player, this.platformlayer);

        // ball colliders
        // Status: Not working
        this.physics.add.collider(this.ball, this.groundlayer);
        this.physics.add.collider(this.ball, this.platformlayer);

        // if the ball hits a mad bird
        // TODO: See if we can tune this
        // Status: Not working     
        /*
        {
            "name": "",
            "type": "Sprite",
            "x": 70.61333333333327,
            "y": 428.93000000000006,
            "depth": 0,
            "scale": {
                "x": 1,
                "y": 1
            },
            "origin": {
                "x": 0.5,
                "y": 0.5
            },
            "flipX": false,
            "flipY": false,
            "rotation": 0,
            "alpha": 1,
            "visible": true,
            "blendMode": 0,
            "textureKey": "ball",
            "frameKey": 0,
            "data": {}
            }
        */
        if (this.madBirds.countActive(true) > 0) {
            this.madBirds.children.iterate((madbird) => {
                this.physics.world.enable(madbird);
                // ground   
                this.physics.add.collider(madbird, this.groundlayer);
                // platform 
                this.physics.add.collider(madbird, this.platformlayer);
                // player
                this.physics.add.collider(madbird, this.player, this.hitPlayer);

                console.log("Madbird Name : " + madbird.getData("name"));
                   
                this.physics.add.collider(this.ball, madbird, this.destroyEnemy, null, this);
            })
        }
        // if the ball hits a blue bird
        // TODO: Make bluebird collisions work
        // Status: Working
        if (this.blueBirds.countActive(true) > 0) {
            this.blueBirds.children.iterate((blueBird) => {

                this.physics.world.enable(blueBird);
                // ground   
                this.physics.add.collider(blueBird, this.groundlayer);
                // platform 
                this.physics.add.collider(blueBird, this.platformlayer);
                // player
                this.physics.add.collider(blueBird, this.player, this.hitPlayer);
                // ball                      
                this.physics.add.collider(this.ball, blueBird, this.destroyEnemy, null, this);
            })
        }

        // when enemy collides with ball
        // Status: Not working 
        //this.scene.physics.add.overlap(this.ball, this.madBirds, this.destroyEnemy, null, this);
        //this.scene.physics.add.overlap(this.ball, this.blueBirds, this.destroyEnemy, null, this);

        // when the player collides with a cherry
        // Status: Working
        this.scene.physics.add.overlap(this.player, this.cherries, this.scene.collectCherry, null, this);


    }

    /**
     * Adds colliders for the given cherry object with the ground and platform layers.
     * @param {Phaser.Physics.Arcade.Sprite} cherry - The cherry object to add colliders to.
     */
    createCherryColliders(cherry) {
        //console.log("Collision Manager createCherryColliders function called");
        this.physics.add.collider(cherry, this.groundlayer);
        this.physics.add.collider(cherry, this.platformlayer);
    }

    destroyEnemy(enemy) {

        //console.log(typeof enemy);
        //console.log(JSON.stringify(enemy));
        //console.log("Name : " + enemy.getData("name"));
        //console.log("Health : " + enemy.getData("health"));

        console.log('destroyEnemy function called');
        // after ball hits enemy, it takes off
        this.ball.setVelocityX(-500);

        //this.enemyhit = this.enemyhit + 1;

        //let health = this.enemy.getData("health");
        //this.enemy.setData("health", health - 50);

        //console.log('enemy health: ' + enemy.getData("health"));
        enemy.setVelocityX("-30");
       
       // if (health <= 0) {
            console.log('destroying enemy' + enemy.getData("Name"));
            score = score + 100;
            scoreText.setText('score:'+ score);
            const explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
            explosion.anims.play('enemyexplode', true);
            explosion.once('animationcomplete', () => { explosion.destroy(); });
            enemy.disableBody(true, true);
            this.enemyhit = 0;            
        //} else {            
        //    enemy.setVelocityX("-30");
        //    ball.setVelocityX("30");
        //}    
    }
}

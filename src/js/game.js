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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var directionFacing = "right";
// loads assets before the game starts
function preload (){
    // background image
    this.load.image('sky', 'assets/sky.png');

    // ground 
    this.load.image('tiles', 'assets/terrain.png');
    this.load.tilemapTiledJSON('tilemap', 'assets/terrain.json');

    // player 
    this.load.spritesheet('dude_run', 'assets/run.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('dude_idle', 'assets/idle.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('dude_jump', 'assets/jump.png', { frameWidth: 32, frameHeight: 32 });

    //this.load.image('dude_jump', 'assets/jump.png');
}

// runs once the game starts
function create () {
    // add the background image
    this.add.image(400,300,'sky');

    // add the ground 
    const map = this.make.tilemap({ key: 'tilemap' });
    const tileset = map.addTilesetImage('terrain', 'tiles');

    // create the ground layer
    const groundlayer = map.createLayer('GroundLayer', tileset);
    groundlayer.setCollisionByExclusion(-1, true);

    // create platform layer
    const platformlayer = map.createLayer('Platforms', tileset);
    platformlayer.setCollisionByExclusion(-1, true);

    // create the player
    player = this.physics.add.sprite(32, 384, 'dude');
    //player.setCollideWorldBounds(true);
    player.setBounce(0.2);
    
    // collider 
    this.physics.add.collider(player, groundlayer);
    this.physics.add.collider(player, platformlayer);

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

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    this.directionFacing = "right";

    console.log(player.getBounds());
}

// runs every frame
function update () {

    inMotion = false;

    var camera = this.cameras.main;

    // check if player is offscreen
    if (player.x < camera.worldView.x || 
        player.x > camera.worldView.x + camera.worldView.width ||
        player.y < camera.worldView.y ||
        player.y > camera.worldView.y + camera.worldView.height) {
        
        console.log('Player is offscreen!');

        if (player.x < camera.worldView.x)
        {
            player.x = camera.worldView.x + camera.worldView.width;
        }else 
        if (player.x > camera.worldView.x)
        {
            player.x = camera.worldView.x;
        }
        //TODO: Figure this out!
        /*
        if (player.y < camera.worldView.y)
        {
            player.y = camera.worldView.y + camera.worldView.height;
        }else 
        if (player.y > camera.worldView.y)
        {
            player.y = camera.worldView.y;
        }
        */
    }
    
    if (cursors.left.isDown)
    {
        this.directionFacing = "left";
        player.setVelocityX(-160);
        inMotion = true;
        player.anims.play('left', true);
        
    }
    else if (cursors.right.isDown)
    {
        this.directionFacing = "right";
        player.setVelocityX(160);
        inMotion = true;
        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        if (this.directionFacing == "right"){
            player.anims.play('facing_right', true);
        }else {
            player.anims.play('facing_left', true);
        }        
    }

    //console.log(player.body.onFloor());
    //if (cursors.up.isDown)
    if (cursors.up.isDown && player.body.onFloor())
    {
        player.setVelocityY(-220);
        console.log("Jump Animation");
        player.anims.play('jump', true);

        /*
        if(inMotion){
            // something else 
            player.anims.play('jump', true);
        }else {
            player.anims.play('jump', true);
        }
        */     
    }
    //if (inMotion) { console.log("in motion"); }
}
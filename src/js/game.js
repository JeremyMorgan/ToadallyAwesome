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
    this.load.spritesheet('dude', 'assets/ninjatoad.png', { frameWidth: 32, frameHeight: 32 });

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
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);
    
    // collider 
    this.physics.add.collider(player, groundlayer);
    this.physics.add.collider(player, platformlayer);

    // player movement 

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 19, end: 24 }),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 5 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'facing_right',
        frames: [{ key: 'dude', frame: 5 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'facing_left',
        frames: [{ key: 'dude', frame: 12 }],
        frameRate: 20
    });


    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 5 }),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('dude', { start: 6, end: 10 }),
        frameRate: 20,
        repeat: -1
    });


    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    this.directionFacing = "right";
}

// runs every frame
function update () {

    
    
    if (cursors.left.isDown)
    {
        this.directionFacing = "left";
        player.setVelocityX(-160);
        player.anims.play('left', true);
        
    }
    else if (cursors.right.isDown)
    {
        this.directionFacing = "right";
        player.setVelocityX(160);
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
        player.setVelocityY(-330);
        player.anims.play('jump', true);
    }
}
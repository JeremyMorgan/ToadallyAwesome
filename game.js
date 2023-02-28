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
}

var game = new Phaser.Game(config);

function preload() {

    this.load.image('sky', 'assets/sky.png');
    this.load.image('tiles', 'assets/terrain.png');
    this.load.tilemapTiledJSON('Terrain', 'assets/terrain.json');
    this.load.spritesheet('dude', 'assets/ninjafrog.png', { frameWidth: 32, frameHeight: 32 });
}

function create() {
    // background image
    this.add.image(400, 320, 'sky');

    // tilemap stuff     
    const map = this.make.tilemap({ key: 'Terrain' });
    const tileset = map.addTilesetImage('TerrainTileSet', 'tiles');
    var tile_layer = map.createLayer('Tile Layer 1', tileset);

    // create the player
    player = this.physics.add.sprite(32, 384, 'dude');

    // Set collision with player (can also be a group)
    tile_layer.setCollisionByExclusion([-1]);

    this.physics.add.collider(player, tile_layer);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 5 }),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 5 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 5 }),
        frameRate: 20,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
}
function update() {

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown)
    //if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }

}
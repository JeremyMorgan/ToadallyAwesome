class EnemyManager extends Phaser.Scene {

    //create constructor function
    constructor(scene, physics){
        super({ key: 'EnemyManager' });
        //this.scene.madBirds = this.physics.add.group(); 
        //this.scene = scene;
        //this.width = width;
        console.log("Scene is " + typeof(scene));
        this.physics = physics;

        this.scene = scene;
        
        // create a mad bird group
        this.scene.madBirds = this.physics.add.group();

        // create a bluebird group 
        //this.scene.blueBirds = this.physics.add.group();       
    }

    //constructor(scene, physics, width) {
        
      //  console.log("Constructor scope: ", this);
      //  console.log("Scene: ", scene);
      //  console.log("Width: ", width);
      //  console.log("Physics: ", physics);
        
        /*this.scene = scene;
        this.width = width;
        this.physics = physics;
        */
        // create a mad bird group
        //this.scene.madBirds = this.physics.add.group();

        // create a bluebird group 
        //this.scene.blueBirds = this.physics.add.group();
    //}
    
    create() {  
        this.createBlueBird();
        this.createMadBird();
    }

    createMadBird(physics) {
        // create an enemy (mad bird)

        let madBirds = physics.add.group();

        //console.log(this.madBirds.countActive());        
        let x = Phaser.Math.Between(0, this.width);
        let y = Phaser.Math.Between(0, 300);

        let madbird = madBirds.create(x, y, 'madbird');
        madbird.setData("health", 100);
        madbird.setData("name", Phaser.Math.RND.uuid());          
        madbird.setBounce(.2);
        console.log("Madbird count: " + this.scene.madBirds.countActive(true));

        return madBirds;
    }

    createBlueBird(physics) {

        // create a blue bird
        let blueBirds = physics.add.group();

        let x = Phaser.Math.Between(0, this.width);
        let y = Phaser.Math.Between(0, 300);

        let bluebird = blueBirds.create(x, y, 'bluebird');
        bluebird.setData("health", 100);
        bluebird.setData("name", Phaser.Math.RND.uuid());          
        bluebird.setBounce(.2);

        return blueBirds;
    } 

}
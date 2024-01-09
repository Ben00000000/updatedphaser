var config = {
    type: Phaser.AUTO,
    width: 2000, // Set a default width
    height: 600,
    scale: {
        mode: Phaser.Scale.RESIZE, // Scale the canvas to fit the screen size
        parent: 'phaser-example', // Replace with the ID of your HTML element
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: {
         key: 'mainScene',
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var cursors;
var leftButton, rightButton, jumpButton;
var lasers;
var lastPlayerLaserTime = 0;
var leftEnemyExists = true;
var rightEnemyExists = true;
let bouncingEnemy1, bouncingEnemy2, bouncingEnemy3, bouncingEnemy4, bouncingEnemy5;
let blueBouncyEnemy1, blueBouncyEnemy2, blueBouncyEnemy3, blueBouncyEnemy4, blueBouncyEnemy5;
let redBouncyEnemy1, redBouncyEnemy2, redBouncyEnemy3, redBouncyEnemy4, redBouncyEnemy5;
var playerHealth = 100; // Set an initial value for player health
var gameOver = false;



var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'sky.png');
    this.load.spritesheet('dude', 'dude.png', { frameWidth: 131, frameHeight: 138 });
    this.load.spritesheet('jumpdude', 'jumpdude.png', { frameWidth: 131, frameHeight: 138 });
    this.load.spritesheet('idledude', 'idledude.png', { frameWidth: 131, frameHeight: 138 });
    this.load.image('ground', 'ground.png');
    this.load.image('wall', 'wall.png');
    this.load.image('platform', 'ground.png');
    this.load.spritesheet('enemy', 'enemy.png', { frameWidth: 228, frameHeight: 210 });
    this.load.spritesheet('bouncyenemy', 'bouncyenemy.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('bluebouncyenemy', 'bluebouncyenemy.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('redbouncyenemy', 'redbouncyenemy.png', { frameWidth: 128, frameHeight: 128 });
    this.load.image('purpleLaser', 'laser.png'); // Replace 'purpleLaser.png' with your actual purple laser image file




}

function create() {


   // Add background image
     let bg = this.add.image(0, 0, 'sky').setOrigin(0, 0).setScale(1.8);

 // Set camera bounds based on the whole world
    this.physics.world.setBounds(0, 0, bg.displayWidth * bg.scaleX, bg.displayHeight * bg.scaleY);

    // Adjust camera bounds to follow the player within the world size
this.cameras.main.setBounds(0, 0, config.width - 50, config.height +200);

lasers = this.physics.add.group();




function shootEnemyLaser(enemy) {
    // Create a laser at the enemy's position
    var laser = lasers.create(enemy.x, enemy.y - 30, 'purpleLaser');

    // Set the velocity of the laser (adjust as needed)
    laser.setVelocityX(enemy.flipX ? -2000 : 2000);

    // Set additional properties for the enemy laser
    laser.setCollideWorldBounds(false);

    // Flip the laser sprite if shot from the right side
    if (enemy.flipX) {
        laser.setFlipX(true);
    }

    // Set a custom property to identify it as an enemy laser
    laser.isPlayerLaser = false;
}

this.time.addEvent({
    delay: 1000,
    callback: function () {
        // Check if left and right enemies still exist before shooting enemy lasers
        if (leftEnemyExists) {
            shootEnemyLaser(enemyLeft);
        }
        if (rightEnemyExists) {
            shootEnemyLaser(enemyRight);
        }
        // Add more enemy references if needed
    },
    loop: true
});










    // Set physics world bounds to include the wall
    this.physics.world.setBounds(0, 0, 2000 + bg.displayWidth * bg.scaleX, bg.displayHeight * bg.scaleY);

// Create ground
let ground = this.physics.add.staticSprite(0, 700, 'ground').setOrigin(0, 0).setDisplaySize(config.width, 100).refreshBody();

// Create wall at the end of the ground
let wall = this.physics.add.staticSprite(config.width - 10, 100, 'wall').setOrigin(0, 0).setDisplaySize(50, config.height).refreshBody();

let platform = this.physics.add.staticSprite(400, 500, 'platform').setDisplaySize(200, 50).refreshBody();
let platform1 = this.physics.add.staticSprite(750, 500, 'platform').setDisplaySize(200, 50).refreshBody();
let platform2 = this.physics.add.staticSprite(1150, 500, 'platform').setDisplaySize(200, 50).refreshBody();
let platform3 = this.physics.add.staticSprite(1550, 500, 'platform').setDisplaySize(200, 50).refreshBody();
let platform4 = this.physics.add.staticSprite(1350, 300, 'platform').setDisplaySize(200, 50).refreshBody();
let platform5 = this.physics.add.staticSprite(950, 300, 'platform').setDisplaySize(200, 50).refreshBody();
let platform6 = this.physics.add.staticSprite(550, 300, 'platform').setDisplaySize(200, 50).refreshBody();


// Set up one-way collision for platforms
platform.body.checkCollision.down = false;
platform1.body.checkCollision.down = false;
platform2.body.checkCollision.down = false;
platform3.body.checkCollision.down = false;
platform4.body.checkCollision.down = false;
platform5.body.checkCollision.down = false;
platform6.body.checkCollision.down = false;



    // Set up player
    player = this.physics.add.sprite(config.width / 2, config.height + 30, 'dude');
    player.setSize(40, 80); // Adjust the width and height as needed
    player.setBounce(0);
    player.setCollideWorldBounds(true);



   // Set up collision between player and world bounds
    this.physics.world.on('worldbounds', function (body) {
        if (body.gameObject === player) {
            // Constrain the player within the world bounds
            player.setVelocityX(0);
            player.setX(Phaser.Math.Clamp(player.x, 0, bg.displayWidth * bg.scaleX));
        }
    }, this);


  // Create enemies on the left and right edges
    let enemyLeft = this.physics.add.sprite(50, config.height - 50, 'enemy');
    let enemyRight = this.physics.add.sprite(config.width - 130, config.height  + 20, 'enemy');

    // Set properties for the enemies
    enemyLeft.setCollideWorldBounds(true);
    enemyRight.setCollideWorldBounds(true);

    // Set the scale of the enemies to make them smaller
    enemyLeft.setScale(0.7); // Adjust the scale value as needed
    enemyRight.setScale(0.7); // Adjust the scale value as needed

// Set custom bounding box size for enemies
enemyLeft.setSize(enemyLeft.width, enemyLeft.height * 0.5); // Adjust the height as needed
enemyRight.setSize(enemyRight.width, enemyRight.height * 0.5); // Adjust the height as needed

    // Add static bodies to make enemies stand on the ground
    this.physics.add.existing(enemyLeft, true);
    this.physics.add.existing(enemyRight, true);


  // Add collision between the ground and enemies
    this.physics.add.collider([enemyLeft, enemyRight], ground);

 // green bouncy enemy
    let bouncingEnemy1 = this.physics.add.sprite(1100, 250, 'bouncyenemy');
    let bouncingEnemy2 = this.physics.add.sprite(1220, 250, 'bouncyenemy');
    let bouncingEnemy3 = this.physics.add.sprite(1150, 250, 'bouncyenemy');
    let bouncingEnemy4 = this.physics.add.sprite(1080, 250, 'bouncyenemy');
    let bouncingEnemy5 = this.physics.add.sprite(1200, 250, 'bouncyenemy');


    // blue bouncy enemy

    let bluebouncyenemy1 = this.physics.add.sprite(1469, 250, 'bluebouncyenemy');
    let bluebouncyenemy2 = this.physics.add.sprite(1630, 250, 'bluebouncyenemy');
    let bluebouncyenemy3 = this.physics.add.sprite(1539, 250, 'bluebouncyenemy');
    let bluebouncyenemy4 = this.physics.add.sprite(1479, 250, 'bluebouncyenemy');
    let bluebouncyenemy5 = this.physics.add.sprite(1569, 250, 'bluebouncyenemy');

       // red bouncy enemy

        let redbouncyenemy1 = this.physics.add.sprite(680, 250, 'redbouncyenemy');
        let redbouncyenemy2 = this.physics.add.sprite(800, 250, 'redbouncyenemy');
        let redbouncyenemy3 = this.physics.add.sprite(730, 250, 'redbouncyenemy');
        let redbouncyenemy4 = this.physics.add.sprite(690, 250, 'redbouncyenemy');
        let redbouncyenemy5 = this.physics.add.sprite(780, 250, 'redbouncyenemy');



    bouncingEnemy1.setBounce(0.2); // Set bounce value to make the enemy bounce
    bouncingEnemy2.setBounce(0.2);
    bouncingEnemy3.setBounce(0.2);
    bouncingEnemy4.setBounce(1);
    bouncingEnemy5.setBounce(1);

    bluebouncyenemy1.setBounce(0.2); // Set bounce value to make the enemy bounce
    bluebouncyenemy2.setBounce(0.2);
    bluebouncyenemy3.setBounce(0.2);
    bluebouncyenemy4.setBounce(1);
    bluebouncyenemy5.setBounce(1);

    redbouncyenemy1.setBounce(0.2); // Set bounce value to make the enemy bounce
    redbouncyenemy2.setBounce(0.2);
    redbouncyenemy3.setBounce(0.2);
    redbouncyenemy4.setBounce(1);
    redbouncyenemy5.setBounce(1);

    bouncingEnemy1.setCollideWorldBounds(true);
    bouncingEnemy2.setCollideWorldBounds(true);
    bouncingEnemy3.setCollideWorldBounds(true);
    bouncingEnemy4.setCollideWorldBounds(true);
    bouncingEnemy5.setCollideWorldBounds(true);

    bluebouncyenemy1.setCollideWorldBounds(true);
    bluebouncyenemy2.setCollideWorldBounds(true);
    bluebouncyenemy3.setCollideWorldBounds(true);
    bluebouncyenemy4.setCollideWorldBounds(true);
    bluebouncyenemy5.setCollideWorldBounds(true);

    redbouncyenemy1.setCollideWorldBounds(true);
    redbouncyenemy2.setCollideWorldBounds(true);
    redbouncyenemy3.setCollideWorldBounds(true);
    redbouncyenemy4.setCollideWorldBounds(true);
    redbouncyenemy5.setCollideWorldBounds(true);

    bouncingEnemy1.setScale(1);
    bouncingEnemy2.setScale(1);
    bouncingEnemy3.setScale(1);
    bouncingEnemy4.setScale(1);
    bouncingEnemy5.setScale(1);

    bluebouncyenemy1.setScale(1);
    bluebouncyenemy2.setScale(1);
    bluebouncyenemy3.setScale(1);
    bluebouncyenemy4.setScale(1);
    bluebouncyenemy5.setScale(1);

    redbouncyenemy1.setScale(1);
    redbouncyenemy2.setScale(1);
    redbouncyenemy3.setScale(1);
    redbouncyenemy4.setScale(1);
    redbouncyenemy5.setScale(1);

// Set custom collision body size for the top part of bouncing enemies
const topCollisionWidth = 128; // Adjust based on the actual width of your bouncing enemies
const topCollisionHeight = 20; // Adjust based on the height you want for the top collision area

this.physics.add.existing(bouncingEnemy1, false);
bouncingEnemy1.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bouncingEnemy1.body.setOffset(0, bouncingEnemy1.height - 35); // Set offset to keep bottom collision intact

this.physics.add.existing(bouncingEnemy2, false);
bouncingEnemy2.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bouncingEnemy2.body.setOffset(0, bouncingEnemy1.height - 35); // Set offset to keep bottom collision intact

this.physics.add.existing(bouncingEnemy3, false);
bouncingEnemy3.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bouncingEnemy3.body.setOffset(0, bouncingEnemy1.height - 35); // Set offset to keep bottom collision intact

this.physics.add.existing(bouncingEnemy4, false);
bouncingEnemy4.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bouncingEnemy4.body.setOffset(0, bouncingEnemy1.height - 35); // Set offset to keep bottom collision intact

this.physics.add.existing(bouncingEnemy5, false);
bouncingEnemy5.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bouncingEnemy5.body.setOffset(0, bouncingEnemy1.height - 35); // Set offset to keep bottom collision intact

// blue
this.physics.add.existing(bluebouncyenemy1, false);
bluebouncyenemy1.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bluebouncyenemy1.body.setOffset(0, bouncingEnemy1.height - 35); // Set offset to keep bottom collision intact

this.physics.add.existing(bluebouncyenemy2, false);
bluebouncyenemy2.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bluebouncyenemy2.body.setOffset(0, bouncingEnemy1.height - 35); // Set offset to keep bottom collision intact

this.physics.add.existing(bluebouncyenemy3, false);
bluebouncyenemy3.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bluebouncyenemy3.body.setOffset(0, bouncingEnemy1.height - 35); // Set offset to keep bottom collision intact

this.physics.add.existing(bluebouncyenemy4, false);
bluebouncyenemy4.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bluebouncyenemy4.body.setOffset(0, bouncingEnemy1.height - 35); // Set offset to keep bottom collision intact

this.physics.add.existing(bluebouncyenemy5, false);
bluebouncyenemy5.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bluebouncyenemy5.body.setOffset(0, bouncingEnemy1.height - 35); // Set offset to keep bottom collision intact


//red
this.physics.add.existing(redbouncyenemy1, false);
redbouncyenemy1.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
redbouncyenemy1.body.setOffset(0, bouncingEnemy1.height - 35); // Set offset to keep bottom collision intact

this.physics.add.existing(redbouncyenemy2, false);
redbouncyenemy2.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
redbouncyenemy2.body.setOffset(0, bouncingEnemy1.height - 35); // Set offset to keep bottom collision intact

this.physics.add.existing(redbouncyenemy3, false);
redbouncyenemy3.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
redbouncyenemy3.body.setOffset(0, bouncingEnemy1.height - 35); // Set offset to keep bottom collision intact

this.physics.add.existing(redbouncyenemy4, false);
redbouncyenemy4.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
redbouncyenemy4.body.setOffset(0, bouncingEnemy1.height - 35); // Set offset to keep bottom collision intact

this.physics.add.existing(bouncingEnemy5, false);
redbouncyenemy5.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
redbouncyenemy5.body.setOffset(0, bouncingEnemy1.height - 35); // Set offset to keep bottom collision intact




    this.physics.add.existing(bouncingEnemy1, true);
    this.physics.add.existing(bouncingEnemy2, true);
    this.physics.add.existing(bouncingEnemy3, true);
    this.physics.add.existing(bouncingEnemy4, true);
    this.physics.add.existing(bouncingEnemy5, true);

    this.physics.add.existing(bluebouncyenemy1, false);
    this.physics.add.existing(bluebouncyenemy2, false);
    this.physics.add.existing(bluebouncyenemy3, false);
    this.physics.add.existing(bluebouncyenemy4, false);
    this.physics.add.existing(bluebouncyenemy5, false);

        this.physics.add.existing(redbouncyenemy1, false);
        this.physics.add.existing(redbouncyenemy2, false);
        this.physics.add.existing(redbouncyenemy3, false);
        this.physics.add.existing(redbouncyenemy4, false);
        this.physics.add.existing(redbouncyenemy5, false);


    this.physics.add.collider([bouncingEnemy1, bouncingEnemy2, bouncingEnemy3, bouncingEnemy4, bouncingEnemy5], [platform2, ground, wall, platform, platform1, platform2, platform3, platform4, platform5, platform6]);

    this.physics.add.collider([bluebouncyenemy1, bluebouncyenemy2, bluebouncyenemy3, bluebouncyenemy4, bluebouncyenemy5], [platform3, ground, wall, platform, platform1, platform2, platform3, platform4, platform5, platform6]);

    this.physics.add.collider([redbouncyenemy1, redbouncyenemy2, redbouncyenemy3, redbouncyenemy4, redbouncyenemy5], [platform1, ground, wall, platform, platform1, platform2, platform3, platform4, platform5, platform6]);
// Set up collision callbacks for green bouncing enemies
this.physics.add.overlap(player, [bouncingEnemy1, bouncingEnemy2, bouncingEnemy3, bouncingEnemy4, bouncingEnemy5], function (player, enemy) {
    bouncingEnemyCollision(player, enemy, 0x00FF00); // Green tint
});

// Set up collision callbacks for blue bouncing enemies
this.physics.add.overlap(player, [bluebouncyenemy1, bluebouncyenemy2, bluebouncyenemy3, bluebouncyenemy4, bluebouncyenemy5], function (player, enemy) {
    bouncingEnemyCollision(player, enemy, 0x0000FF); // Blue tint
});

// Set up collision callbacks for red bouncing enemies
this.physics.add.overlap(player, [redbouncyenemy1, redbouncyenemy2, redbouncyenemy3, redbouncyenemy4, redbouncyenemy5], function (player, enemy) {
    bouncingEnemyCollision(player, enemy, 0xFF0000); // Red tint
});





    // Add animation for bouncing enemies
    this.anims.create({
        key: 'bouncingEnemyAnimation',
        frames: this.anims.generateFrameNumbers('bouncyenemy', { start: 0, end: 12 }),
        frameRate: 10,
        repeat: -1
    });

    bouncingEnemy1.anims.play('bouncingEnemyAnimation', true);
    bouncingEnemy2.anims.play('bouncingEnemyAnimation', true);
    bouncingEnemy3.anims.play('bouncingEnemyAnimation', true);
    bouncingEnemy4.anims.play('bouncingEnemyAnimation', true);
    bouncingEnemy5.anims.play('bouncingEnemyAnimation', true);

    // animation for blue bouncing enemies
       // Add animation for bouncing enemies
        this.anims.create({
            key: 'BluebouncingEnemyAnimation',
            frames: this.anims.generateFrameNumbers('bluebouncyenemy', { start: 0, end: 12 }),
            frameRate: 10,
            repeat: -1
        });

        bluebouncyenemy1.anims.play('BluebouncingEnemyAnimation', true);
        bluebouncyenemy2.anims.play('BluebouncingEnemyAnimation', true);
        bluebouncyenemy3.anims.play('BluebouncingEnemyAnimation', true);
        bluebouncyenemy4.anims.play('BluebouncingEnemyAnimation', true);
        bluebouncyenemy5.anims.play('BluebouncingEnemyAnimation', true);

          // animation for red bouncing enemies
               // Add animation for bouncing enemies
                this.anims.create({
                    key: 'RedbouncingEnemyAnimation',
                    frames: this.anims.generateFrameNumbers('redbouncyenemy', { start: 0, end: 12 }),
                    frameRate: 10,
                    repeat: -1
                });

                redbouncyenemy1.anims.play('RedbouncingEnemyAnimation', true);
                redbouncyenemy2.anims.play('RedbouncingEnemyAnimation', true);
                redbouncyenemy3.anims.play('RedbouncingEnemyAnimation', true);
                redbouncyenemy4.anims.play('RedbouncingEnemyAnimation', true);
                redbouncyenemy5.anims.play('RedbouncingEnemyAnimation', true);


    // Create enemy animations
    this.anims.create({
        key: 'enemyAnimation',
        frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 5 }), // Adjust end frame based on the number of frames in your sprite
        frameRate: 10,
        repeat: -1
    });

    // Play the enemy animation on both enemies
    enemyLeft.anims.play('enemyAnimation', true);
    enemyRight.anims.play('enemyAnimation', true);

     enemyRight.setFlipX(true);





    // Create player animations
       this.anims.create({
           key: 'left',
           frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 14 }),  // Adjust end frame based on the number of frames in your sprite
           frameRate: 25,
           repeat: -1
       });

       this.anims.create({
           key: 'turn',
           frames: [{ key: 'dude', frame: 1 }],  // Adjust frame based on the number of frames in your sprite
           frameRate: 20
       });

       this.anims.create({
           key: 'right',
           frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 14 }),  // Adjust start and end frames based on the number of frames in your sprite
           frameRate: 25,
           repeat: -1
       });

  this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('jumpdude', { start: 0, end: 14, first: 0 }),
        frameRate: 10,
        repeat: -1  // Set repeat to -1 for continuous looping
    });


        this.anims.create({
             key: 'idle',
             frames: this.anims.generateFrameNumbers('idledude', { start: 0, end: 0, first: 0 }),
             frameRate: 5,
             repeat: -1  // Set repeat to -1 for continuous looping
         });
         player.anims.play('idle');



    // Follow the player with the camera
    this.cameras.main.startFollow(player, true, 0.5, 0.5);

    // Create cursor keys
    cursors = this.input.keyboard.createCursorKeys();
        // Add collision between the player and the ground
        this.physics.add.collider(player, [ground, wall, platform, platform1, platform2, platform3, platform4, platform5, platform6]);
        this.physics.add.overlap(player, lasers, laserCollision, null, this);





    // Create on-screen buttons
      leftButton = this.add.sprite(50, 600, 'leftButton').setInteractive();
      rightButton = this.add.sprite(150, 600, 'rightButton').setInteractive();
      jumpButton = this.add.sprite(700, 600, 'jumpButton').setInteractive();


      // Scale the buttons as needed
      leftButton.setScale(2);
      rightButton.setScale(2);
      jumpButton.setScale(2);

      leftButton.setAlpha(0.5);
      rightButton.setAlpha(0.5);
      jumpButton.setAlpha(0.5);


      // Add button events
      leftButton.on('pointerdown', function () {
          cursors.left.isDown = true;
      });

      leftButton.on('pointerup', function () {
          cursors.left.isDown = false;
      });

      rightButton.on('pointerdown', function () {
          cursors.right.isDown = true;
      });

      rightButton.on('pointerup', function () {
          cursors.right.isDown = false;
      });

      jumpButton.on('pointerdown', function () {
          if (player.body.onFloor()) {
              player.setVelocityY(-800);
          }
      });

function laserCollision(player, laser) {

if (laser.isPlayerLaser) {
return;
}
   // Tint the player to purple
      player.setTint(0xE816F3);
playerHealth -= 20;
  // Ensure playerHealth doesn't go below 0
    playerHealth = Math.max(playerHealth, 0);

    // Update the HP bar
    updatePlayerHPBar();
    // Check if the player has an input property before disabling it
    if (player.input) {
        // Disable player input during the tint effect
        player.input.enabled = false;
    }

    // Destroy the laser
    laser.destroy();

    // Set a timeout to reset the player after 500 milliseconds
    setTimeout(function () {
        // Reset tint and re-enable player input if it exists
        player.clearTint();
        if (player.input) {
            player.input.enabled = true;
        }


    }, 1500);
}

function bouncingEnemyCollision(player, enemy, tintColor) {
    // Tint the player based on the specified color
    player.setTint(tintColor);
   playerHealth -= 0.05;
    // Ensure playerHealth doesn't go below 0
       playerHealth = Math.max(playerHealth, 0);

       // Update the HP bar
       updatePlayerHPBar();
    // Disable player input during the tint effect
    if (player.input) {
        player.input.enabled = false;
    }

    // Set a timeout to reset the player after a specified time
    setTimeout(function () {
        // Reset tint and re-enable player input if it exists
        player.clearTint();
        if (player.input) {
            player.input.enabled = true;
        }
    }, 1500);


}

 // Check for collisions between player lasers and enemies
    this.physics.add.overlap(lasers, [bouncingEnemy1, bouncingEnemy2, bouncingEnemy3, bouncingEnemy4, bouncingEnemy5], playerLaserEnemyCollision);
    this.physics.add.overlap(lasers, [bluebouncyenemy1, bluebouncyenemy2, bluebouncyenemy3, bluebouncyenemy4, bluebouncyenemy5], playerLaserEnemyCollision);
    this.physics.add.overlap(lasers, [redbouncyenemy1, redbouncyenemy2, redbouncyenemy3, redbouncyenemy4, redbouncyenemy5], playerLaserEnemyCollision);
     this.physics.add.overlap(lasers, [enemyRight, enemyLeft,], playerLaserEnemyCollision);

    // ... (rest of the previous code)

    // Function to handle player laser and enemy collision
function playerLaserEnemyCollision(enemy, laser) {
    if (laser.isPlayerLaser) {
        enemy.setTint(0x4D0751);

        // Check which enemy is hit and set the corresponding flag to false
        if (enemy === enemyLeft) {
            leftEnemyExists = false;
        } else if (enemy === enemyRight) {
            rightEnemyExists = false;
        }

        setTimeout(() => {
            enemy.destroy();
            areAllEnemiesDefeated();
            // Additional logic or scoring here
        }, 500);

        laser.destroy();
    }
}




function areAllEnemiesDefeated() {
    // Check left and right enemies
    if (!leftEnemyExists && !rightEnemyExists) {
        // Check green bouncing enemies
        if (!bouncingEnemy1.active && !bouncingEnemy2.active && !bouncingEnemy3.active && !bouncingEnemy4.active && !bouncingEnemy5.active) {
            // Check blue bouncing enemies
            if (!bluebouncyenemy1.active && !bluebouncyenemy2.active && !bluebouncyenemy3.active && !bluebouncyenemy4.active && !bluebouncyenemy5.active) {
                // Check red bouncing enemies
                if (!redbouncyenemy1.active && !redbouncyenemy2.active && !redbouncyenemy3.active && !redbouncyenemy4.active && !redbouncyenemy5.active) {
                    // All enemies are defeated, create a new enemy

                    console.log('All enemies are defeated! ');
                }
            }
        }
    }
}

    hpBar = this.add.graphics();

    // Initial update of the HP bar
    updatePlayerHPBar();






  }
function updatePlayerHPBar() {
    // Calculate the width of the HP bar based on the player's health percentage
    var hpBarWidth = (playerHealth / 100) * 100; // Adjust 200 based on your desired maximum width

    // Determine the color based on the player's health
    var barColor = (playerHealth >= 70) ? 0x8DC501 : 0xFF0000; // Green if health is 70 or above, red otherwise

    // Update the HP bar graphics or any UI element you're using
    hpBar.clear();

    // Draw the border
    hpBar.lineStyle(2, 0x000000, 1); // Adjust the line width and color based on your preference
    hpBar.strokeRect(10, 10, 100, 20); // Adjust the position and dimensions based on your preference

    // Draw the filled HP bar
    hpBar.fillStyle(barColor, 1);
    hpBar.fillRect(11, 11, hpBarWidth - 2, 18); // Adjust the position and dimensions based on your preference


}

function gameOverScreen() {
        // Display the game over screen
        document.getElementById('game-over-screen').style.display = 'flex';
        // Additional game over logic if needed
        gameOver = true;
    }

function resetGame() {

    // Reload the game
    window.location.reload();
}



    function restartGame() {
        // Reset the game state
        resetGame();
        // Hide the game over screen
        document.getElementById('game-over-screen').style.display = 'none';
        // Additional reset logic if needed
    }

function update() {

if (!gameOver) {
 hpBar.x = player.x - 50; // Adjust the offset based on your preference
    hpBar.y = player.y - 100;
    // Update the position of the on-screen buttons with the camera
leftButton.x = this.cameras.main.worldView.left + 50;
rightButton.x = this.cameras.main.worldView.left + 150;
jumpButton.x = this.cameras.main.worldView.right - 150;

leftButton.y = this.cameras.main.worldView.bottom - 100;
rightButton.y = this.cameras.main.worldView.bottom - 100;
jumpButton.y = this.cameras.main.worldView.bottom - 100;

    // Player movement code
    if (cursors.left.isDown) {
        // Left movement
        player.setVelocityX(-300);
        player.flipX = true;
        if (player.body.onFloor()) {
            player.anims.play('left', true);
        }
    } else if (cursors.right.isDown) {
        // Right movement
        player.setVelocityX(300);
        player.flipX = false;
        if (player.body.onFloor()) {
            player.anims.play('right', true);
        }
    } else {
        // No movement, play the idle animation
        player.setVelocityX(0);
        if (player.body.onFloor()) {
            player.anims.play('idle', true);
        }
    }

    // Check for the jump key
    if (cursors.up.isDown && player.body.onFloor()) {
        // Player is on the ground and the jump key is pressed
        player.setVelocityY(-800);
        player.anims.play('jump', true);

    } else if (!player.body.onFloor()) {
        // Player is in the air, play the jump animation continuously
        player.anims.play('jump', true);

    }




     if (player.body.velocity.y > 0) {
            // Increase gravity when the player is falling
            player.body.gravity.y = 2000; // You can adjust the gravity value as needed
        } else {
            // Reset gravity to the default value when the player is not falling
            player.body.gravity.y = 250;
        }

         if (cursors.space.isDown && game.getTime() - lastPlayerLaserTime > 300) {
               // Call a function to shoot a player laser
               shootPlayerLaser();

               // Update the last player laser time
               lastPlayerLaserTime = game.getTime();
           }
 // Check if the player's health is less than or equal to 0
    if (playerHealth <= 0) {
gameOverScreen();
    }
}
}


function shootPlayerLaser() {
    // Create a laser at the player's position
    var laser = lasers.create(player.x, player.y + 20, 'purpleLaser');

    // Set the velocity of the laser (adjust as needed)
    laser.setVelocityX(player.flipX ? -800 : 800);

    // Set additional properties for the player laser
    laser.setCollideWorldBounds(false);

    // Flip the laser sprite if shot from the right side
    if (player.flipX) {
        laser.setFlipX(true);
    }

      setTimeout(() => {
                laser.destroy();
                // Additional logic or scoring here
            }, 500);

    // Set a custom property to identify it as a player laser
    laser.isPlayerLaser = true;
}







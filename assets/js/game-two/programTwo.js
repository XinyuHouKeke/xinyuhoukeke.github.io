var keys;
var gameOver = false;

var backgroundImg;
var ground;
var foodGroup;
var chicken;
var fireGroup;

var currentScore;
var currentScoreText;

class MainGame extends Phaser.Scene{
    constructor () {
        super({key: 'MainGame'});
    }

preload () {
    this.load.image('background', '{{ base.url | prepend: site.url }}/assets/img/program-two/background.png');
    this.load.image('food', '{{ base.url | prepend: site.url }}/assets/img/program-two/food.png');
    this.load.image('fire', '{{ base.url | prepend: site.url }}/assets/img/program-two/fire.png');
    this.load.image('ground', '{{ base.url | prepend: site.url }}/assets/img/program-two/ground.png');

    this.load.spritesheet('chicken', 
        '{{ base.url | prepend: site.url }}/assets/img/program-two/chicken.png',
        { frameWidth: 51, frameHeight: 68 }
    );
}

create () {
    backgroundImg = this.add.image(400, 300, 'background');
   
    keys = this.input.keyboard.createCursorKeys();

    ground = this.physics.add.staticGroup();
    ground.create(400,590,'ground');

    foodGroup = this.physics.add.group({
        key: 'food',
        repeat: 0,
        setXY: {x: Phaser.Math.Between(10, 790) , y: 0, stepX: 0}
    });
    foodGroup.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.3));
    });  

    chicken = this.physics.add.sprite(400, 0, 'chicken');
    chicken.setCollideWorldBounds(true);
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('chicken', { start: 0, end: 1 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'stay',
        frames: this.anims.generateFrameNumbers('chicken', { start: 2, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('chicken', { start: 4, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    fireGroup = this.physics.add.group();   

    this.physics.add.collider(fireGroup, ground);
    this.physics.add.collider(chicken, fireGroup, this.die, null, this);

    this.physics.add.collider(ground, chicken);
    this.physics.add.collider(ground, foodGroup);

    this.physics.add.overlap(chicken, foodGroup, this.eatFood, null, this);

    //score
    currentScore = 0;
    currentScoreText = this.add.text(780, 10, 'current score: 0', { fontSize: '12px', color: '#000000', rtl: true });
}

update () {
    //moving
    if (keys.left.isDown) {
        chicken.setVelocityX(-300);
        chicken.anims.play('left', true); 
    } else if (keys.right.isDown) {
        chicken.setVelocityX(300);
        chicken.anims.play('right', true);
    } else {
        chicken.setVelocityX(0);
        chicken.anims.play('stay', true);
    }
}

eatFood (chicken, food) {
    if(gameOver){
        return;
    }
    food.disableBody(true, true);
    currentScore += 1;
    currentScoreText.setText('current score: ' + currentScore);

    if (foodGroup.countActive(true) === 0) {
        foodGroup.children.iterate(function (child) {
            child.enableBody(true, Phaser.Math.Between(10, 790), 0, true, true);
        });

        var fireX = (chicken.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var fire = fireGroup.create(fireX, 16, 'fire');
        fire.setBounce(1);
        fire.setCollideWorldBounds(true);
        fire.setVelocity(Phaser.Math.Between(-200, 200), 30);
        fire.setGravityY(Phaser.Math.Between(200, 500))
    }
}

die () {
    if (gameOver) {
        return;
    }
    chicken.body.setEnable(false);
    chicken.anims.play('stay');

    fireGroup.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.3));
        child.setVelocityX(0);
        child.setGravityY(500)
        child.setBounceX(0);
    });  

    backgroundImg.setTint(0xfa1edd); //0xfa2d1e 0xfa881e 0xfa1edd 0xa1e7d

    game.scene.add('EndScene', EndScene, true);
    gameOver = true;
    }
}

class EndScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'EndScene'
        })
        this.endBox = undefined;
        this.endBoxClosed = false;
    }

    // https://codepen.io/rexrainbow/pen/NEpjmP
    preload() { 
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'phaser-dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });   
    }

    create() {
        let that  = this;
        this.endBox = this.createEndBox(this, function(button) {
            if((button.children[1]._text == 'Restart') && (!that.endBoxClosed)) {
                that.input.on('pointerup', function (pointer) {
                    gameOver = false;
                    that.endBoxClosed = false;
                    game.scene.remove('EndScene');
                    var mainSce = game.scene.getScene('MainGame');
                    mainSce.scene.restart();
                }, that);
            } else { 
                if(!that.endBoxClosed){
                    that.input.on('pointerup', function (pointer) {
                        var endScene = game.scene.getScene('EndScene');
                        endScene.scene.setVisible(false);
                        that.endBoxClosed = true;
                    }, that);       
                }
            } 
        });

    }

    createEndBox (scene, onButtonClick) {
        var endBoxTemp = scene.rexUI.add.dialog({
            x: 400,
            y: 300,
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x9dd9ed), //0x9dd9ed
    
            title: scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 15, 0x68969e), //0x68969e
                text: scene.add.text(0, 0, 'Game Over!', {
                    fontSize: '40px',
                    color: '#ffffff'
                }),
                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                 }
                }),
                
            content: scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 15, 0x7eb6bf), //0x85c1cc
                text: scene.add.text(0, 0, 'Your Score: ' + currentScore, {
                    fontSize: '28px',
                    color: '#335359' //416269
                }),
                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                    }
                }),
                
            actions: [
                scene.rexUI.add.label({
                    background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 15, 0x699e68), //0x919e68
                    text: scene.add.text(0, 0, 'Restart', {
                        fontSize: '20px'
                    }),
                    space: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10
                    }
                }),
                scene.rexUI.add.label({
                    background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 15, 0x88689e), //0x88689e
                    text: scene.add.text(0, 0, 'Cancel', {
                        fontSize: '20px'
                    }),
                    space: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10
                    }
                }),
            ],
    
            actionsAlign: 'left',
    
            space: {
                title: 10,
                content: 10,
                action: 20, //space between button
    
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                }
            })
            .layout()
            .pushIntoBounds()
            .popUp(500);
    
            endBoxTemp
            .on('button.click', function (button) {
                onButtonClick(button);
            })
            .on('button.over', function (button) {
                button.children[0].setStrokeStyle(2, 0xf5f518);
            })
            .on('button.out', function (button) {
                button.children[0].setStrokeStyle();
            });
    
        return endBoxTemp;
    }

    update() {
        let that = this;
        this.input.on('pointerdown', function (pointer) {
            if (that.endBoxClosed) {
                that.input.on('pointerup', function (pointer) {
                    if (that.endBoxClosed) {
                        var endScene = game.scene.getScene('EndScene');
                        endScene.scene.setVisible(true); 
                        that.endBoxClosed = false; 
                    }
                }, that);
            }
        }, this);
        
    }
}

var config = {
    kat: '',
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }
    },
    scene: []
};

var game = new Phaser.Game(config);
game.scene.add('MainGame', MainGame, true);
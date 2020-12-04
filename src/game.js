var MainMenu = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function MainMenu() {
		Phaser.Scene.call(this, {key: 'main_menu'});
	},
	
	preload: function() {
		this.load.spritesheet('spr_enemy', 'assets/spr_enemy.png', { frameWidth: 32, frameHeight: 32 });
		this.load.image('spr_target', 'assets/spr_target.png');
		this.load.image('dude', 'assets/guy.png');
        this.load.image('sight', 'assets/sight.png');
        
		this.load.image('bullet', 'assets/bullet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('9mm', 'assets/9mm.png');
        this.load.image('mouser', 'assets/mouser.png');
        this.load.image('ak47', 'assets/ak47.png');
        this.load.image('m16', 'assets/m16.png');
        this.load.image('mp5', 'assets/mp5.png');
		
		this.load.audio('cock', 'assets/sounds/cock.mp3');
        this.load.audio('gunshot', 'assets/sounds/gunshot.mp3');
        this.load.audio('9mmSound', 'assets/sounds/9mmSound.mp3');
        this.load.audio('12GSound', 'assets/sounds/12GSound.mp3');
        this.load.audio('556Sound', 'assets/sounds/556Sound.mp3');
        this.load.audio('762Sound', 'assets/sounds/762Sound.mp3');
        this.load.audio('45Sound', 'assets/sounds/45Sound.mp3');
			
		this.load.image('terrain', 'assets/terrain.png');
		this.load.image('tilemap', 'assets/tilemap.png');
		this.load.image('main_menu_bg', 'assets/menu_background.png');
		this.load.image('red', 'assets/red.png');
		
		this.load.audio('focus_move', 'assets/focus_move.mp3');
		this.load.audio('confirm', 'assets/confirm.mp3');
		
		this.load.tilemapTiledJSON('stage1', 'src/stages/stage1.json');
		this.load.json('stage1_info', `src/stages/stage1_info.json`);
		
		this.load.tilemapTiledJSON('stage2', 'src/stages/stage2.json');
		this.load.json('stage2_info', `src/stages/stage2_info.json`);
		
		this.load.tilemapTiledJSON('stage3', 'src/stages/stage3.json');
		this.load.json('stage3_info', `src/stages/stage3_info.json`);

		this.load.tilemapTiledJSON('boss_stage', 'src/stages/boss_stage.json');
		this.load.json('boss_stage_info', `src/stages/stage3_info.json`);
	},
	
	create: function() {
		bg = this.add.image(0, 0, 'main_menu_bg',).setOrigin(0);
		start_game = this.add.text(640, 510, 'START GAME', {fontFamily: '"Impact"', fontSize: 50, color: "#361717"}).setOrigin(0.5);
		dont_start = this.add.text(640, 585, "DON'T START", {fontFamily: '"Impact"', fontSize: 50, color: "#361717"}).setOrigin(0.5);
		conf = this.sound.add('confirm');
		focus_move = this.sound.add('focus_move');
		
		start_game.setInteractive();
		dont_start.setInteractive();
		
		start_game.on("pointerover", () => {
			start_game.setColor("#b1a9af");
			focus_move.play();
		});
		
		start_game.on("pointerout", () => {
			start_game.setColor("#361717");
		});
		
		start_game.on("pointerup", () => {
			conf.play();
			this.scene.start('st_b');
			this.scene.stop('main_menu');
		});
		
		dont_start.on("pointerover", () => {
			dont_start.setColor("#b1a9af");
			focus_move.play();
		});
		
		dont_start.on("pointerout", () => {
			dont_start.setColor("#361717");
		});
		
		dont_start.on("pointerup", () => {
			conf.play();
		});
	}
});

var Stage1 = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function Stage1() {
		Phaser.Scene.call(this, {key: 'st_b'});
	},
	
	preload: function() {	
		//this.load.tilemapTiledJSON('stage1', 'src/stages/stage1.json');
		//this.load.json('stage1_info', `src/stages/stage1_info.json`);
	},
	
	create: function() {
		this.next_stage = 2;
		loadStage('boss_stage', this);
		create(this);
	},
	
	update: function() {update(this)}
});

function loadStage(stage_name, scene) {
	scene.stage_finished = false;
	scene.stage = new Stage(scene, stage_name);
	scene.player = new Player(scene, 'dude', scene.stage.spawn_point.x, scene.stage.spawn_point.y);
	scene.enemies = [];
	scene.items = [];
	console.log(scene.stage)
	scene.end_area = scene.add.image(scene.stage.end_area.start.x, scene.stage.end_area.start.y, 'red').setOrigin(0).setDisplaySize(scene.stage.end_area.end.x - scene.stage.end_area.start.x, scene.stage.end_area.end.y - scene.stage.end_area.start.y).setAlpha(0);
	
	scene.physics.add.staticGroup(scene.end_area);
	
	scene.physics.add.overlap(scene.end_area, scene.player.entity, () => {
		if(scene.stage_finished) {
			game.scene.start(`st_${scene.next_stage}`);
			game.scene.stop(scene.scene.key);
			scene.stopped = true;
		}
	});
	
	scene.stage.enemies.forEach((position) => {
		scene.enemies.push(new Enemy(scene, position.x, position.y, scene.player.entity, scene.stage.wall_layer));
	});
	
	scene.stage.items.forEach((item) => {
		let it = new Item(scene, item.x, item.y, item.image, item.name);
		it.createOverlap(scene.player);
		scene.items.push(it);
	});
}


function create(scene) {
    scene.weapons = [];
	sight = new Sight(scene)
	

	camera = scene.cameras.main;
	camera.setZoom(2);
    camera.startFollow(scene.player.entity)
    
	scene.physics.add.collider(scene.player.entity, scene.stage.wall_layer);
	scene.enemies.forEach((enemy) => {
        scene.physics.add.collider(enemy.entity, scene.player.entity, () => scene.player.getHit());
    });
	
    game.canvas.addEventListener('mousedown', function () {
        game.input.mouse.requestPointerLock();
    });
	
    scene.input.on('pointermove', function (e) {
		if (scene.input.mouse.locked) {
            sight.entity.x += e.movementX;
            sight.entity.y += e.movementY;
        }
    }, scene);
	scene.firing = false
    scene.input.on('pointerdown', function (pointer, time, lastFired) {
        scene.firing = true
    }, scene);
    
    scene.input.on('pointerup', function (pointer, time, lastFired) {
        scene.firing = false
    }, scene);
    
}

function update(scene) {
    
    if(scene.firing){
        if (scene.player.entity.active === false)
            return;
        var bullet = null;
        
        if(scene.player.getWeapon()) {
            bullet = scene.player.shoot(scene.player, sight)

            if (bullet) {
                scene.enemies.forEach((enemy) => {
                    scene.physics.add.collider(bullet.entity, scene.stage.wall_layer, () => bullet.entity.destroy());
                    scene.physics.add.overlap(enemy.entity, bullet.entity, () => bullet.hitCallBack(enemy));
                });
            }
        }
        if(scene.player.weapon) {
            if(!scene.player.weapon.automatic) {
                scene.firing = false;
            }
        }
    }
    try {
		scene.player.setRotation(Phaser.Math.Angle.Between(scene.player.entity.x, scene.player.entity.y, sight.entity.x, sight.entity.y));
		scene.player.update();
		
		scene.weapons.forEach((weapon) => {
			weapon.update();
		});

		if(scene.player.entity.active) {
			sight.entity.x += scene.player.entity.body.deltaXFinal();
			sight.entity.y += scene.player.entity.body.deltaYFinal();
		}
		
		scene.enemies.forEach((enemy, index) => {
			if(!enemy.isAlive()) {
				scene.enemies.splice(index, 1);
				
				if(!scene.enemies.length) {
					scene.stage_finished = true;
					scene.end_area.setAlpha(0.35);
				}
			}
			else
				enemy.update(scene.player, scene.stage);
		});
	} catch(e) {
		if(!scene.stopped)
			throw e;
	}
}

var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainMenu, Stage1],
	loaderAsync: false,
	pixelArt: true,
	backgroundColor: "#493743"
};

var game = new Phaser.Game(config);
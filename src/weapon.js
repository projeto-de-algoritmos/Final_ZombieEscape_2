class Weapon {
    constructor(game, weaponName) {
        this.game = game
        this.bullets = game.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.name = weaponName;
        this.ready = true;
        game.weapons.push(this);
        this.counter = 10;
        switch(weaponName) {
            case 'mp5':
                this.sound = '9mmSound';
                this.automatic = true;
				this.damage = 5;
                this.fireLag = 5;
                this.counter = 10;
				this.penetration = 0;
				break;
			case 'mouser':
                this.sound = '9mmSound';
				this.damage = 10;
                this.fireLag = 20;
                this.counter = 10;
				this.penetration = 0;
				break;
			case 'ak47':
                this.sound = '762Sound';
                this.automatic = true;
				this.damage = 50;
				this.fireLag = 6;
				this.counter = 5;
				this.penetration = 5;
				break;
        }
    }

    fire(shooter, target) {
        if(this.ready) {
            var gunshot = this.game.sound.add(this.sound)
            gunshot.play()
            var bullet = new Bullet(this.game, this.damage, this.penetration)
            this.bullets.add(bullet.entity)
            this.ready = false;
            this.counter = 0;
            
            if (bullet.entity) {
                bullet.fire(shooter, target);
                
                return bullet
            }
        }
    }

    update() {
        this.counter += 1;
        if(this.counter >= this.fireLag) {
            this.ready = true;
        }
    }
}
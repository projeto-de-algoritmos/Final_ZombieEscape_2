class Bullet {
    constructor(game, damage, penetration) {
        this.game = game;
        this.entity = game.physics.add.image(0, 0, 'bullet').setDisplaySize(16, 8);
        this.entity.born = 0;
        this.entity.direction = 0;
        this.entity.speed = 1
        this.damage = damage;
		this.penetration = penetration
    }
    
    fire(shooter, target) {
        this.entity.setPosition(shooter.entity.x, shooter.entity.y); // Initial position
        this.entity.direction = Math.atan((target.entity.x - this.entity.x) / (target.entity.y - this.entity.y));
        
        if (target.entity.y >= this.entity.y) {
            this.entity.body.velocity.x = this.entity.speed * Math.sin(this.entity.direction);
            this.entity.body.velocity.y = this.entity.speed * Math.cos(this.entity.direction);
        }
        else {
            this.entity.body.velocity.x = - this.entity.speed * Math.sin(this.entity.direction);
            this.entity.body.velocity.y = - this.entity.speed * Math.cos(this.entity.direction);
        }
        
        this.entity.rotation = shooter.entity.rotation;
        this.game.physics.velocityFromRotation(this.entity.rotation, 1200, this.entity.body.velocity);
        this.entity.born = 0;
    }

    hitCallBack(target) {
        target.getHit(this.damage)
		if(!this.penetration)
			this.entity.destroy()
		else
			this.penetration -= 1;
    }

    update(time, delta) {
        if(this.entity.active) {
            this.entity.born += delta;
            if (this.entity.born > 1800) {
                this.entity.destroy()
            }
        }
    }
}
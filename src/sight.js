class Sight {
    constructor(game, x=0, y=0) {
        this.game = game
        this.entity = this.game.physics.add.sprite(800, 700, 'sight');
        this.entity.setDisplaySize(32, 32);
    }

    setVelocityX(velocity) {
        this.entity.body.velocity.x = velocity
    }

    setVelocityY(velocity) {
        this.entity.body.velocity.y = velocity
    }
}
class Item {
    // entity = null
    constructor(game, x, y, image, itemName) {
        this.game = game
        this.entity = game.physics.add.image(x, y, image);
        this.name = itemName
		this.entity.setDisplaySize(24, 16)
    }

createOverlap(player) {
    switch(this.name) {
        default:
            this.game.physics.add.overlap(this.entity, player.entity, () => {
                player.pickupWeapon(new Weapon(this.game, this.name));
                this.entity.destroy()
            })
        break;
    }
}

    
}
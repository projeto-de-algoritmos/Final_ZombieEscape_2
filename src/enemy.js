class Enemy {
	health = 10;
	constructor(game, x = 0, y = 0, player = null, collision_layer = null, ice) {
		if (ice) {
			this.entity = game.physics.add.sprite(x, y, 'ice_zombie');
		} else {
			this.entity = game.physics.add.sprite(x, y, 'spr_enemy');
		}
		var now = Date.now();
		this.ice = ice;
		this.entity.setScale(.18);
		this.entity.setCollideWorldBounds(true);
		this.target = player;
		this.game = game;
		this.collision_layer = collision_layer;
		this.path = [];
		this.doneCalculating = true;
		this.lastCalculated = now - 101;
	}

	getHit(damage) {
		this.health -= damage;
		console.log('alive', this.health)
		if (this.health <= 0) {
			console.log('dead')
			this.entity.destroy()
		}
	}

	followTarget() {
		this.entity.rotation = Phaser.Math.Angle.Between(this.entity.x, this.entity.y, this.target.x, this.target.y);
		this.game.physics.velocityFromRotation(this.entity.rotation, 200, this.entity.body.velocity);
	}

	followPath(player, stage) {
		var thisTile = stage.map.getTileAtWorldXY(this.entity.x, this.entity.y);
		var playerTile = stage.map.getTileAtWorldXY(player.entity.x, player.entity.y)
		var now = Date.now();
		if (this.path[0]) {
			var next_vertex = stage.floor_graph.getVertex(this.path[0]);
			next_vertex = stage.map.getTileAtWorldXY(next_vertex.centerPosition.x, next_vertex.centerPosition.y)
			if (thisTile && next_vertex) {
				if (thisTile.index == next_vertex.index) {
					this.path.shift();
				}
			}
		}
		if (thisTile && playerTile) {
			if (this.doneCalculating && ((now - this.lastCalculated) >= 500)) {
				this.doneCalculating = false;
				var playerTile = stage.map.getTileAtWorldXY(player.entity.x, player.entity.y);
				var thisNode = thisTile.x + (thisTile.y * stage.floor_layer.layer.width);
				var playerNode = playerTile.x + (playerTile.y * stage.floor_layer.layer.width);
				if (this.ice) {
					const calculate = async () => {
						//console.log('bellman not done')
						stage.floor_graph.bellmanFord(thisNode, playerNode).then((path) => {
							console.log("Bellman",path)
							this.path = path;
							this.doneCalculating = true;
							this.lastCalculated = now;
						});
					}
					calculate();
				} else {
					const calculate = async () => {

						//console.log('bfsn not done')
						stage.floor_graph.BFSShortestPath(thisNode, playerNode).then((path) => {
							this.path = path;
							console.log("Bfs",path)
							this.doneCalculating = true;
							this.lastCalculated = now;
						});
					}
					calculate();
				}
			}

			if (this.path[0]) {
				var next_vertex = stage.floor_graph.getVertex(this.path[0]);
				this.entity.rotation = Phaser.Math.Angle.Between(this.entity.x, this.entity.y, next_vertex.centerPosition.x, next_vertex.centerPosition.y);
				this.game.physics.velocityFromRotation(this.entity.rotation, 200, this.entity.body.velocity);
			} else {
				this.game.physics.velocityFromRotation(this.entity.rotation, 0, this.entity.body.velocity);
			}
		}
	}

	getInput() {
		if (!cast_ray_into_tilemap(this.entity.x, this.entity.y, this.target.x, this.target.y, this.collision_layer).length)
			return 2;
		else if (1)
			return 1;
		return 0;
	}

	update(player, stage) {
		switch (this.getInput()) {
			case 0:
				break;
			case 1:
				this.followPath(player, stage);
				break;
			case 2:
				this.followPath(player, stage);
				break;
		}
	}

	isAlive() {
		if (this.health > 0) {
			return true
		}
		return false
	}
}
class Stage {
	constructor(game, stage_name, tileset='tilemap') {
		this.map = game.make.tilemap({ key: stage_name });
		this.tileset = this.map.addTilesetImage(tileset);
		this.background_layer = this.map.createStaticLayer('Background', tileset, 0, 0);
		this.wall_layer = this.map.createStaticLayer('Walls', tileset, 0, 0);
		this.floor_layer = this.map.createStaticLayer('Floor', tileset, 0, 0);
		this.ice_layer = this.map.createStaticLayer('Ice', tileset, 0, 0);

		//Dynamic loading is async and is pending a solution.
		//game.load.json(stage_name, `/src/stages/${stage_name}_info.json`);
		//game.load.start();
		let stage_json = game.cache.json.get(stage_name + '_info');
		this.spawn_point = stage_json.spawn_point;
		this.enemies = stage_json.enemies;
		this.end_area = stage_json.end_area;
		this.items = stage_json.items;
		
		this.generateFloorGraph();
		this.wall_layer.setCollisionBetween(0, 999);
	}
	
	generateFloorGraph() {
		this.floor_graph = new Graph();
		let offset = this.floor_layer.layer.baseTileHeight/2;
		
		for(var x = 0; x < this.floor_layer.layer.height; x += 1)
			for(var y = 0; y < this.floor_layer.layer.width; y += 1)
				if(this.floor_layer.layer.data[x][y].index != -1)
					this.floor_graph.addVertex(x * this.floor_layer.layer.width + y, {centerPosition: {y: x * this.floor_layer.layer.baseTileHeight + offset, x: y * this.floor_layer.layer.baseTileHeight + offset}});
				
		this.floor_graph.adjList.forEach((vertex, id) => {
			if(this.floor_graph.getVertex(id + 1))
				this.floor_graph.addEdge(id, id + 1);
			
			if(this.floor_graph.getVertex(id + this.floor_layer.layer.width))
				this.floor_graph.addEdge(id, id + this.floor_layer.layer.width);
			
			if(this.floor_graph.getVertex(id + this.floor_layer.layer.width + 1))
				this.floor_graph.addEdge(id, id + this.floor_layer.layer.width + 1);
		});
	}
}

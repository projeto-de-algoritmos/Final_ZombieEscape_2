function cast_ray_into_tilemap(x0, y0, x1, y1, layer) {
	ray = new Phaser.Geom.Line(x0, y0, x1, y1);
	return layer.getTilesWithinShape(ray, {isNotEmpty: true})
}

class Graph {
	constructor() {
		// this.vertices = 0;
		this.adjList = new Map();
		this.size = 0;
		this.edges = 0;
		this.edgeList = [];
		this.hasCycle = false;
	}
	
	addVertex(v, info = {}) {
		this.adjList.set(v, {...info, edges: []});
		this.size++;
	}
	
	addEdge(v1, v2, weight) {
		this.adjList.get(v1).edges.push({edge: v2, weight: weight});
		this.adjList.get(v2).edges.push({edge: v1, weight: weight});
		this.edgeList.push({src: v1, dest: v2, weight: weight});
		this.edges++;
	}
	
	getVertex(v) {
		return this.adjList.get(v);
	}

	BFSShortestPath(vRoot, vDestination) {
		if(vRoot == vDestination) {
			return [vDestination]
		}
		var originTreeEdge = new Array();
		var destinationTreeEdge = new Array();
		var queue = new Array();
		var visitedNodes = new Array();
		var run = true;
		
		queue.push(vRoot);
		visitedNodes.push(vRoot);
		
		while(queue.length > 0 && run) {
			var uNode = queue.shift()
			this.adjList.get(uNode).edges.forEach(vNode => {
				if(!visitedNodes.includes(vNode) && run) {
					originTreeEdge.unshift(uNode)
					destinationTreeEdge.unshift(vNode)
					if(vNode == vDestination || uNode == vDestination) {
						run = false;
					}
					if(run) {
						visitedNodes.push(vNode)
						queue.push(vNode)
					}
				}
			});
		}

		run = true;
		var path = new Array()
		var destination = vDestination;
		destinationTreeEdge.forEach((node, index) => {
			if(node == destination && run) {
				path.unshift(node)
				destination = originTreeEdge[index];
				if(destination == vRoot) {
					run = false;
				}
			}
			
		})
		return path[0];
	}

	bellmanFord(start_node, last_node){
		let distance = {};
		let predecessor = {};
		let path = [];
		let target = last_node;
	
		for(let i = 0; i < this.size; i++){
			distance[i] = INF;
		}
		distance[start_node] = 0;
	
		for(let i = 1; i < this.size; i++){
			for(let j = 0; j < this.edges; j++){
				let edge = this.edgeList[j]
				let u = edge.src;
				let v = edge.dest;
				let w = edge.weight;
	
				if(distance[u] != INF && distance[u] + w < distance[v]){
					distance[v] = distance[u] + w;
					predecessor[v] = u;
				}
			}
		}
	
		for(let i = 0; i < this.edges; i ++){
			let edge = this.edgeList[i]
			let u = edge.src;
			let v = edge.dest;
			let w = edge.weight;
			
			if(distance[u] != INF && distance[u] + w < distance[v]){
				
				this.hasCycle = true;
			}
					
		}
	
		if(this.hasCycle){
			console.log("Ciclo negativo");
		}
			
		else{
		
			while(target != null){
				path.unshift(target);
				target = predecessor[target]
			}
		}
		return path;
	}
}
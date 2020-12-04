function cast_ray_into_tilemap(x0, y0, x1, y1, layer) {
	ray = new Phaser.Geom.Line(x0, y0, x1, y1);
	return layer.getTilesWithinShape(ray, {isNotEmpty: true})
}

class Graph {
	constructor() {
		// this.vertices = 0;
		this.adjList = new Map();
	}
	
	addVertex(v, info = {}) {
		this.adjList.set(v, {...info, edges: []});
	}
	
	addEdge(v1, v2) {
		this.adjList.get(v1).edges.push(v2);
		this.adjList.get(v2).edges.push(v1);
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
}
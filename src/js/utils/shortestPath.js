import Graph from './graph';
import floorPlan from '../common/floorPlan';
import { createGlobalPathMap, createKey } from './misc';

export default function calcShortestPath(startNode, endNode) {
    const paths = floorPlan.map.paths;
    const updatedFloorPlan = [
        ...paths,
        { x1: startNode.point.x, y1: startNode.point.y, x2: startNode.selectedPath.x1, y2: startNode.selectedPath.y1},
        { x1: startNode.point.x, y1: startNode.point.y, x2: startNode.selectedPath.x2, y2: startNode.selectedPath.y2},
        { x1: endNode.point.x, y1: endNode.point.y, x2: endNode.selectedPath.x2, y2: endNode.selectedPath.y2},
        { x1: endNode.point.x, y1: endNode.point.y, x2: endNode.selectedPath.x2, y2: endNode.selectedPath.y2},
    ];
    const map = createGlobalPathMap(updatedFloorPlan);

    const graph = new Graph(map);
    const shortestPath = graph.findShortestPath(createKey(startNode.point.x, startNode.point.y), createKey(endNode.point.x, endNode.point.y));
    
    const shortestPathArr = [];
    for(let i = 0; i < shortestPath.length - 1; i++) {
        const point1 = shortestPath[i].split(',');
        const point2 = shortestPath[i+1].split(',');
        shortestPathArr.push({
            x1: point1[0],
            y1: point1[1],
            x2: point2[0],
            y2: point2[1],
        });
    }
    return shortestPathArr;
}

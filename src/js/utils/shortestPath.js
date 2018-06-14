import Graph from './graph';
import floorPlan from '../common/floorPlan';
import { createGlobalPathMap, createKey } from './misc';

export default function calcShortestPath(startNode, endNode) {
    const paths = floorPlan.map.paths;
    const updatedFloorPlan = [
        ...paths,
        { x1: startNode.path.x, y1: startNode.path.y, x2: startNode.selectedPath.x1, y2: startNode.selectedPath.y1},
        { x1: startNode.path.x, y1: startNode.path.y, x2: startNode.selectedPath.x2, y2: startNode.selectedPath.y2},
        { x1: endNode.path.x, y1: endNode.path.y, x2: endNode.selectedPath.x2, y2: endNode.selectedPath.y2},
        { x1: endNode.path.x, y1: endNode.path.y, x2: endNode.selectedPath.x2, y2: endNode.selectedPath.y2},
    ];
    const map = createGlobalPathMap(updatedFloorPlan);
    
    const graph = new Graph(map);
    return graph.findShortestPath(createKey(startNode.path.x, startNode.path.y), createKey(endNode.path.x, endNode.path.y));
}

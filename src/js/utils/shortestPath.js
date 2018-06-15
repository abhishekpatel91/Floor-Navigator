import Graph from './graph';
import floorPlan from '../common/floorPlan';
import { createGlobalPathMap, createKey } from './misc';

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

/**
 * Returns the path and nearest point on that path
 * to the given entity.
 * Returned object is of following format
 *  {
 *      path: { x, y }
 *      selectedPath: { x1, y1, x2, y2 }
 *  }
 *
 * @param {*} entity
 * @param {*} paths
 */
export function findNearestPath(entity, paths) {
    const x = parseInt(entity.x) + parseInt(entity.width) / 2,
        y = parseInt(entity.y) + parseInt(entity.height) / 2;
    let d = Number.MAX_SAFE_INTEGER;
    let selectedPath, point;

    for (let path of paths) {
        const x1 = parseInt(path.x1),
            y1 = parseInt(path.y1),
            x2 = parseInt(path.x2),
            y2 = parseInt(path.y2);

        // const distance = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
        //     Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1))
        const distance = getDistance(x, y, (x1 + x2) / 2, (y1 + y2) / 2);
        if (distance < d) {
            d = distance;
            selectedPath = path;

            const m = (y2 - y1) / (x2 - x1);
            if (Number.isFinite(m)) {
                if (m !== 0) {
                    const c2 = y + x / m;
                    point = {
                        x: (c2 - c1) / (m * m + 1),
                        y: (m * m * c1 + m * c2) / (m * m + 1)
                    }
                } else {
                    point = {
                        x,
                        y: y1
                    }
                }
            } else {
                point = {
                    x: x1,
                    y: y
                }
            }

        }
    }

    const a = getDistance(
        parseInt(point.x), parseInt(point.y),
        parseInt(selectedPath.x2), parseInt(selectedPath.y2)
    );
    const b = getDistance(
        parseInt(point.x), parseInt(point.y),
        parseInt(selectedPath.x1), parseInt(selectedPath.y1)
    );
    const c = getDistance(
        parseInt(selectedPath.x1), parseInt(selectedPath.y1),
        parseInt(selectedPath.x2), parseInt(selectedPath.y2)
    );

    if (c === a + b) {
        return {
            point,
            selectedPath
        }
    } else {
        return {
            point : {
                x: selectedPath.x1,
                y: selectedPath.y1
            },
            selectedPath
        }
    }
}

export default function calcShortestPath(startNode, endNode) {
    const paths = floorPlan.map.paths;
    const updatedFloorPlan = [
        ...paths,
        { x1: startNode.point.x, y1: startNode.point.y, x2: startNode.selectedPath.x1, y2: startNode.selectedPath.y1},
        { x1: startNode.point.x, y1: startNode.point.y, x2: startNode.selectedPath.x2, y2: startNode.selectedPath.y2},
        { x1: endNode.point.x, y1: endNode.point.y, x2: endNode.selectedPath.x1, y2: endNode.selectedPath.y1},
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

export function createKey(x, y) {
    return `${x},${y}`;
}

export function calcDistance(s, e) {
    const dist = Math.sqrt(Math.pow((e.y - s.y), 2) + Math.pow((e.x - s.x), 2));
    return parseInt(dist);
}

export function createGlobalPathMap(paths) {
    const map = {};
    paths.map((path) => {
        const key1 = createKey(path.x1, path.y1);
        const key2 = createKey(path.x2, path.y2);

        if(!map[key1]) {
            map[key1] = {};
        }
        if(!map[key2]) {
            map[key2] = {};
        }

        map[key1][key2] = calcDistance({ x: path.x1, y: path.y1}, { x: path.x2, y: path.y2});
        map[key2][key1] = calcDistance({ x: path.x1, y: path.y1}, { x: path.x2, y: path.y2});
    });
    return map;
}
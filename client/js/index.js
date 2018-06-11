function initCanvas(elm, background='#dcdcdc') {
    return origami(elm)
        .background(background);
}

function createFloorCanvas(canvas, floorPlan) {
    const { meta, map } = floorPlan;
    const { color:fillColor,  dimensions } = meta;

    for( let key in map) {
        const entity = map[key];
        const entityDimensions = dimensions[key];
        const entityStyle = fillColor[key]

        entity.forEach(block => {
            const width = block.width || entityDimensions[0];
            const height = block.height || entityDimensions[1];
            bgColor = block.color || entityStyle;

            canvas
            .rect(block.x, block.y, width, height, {
                background: bgColor,
                border: '1px solid #000'
            })
            .draw();
        });
    }
}

const myCanvas = initCanvas('.canvas-class');
const myFloorPlan = window.floorPlan;

createFloorCanvas(myCanvas, myFloorPlan);

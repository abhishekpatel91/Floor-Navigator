import React from 'react';

import floorPlan from './common/floorPlan';
const textStyle = {
    fontSize: '80px',
    color: '#000',
    zIndex: 1000,
    align: 'center',
}

function initCanvas(elm, background = '#dcdcdc') {
    return origami(elm)
        .background(background);
}

function createFloorCanvas(canvas, floorPlan) {
    const { meta, map } = floorPlan;
    const { color: fillColor, dimensions } = meta;

    for (let key in map) {
        const entity = map[key];
        const entityDimensions = dimensions[key];
        const entityStyle = fillColor[key]

        if (key === 'paths') {
            createPaths(canvas, entity);
        }

        entity.forEach(block => {
            const width = block.width || entityDimensions[0];
            const height = block.height || entityDimensions[1];
            const bgColor = block.color || entityStyle;

            canvas
            .rect(+block.x, +block.y, width, height, {
                background: bgColor,
                border: '1px solid #000'
            })
            .draw();
        });
    }
}

function createPaths(canvas, entity) {
    entity.forEach((block) => {
        const x1 = +block.x1;
        const x2 = +block.x2;
        const y1 = +block.y1;
        const y2 = +block.y2;

        canvas
        .line({x : x1, y: y1}, {x : x2, y: y2}, {
            border: '5px dashed #c83349'
        })
        .text(`${x1}, ${y1}`, x1, y1, textStyle)
        .text(`${x2}, ${y2}`, x2, y2, textStyle)
        .draw();
    });
}

export default class FloorMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const canvas = initCanvas('.canvas-class');
        createFloorCanvas(canvas, floorPlan);
    }

    render() {
        return (
            <div className="container">
                <canvas className="canvas-class" ref={this.canvasRef}></canvas>
            </div>
        );
    }
}

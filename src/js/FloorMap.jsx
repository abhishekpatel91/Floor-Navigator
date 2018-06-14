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

            canvas.setStart();
            canvas
            .rect(+block.x, +block.y, width, height)
            .attr({
                fill: bgColor,
                stroke: '#000'
                });
            canvas.text(parseInt(block.x) + parseInt(width) / 2, parseInt(block.y) + parseInt(height) / 2, `${block.id || ''}`)
            .attr({ fill: '#000', "font-size": 15 });
            canvas.setFinish();
        });
    }
}

function createPaths(canvas, entity) {
    entity.forEach((block) => {
        const x1 = block.x1;
        const x2 = block.x2;
        const y1 = block.y1;
        const y2 = block.y2;

        canvas.path(`M${x1} ${y1}L${x2} ${y2}Z`)
            .attr({
                'stroke': '#c83349',
                'stroke-dasharray': '.',
                'stroke-width': 5
            });
            
        // .text(`${x1}, ${y1}`, x1, y1, textStyle)
        // .text(`${x2}, ${y2}`, x2, y2, textStyle)

    });
}

export default class FloorMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        // const canvas = initCanvas(this.canvasRef.current);

        const canvas = Raphael(0, 0, 3335, 4040);
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

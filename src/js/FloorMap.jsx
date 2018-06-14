import React from 'react';

import floorPlan from './common/floorPlan';

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

        entity.forEach(block => {
            const width = block.width || entityDimensions[0];
            const height = block.height || entityDimensions[1];
            const bgColor = block.color || entityStyle;

            canvas
                .rect(block.x, block.y, width, height, {
                    background: bgColor,
                    border: '1px solid #000'
                })
                .draw();
        });
    }
}

export default class FloorMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        // const canvas = initCanvas(this.canvasRef.current);

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

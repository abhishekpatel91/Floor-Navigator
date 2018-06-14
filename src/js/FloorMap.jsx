import React from 'react';
import floorPlan from './common/floorPlan';

const pathStyle = {
    'stroke': '#c83349',
    'stroke-width': 5
}

export default class FloorMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
    }

    camelToSentenceCase = (str) => {
        const result = str.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    handleTileClick = (event, area, type) => {
        this.props.onMapClick(
            type,
            area.id
        );
    }

    createFloorCanvas = (canvas, floorPlan) => {
        const { meta, map } = floorPlan;
        const { color: fillColor, dimensions } = meta;

        for (let key in map) {
            const entity = map[key];
            const entityDimensions = dimensions[key];
            const entityStyle = fillColor[key]

            if (key === 'paths') {
                this.createPaths(canvas, entity, pathStyle);
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
                        stroke: '#000',
                        cursor: 'pointer'
                    })
                    .click((event) => {
                        this.handleTileClick(event, block, key);
                    });
                canvas
                    .text(parseInt(block.x) + parseInt(width) / 2, parseInt(block.y) + parseInt(height) / 2, `${block.id || ''}`)
                    .attr({ fill: '#000', "font-size": 15, cursor: 'pointer' })
                    .click((event) => {
                        this.handleTileClick(event, block, key);
                    });
                canvas.setFinish();
            });
        }
    }

    createPaths = (canvas, entity, pathStyle) => {
        entity.forEach((block) => {
            const x1 = block.x1;
            const x2 = block.x2;
            const y1 = block.y1;
            const y2 = block.y2;

            canvas.path(`M${x1} ${y1}L${x2} ${y2}Z`)
                .attr(pathStyle);


        });
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
    findNearestPath = (entity, paths) => {
        const x = parseInt(entity.x),
            y = parseInt(entity.y);
        let d = Number.MAX_SAFE_INTEGER;
        let selectedPath, point;

        for (let path of paths) {
            const x1 = parseInt(path.x1),
                y1 = parseInt(path.y1),
                x2 = parseInt(path.x2),
                y2 = parseInt(path.y2);

            const distance = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
                Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
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

        return {
            point,
            selectedPath
        }
    }

    componentDidMount() {
        const canvas = Raphael(this.containerRef.current, 3335, 4040);
        this.createFloorCanvas(canvas, floorPlan);
    }

    render() {
        return (
            <div className="container" ref={this.containerRef}>
            </div>
        );
    }
}

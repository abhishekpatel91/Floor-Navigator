import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import floorPlan from './common/floorPlan';
import Hammer from 'hammerjs';

const pathStyle = {
    'stroke': '#c83349',
    'stroke-width': 5
}

const floorSize = {
    height: 4040,
    width: 3335
};

const leastSize = {
    height: 404,
    width: 333
};

const partitionSize = {
    height: 363.6,
    width: 300.2
};

const ZoomButtons = styled.div`
    position: fixed;
    right: 10px;
    top: 100px;

    .button {
        padding: 5px;
        margin: 2px;
        display: inline-block;
        width: 32px;
        height: 32px;
        font-size: 20px;
        text-align: center;
        cursor: pointer;
        background: white;
        box-shadow: rgba(100, 100, 100, 0.4) 1px 2px 5px 0;
    }
`;

const MAX_ZOOM = 10;
const DEFAULT_ZOOM = 8;

export default class FloorMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
        this.setSizeThrottled = _.throttle(this.setSize, 500);
        this.zoom = DEFAULT_ZOOM;
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

    createFloorCanvas = (floorPlan) => {
        const { meta, map } = floorPlan;
        const { color: fillColor, dimensions } = meta;

        for (let key in map) {
            const entity = map[key];
            const entityDimensions = dimensions[key];
            const entityStyle = fillColor[key]

            if (key === 'paths') {
                this.createPaths(entity, pathStyle);
            }

            entity.forEach(block => {
                const width = block.width || entityDimensions[0];
                const height = block.height || entityDimensions[1];
                const bgColor = block.color || entityStyle;

                this.canvas.setStart();
                this.canvas
                    .rect(+block.x, +block.y, width, height)
                    .attr({
                        fill: bgColor,
                        stroke: '#000',
                        cursor: 'pointer'
                    })
                    .click((event) => {
                        this.handleTileClick(event, block, key);
                    });
                this.canvas
                    .text(parseInt(block.x) + parseInt(width) / 2, parseInt(block.y) + parseInt(height) / 2, `${block.id || ''}`)
                    .attr({ fill: '#000', "font-size": 15, cursor: 'pointer' })
                    .click((event) => {
                        this.handleTileClick(event, block, key);
                    });
                this.canvas.setFinish();
            });
        }
    }

    createPaths = (entity, pathStyle) => {
        entity.forEach((block) => {
            const x1 = block.x1;
            const x2 = block.x2;
            const y1 = block.y1;
            const y2 = block.y2;

            this.canvas.path(`M${x1} ${y1}L${x2} ${y2}Z`)
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

    setSize = (size) => {
        this.zoom = Math.min(size, MAX_ZOOM);
        this.zoom = Math.max(this.zoom, 1);
        if (this.canvas) {
            this.canvas.setSize(leastSize.width + (partitionSize.width * this.zoom), leastSize.height + (partitionSize.height * this.zoom));
        }
    }

    componentDidMount() {
        this.canvas = Raphael(this.containerRef.current, leastSize.width * MAX_ZOOM, leastSize.height * MAX_ZOOM);
        this.canvas.setViewBox(0, 0, floorSize.width, floorSize.height, true);
        this.createFloorCanvas(floorPlan);

        this.hammer = new Hammer(this.containerRef.current);
        this.hammer.get('pinch').set({ enable: true });
        this.hammer.on('pan', event => {
            if (this.left === undefined)
                this.left = this.containerRef.current.scrollLeft;
            if (this.top === undefined)
                this.top = this.containerRef.current.scrollTop;

            this.containerRef.current.scrollTo(this.left - event.deltaX, this.top - event.deltaY);

            if (event.isFinal) {
                this.left = undefined;
                this.top = undefined;
            }
        });

        this.hammer.on('pinchin', event => {
            console.log('pinchin', event.scale, this.zoom);
            this.setSizeThrottled(this.zoom - 2);
        });

        this.hammer.on('pinchout', event => {
            console.log('pinchout', event.scale, this.zoom);
            this.setSizeThrottled(this.zoom + 2);
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="container" style={{ overflow: 'hidden' }} ref={this.containerRef}>
                </div>
                <ZoomButtons>
                    <div className="button" onClick={() => this.setSize(this.zoom + 1)}>+</div>
                    <div className="button" onClick={() => this.setSize(this.zoom - 1)}>-</div>
                </ZoomButtons>
            </React.Fragment>
        );
    }
}

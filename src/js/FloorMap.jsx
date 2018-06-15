import React from 'react';
import queryString from 'query-string';
import floorPlan from './common/floorPlan';
import Hammer from 'hammerjs';
import calcShortestPath, { findNearestPath } from './utils/shortestPath';

const pathStyle = {
    'stroke': '#f2f2f2',
    'stroke-width': 25
}

const highlightedStye = {
    'stroke': '#2274A5',
    'stroke-width': 25
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
        canvas.path('M 0 0 L 2378 0 L 2378 1450 L 3335 1450 L 3335 4040 L 0 4040 Z').attr('fill', '#D8E4BC')

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

    findEntity = (entityId, entityList) => {
        return entityList.find(entity => entity.id === entityId);
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

    plotPath = (props) => {
        const { from, to } = queryString.parse(props.location.hash);
        
        if (from && to) {
            const fromNode = from.split(',');
            const toNode = to.split(',');
            const startNode = this.findEntity(fromNode[1], floorPlan.map[fromNode[0]]);
            const endNode = this.findEntity(toNode[1], floorPlan.map[toNode[0]]);            
            if (startNode && endNode){
                const calculatedPath = calcShortestPath(
                    findNearestPath(startNode, floorPlan.map.paths),
                    findNearestPath(endNode, floorPlan.map.paths)
                );
                this.createPaths(this.canvas, floorPlan.map.paths, pathStyle);
                this.createPaths(this.canvas, calculatedPath, highlightedStye);
            }
        }
    }

    componentDidMount() {
        this.canvas = Raphael(this.containerRef.current, 3335, 4040);
        this.createFloorCanvas(this.canvas, floorPlan);

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

        this.plotPath(this.props);
    }

    UNSAFE_componentWillUpdate(nextProps) {
        if (nextProps.location !== this.props.location)
            this.plotPath(nextProps);
    }

    render() {
        return (
            <React.Fragment>
                <div className="container" style={{ overflow: 'hidden' }} ref={this.containerRef}>
                </div>
            </React.Fragment>
        );
    }
}

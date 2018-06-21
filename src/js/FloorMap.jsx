import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import queryString from 'query-string';
import floorPlan from './common/floorPlan';
import Hammer from 'hammerjs';
import calcShortestPath, { findNearestPath } from './utils/shortestPath';

const pathStyle = {
    'stroke': '#f2f2f2',
    'stroke-width': 25
}

const pinStyle = {
    'stroke': '#B71C1C',
    'stroke-width': 1,
    'fill': '#F44336'
};

const highlightedStye = {
    'stroke': '#2274A5',
    'stroke-width': 25
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
    top: 150px;

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
        this.setZoomSizeThrottled = _.throttle(this.setZoomSize, 500);
        this.zoom = DEFAULT_ZOOM;
        this.currentLeft = 1600;
        this.currentRight = 2000;
        this.pin = null;
    }

    componentDidMount() {
        this.boundaryCalculation(this.props);
        this.setPin(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.props.pin !== nextProps.pin ||
            this.props.from !== nextProps.from ||
            this.props.to !== nextProps.to
        ) {
            this.boundaryCalculation(nextProps);
            this.setPin(nextProps);
        }
    }

    setPin = (props) => {
        const pin = props.pin || props.to;
        this.pin && this.pin.remove();
        if (pin) {
            const entity = this.getEntityForString(pin);
            this.pin = this.canvas &&
                this.canvas.path(this.getPinPath(+entity.x + (entity.width / 2), +entity.y + (entity.height / 2) - 30))
                    .attr(pinStyle);
        }
    }

    boundaryCalculation = (props) => {
        let x = this.currentLeft;
        let y = this.currentRight;
        const boundary = props.pin || props.from;
        if (boundary) {
            const entity = this.getEntityForString(boundary);
            x = +entity.x + (entity.width / 2);
            y = +entity.y + (entity.height / 2);
        }
        this.fitBoundary(x, y);
    }

    getEntityForString = (pinString) => {
        const [type, id] = pinString.split(',');
        return this.findEntity(id, floorPlan.map[type]);
    }

    fitBoundary(x, y) {
        this.setZoomSize(6);
        const fittedX = (leastSize.width + (partitionSize.width * this.zoom)) * x / floorSize.width;
        const fittedY = (leastSize.height + (partitionSize.height * this.zoom)) * y / floorSize.height;
        this.moveTo(Math.max(fittedX - (window.innerWidth / 2), 0), Math.max(fittedY - (window.innerHeight / 2), 0));
        // this.setState({
        //     top: y,
        //     left: x,
        // })
    }

    camelToSentenceCase = (str) => {
        const result = str.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    handleTileClick = (event, area, type) => {
        console.log(event, area);
        this.props.onMapClick(
            type,
            area.id
        );
    }

    createFloorCanvas = (floorPlan) => {
        this.canvas.path(floorPlan.meta.boundary).attr('fill', floorPlan.meta.color.boundary);

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
                    .text(parseInt(block.x) + parseInt(width) / 2, parseInt(block.y) + parseInt(height) / 2, `${block.name || block.id || ''}`)
                    .attr({ fill: '#000', "font-size": 15, cursor: 'pointer' })
                    .click((event) => {
                        this.handleTileClick(event, block, key);
                    });
                this.canvas.setFinish();
            });
        }
    }

    findEntity = (entityId, entityList) => {
        return entityList.find(entity => entity.id === entityId);
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

    plotPath = (props) => {
        const { from, to } = queryString.parse(props.location.hash);

        if (from && to) {
            const fromNode = from.split(',');
            const toNode = to.split(',');
            const startNode = this.findEntity(fromNode[1], floorPlan.map[fromNode[0]]);
            const endNode = this.findEntity(toNode[1], floorPlan.map[toNode[0]]);
            if (startNode && endNode) {
                const calculatedPath = calcShortestPath(
                    findNearestPath(startNode, floorPlan.map.paths),
                    findNearestPath(endNode, floorPlan.map.paths)
                );
                this.createPaths(floorPlan.map.paths, pathStyle);
                this.createPaths(calculatedPath, highlightedStye);
            }
        }
    }

    setZoomSize = (size) => {
        this.zoom = Math.min(size, MAX_ZOOM);
        this.zoom = Math.max(this.zoom, 0);
        if (this.canvas) {
            this.canvas.setSize(leastSize.width + (partitionSize.width * this.zoom), leastSize.height + (partitionSize.height * this.zoom));
        }
    }

    moveTo = (x, y) => {
        this.containerRef.current.scrollTo(x, y);
    }

    getPinPath(x, y) {
        return `M${x} ${y}c -3.3120000000000003 0 -6 -2.688 -6 -6 s 2.688 -6 6 -6 6 2.688 6 6 -2.688 6 -6 6 m 0 -15 c -4.971 0 -9 4.029 -9 9 s 4.029 9 9 9 9 -4.029 9 -9 -4.029 -9 -9 -9 m -21 7.805999999999999 c 0 -10.551 9.812999999999999 -19.806 21 -19.806 s 21 9.254999999999999 21 19.806 c 0 10.365 -7.689 22.629 -21 43.580999999999996 -13.466999999999999 -21.219 -21 -33.215999999999994 -21 -43.580999999999996 m 21 -22.806 c -12.594000000000001 0 -24 10.209 -24 22.806 0 12.594000000000001 10.407 27.630000000000003 24 49.194 13.593 -21.564 24 -36.599999999999994 24 -49.194 0 -12.597 -11.403 -22.806 -24 -22.806 Z`;
        // return `M${x} ${y}c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2m0-5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3m-7 2.602c0-3.517 3.271-6.602 7-6.602s7 3.085 7 6.602c0 3.455-2.563 7.543-7 14.527-4.489-7.073-7-11.072-7-14.527m7-7.602c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602`;
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

            this.moveTo(this.left - event.deltaX, this.top - event.deltaY);

            if (event.isFinal) {
                this.currentLeft = this.containerRef.current.scrollLeft;
                this.currentRight = this.containerRef.current.scrollTop;
                this.left = undefined;
                this.top = undefined;
            }
        });

        this.hammer.on('pinchin', event => {
            console.log('pinchin', event.scale, this.zoom);
            this.setZoomSizeThrottled(this.zoom - 2);
        });

        this.hammer.on('pinchout', event => {
            console.log('pinchout', event.scale, this.zoom);
            this.setZoomSizeThrottled(this.zoom + 2);
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
                <ZoomButtons>
                    <div className="button" onClick={() => this.setZoomSize(this.zoom + 1)}>+</div>
                    <div className="button" onClick={() => this.setZoomSize(this.zoom - 1)}>-</div>
                </ZoomButtons>
            </React.Fragment>
        );
    }
}

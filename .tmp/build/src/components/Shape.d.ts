import * as d3 from 'd3';
export declare class Shape {
    private container;
    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>);
    drawShape(x: number, y: number, shapeData: {
        type: string;
        color: string;
        stroke: string;
        shapeStroke: number;
    }, containerWidth: number, containerHeight: number): d3.Selection<SVGElement, unknown, HTMLElement, any>;
}

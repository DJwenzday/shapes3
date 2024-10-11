import * as d3 from 'd3';
export declare class Shape {
    private container;
    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>);
    drawShape(x: number, y: number, shapeData: any): d3.Selection<SVGElement, unknown, HTMLElement, any>;
}

import * as d3 from 'd3';
export declare class Separators {
    private container;
    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>);
    drawVerticalLine(xPosition: number, height: number, settings: any): void;
    drawHorizontalLine(yPosition: number, width: number, settings: any): void;
}

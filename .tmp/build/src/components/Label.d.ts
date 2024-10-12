import * as d3 from 'd3';
export declare class Label {
    private container;
    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>);
    drawLabel(x: number, y: number, text: string, position: string, font: string, fontSize: number, fontColor: string, shapeSize: number): void;
}

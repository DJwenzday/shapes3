import * as d3 from 'd3';
import powerbi from 'powerbi-visuals-api';
import DataView = powerbi.DataView;
export declare class Shape {
    private container;
    private tooltipService;
    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>);
    drawShape(x: number, // X-coordinate for the shape's position
    y: number, // Y-coordinate for the shape's position
    shapeData: {
        type: string;
        defaultColor: string;
        defaultStroke: string;
        width: number;
    }, // Shape properties
    shapeSize: number, // Size of the shape
    measureSettings: any, // Custom settings for the measure
    dataView: DataView, // The DataView object for data and settings access
    tooltipText: string): d3.Selection<SVGElement, unknown, HTMLElement, any>;
    private getConditionalFormattingColor;
}

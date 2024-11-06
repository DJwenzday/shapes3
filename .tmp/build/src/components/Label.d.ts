import * as d3 from 'd3';
import powerbi from 'powerbi-visuals-api';
import DataView = powerbi.DataView;
export declare class Label {
    private container;
    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, string>);
    drawLabel(x: number, // X-coordinate for the label
    y: number, // Y-coordinate for the label
    text: string, // The text content of the label
    position: string, // Positioning: 'above' or 'centered'
    font: string, // Font family for the label text
    fontSize: number, // Size of the font
    defaultFontColor: string, // Default color for the label
    shapeSize: number, // Size of the associated shape
    shapeType: string, // Type of shape (e.g., circle, square, triangle)
    measureSettings: any, // Settings related to the measure
    dataView: DataView): d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
    private getConditionalFormattingColor;
}

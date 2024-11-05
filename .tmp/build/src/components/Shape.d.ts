import * as d3 from 'd3';
import powerbi from 'powerbi-visuals-api';
import DataView = powerbi.DataView;
export declare class Shape {
    private container;
    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>);
    drawShape(x: number, y: number, shapeData: {
        type: string;
        defaultColor: string;
        defaultStroke: string;
        shapeStroke: number;
    }, shapeSize: number, measureSettings: any, dataView: DataView): d3.Selection<SVGElement, unknown, HTMLElement, any>;
    private getConditionalFormattingColor;
}

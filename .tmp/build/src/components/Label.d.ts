import * as d3 from 'd3';
import powerbi from 'powerbi-visuals-api';
import DataView = powerbi.DataView;
export declare class Label {
    private container;
    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, string>);
    drawLabel(x: number, y: number, text: string, position: string, font: string, fontSize: number, defaultFontColor: string, shapeSize: number, shapeType: string, measureSettings: any, dataView: DataView): void;
    private getConditionalFormattingColor;
}

import * as d3 from 'd3';
import powerbi from 'powerbi-visuals-api';
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import DataView = powerbi.DataView;
export declare class QuadChart {
    private container;
    private separators;
    private shapeDrawer;
    private labelDrawer;
    private tooltipService;
    private selectionManager;
    private currentTitle;
    private host;
    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>, selectionManager: ISelectionManager, host: IVisualHost);
    drawChart(width: number, height: number, separatorSettings: any, shapeSettings: any, dataView: DataView, // This is the actual dataView instance
    settings: any): void;
    private drawShapesAndLabels;
    private drawShapeWithLabel;
    private getConditionalFormattingColor;
    updateContextMenu(labelText: string): void;
    private bindContextMenu;
}

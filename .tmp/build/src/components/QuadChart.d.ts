import * as d3 from 'd3';
export declare class QuadChart {
    private container;
    private separators;
    private shapeDrawer;
    private tooltipService;
    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>);
    drawChart(width: number, height: number, separatorSettings: any, shapeSettings: any, measureValues: number[]): void;
    private drawShapeWithTooltip;
}

import * as d3 from 'd3';
import { Separators } from './Separators';
import { Shape } from './Shape';
import { TooltipService } from '../services/tooltipService';

export class QuadChart {
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>;
    private separators: Separators;
    private shapeDrawer: Shape;
    private tooltipService: TooltipService;

    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>) {
        this.container = container;
        this.separators = new Separators(container);
        this.shapeDrawer = new Shape(container);
        this.tooltipService = new TooltipService();
    }

    public drawChart(width: number, height: number, separatorSettings: any, shapeSettings: any, measureValues: number[]): void {
        // Clear existing content
        this.container.selectAll('*').remove();
    
        // Draw separators
        this.separators.drawVerticalLine(width / 2, height, separatorSettings);
        this.separators.drawHorizontalLine(height / 2, width, separatorSettings);
    
        // Draw the same shape in each quadrant with its measure value affecting the size or appearance
        this.drawShapeWithTooltip(width / 4, height / 4, shapeSettings, 'Top-Left Quadrant', measureValues[0]);
        this.drawShapeWithTooltip((3 * width) / 4, height / 4, shapeSettings, 'Top-Right Quadrant', measureValues[1]);
        this.drawShapeWithTooltip(width / 4, (3 * height) / 4, shapeSettings, 'Bottom-Left Quadrant', measureValues[2]);
        this.drawShapeWithTooltip((3 * width) / 4, (3 * height) / 4, shapeSettings, 'Bottom-Right Quadrant', measureValues[3]);
    }

    private drawShapeWithTooltip(x: number, y: number, shapeSettings: any, tooltipText: string, sizeModifier: number): void {
        const shapeElement = this.shapeDrawer.drawShape(x, y, shapeSettings, sizeModifier);

        // Apply tooltip functionality, passing the event object to the handler
        shapeElement
            .on('mouseover', (event: MouseEvent) => this.tooltipService.showTooltip(tooltipText, event))
            .on('mouseout', () => this.tooltipService.hideTooltip());
    }
}

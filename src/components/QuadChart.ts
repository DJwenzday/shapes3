//QuadChart.ts
import * as d3 from 'd3';
import { Separators } from './Separators';
import { Shape } from './Shape';
import { Label } from './Label';
import { TooltipService } from '../services/tooltipService';
import { MeasureSettings } from '../settings';

export class QuadChart {
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>;
    private separators: Separators;
    private shapeDrawer: Shape;
    private labelDrawer: Label;
    private tooltipService: TooltipService;

    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>) {
        this.container = container;
        this.separators = new Separators(container);
        this.shapeDrawer = new Shape(container);
        this.labelDrawer = new Label(container);
        this.tooltipService = new TooltipService();
    }

    public drawChart(
        width: number,
        height: number,
        separatorSettings: any,
        shapeSettings: any,
        measureValues: (string | number)[],
        measureTitles: string[],
        measureSettingsArray: any[]
    ): void {
        // Clear existing content
        this.container.selectAll('*').remove();
    
        // Draw separators
        this.separators.drawVerticalLine(width / 2, height, separatorSettings);
        this.separators.drawHorizontalLine(height / 2, width, separatorSettings);
    
        // Draw shapes with labels using measure titles and individual settings
        this.drawShapeWithLabel(width / 4, height / 4, shapeSettings, 'Top-Left Quadrant', measureTitles[0], measureSettingsArray[0]);
        this.drawShapeWithLabel((3 * width) / 4, height / 4, shapeSettings, 'Top-Right Quadrant', measureTitles[1], measureSettingsArray[1]);
        this.drawShapeWithLabel(width / 4, (3 * height) / 4, shapeSettings, 'Bottom-Left Quadrant', measureTitles[2], measureSettingsArray[2]);
        this.drawShapeWithLabel((3 * width) / 4, (3 * height) / 4, shapeSettings, 'Bottom-Right Quadrant', measureTitles[3], measureSettingsArray[3]);
    } 

    private drawShapeWithLabel(
        x: number, 
        y: number, 
        shapeSettings: any, 
        tooltipText: string, 
        labelText: string, 
        measureSettings: any
    ): void {
        const shapeElement = this.shapeDrawer.drawShape(x, y, shapeSettings);
    
        // Use the specific settings for each measure to set shape fill, stroke, and label font color
        shapeElement.attr('fill', measureSettings.shapeFillColor || shapeSettings.color);
        shapeElement.attr('stroke', measureSettings.shapeStrokeColor || 'black');
    
        // Draw the label with the measure-specific font color
        this.labelDrawer.drawLabel(
            x,
            y,
            labelText,
            shapeSettings.labelPosition,
            shapeSettings.font,
            shapeSettings.fontSize,
            measureSettings.labelFontColor // Use the measure-specific label font color
        );
    
        // Add tooltip functionality
        shapeElement
            .on('mouseover', (event: MouseEvent) => this.tooltipService.showTooltip(tooltipText, event))
            .on('mouseout', () => this.tooltipService.hideTooltip());
    }
              
    
}

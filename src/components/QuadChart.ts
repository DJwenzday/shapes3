// QuadChart.ts
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

        // Draw separators conditionally
        if (separatorSettings.show) {
            this.separators.drawVerticalLine(width / 2, height, separatorSettings);
            this.separators.drawHorizontalLine(height / 2, width, separatorSettings);
        }

        // Dynamic shape size, e.g., 20% of the chart's width or height
        const shapeSize = Math.min(width, height) * 0.2;

        // Draw shapes and labels conditionally
        this.drawShapesAndLabels(width, height, shapeSettings, measureTitles, measureSettingsArray, shapeSize);
    }

    private drawShapesAndLabels(
        width: number,
        height: number,
        shapeSettings: any,
        measureTitles: string[],
        measureSettingsArray: any[],
        shapeSize: number
    ) {
        // Draw the shapes independently of the label settings
        // Top-left quadrant
        this.drawShapeWithLabel(
            width / 4, height / 4,
            shapeSettings, 'Top-Left Quadrant',
            measureTitles[0], measureSettingsArray[0], 
            width, height, shapeSize, shapeSettings.show
        );
    
        // Top-right quadrant
        this.drawShapeWithLabel(
            (3 * width) / 4, height / 4,
            shapeSettings, 'Top-Right Quadrant',
            measureTitles[1], measureSettingsArray[1], 
            width, height, shapeSize, shapeSettings.show
        );
    
        // Bottom-left quadrant
        this.drawShapeWithLabel(
            width / 4, (3 * height) / 4,
            shapeSettings, 'Bottom-Left Quadrant',
            measureTitles[2], measureSettingsArray[2], 
            width, height, shapeSize, shapeSettings.show
        );
    
        // Bottom-right quadrant
        this.drawShapeWithLabel(
            (3 * width) / 4, (3 * height) / 4,
            shapeSettings, 'Bottom-Right Quadrant',
            measureTitles[3], measureSettingsArray[3], 
            width, height, shapeSize, shapeSettings.show
        );
    }
    
    private drawShapeWithLabel(
        x: number, 
        y: number, 
        shapeSettings: any, 
        tooltipText: string, 
        labelText: string, 
        measureSettings: any, 
        containerWidth: number, 
        containerHeight: number, 
        shapeSize: number,
        showLabels: boolean // Added to control label visibility
    ): void {
        // Correctly pass measureSettings to ensure color and stroke are used
        const shapeElement = this.shapeDrawer.drawShape(
            x, 
            y, 
            { 
                ...shapeSettings, 
                color: measureSettings.shapeFillColor, 
                stroke: measureSettings.shapeStrokeColor, 
                strokeWidth: shapeSettings.strokeWidth // Dynamic stroke width
            }, 
            containerWidth, 
            containerHeight
        );
    
        // Only draw the label if labels are enabled in settings
        if (showLabels) {
            this.labelDrawer.drawLabel(
                x,
                y,
                labelText,
                shapeSettings.labelPosition,
                shapeSettings.font,
                shapeSettings.fontSize,
                measureSettings.labelFontColor, // Label font color from settings
                shapeSize
            );
        }
    
        // Apply tooltips on hover for the shapes
        shapeElement
            .on('mouseover', (event: MouseEvent) => this.tooltipService.showTooltip(tooltipText, event))
            .on('mouseout', () => this.tooltipService.hideTooltip());
    }
}    
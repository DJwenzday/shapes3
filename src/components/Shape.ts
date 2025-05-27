//Shapes.ts

// Import necessary libraries and types
import * as d3 from 'd3'; // Importing D3.js for creating and manipulating SVG elements
import { dataViewObjects } from 'powerbi-visuals-utils-dataviewutils'; // Utility for accessing Power BI DataView objects
import powerbi from 'powerbi-visuals-api'; // Importing Power BI Visuals API for types and interfaces
import DataView = powerbi.DataView; // Type alias for Power BI's DataView
import { TooltipService } from '../services/tooltipService'; // Importing custom TooltipService for handling tooltips

// Shape class responsible for drawing shapes onto the SVG container
export class Shape {
    // Private property to hold the container where shapes will be drawn
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>;
    private tooltipService: TooltipService; // Instance for handling tooltips

    // Constructor to initialize the container with a D3 selection and TooltipService
    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>) {
        this.container = container;
        this.tooltipService = new TooltipService(); // Initialize TooltipService
    }

    // Method to draw different types of shapes
    public drawShape(
        x: number, // X-coordinate for the shape's position
        y: number, // Y-coordinate for the shape's position
        shapeData: { type: string; defaultColor: string; defaultStroke: string; width: number; }, // Shape properties
        shapeSize: number, // Size of the shape
        measureSettings: any, // Custom settings for the measure
        dataView: DataView, // The DataView object for data and settings access
        tooltipText: string // Tooltip text for the shape
    ): d3.Selection<SVGElement, unknown, HTMLElement, any> {
        // Get conditional formatting color for the shape's fill
        const fillColor = this.getConditionalFormattingColor(
            measureSettings.objectName,
            'shapeFillColor',
            shapeData.defaultColor, // Fallback color if no rules match
            dataView,
            measureSettings.measureValue
        );

        // Get conditional formatting color for the shape's stroke
        const strokeColor = this.getConditionalFormattingColor(
            measureSettings.objectName,
            'shapeStrokeColor',
            shapeData.defaultStroke, // Fallback stroke color if no rules match
            dataView,
            measureSettings.measureValue
        );

        const shapeType = shapeData.type || 'circle'; // Default to 'circle' if type is not provided
        const strokeWidth = shapeData.width || measureSettings.shapeStrokeWidth || 2; // Determine stroke width

        let shapeElement; // Variable to hold the drawn shape element

        // Draw the appropriate shape based on the type
        switch (shapeType) {
            case 'circle':
                shapeElement = this.container.append('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', shapeSize / 2)
                    .attr('fill', fillColor)
                    .attr('stroke', strokeColor)
                    .attr('stroke-width', strokeWidth)
                    .style('cursor', 'pointer');;
                break;
            case 'square':
                shapeElement = this.container.append('rect')
                    .attr('x', x - shapeSize / 2)
                    .attr('y', y - shapeSize / 2)
                    .attr('width', shapeSize)
                    .attr('height', shapeSize)
                    .attr('fill', fillColor)
                    .attr('stroke', strokeColor)
                    .attr('stroke-width', strokeWidth)
                    .style('cursor', 'pointer');;
                break;
            case 'triangle':
                shapeElement = this.container.append('polygon')
                    .attr('points', `${x},${y - shapeSize / 2} ${x - shapeSize / 2},${y + shapeSize / 2} ${x + shapeSize / 2},${y + shapeSize / 2}`)
                    .attr('fill', fillColor)
                    .attr('stroke', strokeColor)
                    .attr('stroke-width', strokeWidth)
                    .style('cursor', 'pointer');;
                break;
            default:
                console.error('Invalid shape type:', shapeType);
                break;
        }

        // Add tooltip event handlers to the shape
        if (shapeElement) {
            shapeElement.on('mouseover', (event: MouseEvent) => {
                this.tooltipService.showTooltip(tooltipText, event);
            }).on('mouseout', () => {
                this.tooltipService.hideTooltip();
            });
        }

        return shapeElement;
    }

    // Private method for getting conditional formatting color
    private getConditionalFormattingColor(
        objectName: string,
        propertyName: string,
        defaultColor: string,
        dataView: DataView,
        measureValue: any
    ): string {
        const objects = dataView?.metadata?.objects;
        if (objects) {
            const rules = dataViewObjects.getValue<any>(
                objects,
                { objectName, propertyName },
                null
            );

            if (rules && Array.isArray(rules)) {
                for (const rule of rules) {
                    const { minValue, maxValue, color, stringValue } = rule;
                    if (typeof measureValue === 'number' && minValue !== undefined && maxValue !== undefined) {
                        if (measureValue >= minValue && measureValue <= maxValue) {
                            return color;
                        }
                    } else if (typeof measureValue === 'string' && stringValue !== undefined) {
                        if (measureValue === stringValue) {
                            return color;
                        }
                    }
                }
            }
        }
        return defaultColor;
    }
}

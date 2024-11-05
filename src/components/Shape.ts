//Shapes.ts

// Import necessary libraries and types
import * as d3 from 'd3'; // Importing D3.js for creating and manipulating SVG elements
import { dataViewObjects } from 'powerbi-visuals-utils-dataviewutils'; // Utility for accessing Power BI DataView objects
import powerbi from 'powerbi-visuals-api'; // Importing Power BI Visuals API for types and interfaces
import DataView = powerbi.DataView; // Type alias for Power BI's DataView

// Shape class responsible for drawing shapes onto the SVG container
export class Shape {
    // Private property to hold the container where shapes will be drawn
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>;

    // Constructor to initialize the container with a D3 selection
    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>) {
        this.container = container;
    }

    // Method to draw different types of shapes
    public drawShape(
        x: number, // X-coordinate for the shape's position
        y: number, // Y-coordinate for the shape's position
        shapeData: { type: string; defaultColor: string; defaultStroke: string; width: number; }, // Shape properties
        shapeSize: number, // Size of the shape
        measureSettings: any, // Custom settings for the measure
        dataView: DataView // The DataView object for data and settings access
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

        // Determine the type of shape to draw
        const shapeType = shapeData.type || 'circle'; // Default to 'circle' if type is not provided
        const strokeWidth = shapeData.width || measureSettings.shapeStrokeWidth || 2; // Determine stroke width

        let shapeElement; // Variable to hold the drawn shape element

        // Use a switch statement to draw the appropriate shape
        switch (shapeType) {
            case 'circle':
                shapeElement = this.container.append('circle') // Append a circle to the container
                    .attr('cx', x) // X-coordinate of the circle's center
                    .attr('cy', y) // Y-coordinate of the circle's center
                    .attr('r', shapeSize / 2) // Radius of the circle
                    .attr('fill', fillColor) // Fill color
                    .attr('stroke', strokeColor) // Stroke color
                    .attr('stroke-width', strokeWidth); // Stroke width
                break;
            case 'square':
                shapeElement = this.container.append('rect') // Append a rectangle (square) to the container
                    .attr('x', x - shapeSize / 2) // X-coordinate of the top-left corner
                    .attr('y', y - shapeSize / 2) // Y-coordinate of the top-left corner
                    .attr('width', shapeSize) // Width of the square
                    .attr('height', shapeSize) // Height of the square
                    .attr('fill', fillColor) // Fill color
                    .attr('stroke', strokeColor) // Stroke color
                    .attr('stroke-width', strokeWidth); // Stroke width
                break;
            case 'triangle':
                shapeElement = this.container.append('polygon') // Append a polygon (triangle) to the container
                    .attr('points', `${x},${y - shapeSize / 2} ${x - shapeSize / 2},${y + shapeSize / 2} ${x + shapeSize / 2},${y + shapeSize / 2}`) // Points defining the triangle vertices
                    .attr('fill', fillColor) // Fill color
                    .attr('stroke', strokeColor) // Stroke color
                    .attr('stroke-width', strokeWidth); // Stroke width
                break;
            default:
                // Log an error if an invalid shape type is provided
                console.error('Invalid shape type:', shapeType);
                break;
        }
        return shapeElement; // Return the created shape element
    }

    // Private method for getting conditional formatting color
    private getConditionalFormattingColor(
        objectName: string, // Name of the object in the DataView
        propertyName: string, // Name of the property to retrieve
        defaultColor: string, // Default color to use if no rules match
        dataView: DataView, // DataView object for accessing metadata
        measureValue: any // Value of the measure used for conditional checks
    ): string {
        const objects = dataView?.metadata?.objects; // Access metadata objects if available
        if (objects) {
            // Retrieve formatting rules from the DataView
            const rules = dataViewObjects.getValue<any>(
                objects,
                { objectName, propertyName },
                null // Default value if the property is not found
            );

            // Check if there are formatting rules and iterate over them
            if (rules && Array.isArray(rules)) {
                for (const rule of rules) {
                    const { minValue, maxValue, color, stringValue } = rule;

                    // Check numeric range for conditional formatting
                    if (typeof measureValue === 'number' && minValue !== undefined && maxValue !== undefined) {
                        if (measureValue >= minValue && measureValue <= maxValue) {
                            return color; // Return the matching color
                        }
                    } 
                    // Check string equality for conditional formatting
                    else if (typeof measureValue === 'string' && stringValue !== undefined) {
                        if (measureValue === stringValue) {
                            return color; // Return the matching color
                        }
                    }
                }
            }
        }
        return defaultColor; // Return the default color if no rules match
    }
}

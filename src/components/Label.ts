//Label.ts

// Importing necessary libraries and utilities
import * as d3 from 'd3';
import { dataViewObjects } from 'powerbi-visuals-utils-dataviewutils';
import powerbi from 'powerbi-visuals-api';
import DataView = powerbi.DataView;

// Class to handle label drawing functionality
export class Label {
    // Container element for drawing the labels
    private container: d3.Selection<SVGElement, unknown, HTMLElement, string>;

    // Constructor that initializes the container
    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, string>) {
        this.container = container;
    }

    // Method to draw a label on the chart
    public drawLabel(
        x: number, // X-coordinate for the label
        y: number, // Y-coordinate for the label
        text: string, // The text content of the label
        position: string, // Positioning: 'above' or 'centered'
        font: string, // Font family for the label text
        fontSize: number, // Size of the font
        defaultFontColor: string, // Default color for the label
        shapeSize: number, // Size of the associated shape
        shapeType: string, // Type of shape (e.g., circle, square, triangle)
        measureSettings: any, // Settings related to the measure
        dataView: DataView // The DataView object containing visualization data
    ): d3.Selection<SVGTextElement, unknown, HTMLElement, any> {
        // Get the color for the label with optional conditional formatting
        const fontColor = this.getConditionalFormattingColor(
            measureSettings.objectName, // Name of the object in DataView
            'labelFontColor', // Property name for font color
            defaultFontColor, // Default color if no rule matches
            dataView, // DataView for accessing metadata and rules
            measureSettings.measureValue // Value to match against rules
        );

        const additionalSpacing = 3; // Additional spacing for better positioning
        const labelX = x; // X-coordinate remains unchanged
        let labelY = y; // Initial Y-coordinate

        // Adjust Y-coordinate based on the position and shape type
        if (position === 'above') {
            labelY = y - (shapeSize / 2) - fontSize - additionalSpacing;
            if (shapeType === 'triangle') {
                labelY -= 10; // Extra spacing for triangles
            } else if (shapeType === 'circle' || shapeType === 'square') {
                labelY -= 5; // Adjust for other shapes
            }
        } else if (position === 'centered') {
            labelY = y; // Centered position maintains the original Y-coordinate
            if (shapeType === 'triangle') {
                labelY += 5; // Slight adjustment for triangles
            }
        }

        console.log("Drawing label at:", labelX, labelY, "with text:", text); // Debug log for label position

        // Append a text element to the container
        const labelElement = this.container.append('text')
            .attr('x', labelX) // Set X-coordinate
            .attr('y', labelY) // Set Y-coordinate
            .attr('text-anchor', 'middle') // Center-align the text
            .attr('dominant-baseline', position === 'centered' ? 'middle' : 'bottom') // Adjust vertical alignment
            .attr('font-family', font) // Set font family
            .attr('font-size', `${fontSize}px`) // Set font size
            .attr('fill', fontColor) // Apply the font color
            .style('cursor', 'pointer')
            .text(text); // Set the text content

        return labelElement; // Return the created label element
    }

    // Helper method to get the color based on conditional formatting rules
    private getConditionalFormattingColor(
        objectName: string, // Name of the object in DataView
        propertyName: string, // Property to access (e.g., 'labelFontColor')
        defaultColor: string, // Default color if no rule matches
        dataView: DataView, // DataView for accessing metadata and rules
        measureValue: any // Value used to match against formatting rules
    ): string {
        // Access the objects property in the DataView
        const objects = dataView?.metadata?.objects;
        if (objects) {
            // Get conditional formatting rules from DataView
            const rules = dataViewObjects.getValue<any>(
                objects,
                { objectName, propertyName },
                null // Default value if no rules found
            );

            // Check if rules exist and iterate over them
            if (rules && Array.isArray(rules)) {
                for (const rule of rules) {
                    const { minValue, maxValue, color, stringValue } = rule;

                    // Check for numerical rules
                    if (typeof measureValue === 'number' && minValue !== undefined && maxValue !== undefined) {
                        if (measureValue >= minValue && measureValue <= maxValue) {
                            return color; // Return color if rule matches
                        }
                    }
                    // Check for string-based rules
                    else if (typeof measureValue === 'string' && stringValue !== undefined) {
                        if (measureValue === stringValue) {
                            return color; // Return color if string rule matches
                        }
                    }
                }
            }
        }
        return defaultColor; // Return default color if no rule matches
    }
}
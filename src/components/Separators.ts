//Separators.ts

// Importing the D3.js library for creating and manipulating SVG elements
import * as d3 from 'd3';

// Class responsible for drawing separator lines (vertical and horizontal) in the chart
export class Separators {
    // Private property to hold the container where lines will be drawn
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>;

    // Constructor method to initialize the Separators class with a D3 container
    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>) {
        this.container = container; // Assign the provided container to the class property
    }

    /**
     * Method to draw a vertical line in the container.
     * @param xPosition - The x-coordinate where the vertical line should be drawn.
     * @param height - The height of the line.
     * @param settings - An object containing style settings for the line (e.g., color, width).
     */
    public drawVerticalLine(xPosition: number, height: number, settings: any): void {
        // Appending a 'line' element to the container
        this.container.append('line')
            .attr('x1', xPosition) // Starting x-coordinate of the line
            .attr('y1', 0) // Starting y-coordinate (top of the container)
            .attr('x2', xPosition) // Ending x-coordinate (same as starting, making it vertical)
            .attr('y2', height) // Ending y-coordinate (bottom of the line)
            .attr('stroke', settings.color || 'black') // Line color, defaulting to black if not provided
            .attr('stroke-width', settings.width || 2); // Line width, defaulting to 2 if not provided
    }

    /**
     * Method to draw a horizontal line in the container.
     * @param yPosition - The y-coordinate where the horizontal line should be drawn.
     * @param width - The length of the line (width).
     * @param settings - An object containing style settings for the line (e.g., color, width).
     * @param offset - An optional offset to adjust the y-position of the line.
     */
    public drawHorizontalLine(yPosition: number, width: number, settings: any, offset: number = 0): void {
        // Appending a 'line' element to the container
        this.container.append('line')
            .attr('x1', 0) // Starting x-coordinate (left side of the container)
            .attr('y1', yPosition - offset) // Starting y-coordinate adjusted by the offset
            .attr('x2', width) // Ending x-coordinate (length of the line)
            .attr('y2', yPosition - offset) // Ending y-coordinate (same as starting, making it horizontal)
            .attr('stroke', settings.color || 'black') // Line color, defaulting to black if not provided
            .attr('stroke-width', settings.width || 2); // Line width, defaulting to 2 if not provided
    }
}
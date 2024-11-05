//tooltipService.ts

// Import D3.js for DOM manipulation
import * as d3 from 'd3';

// TooltipService class to handle showing and hiding tooltips in the chart
export class TooltipService {
    // Private property to hold the tooltip element
    private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

    // Constructor to create and style the tooltip element
    constructor() {
        // Create the tooltip element and append it to the body if it doesn't already exist
        this.tooltip = d3.select('body').append('div') // Append a <div> element to the body
            .attr('class', 'quad-chart-tooltip') // Assign a CSS class for styling purposes
            .style('position', 'absolute') // Position the tooltip absolutely relative to the page
            .style('padding', '8px') // Add padding to the tooltip for spacing
            .style('background-color', 'rgba(0, 0, 0, 0.7)') // Set a semi-transparent dark background color
            .style('color', 'white') // Set text color to white for better visibility
            .style('border-radius', '4px') // Round the corners of the tooltip
            .style('pointer-events', 'none') // Disable pointer events to avoid interaction
            .style('opacity', 0); // Set initial opacity to 0 (hidden by default)
    }

    // Method to show the tooltip with the specified text and position it based on mouse event
    public showTooltip(text: string, event: MouseEvent): void {
        // Set the content and display properties of the tooltip
        this.tooltip
            .html(text) // Set the HTML content of the tooltip
            .style('left', `${event.pageX + 10}px`) // Position the tooltip 10 pixels to the right of the mouse X coordinate
            .style('top', `${event.pageY + 10}px`) // Position the tooltip 10 pixels below the mouse Y coordinate
            .style('opacity', 1); // Make the tooltip visible by setting opacity to 1
    }

    // Method to hide the tooltip
    public hideTooltip(): void {
        // Change the opacity to 0 to hide the tooltip
        this.tooltip.style('opacity', 0);
    }
}


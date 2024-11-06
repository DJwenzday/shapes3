//tooltipService.ts

// Import D3.js for DOM manipulation
import * as d3 from 'd3';

// TooltipService class to handle showing and hiding tooltips in the chart
export class TooltipService {
    // Private property to hold the tooltip element
    private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

    // Constructor to create and style the tooltip element
    constructor() {
        // Check if the tooltip already exists and create if not
        this.tooltip = d3.select('body').select('quad-chart-tooltip');
        if (this.tooltip.empty()) {
            this.tooltip = d3.select('body').append('div')
                .attr('class', 'quad-chart-tooltip');
    }
}

    // Method to show the tooltip with the specified text and position it based on mouse event
    public showTooltip(text: string, event: MouseEvent): void {
        console.log("Showing tooltip with text:", text); // Debug log
        this.tooltip
            .html(text) // Set the HTML content of the tooltip
            .style('left', `${event.pageX + 10}px`) // Position the tooltip 10 pixels to the right of the mouse X coordinate
            .style('top', `${event.pageY + 10}px`) // Position the tooltip 10 pixels below the mouse Y coordinate
            .style('opacity', 1) // Make the tooltip visible by setting opacity to 1
            .style('visibility', 'visible'); // Ensure visibility is set to visible
    }

    // Method to hide the tooltip
    public hideTooltip(): void {
        console.log("Hiding tooltip"); // Debug log
        this.tooltip
            .style('visibility', 'hidden');
    }
}
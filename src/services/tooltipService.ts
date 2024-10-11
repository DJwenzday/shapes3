//tooltipService.ts
import * as d3 from 'd3';

export class TooltipService {
    private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

    constructor() {
        // Create the tooltip element if it doesn't already exist
        this.tooltip = d3.select('body').append('div')
            .attr('class', 'quad-chart-tooltip')
            .style('position', 'absolute')
            .style('padding', '8px')
            .style('background-color', 'rgba(0, 0, 0, 0.7)')
            .style('color', 'white')
            .style('border-radius', '4px')
            .style('pointer-events', 'none')
            .style('opacity', 0);
    }

    public showTooltip(text: string, event: MouseEvent): void {
        this.tooltip
            .html(text)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY + 10}px`)
            .style('opacity', 1);
    }

    public hideTooltip(): void {
        this.tooltip.style('opacity', 0);
    }
}

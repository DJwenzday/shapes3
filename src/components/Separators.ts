//Separators.ts
import * as d3 from 'd3';

export class Separators {
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>;

    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>) {
        this.container = container;
    }

    public drawVerticalLine(xPosition: number, height: number, settings: any): void {
        this.container.append('line')
            .attr('x1', xPosition)
            .attr('y1', 0)
            .attr('x2', xPosition)
            .attr('y2', height)
            .attr('stroke', settings.color || 'black')
            .attr('stroke-width', settings.width || 2);
    }

    public drawHorizontalLine(yPosition: number, width: number, settings: any, offset: number = 0): void {
        this.container.append('line')
            .attr('x1', 0)
            .attr('y1', yPosition - offset)
            .attr('x2', width)
            .attr('y2', yPosition - offset)
            .attr('stroke', settings.color || 'black')
            .attr('stroke-width', settings.width || 2);
    }
}
//Label.ts
import * as d3 from 'd3';

export class Label {
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>;

    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>) {
        this.container = container;
    }

    public drawLabel(x: number, y: number, text: string, position: string): void {
        let labelX = x;
        let labelY = y;

        if (position === 'above') {
            labelY -= 40; // Adjust the label position above the shape
        }

        this.container.append('text')
            .attr('x', labelX)
            .attr('y', labelY)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', position === 'centered' ? 'middle' : 'baseline')
            .attr('font-size', '12px')
            .attr('fill', 'black')
            .text(text);
    }
}

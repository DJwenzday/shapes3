//Label.ts
import * as d3 from 'd3';

export class Label {
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>;

    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>) {
        this.container = container;
    }

    public drawLabel(x: number, y: number, text: string, position: string, font: string, fontSize: number, fontColor: string): void {
        let labelX = x;
        let labelY = position === 'above' ? y - 35 : y;

        this.container.append('text')
            .attr('x', labelX)
            .attr('y', labelY)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', position === 'centered' ? 'middle' : 'bottom')
            .attr('font-family', font)       // Use the font setting from the user
            .attr('font-size', `${fontSize}px`) // Use the font size setting from the user
            .attr('fill', fontColor)          // Use the font color setting from the user
            .text(text);
    }
}
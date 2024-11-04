// Label.ts
import * as d3 from 'd3';

export class Label {
    private container: d3.Selection<SVGElement, unknown, HTMLElement, string>;

    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, string>) {
        this.container = container;
    }

    public drawLabel(
        x: number, 
        y: number, 
        text: string, 
        position: string, 
        font: string, 
        fontSize: number, 
        fontColor: string, 
        shapeSize: number,
        shapeType: string
    ): void {
        const additionalSpacing= 5;
        const labelX = x;
        let labelY = position === 'above' ? y - (shapeSize / 2) - fontSize - additionalSpacing : y;  // Adjust labelY with extra space

        if (shapeType === 'triangle') {
            labelY += 10; // Adjust this value as needed for your design
        }
        console.log("Drawing label at:", labelX, labelY, "with text:", text);

        this.container.append('text')
            .attr('x', labelX)
            .attr('y', labelY)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', position === 'centered' ? 'middle' : 'bottom')
            .attr('font-family', font)
            .attr('font-size', `${fontSize}px`)
            .attr('fill', fontColor)
            .text(text);
    }
}

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
        const additionalSpacing = 5;
        const labelX = x;
        let labelY = y;

        if (position === 'above') {
            // Ensure label stays above regardless of shape size or font size
            labelY = y - (shapeSize / 2) - fontSize - additionalSpacing;

            if (shapeType === 'triangle') {
                labelY -= 10; // Adjust triangle label positioning further if needed
            } else if (shapeType === 'circle' || shapeType === 'square') {
                labelY -= 5; // Adjust for circle or square label positioning if needed
            }
        } else if (position === 'centered') {
            labelY = y;

            if (shapeType === 'triangle') {
                labelY += 5; // Adjust for triangle's "centered" position
            }
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

//Shape.ts
import * as d3 from 'd3';

export class Shape {
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>;

    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>) {
        this.container = container;
    }

    public drawShape(
        x: number, 
        y: number, 
        shapeData: { type: string; color: string; stroke: string; shapeStroke: number; },
        containerWidth: number, 
        containerHeight: number
    ): d3.Selection<SVGElement, unknown, HTMLElement, any> {
        // Extraction and application of properties should be logged or verified
        const shapeType = shapeData.type || 'circle';
        const color = shapeData.color || 'blue';  // Default fallback color
        const stroke = shapeData.stroke || 'black';
        const shapeStroke = shapeData.shapeStroke || 2;  // Apply dynamic stroke width from settings
        const shapeSize = Math.min(containerWidth, containerHeight) * 0.3;  // Dynamic shape size
    
        let shapeElement;
        switch (shapeType) {
            case 'circle':
                shapeElement = this.container.append('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', shapeSize / 2)
                    .attr('fill', color)  // Apply the correct fill color
                    .attr('stroke', stroke)  // Apply the correct stroke color
                    .attr('stroke-width', shapeStroke);  // Apply stroke width
                break;
            case 'square':
                shapeElement = this.container.append('rect')
                    .attr('x', x - shapeSize / 2)
                    .attr('y', y - shapeSize / 2)
                    .attr('width', shapeSize)
                    .attr('height', shapeSize)
                    .attr('fill', color)
                    .attr('stroke', stroke)
                    .attr('stroke-width', shapeStroke);  // Apply stroke width
                break;
            case 'triangle':
                shapeElement = this.container.append('polygon')
                    .attr('points', `${x},${y - shapeSize / 2} ${x - shapeSize / 2},${y + shapeSize / 2} ${x + shapeSize / 2},${y + shapeSize / 2}`)
                    .attr('fill', color)
                    .attr('stroke', stroke)
                    .attr('stroke-width', shapeStroke);  // Apply stroke width
                break;
            default:
                console.error('Invalid shape type:', shapeType);
                break;
        }
        return shapeElement;
    }    
}
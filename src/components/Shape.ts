//shape.ts
import * as d3 from 'd3';

export class Shape {
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>;

    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>) {
        this.container = container;
    }

    public drawShape(x: number, y: number, shapeData: any, containerWidth: number, containerHeight: number): d3.Selection<SVGElement, unknown, HTMLElement, any> {
        const shapeType = shapeData.type || 'circle';
        const color = shapeData.color || 'blue';
        const strokeColor = shapeData.strokeColor || 'black';  // Handle dynamic stroke color
        const strokeWidth = shapeData.strokeWidth || 2;  // Handle dynamic stroke width
        
        // Adjust the size dynamically based on the container's width and height
        const shapeSize = Math.min(containerWidth, containerHeight) * 0.2; // Adjust size proportionally
        
        let shapeElement;
        switch (shapeType) {
            case 'circle':
                shapeElement = this.container.append('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', shapeSize / 2)  // Adjust radius
                    .attr('fill', color)
                    .attr('stroke', strokeColor)  // Apply stroke color dynamically
                    .attr('stroke-width', strokeWidth);  // Apply dynamic stroke width
                break;
            case 'square':
                shapeElement = this.container.append('rect')
                    .attr('x', x - shapeSize / 2)
                    .attr('y', y - shapeSize / 2)
                    .attr('width', shapeSize)
                    .attr('height', shapeSize)
                    .attr('fill', color)
                    .attr('stroke', strokeColor)  // Apply stroke color dynamically
                    .attr('stroke-width', strokeWidth);  // Apply dynamic stroke width
                break;
            case 'triangle':
                shapeElement = this.container.append('polygon')
                    .attr('points', `${x},${y - shapeSize / 2} ${x - shapeSize / 2},${y + shapeSize / 2} ${x + shapeSize / 2},${y + shapeSize / 2}`)
                    .attr('fill', color)
                    .attr('stroke', strokeColor)  // Apply stroke color dynamically
                    .attr('stroke-width', strokeWidth);  // Apply dynamic stroke width
                break;
            default:
                console.error('Invalid shape type:', shapeType);
                break;
        }
        return shapeElement;
    }
    
    
}

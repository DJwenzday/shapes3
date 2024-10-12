//shape.ts
import * as d3 from 'd3';

export class Shape {
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>;

    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>) {
        this.container = container;
    }

    public drawShape(
        x: number, 
        y: number, 
        shapeData: any, 
        containerWidth: number, 
        containerHeight: number
    ): d3.Selection<SVGElement, unknown, HTMLElement, any> {
        const shapeType = shapeData.type || 'circle';
        const color = shapeData.color || 'blue';  // Use the color from measureSettings
        const stroke = shapeData.stroke || 'black';  // Use stroke color from measureSettings
        const strokeWidth = shapeData.strokeWidth || 2; // Use stroke width from shapeSettings
        
        const shapeSize = Math.min(containerWidth, containerHeight) * 0.2;  // Dynamic shape size
    
        let shapeElement;
        switch (shapeType) {
            case 'circle':
                shapeElement = this.container.append('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', shapeSize / 2)
                    .attr('fill', color)  // Apply the correct fill color
                    .attr('stroke', stroke)  // Apply the correct stroke color
                    .attr('stroke-width', strokeWidth);  // Apply stroke width
                break;
            case 'square':
                shapeElement = this.container.append('rect')
                    .attr('x', x - shapeSize / 2)
                    .attr('y', y - shapeSize / 2)
                    .attr('width', shapeSize)
                    .attr('height', shapeSize)
                    .attr('fill', color)
                    .attr('stroke', stroke)
                    .attr('stroke-width', strokeWidth);
                break;
            case 'triangle':
                shapeElement = this.container.append('polygon')
                    .attr('points', `${x},${y - shapeSize / 2} ${x - shapeSize / 2},${y + shapeSize / 2} ${x + shapeSize / 2},${y + shapeSize / 2}`)
                    .attr('fill', color)
                    .attr('stroke', stroke)
                    .attr('stroke-width', strokeWidth);
                break;
            default:
                console.error('Invalid shape type:', shapeType);
                break;
        }
        return shapeElement;
    }  
}
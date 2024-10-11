//shape.ts
import * as d3 from 'd3';

export class Shape {
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>;

    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>) {
        this.container = container;
    }

    public drawShape(x: number, y: number, shapeData: any): d3.Selection<SVGElement, unknown, HTMLElement, any> {
        const shapeType = shapeData.type || 'circle';
        const color = shapeData.color || 'blue';

        let shapeElement;
        switch (shapeType) {
            case 'circle':
                shapeElement = this.container.append('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', 30)  // Fixed size for circle
                    .attr('fill', color);
                break;
            case 'square':
                shapeElement = this.container.append('rect')
                    .attr('x', x - 25)
                    .attr('y', y - 25)
                    .attr('width', 50)  // Fixed width and height for square
                    .attr('height', 50)
                    .attr('fill', color);
                break;
            case 'triangle':
                shapeElement = this.container.append('polygon')
                    .attr('points', `${x},${y - 30} ${x - 26},${y + 15} ${x + 26},${y + 15}`)
                    .attr('fill', color);
                break;
            default:
                console.error('Invalid shape type:', shapeType);
                break;
        }
        return shapeElement;
    }
}

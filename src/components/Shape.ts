import * as d3 from 'd3';

export class Shape {
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>;

    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>) {
        this.container = container;
    }

    public drawShape(x: number, y: number, shapeData: any, sizeModifier: number): d3.Selection<SVGElement, unknown, HTMLElement, any> {
        const shapeType = shapeData.type || 'circle';
        const color = shapeData.color || 'blue';

        let shapeElement;
        switch (shapeType) {
            case 'circle':
                shapeElement = this.container.append('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', 20 + sizeModifier * 5)  // Adjust size based on measure value
                    .attr('fill', color);
                break;
            case 'square':
                shapeElement = this.container.append('rect')
                    .attr('x', x - (25 + sizeModifier * 2))
                    .attr('y', y - (25 + sizeModifier * 2))
                    .attr('width', 50 + sizeModifier * 4)
                    .attr('height', 50 + sizeModifier * 4)
                    .attr('fill', color);
                break;
            case 'triangle':
                shapeElement = this.container.append('polygon')
                    .attr('points', `${x},${y - 30 - sizeModifier * 5} ${x - 26 - sizeModifier * 3},${y + 15 + sizeModifier * 5} ${x + 26 + sizeModifier * 3},${y + 15 + sizeModifier * 5}`)
                    .attr('fill', color);
                break;
        }
        return shapeElement;
    }
}

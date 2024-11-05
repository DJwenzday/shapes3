//Shape.ts
import * as d3 from 'd3';
import { dataViewObjects } from 'powerbi-visuals-utils-dataviewutils';
import powerbi from 'powerbi-visuals-api';
import DataView = powerbi.DataView;

export class Shape {
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>;

    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>) {
        this.container = container;
    }

    public drawShape(
        x: number,
        y: number,
        shapeData: { type: string; defaultColor: string; defaultStroke: string; shapeStroke: number; },
        shapeSize: number,
        measureSettings: any,
        dataView: DataView
    ): d3.Selection<SVGElement, unknown, HTMLElement, any> {
        const fillColor = this.getConditionalFormattingColor(
            measureSettings.objectName,
            'shapeFillColor',
            shapeData.defaultColor,
            dataView,
            measureSettings.measureValue
        );

        const strokeColor = this.getConditionalFormattingColor(
            measureSettings.objectName,
            'shapeStrokeColor',
            shapeData.defaultStroke,
            dataView,
            measureSettings.measureValue
        );

        const shapeType = shapeData.type || 'circle';
        const shapeStroke = shapeData.shapeStroke || 2;

        let shapeElement;
        switch (shapeType) {
            case 'circle':
                shapeElement = this.container.append('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', shapeSize / 2)
                    .attr('fill', fillColor)
                    .attr('stroke', strokeColor)
                    .attr('stroke-width', shapeStroke);
                break;
            case 'square':
                shapeElement = this.container.append('rect')
                    .attr('x', x - shapeSize / 2)
                    .attr('y', y - shapeSize / 2)
                    .attr('width', shapeSize)
                    .attr('height', shapeSize)
                    .attr('fill', fillColor)
                    .attr('stroke', strokeColor)
                    .attr('stroke-width', shapeStroke);
                break;
            case 'triangle':
                shapeElement = this.container.append('polygon')
                    .attr('points', `${x},${y - shapeSize / 2} ${x - shapeSize / 2},${y + shapeSize / 2} ${x + shapeSize / 2},${y + shapeSize / 2}`)
                    .attr('fill', fillColor)
                    .attr('stroke', strokeColor)
                    .attr('stroke-width', shapeStroke);
                break;
            default:
                console.error('Invalid shape type:', shapeType);
                break;
        }
        return shapeElement;
    }

    private getConditionalFormattingColor(
        objectName: string,
        propertyName: string,
        defaultColor: string,
        dataView: DataView,
        measureValue: any
    ): string {
        const objects = dataView?.metadata?.objects;
        if (objects) {
            const rules = dataViewObjects.getValue<any>(
                objects,
                { objectName, propertyName },
                null
            );

            if (rules && Array.isArray(rules)) {
                for (const rule of rules) {
                    const { minValue, maxValue, color, stringValue } = rule;

                    if (typeof measureValue === 'number' && minValue !== undefined && maxValue !== undefined) {
                        if (measureValue >= minValue && measureValue <= maxValue) {
                            return color;
                        }
                    } else if (typeof measureValue === 'string' && stringValue !== undefined) {
                        if (measureValue === stringValue) {
                            return color;
                        }
                    }
                }
            }
        }
        return defaultColor; // Return default color if no rule matches
    }
}

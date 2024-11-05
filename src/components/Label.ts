// Label.ts
import * as d3 from 'd3';
import { dataViewObjects } from 'powerbi-visuals-utils-dataviewutils';
import powerbi from 'powerbi-visuals-api';
import DataView = powerbi.DataView;

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
        defaultFontColor: string,
        shapeSize: number,
        shapeType: string,
        measureSettings: any,
        dataView: DataView
    ): void {
        const fontColor = this.getConditionalFormattingColor(
            measureSettings.objectName,
            'labelFontColor',
            defaultFontColor,
            dataView,
            measureSettings.measureValue
        );

        const additionalSpacing = 5;
        const labelX = x;
        let labelY = y;

        if (position === 'above') {
            labelY = y - (shapeSize / 2) - fontSize - additionalSpacing;
            if (shapeType === 'triangle') {
                labelY -= 10;
            } else if (shapeType === 'circle' || shapeType === 'square') {
                labelY -= 5;
            }
        } else if (position === 'centered') {
            labelY = y;
            if (shapeType === 'triangle') {
                labelY += 5;
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

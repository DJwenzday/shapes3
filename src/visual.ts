//visual.ts
import * as d3 from 'd3';
import powerbi from "powerbi-visuals-api";
import DataView  = powerbi.DataView;
import PrimitiveValue = powerbi.PrimitiveValue;
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import { VisualSettings } from './settings';
import { QuadChart } from './components/QuadChart';


export class Visual implements IVisual {
    private target: HTMLElement;
    private svg: d3.Selection<SVGElement, unknown, HTMLElement, any>;
    private quadChart: QuadChart;
    private settings: VisualSettings;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.svg = d3.select(this.target)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        this.quadChart = new QuadChart(this.svg);
    }

    public update(options: VisualUpdateOptions) {
        // Parse the settings from the data view
        this.settings = Visual.parseSettings(options.dataViews && options.dataViews[0]);
    
        const width = options.viewport.width;
        const height = options.viewport.height;
    
        const dataView = options.dataViews && options.dataViews[0];
    
        // Extract measure values and titles from the dataView using the categorical structure
        const { values: measureValues, titles: measureTitles } = this.getMeasureValuesAndTitles(dataView);
    
        // Get the shape and separator settings from the property pane
        const separatorSettings = this.settings.separator;
        const shapeSettings = {
            color: this.settings.shapeSettings.shapeColor,
            type: this.settings.shapeSettings.shapeType,
            labelPosition: this.settings.shapeSettings.labelPosition, // Ensure label position is included
        };
    
        // Draw the Quad Chart with the updated settings, measure values, and measure titles
        this.quadChart.drawChart(width, height, separatorSettings, shapeSettings, measureValues, measureTitles);
    }
       

    private getMeasureValuesAndTitles(dataView: DataView): { values: number[], titles: string[] } {
        const valuesArray = dataView?.categorical?.values;
        if (valuesArray && valuesArray.length >= 4) {
            const measureValues = [
                this.toNumber(valuesArray[0]?.values[0]),
                this.toNumber(valuesArray[1]?.values[0]),
                this.toNumber(valuesArray[2]?.values[0]),
                this.toNumber(valuesArray[3]?.values[0])
            ];
    
            const measureTitles = [
                valuesArray[0]?.source?.displayName || 'Measure 1',
                valuesArray[1]?.source?.displayName || 'Measure 2',
                valuesArray[2]?.source?.displayName || 'Measure 3',
                valuesArray[3]?.source?.displayName || 'Measure 4'
            ];
    
            return { values: measureValues, titles: measureTitles };
        }
        return { values: [0, 0, 0, 0], titles: ['Measure 1', 'Measure 2', 'Measure 3', 'Measure 4'] };
    }
    
    
    private toNumber(value: PrimitiveValue): number {
        return typeof value === 'number' ? value : isNaN(Number(value)) ? 0 : Number(value);
    }    

    private static parseSettings(dataView: DataView): VisualSettings {
        return VisualSettings.parse<VisualSettings>(dataView);
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        return VisualSettings.enumerateObjectInstances(this.settings || new VisualSettings(), options);
    }
}
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
    
        // Extract measure values and titles from the dataView
        const { values: measureValues, titles: measureTitles } = this.getMeasureValuesAndTitles(dataView);
    
        // Get the shape and separator settings from the property pane
        const separatorSettings = this.settings.separator;
        const shapeSettings = {
            color: this.settings.shapeSettings.shapeColor,
            type: this.settings.shapeSettings.shapeType,
            labelPosition: this.settings.shapeSettings.labelPosition,
        };
    
        console.log('Shape Settings:', shapeSettings); // Debugging statement
        console.log('Measure Values:', measureValues); // Debugging statement
        console.log('Measure Titles:', measureTitles); // Debugging statement
    
        // Draw the Quad Chart with the updated settings, measure values, and measure titles
        this.quadChart.drawChart(width, height, separatorSettings, shapeSettings, measureValues, measureTitles);
    }
    
    
       

    private getMeasureValuesAndTitles(dataView: DataView): { values: number[], titles: string[] } {
        const valuesArray = dataView?.categorical?.values;
        if (valuesArray && valuesArray.length > 0) {
            const measureValues = [
                this.toNumber(valuesArray.find(value => value.source.roles && value.source.roles['shape1measure'])?.values[0]) || 0,
                this.toNumber(valuesArray.find(value => value.source.roles && value.source.roles['shape2measure'])?.values[1]) || 1,
                this.toNumber(valuesArray.find(value => value.source.roles && value.source.roles['shape3measure'])?.values[2]) || 2,
                this.toNumber(valuesArray.find(value => value.source.roles && value.source.roles['shape4measure'])?.values[3]) || 3
            ];
    
            const measureTitles = [
                valuesArray.find(value => value.source.roles && value.source.roles['shape1measure'])?.source?.displayName || 'Shape 1',
                valuesArray.find(value => value.source.roles && value.source.roles['shape2measure'])?.source?.displayName || 'Shape 2',
                valuesArray.find(value => value.source.roles && value.source.roles['shape3measure'])?.source?.displayName || 'Shape 3',
                valuesArray.find(value => value.source.roles && value.source.roles['shape4measure'])?.source?.displayName || 'Shape 4'
            ];
    
            return { values: measureValues, titles: measureTitles };
        }
        return { values: [0, 1, 2, 3], titles: ['Shape 1', 'Shape 2', 'Shape 3', 'Shape 4'] };
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
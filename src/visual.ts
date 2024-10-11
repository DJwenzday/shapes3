//visual.ts
import * as d3 from 'd3';
import powerbi from "powerbi-visuals-api";
import DataView  = powerbi.DataView;
import IDataViewObject = powerbi.DataViewObject;
import DataViewObjects = powerbi.DataViewObjects;
//import DataViewObjects = powerbi.DataViewObjects;
//import { DataViewObjects } from "powerbi-visuals-utils-dataviewutils/lib/dataViewObjects";
import PrimitiveValue = powerbi.PrimitiveValue;
//import IColorValue = powerbi.visuals.FormattingProperties.ColorValue;
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FillDefinition = formattingSettings.ColorPicker
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

import "./../style/visual.less";
import { FormattingService } from './formattingService';
import { VisualSettings } from './settings';
import { QuadChart } from './components/QuadChart';
import { dataViewObjects } from 'powerbi-visuals-utils-dataviewutils';


export class Visual implements IVisual {
    private target: HTMLElement;
    private svg: d3.Selection<SVGElement, unknown, HTMLElement, any>;
    private quadChart: QuadChart;
    private formattingService: FormattingService;
    private settings: VisualSettings;

    constructor(options: VisualConstructorOptions) {
        this.formattingService = new FormattingService();
        this.target = options.element;
        this.svg = d3.select(this.target)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        this.quadChart = new QuadChart(this.svg);
    }

    private extractValue(value: PrimitiveValue | undefined): string | number {
        if (typeof value === 'string' || typeof value === 'number') {
            return value;
        }
        return '0'; // Default to '0' as a string if the value is not a string or number
    }
    
    private getConditionalFormattingColor(
        objectName: string,
        propertyName: string,
        roleName: string,
        defaultColor: string,
        dataView: powerbi.DataView
    ): string {
        const objects = dataView?.metadata?.objects;
        if (objects) {
            const colorProperty = dataViewObjects.getValue<string>( //DataViewObjects.getValue<string>(
                objects, 
                { objectName, propertyName }, 
                defaultColor
            );
            return colorProperty || defaultColor;
        }
        return defaultColor;
    }
    

    public update(options: VisualUpdateOptions) {
        this.settings = Visual.parseSettings(options.dataViews && options.dataViews[0]);
    
        const width = options.viewport.width;
        const height = options.viewport.height;
        const dataView = options.dataViews && options.dataViews[0];
    
        const { values: measureValues, titles: measureTitles } = this.getMeasureValuesAndTitles(dataView);
    
        const separatorSettings = this.settings.separatorSettings;
        const shapeSettings = {
            color: this.settings.shapeSettings.shapeColor,
            type: this.settings.shapeSettings.shapeType,
            labelPosition: this.settings.shapeSettings.labelPosition,
            font: this.settings.shapeSettings.font,
            fontSize: this.settings.shapeSettings.fontSize
        };
    
        // Draw the Quad Chart with the updated settings, passing individual measure settings for each label
        this.quadChart.drawChart(
            width,
            height,
            separatorSettings,
            shapeSettings,
            measureValues,
            measureTitles,
            [
                this.settings.measure1Settings,
                this.settings.measure2Settings,
                this.settings.measure3Settings,
                this.settings.measure4Settings
            ]
        );
    }
    
    
    private getMeasureValuesAndTitles(dataView: DataView): { values: (string | number)[], titles: string[] } {
        const valuesArray = dataView?.categorical?.values;
        if (valuesArray && valuesArray.length > 0) {
            const measureValues = [
                this.extractValue(valuesArray.find(value => value.source.roles && value.source.roles['shape1measure'])?.values[0]),
                this.extractValue(valuesArray.find(value => value.source.roles && value.source.roles['shape2measure'])?.values[0]),
                this.extractValue(valuesArray.find(value => value.source.roles && value.source.roles['shape3measure'])?.values[0]),
                this.extractValue(valuesArray.find(value => value.source.roles && value.source.roles['shape4measure'])?.values[0])
            ];
    
            const measureTitles = [
                valuesArray.find(value => value.source.roles && value.source.roles['shape1measure'])?.source?.displayName || 'Shape 1',
                valuesArray.find(value => value.source.roles && value.source.roles['shape2measure'])?.source?.displayName || 'Shape 2',
                valuesArray.find(value => value.source.roles && value.source.roles['shape3measure'])?.source?.displayName || 'Shape 3',
                valuesArray.find(value => value.source.roles && value.source.roles['shape4measure'])?.source?.displayName || 'Shape 4'
            ];
    
            return { values: measureValues, titles: measureTitles };
        }
        return { values: [0, 0, 0, 0], titles: ['Shape 1', 'Shape 2', 'Shape 3', 'Shape 4'] };
    }
    
    
    private toNumber(value: PrimitiveValue): number {
        return typeof value === 'number' ? value : isNaN(Number(value)) ? 0 : Number(value);
    }    

    private static parseSettings(dataView: DataView): VisualSettings {
        return VisualSettings.parse<VisualSettings>(dataView);
    }

   //(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
   //     return VisualSettings.enumerateObjectInstances(this.settings || new VisualSettings(), options);
   // }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingService.getFormattingModel(this.settings);
    }
}
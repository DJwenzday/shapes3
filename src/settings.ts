//settings.ts
import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class VisualSettings extends DataViewObjectsParser {
    public separatorSettings: SeparatorSettings = new SeparatorSettings();
    public shapeSettings: ShapeSettings = new ShapeSettings();
    public measure1Settings: MeasureSettings = new MeasureSettings();
    public measure2Settings: MeasureSettings = new MeasureSettings();
    public measure3Settings: MeasureSettings = new MeasureSettings();
    public measure4Settings: MeasureSettings = new MeasureSettings();
    public tooltipSettings: TooltipSettings = new TooltipSettings();
    public cards: Array<powerbi.visuals.FormattingCard> = [];  //new
}

export class SeparatorSettings {
    public color: string = "#000000";
    public width: number = 2;
    public show: boolean = true; // Toggle for showing separator
}

export class ShapeSettings {
    public shapeType: string = "circle"; 
    public width: number = 2; // Stroke size of shape
    public labelPosition: string = "centered";
    public font: string = "Segoe UI";
    public fontSize: number = 12;
    public show: boolean = true; // Labels are shown by default
}

export class MeasureSettings {
    public shapeFillColor: string = "#ff0000";  // Default fill color
    public shapeStrokeColor: string = "#000000";  // Default stroke color
    public labelFontColor: string = "#000000";  // Font color for the label
    public conditionalFormattingRules: any[] = []; // To hold rule-based settings
}

export class TooltipSettings {
    public show: boolean = true;
}
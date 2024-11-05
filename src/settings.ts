//settings.ts

// Import the DataViewObjectsParser from Power BI visuals utilities for handling settings parsing
import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

// Main class for visual settings that extends DataViewObjectsParser to enable custom property parsing
export class VisualSettings extends DataViewObjectsParser {
    public separatorSettings: SeparatorSettings = new SeparatorSettings(); // Instance for separator settings
    public shapeSettings: ShapeSettings = new ShapeSettings(); // Instance for shape settings
    public measure1Settings: MeasureSettings = new MeasureSettings(); // Instance for measure 1 settings
    public measure2Settings: MeasureSettings = new MeasureSettings(); // Instance for measure 2 settings
    public measure3Settings: MeasureSettings = new MeasureSettings(); // Instance for measure 3 settings
    public measure4Settings: MeasureSettings = new MeasureSettings(); // Instance for measure 4 settings
    public tooltipSettings: TooltipSettings = new TooltipSettings(); // Instance for tooltip settings
    public cards: Array<powerbi.visuals.FormattingCard> = []; // Array to hold formatting cards for the custom format pane
}

// Class for configuring settings related to separators in the visualization
export class SeparatorSettings {
    public color: string = "#000000"; // Default color of the separator line
    public width: number = 2; // Default width of the separator line
    public show: boolean = true; // Flag to toggle the visibility of the separator
}

// Class for configuring settings related to shapes in the visualization
export class ShapeSettings {
    public shapeType: string = "circle"; // Default type of shape (circle)
    public shapeStrokeWidth: number = 2; // Default stroke width for the shape border
    public labelPosition: string = "centered"; // Default position for labels (centered)
    public font: string = "Segoe UI"; // Default font for the label text
    public fontSize: number = 12; // Default font size for the label text
    public show: boolean = true; // Flag to indicate whether labels are shown by default
}

// Class for configuring individual measure settings including appearance and formatting
export class MeasureSettings {
    public shapeFillColor: string = "#ff0000"; // Default fill color for shapes
    public shapeStrokeColor: string = "#000000"; // Default stroke color for shapes
    public labelFontColor: string = "#000000"; // Default font color for labels
    public conditionalFormattingRules: any[] = []; // Array to store conditional formatting rules for dynamic styling
}

// Class for configuring tooltip settings in the visualization
export class TooltipSettings {
    public show: boolean = true; // Flag to indicate whether tooltips are shown by default
}
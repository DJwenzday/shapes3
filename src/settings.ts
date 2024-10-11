import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class VisualSettings extends DataViewObjectsParser {
    public separatorSettings: SeparatorSettings = new SeparatorSettings(); // Changed to match capabilities.json
    public shapeSettings: ShapeSettings = new ShapeSettings();
    public measure1Settings: MeasureSettings = new MeasureSettings();
    public measure2Settings: MeasureSettings = new MeasureSettings();
    public measure3Settings: MeasureSettings = new MeasureSettings();
    public measure4Settings: MeasureSettings = new MeasureSettings();
}

export class SeparatorSettings {
    public color: string = "#000000";
    public width: number = 2;
}

export class ShapeSettings {
    public shapeColor: string = "#ff0000"; // Default color for all shapes
    public shapeType: string = "circle";   // Default shape type for all quadrants
    public labelPosition: string = "centered";
}

export class MeasureSettings {
    public shapeFillColor: string = "#ff0000";  // Default fill color
    public shapeStrokeColor: string = "#000000";  // Default stroke color
}

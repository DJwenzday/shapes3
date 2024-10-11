//settings.ts
import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class VisualSettings extends DataViewObjectsParser {
    public separator: SeparatorSettings = new SeparatorSettings();
    public shapeSettings: ShapeSettings = new ShapeSettings();
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
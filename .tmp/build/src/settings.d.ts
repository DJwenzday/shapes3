import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;
export declare class VisualSettings extends DataViewObjectsParser {
    separator: SeparatorSettings;
    shapeSettings: ShapeSettings;
}
export declare class SeparatorSettings {
    color: string;
    width: number;
}
export declare class ShapeSettings {
    shapeColor: string;
    shapeType: string;
}

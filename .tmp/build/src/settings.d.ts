import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;
export declare class VisualSettings extends DataViewObjectsParser {
    separatorSettings: SeparatorSettings;
    shapeSettings: ShapeSettings;
    measure1Settings: MeasureSettings;
    measure2Settings: MeasureSettings;
    measure3Settings: MeasureSettings;
    measure4Settings: MeasureSettings;
}
export declare class SeparatorSettings {
    color: string;
    width: number;
}
export declare class ShapeSettings {
    shapeColor: string;
    shapeType: string;
    labelPosition: string;
}
export declare class MeasureSettings {
    shapeFillColor: string;
    shapeStrokeColor: string;
}

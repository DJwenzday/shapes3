import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;
export declare class VisualSettings extends DataViewObjectsParser {
    separatorSettings: SeparatorSettings;
    shapeSettings: ShapeSettings;
    measure1Settings: MeasureSettings;
    measure2Settings: MeasureSettings;
    measure3Settings: MeasureSettings;
    measure4Settings: MeasureSettings;
    tooltipSettings: TooltipSettings;
    cards: Array<powerbi.visuals.FormattingCard>;
}
export declare class SeparatorSettings {
    color: string;
    strokeWidth: number;
    show: boolean;
}
export declare class ShapeSettings {
    shapeType: string;
    strokeWidth: number;
    labelPosition: string;
    font: string;
    fontSize: number;
    show: boolean;
}
export declare class MeasureSettings {
    shapeFillColor: string;
    shapeStrokeColor: string;
    labelFontColor: string;
    conditionalFormattingRules: any[];
}
export declare class TooltipSettings {
    show: boolean;
}

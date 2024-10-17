import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import "./../style/visual.less";
export declare class Visual implements IVisual {
    private target;
    private svg;
    private quadChart;
    private formattingService;
    private settings;
    private selectionManager;
    constructor(options: VisualConstructorOptions);
    private bindContextMenu;
    private extractValue;
    private getConditionalFormattingColor;
    update(options: VisualUpdateOptions): void;
    private getMeasureValuesAndTitles;
    private toNumber;
    private static parseSettings;
    getFormattingModel(): powerbi.visuals.FormattingModel;
}

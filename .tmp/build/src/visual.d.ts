import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
export declare class Visual implements IVisual {
    private target;
    private svg;
    private quadChart;
    private formattingService;
    private settings;
    private selectionManager;
    private formattingSettingsService;
    private host;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    private bindContextMenu;
    private static parseSettings;
    getFormattingModel(): powerbi.visuals.FormattingModel;
}

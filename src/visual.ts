// visual.ts
import * as d3 from 'd3';
import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import { FormattingService } from './formattingService';
import { VisualSettings } from './settings';
import { QuadChart } from './components/QuadChart';
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";

export class Visual implements IVisual {
    private target: HTMLElement;
    private svg: d3.Selection<SVGElement, unknown, HTMLElement, any>;
    private quadChart: QuadChart;
    private formattingService: FormattingService;
    private settings: VisualSettings;
    private selectionManager: ISelectionManager;
    private formattingSettingsService: FormattingSettingsService;
    private host: powerbi.extensibility.visual.IVisualHost;

    constructor(options: VisualConstructorOptions) {
        console.log("Initializing Visual");
        this.host = options.host;
        this.formattingService = new FormattingService();
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        this.svg = d3.select(this.target)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        this.selectionManager = options.host.createSelectionManager();
        this.quadChart = new QuadChart(this.svg, this.selectionManager, options.host);
        this.bindContextMenu();
    }

    public update(options: VisualUpdateOptions) {
        console.log("Visual update called");
        const dataView = options.dataViews && options.dataViews[0];
        if (!dataView || !dataView.categorical || !dataView.categorical.values) {
            console.warn("No data view available");
            return;
        }
    
        this.settings = Visual.parseSettings(dataView);
        console.log("Settings parsed:", this.settings);
    
        this.quadChart.drawChart(
            options.viewport.width,
            options.viewport.height,
            this.settings.separatorSettings,
            this.settings.shapeSettings,
            dataView,
            this.settings
        );
    
        console.log("Chart rendered with dimensions:", options.viewport.width, options.viewport.height);
    }

    private bindContextMenu() {
        this.svg.on('contextmenu', (event: MouseEvent) => {
            event.preventDefault();
            console.log("Context menu triggered");

            const dataPoint = {
                category: "quadChart",
                value: []
            };
            this.selectionManager.showContextMenu(dataPoint, { x: event.clientX, y: event.clientY });
        });
    }

    private static parseSettings(dataView: powerbi.DataView): VisualSettings {
        console.log("Parsing settings from data view");
        return VisualSettings.parse<VisualSettings>(dataView);
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        console.log("Retrieving formatting model for custom format pane");
        return this.formattingService.getFormattingModel(this.settings);
    }
}

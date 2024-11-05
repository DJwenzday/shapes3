//visual.ts

// Import necessary libraries and types
import * as d3 from 'd3'; // Importing D3.js for SVG and DOM manipulation
import powerbi from "powerbi-visuals-api"; // Power BI Visuals API for types and interfaces
import IVisual = powerbi.extensibility.visual.IVisual; // Interface for custom visuals
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions; // Constructor options for visuals
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions; // Update options for visuals
import ISelectionManager = powerbi.extensibility.ISelectionManager; // Interface for selection manager
import { FormattingService } from './formattingService'; // Custom formatting service
import { VisualSettings } from './settings'; // Settings class for managing visual settings
import { QuadChart } from './components/QuadChart'; // Component for drawing the chart
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel"; // Service for formatting settings

// Main class that implements the custom Power BI visual
export class Visual implements IVisual {
    // Private properties for managing visual elements and functionality
    private target: HTMLElement; // The HTML element target for rendering the visual
    private svg: d3.Selection<SVGElement, unknown, HTMLElement, any>; // D3 selection for the SVG container
    private quadChart: QuadChart; // Instance of the QuadChart class
    private formattingService: FormattingService; // Instance of the formatting service
    private settings: VisualSettings; // Instance of the visual settings
    private selectionManager: ISelectionManager; // Instance of the selection manager for handling interactions
    private formattingSettingsService: FormattingSettingsService; // Service for formatting pane customization
    private host: powerbi.extensibility.visual.IVisualHost; // Host services from Power BI

    // Constructor for initializing the visual with options provided by Power BI
    constructor(options: VisualConstructorOptions) {
        console.log("Initializing Visual");
        this.host = options.host; // Assigning the host to access services such as color palette and localization
        this.formattingService = new FormattingService(); // Creating an instance of the formatting service
        this.formattingSettingsService = new FormattingSettingsService(); // Creating an instance of the formatting settings service
        this.target = options.element; // Setting the target element for the visual
        this.svg = d3.select(this.target) // Initializing the SVG container with D3.js
            .append('svg')
            .attr('width', '100%') // Setting width to fill the container
            .attr('height', '100%'); // Setting height to fill the container

        this.selectionManager = options.host.createSelectionManager(); // Initializing the selection manager for handling data selection
        this.quadChart = new QuadChart(this.svg, this.selectionManager, options.host); // Creating an instance of the QuadChart
        this.bindContextMenu(); // Binding the context menu for right-click interactions
    }

    // Method that Power BI calls when the visual is updated with new data or settings
    public update(options: VisualUpdateOptions) {
        console.log("Visual update called");
        const dataView = options.dataViews && options.dataViews[0]; // Checking if data view is available
        if (!dataView || !dataView.categorical || !dataView.categorical.values) {
            console.warn("No data view available"); // Logging a warning if no data is available
            return; // Exiting the method if no data is found
        }

        // Parsing settings from the data view
        this.settings = Visual.parseSettings(dataView);
        console.log("Settings parsed:", this.settings);

        // Drawing the QuadChart with the parsed settings and data
        this.quadChart.drawChart(
            options.viewport.width, // Width of the viewport
            options.viewport.height, // Height of the viewport
            this.settings.separatorSettings, // Separator settings for lines in the chart
            this.settings.shapeSettings, // Shape settings for the chart's visuals
            dataView, // Data view containing the chart data
            this.settings // Overall visual settings
        );

        console.log("Chart rendered with dimensions:", options.viewport.width, options.viewport.height);
    }

    // Method for binding the right-click context menu event to the SVG container
    private bindContextMenu() {
        this.svg.on('contextmenu', (event: MouseEvent) => {
            event.preventDefault(); // Preventing the default context menu from appearing
            console.log("Context menu triggered");

            const dataPoint = {
                category: "quadChart", // Placeholder data point for the context menu
                value: []
            };
            this.selectionManager.showContextMenu(dataPoint, { x: event.clientX, y: event.clientY }); // Showing the context menu at the mouse position
        });
    }

    // Static method to parse settings from a data view
    private static parseSettings(dataView: powerbi.DataView): VisualSettings {
        console.log("Parsing settings from data view");
        return VisualSettings.parse<VisualSettings>(dataView); // Parsing the visual settings from the data view
    }

    // Method for retrieving the formatting model for the Power BI custom format pane
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        console.log("Retrieving formatting model for custom format pane");
        return this.formattingService.getFormattingModel(this.settings); // Returning the formatting model from the formatting service
    }
}

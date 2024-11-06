//QuadChart.ts

// Import necessary libraries and components for building the visual
import * as d3 from 'd3'; // D3.js library for data visualization
import { Separators } from './Separators'; // Module for drawing separator lines
import { Shape } from './Shape'; // Module for drawing shapes
import { Label } from './Label'; // Module for drawing labels
import { TooltipService } from '../services/tooltipService'; // Custom service for handling tooltips
import powerbi from 'powerbi-visuals-api'; // Power BI API for building custom visuals
import ISelectionManager = powerbi.extensibility.ISelectionManager; // Interface for handling selection
import ISelectionId = powerbi.visuals.ISelectionId; // Interface for selection IDs
import IVisualHost = powerbi.extensibility.visual.IVisualHost; // Interface for visual host
import DataView = powerbi.DataView; // Interface for Power BI DataView
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn; // Interface for category columns in DataView
import DataViewValueColumns = powerbi.DataViewValueColumns; // Interface for value columns in DataView

// Class that handles the creation and rendering of the Quad Chart
export class QuadChart {
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>; // Main SVG container for the chart
    private separators: Separators; // Instance for drawing separators
    private shapeDrawer: Shape; // Instance for drawing shapes
    private labelDrawer: Label; // Instance for drawing labels
    private tooltipService: TooltipService; // Instance for managing tooltips
    private selectionManager: ISelectionManager; // Manager for selection handling
    private host: IVisualHost; // Host interface for Power BI visual interactions
    private data: any[]; // Array to hold data for rendering

    // Constructor to initialize the QuadChart with container, selection manager, and host
    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>, selectionManager: ISelectionManager, host: IVisualHost) {
        this.container = container; // Assign the SVG container
        this.separators = new Separators(container); // Initialize separators instance
        this.shapeDrawer = new Shape(container); // Initialize shape drawer instance
        this.labelDrawer = new Label(container); // Initialize label drawer instance
        this.tooltipService = new TooltipService(); // Initialize tooltip service
        this.selectionManager = selectionManager; // Assign selection manager
        this.host = host; // Assign visual host
        console.log("QuadChart initialized"); // Log message for debugging
    }

    // Method to draw basic circles based on the provided data
    public draw(data: any[]): void {
        this.data = data; // Store the data in the instance

        // Bind data to circle elements and set their properties
        this.container.selectAll('circle')
            .data(data)
            .join('circle')
            .attr('cx', d => d.x) // Set x-coordinate
            .attr('cy', d => d.y) // Set y-coordinate
            .attr('r', 20) // Set radius (example value)
            .style('fill', d => d.color) // Set fill color based on data
            .on('contextmenu', (event, d) => {
                event.preventDefault(); // Prevent default context menu
                if (d.selectionId) { // Check if a selection ID is present
                    this.selectionManager.showContextMenu(d.selectionId, {
                        x: event.clientX,
                        y: event.clientY
                    });
                    console.log('Context menu triggered for:', d.selectionId); // Log selection ID for debugging
                }
            });
    }

    // Main method to draw the chart with shapes, separators, and labels
    // QuadChart.ts

public drawChart(
    width: number,
    height: number,
    separatorSettings: any,
    shapeSettings: any,
    dataView: DataView,
    settings: any
): void {
    console.log("Drawing chart with dimensions:", width, "x", height);

    // Clear the container before drawing new elements
    this.container.selectAll('*').remove();

    // Draw separators if the setting is enabled
    if (separatorSettings.show) {
        this.separators.updateSeparators(width, height, separatorSettings);
        console.log("Separators drawn");
    }

    const shapeSize = Math.min(width, height) * 0.2;
    console.log("Calculated shape size:", shapeSize);

    if (dataView.categorical && dataView.categorical.categories && dataView.categorical.categories.length > 0) {
        const categoryColumn = dataView.categorical.categories[0];
        const measures = dataView.categorical.values;
        this.drawShapesAndLabels(width, height, shapeSettings, categoryColumn, measures, shapeSize, settings, dataView);
    }
}


    // Private method to draw shapes and labels for each data point
    // QuadChart.ts

private drawShapesAndLabels(
    width: number,
    height: number,
    shapeSettings: any,
    categoryColumn: DataViewCategoryColumn,
    measures: DataViewValueColumns,
    shapeSize: number,
    settings: any,
    dataView: DataView
): void {
    const measureSettingsArray = [
        settings.measure1Settings,
        settings.measure2Settings,
        settings.measure3Settings,
        settings.measure4Settings
    ];

    const tooltipColumn = dataView.categorical.values.find(value => value.source.roles["tooltipMeasure"]);

    categoryColumn.values.forEach((category, index) => {
        const selectionId = this.host.createSelectionIdBuilder()
            .withCategory(categoryColumn, index)
            .createSelectionId();

        const measureValue = measures[0]?.values[index];
        const tooltipValue = tooltipColumn ? tooltipColumn.values[index] : null;
        const measureTitle = measures[index % measures.length]?.source.displayName || 'N/A';

        // Calculate coordinates for shapes based on quadrant index
        const x = (index % 2) * width / 2 + width / 4;
        const y = Math.floor(index / 2) * height / 2 + height / 4;

        const measureSettings = {
            ...measureSettingsArray[index % measureSettingsArray.length],
            measureValue: measureValue,
            objectName: `measure${(index % 4) + 1}Settings`,
            shapeType: shapeSettings.shapeType
        };

        console.log(`Drawing shape for measure title "${measureTitle}" at index ${index}:`, measureSettings.shapeType);

        const shapeElement = this.shapeDrawer.drawShape(
            x,
            y,
            {
                type: measureSettings.shapeType || 'circle',
                defaultColor: measureSettings.shapeFillColor || '#000000',
                defaultStroke: measureSettings.shapeStrokeColor || '#000000',
                width: shapeSettings.shapeStrokeWidth || 2
            },
            shapeSize,
            measureSettings,
            dataView,
            tooltipValue !== null && tooltipValue !== undefined ? String(tooltipValue) : 'N/A'
        );

        shapeElement.on('contextmenu', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            this.selectionManager.showContextMenu(selectionId, { x: event.clientX, y: event.clientY });
            console.log("Context menu triggered for measure title:", measureTitle);
        });

        shapeElement.on('mouseover', (event: MouseEvent) => {
            const tooltipText = tooltipValue !== null && tooltipValue !== undefined ? String(tooltipValue) : 'N/A';
            this.tooltipService.showTooltip(tooltipText, event);
        }).on('mouseout', () => {
            this.tooltipService.hideTooltip();
        });

        if (shapeSettings.show) {
            const labelElement = this.labelDrawer.drawLabel(
                x,
                y,
                measureTitle,
                shapeSettings.labelPosition,
                shapeSettings.font,
                shapeSettings.fontSize,
                measureSettings.labelFontColor || '#000000',
                shapeSize,
                measureSettings.shapeType,
                measureSettings,
                dataView
            ) as d3.Selection<SVGTextElement, unknown, HTMLElement, any>;

            if (labelElement) {
                labelElement.on('contextmenu', (event: MouseEvent) => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.selectionManager.showContextMenu(selectionId, { x: event.clientX, y: event.clientY });
                    console.log("Context menu triggered for measure title:", measureTitle, "from label");
                });

                labelElement.on('mouseover', (event: MouseEvent) => {
                    const tooltipText = tooltipValue !== null && tooltipValue !== undefined ? String(tooltipValue) : 'N/A';
                    this.tooltipService.showTooltip(tooltipText, event);
                }).on('mouseout', () => {
                    this.tooltipService.hideTooltip();
                });
            }
        }
    });
}

}
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
    public drawChart(
        width: number, // Width of the chart
        height: number, // Height of the chart
        separatorSettings: any, // Settings for separators
        shapeSettings: any, // Settings for shapes
        dataView: DataView, // DataView containing chart data
        settings: any // General settings for the chart
    ): void {
        console.log("Drawing chart with dimensions:", width, "x", height); // Log chart dimensions

        // Clear the container before drawing new elements
        this.container.selectAll('*').remove();

        // Draw separators if the setting is enabled
        if (separatorSettings.show) {
            this.separators.drawVerticalLine(width / 2, height, separatorSettings); // Draw vertical line
            this.separators.drawHorizontalLine(height / 2, width, separatorSettings, 10); // Draw horizontal line with offset
            console.log("Separators drawn"); // Log message for debugging
        }

        // Calculate size for shapes relative to chart dimensions
        const shapeSize = Math.min(width, height) * 0.2;
        console.log("Calculated shape size:", shapeSize); // Log calculated shape size

        // Check if the DataView contains categories and values before drawing shapes
        if (dataView.categorical && dataView.categorical.categories && dataView.categorical.categories.length > 0) {
            const categoryColumn = dataView.categorical.categories[0]; // Get the category column
            const measures = dataView.categorical.values; // Get the measure values
            this.drawShapesAndLabels(width, height, shapeSettings, categoryColumn, measures, shapeSize, settings, dataView);
        }
    }

    // Private method to draw shapes and labels for each data point
    private drawShapesAndLabels(
        width: number, // Width of the chart
        height: number, // Height of the chart
        shapeSettings: any, // Settings for shapes
        categoryColumn: DataViewCategoryColumn, // Category column from DataView
        measures: DataViewValueColumns, // Value columns from DataView
        shapeSize: number, // Size of the shapes
        settings: any, // General settings for the chart
        dataView: DataView // DataView containing chart data
    ): void {
        // Array of measure settings for each measure column
        const measureSettingsArray = [
            settings.measure1Settings,
            settings.measure2Settings,
            settings.measure3Settings,
            settings.measure4Settings
        ];

        // Extract tooltip data column if available
        const tooltipColumn = dataView.categorical.values.find(value => value.source.roles["tooltipMeasure"]);

        // Iterate over each category to draw shapes and labels
        categoryColumn.values.forEach((category, index) => {
            // Create a selection ID for each data point
            const selectionId = this.host.createSelectionIdBuilder()
                .withCategory(categoryColumn, index)
                .createSelectionId();

            // Get the measure value and tooltip value for the current index
            const measureValue = measures[0]?.values[index]; // Adjust index based on measure logic
            const tooltipValue = tooltipColumn ? tooltipColumn.values[index] : null; // Get tooltip value
            const measureTitle = measures[index % measures.length]?.source.displayName || 'N/A'; // Get measure title

            // Calculate the coordinates for placing the shape
            const x = (index % 2) * width / 2 + width / 4;
            const y = Math.floor(index / 2) * height / 2 + height / 4;

            // Create an object containing settings for the current measure
            const measureSettings = {
                ...measureSettingsArray[index % measureSettingsArray.length],
                measureValue: measureValue, // Value of the current measure
                objectName: `measure${(index % 4) + 1}Settings`, // Object name for measure settings
                shapeType: shapeSettings.shapeType // Shape type from settings
            };

            console.log(`Drawing shape for measure title "${measureTitle}" at index ${index}:`, measureSettings.shapeType); // Log drawing details

            // Draw the shape and bind event handlers
            const shapeElement = this.shapeDrawer.drawShape(
                x, // X-coordinate for shape
                y, // Y-coordinate for shape
                {
                    type: measureSettings.shapeType || 'circle', // Shape type (default: circle)
                    defaultColor: measureSettings.shapeFillColor || '#000000', // Default fill color
                    defaultStroke: measureSettings.shapeStrokeColor || '#000000', // Default stroke color
                    width: shapeSettings.shapeStrokeWidth || 2 // Stroke width
                },
                shapeSize, // Size of the shape
                measureSettings, // Settings for the current measure
                dataView // DataView for accessing metadata and data
            );

            // Add context menu event handler to the shape
            shapeElement.on('contextmenu', (event: MouseEvent) => {
                event.preventDefault(); // Prevent default context menu
                event.stopPropagation(); // Stop event propagation
                this.selectionManager.showContextMenu(selectionId, { x: event.clientX, y: event.clientY }); // Show custom context menu
                console.log("Context menu triggered for measure title:", measureTitle); // Log message for debugging
            });

            // Add mouseover and mouseout event handlers for tooltips
            shapeElement.on('mouseover', (event: MouseEvent) => {
                const tooltipText = tooltipValue !== null && tooltipValue !== undefined ? String(tooltipValue) : 'N/A'; // Set tooltip text
                this.tooltipService.showTooltip(tooltipText, event); // Show tooltip
            }).on('mouseout', () => {
                this.tooltipService.hideTooltip(); // Hide tooltip on mouse out
            });

            // Check if labels should be shown based on settings
            if (shapeSettings.show) {
                // Draw the label and bind event handlers
                const labelElement = this.labelDrawer.drawLabel(
                    x, // X-coordinate for label
                    y, // Y-coordinate for label
                    measureTitle, // Text for the label (measure title)
                    shapeSettings.labelPosition, // Position of the label ('centered' or 'above')
                    shapeSettings.font, // Font family for the label
                    shapeSettings.fontSize, // Font size for the label
                    measureSettings.labelFontColor || '#000000', // Font color for the label
                    shapeSize, // Size of the associated shape
                    measureSettings.shapeType, // Type of the shape
                    measureSettings, // Settings for the current measure
                    dataView // DataView for accessing metadata and data
                ) as d3.Selection<SVGTextElement, unknown, HTMLElement, any>;

                // Add context menu event handler to the label
                if (labelElement) {
                    labelElement.on('contextmenu', (event: MouseEvent) => {
                        event.preventDefault(); // Prevent default context menu
                        event.stopPropagation(); // Stop event propagation
                        this.selectionManager.showContextMenu(selectionId, { x: event.clientX, y: event.clientY }); // Show custom context menu
                        console.log("Context menu triggered for measure title:", measureTitle, "from label"); // Log message for debugging
                    });

                    // Add mouseover and mouseout event handlers for tooltips on the label
                    labelElement.on('mouseover', (event: MouseEvent) => {
                        const tooltipText = tooltipValue !== null && tooltipValue !== undefined ? String(tooltipValue) : 'N/A'; // Set tooltip text
                        this.tooltipService.showTooltip(tooltipText, event); // Show tooltip
                    }).on('mouseout', () => {
                        this.tooltipService.hideTooltip(); // Hide tooltip on mouse out
                    });
                }
            }
        });
    }
}
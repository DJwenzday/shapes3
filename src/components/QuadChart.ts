//QuadChart.ts
import * as d3 from 'd3';
import { Separators } from './Separators';
import { Shape } from './Shape';
import { Label } from './Label';
import { TooltipService } from '../services/tooltipService';
import { MeasureSettings } from '../settings';
import { dataViewObject, dataViewObjects } from 'powerbi-visuals-utils-dataviewutils';
import powerbi from 'powerbi-visuals-api';
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import ISelectionId = powerbi.visuals.ISelectionId;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import DataView = powerbi.DataView;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import DataViewValueColumns = powerbi.DataViewValueColumns;


export class QuadChart {
    //private settings: MeasureSettings;
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>;
    private separators: Separators;
    private shapeDrawer: Shape;
    private labelDrawer: Label;
    private tooltipService: TooltipService;
    private selectionManager: ISelectionManager;
    private currentTitle: string = "Default Title";
    private host: IVisualHost;

    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>, selectionManager: ISelectionManager, host: IVisualHost) {
        //this.settings = new MeasureSettings;
        this.container = container;
        this.separators = new Separators(container);
        this.shapeDrawer = new Shape(container);
        this.labelDrawer = new Label(container);
        this.tooltipService = new TooltipService();
        this.selectionManager = selectionManager;
        this.host = host;
        console.log("QuadChart initialized");
    }

    // Correcting drawShapesAndLabels invocation and refining shape handling
// QuadChart.ts

public drawChart(
    width: number,
    height: number,
    separatorSettings: any,
    shapeSettings: any,
    dataView: DataView, // This is the actual dataView instance
    settings: any       // Accept settings as a parameter
): void {
    console.log("Drawing chart with dimensions:", width, "x", height);
    this.container.selectAll('*').remove();

    if (separatorSettings.show) {
        this.separators.drawVerticalLine(width / 2, height, separatorSettings);
        this.separators.drawHorizontalLine(height / 2, width, separatorSettings);
        console.log("Separators drawn");
    }

    const shapeSize = Math.min(width, height) * 0.2;
    console.log("Calculated shape size:", shapeSize);

    if (dataView.categorical && dataView.categorical.categories && dataView.categorical.categories.length > 0) {
        const categoryColumn = dataView.categorical.categories[0];
        const measures = dataView.categorical.values;
        this.drawShapesAndLabels(width, height, shapeSettings, categoryColumn, measures, shapeSize, settings, dataView); // Pass dataView here
    }
}

private drawShapesAndLabels(
    width: number,
    height: number,
    shapeSettings: any,
    categoryColumn: DataViewCategoryColumn,
    measures: DataViewValueColumns,
    shapeSize: number,
    settings: any,
    dataView: DataView  // Accept the actual dataView instance here
): void {
    const measureSettingsArray = [
        settings.measure1Settings,
        settings.measure2Settings,
        settings.measure3Settings,
        settings.measure4Settings
    ];

    measures.forEach((measure, index) => {
        const measureValue = measure.values[0];  // Get the actual data value for conditional formatting
        const measureTitle = measure.source.displayName;  // Get the title (display name) of the measure
        const x = (index % 2) * width / 2 + width / 4;
        const y = Math.floor(index / 2) * height / 2 + height / 4;

        const measureSettings = measureSettingsArray[index] || {};
        const selectionId = this.host.createSelectionIdBuilder()
            .withCategory(categoryColumn, index)
            .createSelectionId();

        // Pass dataView to drawShapeWithLabel
        this.drawShapeWithLabel(x, y, measureTitle, measureValue, measureSettings, selectionId, shapeSettings, shapeSize, width, height, dataView);
    });
}

private drawShapeWithLabel(
    x: number, 
    y: number,
    measureTitle: string,
    measureValue: any,  // Pass the measure value
    measureSettings: any, 
    selectionId: ISelectionId,
    shapeSettings: any,
    shapeSize: number,
    containerWidth: number,
    containerHeight: number,
    dataView: DataView  // Use the actual dataView instance here
): void {
    console.log("Drawing shape at:", x, y, "with measure value:", measureValue);

    // Determine conditional color based on measureValue
    const fillColor = this.getConditionalFormattingColor(
        measureSettings.objectName,           // Object name for measure settings
        "shapeFillColor",                     // Property for shape fill color
        measureSettings.shapeFillColor || "#000000",  // Fallback color if no rule is set
        dataView                              // The data view for dynamic rules
    );
    
    const strokeColor = this.getConditionalFormattingColor(
        measureSettings.objectName,           // Object name for measure settings
        "shapeStrokeColor",                   // Property for shape stroke color
        measureSettings.shapeStrokeColor || "#000000", // Fallback color
        dataView
    );
    
    const fontColor = this.getConditionalFormattingColor(
        measureSettings.objectName,           // Object name for measure settings
        "labelFontColor",                     // Property for label font color
        measureSettings.labelFontColor || "#000000",   // Fallback color
        dataView
    );

    // Use these colors for rendering shapes and labels
    const shapeElement = this.shapeDrawer.drawShape(x, y, {
        type: shapeSettings.shapeType,
        color: fillColor,
        stroke: strokeColor,
        shapeStroke: shapeSettings.shapeStroke
    }, containerWidth, containerHeight);
    
    if (!shapeElement) {
        console.error("Failed to create shape element.");
        return;
    }

    // Attach context menu and tooltips as before
    shapeElement.on('contextmenu', (event: MouseEvent) => {
        event.preventDefault();
        this.selectionManager.showContextMenu(selectionId, { x: event.clientX, y: event.clientY });
        console.log("Context menu triggered for", measureTitle);
    });

    shapeElement.on('mouseover', (event: MouseEvent) => {
        this.tooltipService.showTooltip(measureValue, event);
    }).on('mouseout', () => {
        this.tooltipService.hideTooltip();
    });

    // Draw label if setting is enabled
    if (shapeSettings.show) {
        console.log("Drawing label for:", measureTitle);
        const labelPosition = shapeSettings.labelPosition === 'above' ? 'above' : 'centered';
        
        this.labelDrawer.drawLabel(
            x, 
            y, 
            measureTitle, 
            labelPosition, 
            shapeSettings.font, 
            shapeSettings.fontSize, 
            fontColor, 
            shapeSize
        );
    }
}




// Add helper method to determine conditional color based on measure value
private getConditionalFormattingColor(
    objectName: string,
    propertyName: string,
    defaultColor: string,
    dataView: powerbi.DataView
): string {
    const objects = dataView?.metadata?.objects;
    if (objects) {
        // Retrieve color from conditional formatting rule or use the default color
        const colorProperty = dataViewObjects.getValue<string>(
            objects, 
            { objectName, propertyName }, 
            defaultColor
        );
        return colorProperty || defaultColor;
    }
    return defaultColor;
}



    public updateContextMenu(labelText: string) {
        this.currentTitle = labelText;
        console.log("Context menu title set to:", labelText);
        this.bindContextMenu();
    }

    private bindContextMenu() {
        this.container.on('contextmenu', (event: MouseEvent) => {
            event.preventDefault();
            const mouseEvent = event as MouseEvent;
            console.log("Context menu requested at position:", mouseEvent.clientX, mouseEvent.clientY);
            const dataPoint = {
                category: this.currentTitle, 
                value: []
            };
            this.selectionManager.showContextMenu(dataPoint, { x: mouseEvent.clientX, y: mouseEvent.clientY });
        });
    }
}
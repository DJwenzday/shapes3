import * as d3 from 'd3';
import { Separators } from './Separators';
import { Shape } from './Shape';
import { Label } from './Label';
import { TooltipService } from '../services/tooltipService';
import powerbi from 'powerbi-visuals-api';
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import ISelectionId = powerbi.visuals.ISelectionId;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import DataView = powerbi.DataView;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import DataViewValueColumns = powerbi.DataViewValueColumns;

export class QuadChart {
    private container: d3.Selection<SVGElement, unknown, HTMLElement, any>;
    private separators: Separators;
    private shapeDrawer: Shape;
    private labelDrawer: Label;
    private tooltipService: TooltipService;
    private selectionManager: ISelectionManager;
    private host: IVisualHost;

    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>, selectionManager: ISelectionManager, host: IVisualHost) {
        this.container = container;
        this.separators = new Separators(container);
        this.shapeDrawer = new Shape(container);
        this.labelDrawer = new Label(container);
        this.tooltipService = new TooltipService();
        this.selectionManager = selectionManager;
        this.host = host;
        console.log("QuadChart initialized");
    }

    public drawChart(
        width: number,
        height: number,
        separatorSettings: any,
        shapeSettings: any,
        dataView: DataView,
        settings: any
    ): void {
        console.log("Drawing chart with dimensions:", width, "x", height);
        this.container.selectAll('*').remove();

        if (separatorSettings.show) {
            this.separators.drawVerticalLine(width / 2, height, separatorSettings);
            this.separators.drawHorizontalLine(height / 2, width, separatorSettings, 10);
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

        measures.forEach((measure, index) => {
            const measureValue = measure.values[0];
            const measureTitle = measure.source.displayName;
            const x = (index % 2) * width / 2 + width / 4;
            const y = Math.floor(index / 2) * height / 2 + height / 4;

            const measureSettings = {
                ...measureSettingsArray[index],
                measureValue: measureValue,
                objectName: `measure${index + 1}Settings`,
                shapeType: shapeSettings.shapeType // Ensure shapeType is correctly passed
            };

            // Debug log to ensure shape type is correct
            console.log(`Drawing shape type for measure ${index + 1}:`, measureSettings.shapeType);

            // Draw the shape using the correct shape type from measureSettings
            this.shapeDrawer.drawShape(
                x,
                y,
                {
                    type: measureSettings.shapeType || 'circle',
                    defaultColor: measureSettings.shapeFillColor || '#000000',
                    defaultStroke: measureSettings.shapeStrokeColor || '#000000',
                    shapeStroke: shapeSettings.strokeWidth || 2
                },
                shapeSize,
                measureSettings,
                dataView
            );

            // Draw the label
            this.labelDrawer.drawLabel(
                x,
                y,
                measureTitle,
                shapeSettings.labelPosition,
                shapeSettings.font,
                shapeSettings.fontSize,
                measureSettings.labelFontColor || '#000000',
                shapeSize,
                measureSettings.shapeType, // Pass the correct shape type
                measureSettings,
                dataView
            );
        });
    }
}

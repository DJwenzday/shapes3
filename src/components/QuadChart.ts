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
    private data: any[];

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

    public draw(data: any[]): void {
        this.data = data;

        this.container.selectAll('circle')
            .data(data)
            .join('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 20) // Example radius
            .style('fill', d => d.color)
            .on('contextmenu', (event, d) => {
                event.preventDefault();
                if (d.selectionId) {
                    this.selectionManager.showContextMenu(d.selectionId, {
                        x: event.clientX,
                        y: event.clientY
                    });
                    console.log('Context menu triggered for:', d.selectionId);
                }
            });
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
        
        categoryColumn.values.forEach((category, index) => {
            const selectionId = this.host.createSelectionIdBuilder()
                .withCategory(categoryColumn, index)
                .createSelectionId();
        
            const measureValue = measures[0]?.values[index]; // Adjust this based on measure index logic
            const measureTitle = category ? category.toString() : 'N/A'; // Display name for label with fallback
        
            const x = (index % 2) * width / 2 + width / 4;
            const y = Math.floor(index / 2) * height / 2 + height / 4;
        
            const measureSettings = {
                ...measureSettingsArray[index % measureSettingsArray.length],
                measureValue: measureValue,
                objectName: `measure${(index % 4) + 1}Settings`,
                shapeType: shapeSettings.shapeType // Ensure shapeType is correctly passed
            };
        
            console.log(`Drawing shape for category "${measureTitle}" at index ${index}:`, measureSettings.shapeType);
        
            // Draw shape and bind events
            const shapeElement = this.shapeDrawer.drawShape(
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
        
            shapeElement.on('contextmenu', (event: MouseEvent) => {
                event.preventDefault();
                this.selectionManager.showContextMenu(selectionId, { x: event.clientX, y: event.clientY });
                console.log("Context menu triggered for category:", measureTitle);
            });
    
            shapeElement.on('mouseover', (event: MouseEvent) => {
                const tooltipText = measureValue !== null && measureValue !== undefined ? String(measureValue) : 'N/A';
                this.tooltipService.showTooltip(tooltipText, event);
            }).on('mouseout', () => {
                this.tooltipService.hideTooltip();
            });
    
            // Draw label and bind events
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
                    console.log("Context menu triggered for category:", measureTitle, "from label");
                });
    
                labelElement.on('mouseover', (event: MouseEvent) => {
                    const tooltipText = measureValue !== null && measureValue !== undefined ? String(measureValue) : 'N/A';
                    this.tooltipService.showTooltip(tooltipText, event);
                }).on('mouseout', () => {
                    this.tooltipService.hideTooltip();
                });
            }
        });
    }
    
}

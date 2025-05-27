// QuadChart.ts

import { VisualSettings } from "../settings";
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
import { createTooltipServiceWrapper, ITooltipServiceWrapper, TooltipEventArgs } from "powerbi-visuals-utils-tooltiputils";

export class QuadChart {
    private tooltipServiceWrapper: ITooltipServiceWrapper;
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
        this.tooltipServiceWrapper = createTooltipServiceWrapper(this.host.tooltipService, container.node());
    }

    public drawChart(
        width: number,
        height: number,
        separatorSettings: any,
        shapeSettings: any,
        dataView: DataView,
        settings: VisualSettings
    ): void {
        this.container.selectAll('*').remove();

        if (separatorSettings.show) {
            this.separators.updateSeparators(width, height, separatorSettings);
        }

        const shapeSize = Math.min(width, height) * 0.3;

        if (dataView.categorical && dataView.categorical.categories?.length > 0) {
            const categoryColumn = dataView.categorical.categories[0];
            const measures = dataView.categorical.values;
            const tooltipColumns = dataView.categorical.values
    .filter(col => col.source.roles?.tooltips) as powerbi.DataViewValueColumns;
            this.drawShapesAndLabels(width, height, shapeSettings, categoryColumn, measures, tooltipColumns, shapeSize, settings, dataView);
        }
    }

    private drawShapesAndLabels(
        width: number,
        height: number,
        shapeSettings: any,
        categoryColumn: DataViewCategoryColumn,
        measures: DataViewValueColumns,
        tooltipColumns: DataViewValueColumns,
        shapeSize: number,
        settings: VisualSettings,
        dataView: DataView
    ): void {
        const measureSettingsArray = [
            settings.measure1Settings,
            settings.measure2Settings,
            settings.measure3Settings,
            settings.measure4Settings
        ];

        for (let i = 0; i < 4; i++) {
            const measureColumn = measures[i % measures.length];
            const measureValue = measureColumn?.values[0] ?? 0;
            const measureTitle = measureColumn?.source.displayName || 'N/A';

            let selectionId: ISelectionId = null;
            if (categoryColumn?.values?.length > i) {
                selectionId = this.host.createSelectionIdBuilder()
                    .withCategory(categoryColumn, i)
                    .createSelectionId();
            }

            const x = (i % 2) * width / 2 + width / 4;
            const y = Math.floor(i / 2) * height / 2 + height / 4;

            const measureSettings = {
                ...measureSettingsArray[i % measureSettingsArray.length],
                measureValue,
                objectName: `measure${(i % 4) + 1}Settings`,
                shapeType: shapeSettings.shapeType
            };

            const shapeElement = this.shapeDrawer.drawShape(
                x,
                y,
                {
                    type: measureSettings.shapeType || 'circle',
                    defaultColor: measureSettings.shapeFillColor || '#cccccc',
                    defaultStroke: measureSettings.shapeStrokeColor || '#000000',
                    width: shapeSettings.shapeStrokeWidth || 2
                },
                shapeSize,
                measureSettings,
                dataView,
                String(measureValue)
            );

            const tooltipDataItems = [
                {
                    displayName: measureTitle,
                    value: String(measureValue)
                },
                ...tooltipColumns.map(col => ({
                    displayName: col.source.displayName,
                    value: String(col.values[i])
                }))
            ];

            this.tooltipServiceWrapper.addTooltip(
                shapeElement,
                () => tooltipDataItems,
                () => selectionId
            );

            shapeElement.on('contextmenu', (event: MouseEvent) => {
                event.preventDefault();
                if (selectionId) {
                    this.selectionManager.showContextMenu(selectionId, {
                        x: event.clientX,
                        y: event.clientY
                    });
                }
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
                );

                if (labelElement) {
                    labelElement.on('contextmenu', (event: MouseEvent) => {
                        event.preventDefault();
                        event.stopPropagation();
                        if (selectionId) {
                            this.selectionManager.showContextMenu(selectionId, {
                                x: event.clientX,
                                y: event.clientY
                            });
                        }
                    });
                }
            }
        }
    }
}

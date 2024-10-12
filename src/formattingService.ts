//formattingService.ts
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import { VisualSettings } from './settings';

export class FormattingService {
    public getFormattingModel(settings: VisualSettings): powerbi.visuals.FormattingModel {
        return {
            cards: [
                this.createShapeFormattingCard(settings),
                this.createMeasureFormattingCard("Measure 1", settings.measure1Settings, "measure1Settings"),
                this.createMeasureFormattingCard("Measure 2", settings.measure2Settings, "measure2Settings"),
                this.createMeasureFormattingCard("Measure 3", settings.measure3Settings, "measure3Settings"),
                this.createMeasureFormattingCard("Measure 4", settings.measure4Settings, "measure4Settings"),
                this.createSeparatorFormattingCard(settings)
            ]
        };
    }    

    private createShapeFormattingCard(settings: VisualSettings): powerbi.visuals.FormattingCard {
        return {
            uid: "shapeSettingsCard_uid",
            displayName: "Shape Settings",
            groups: [
                {
                    uid: "generalSettingsGroup_uid",
                    displayName: "General Settings",
                    slices: [
                        this.createDropdownSlice("Shape Type", "shapeSettings", "shapeType", settings.shapeSettings.shapeType),
                        this.createDropdownSlice("Label Position", "shapeSettings", "labelPosition", settings.shapeSettings.labelPosition),
                        this.createFontControlSlice(settings)
                    ]
                }
            ]
        };
    }

    private createMeasureFormattingCard(displayName: string, measureSettings: any, objectName: string): powerbi.visuals.FormattingCard {
        return {
            uid: `${displayName.toLowerCase().replace(/\s+/g, '')}Card_uid`,
            displayName: displayName,
            groups: [
                {
                    uid: `${displayName.toLowerCase().replace(/\s+/g, '')}Group_uid`,
                    displayName: `${displayName} Colors`,
                    slices: [
                        this.createColorPickerSlice(objectName, "shapeFillColor", "Shape Fill", measureSettings.shapeFillColor),
                        this.createColorPickerSlice(objectName, "shapeStrokeColor", "Shape Stroke", measureSettings.shapeStrokeColor),
                        this.createColorPickerSlice(objectName, "labelFontColor", "Font Color", measureSettings.labelFontColor)
                    ]
                }
            ]
        };
    }
        

    private createSeparatorFormattingCard(settings: VisualSettings): powerbi.visuals.FormattingCard {
        return {
            uid: "separatorSettingsCard_uid",
            displayName: "Separator Settings",
            groups: [
                {
                    uid: "separatorGroup_uid",
                    displayName: undefined,
                    slices: [
                        this.createColorPickerSlice("separatorSettings", "color", "Separator Color", settings.separatorSettings.color),
                        this.createNumberInputSlice("separatorSettings", "width", "Separator Width", settings.separatorSettings.width)
                    ]
                }
            ]
        };
    }

    private createDropdownSlice(displayName: string, objectName: string, propertyName: string, value: any): powerbi.visuals.FormattingSlice {
        return {
            uid: `${propertyName}_uid`,
            displayName: displayName,
            control: {
                type: powerbi.visuals.FormattingComponent.Dropdown,
                properties: {
                    descriptor: {
                        objectName: objectName,
                        propertyName: propertyName
                    },
                    value: value
                }
            }
        };
    }

    private createFontControlSlice(settings: VisualSettings): powerbi.visuals.FormattingSlice {
        return {
            uid: "fontControlSlice_uid",
            displayName: "Font",
            control: {
                type: powerbi.visuals.FormattingComponent.FontControl,
                properties: {
                    fontFamily: {
                        descriptor: {
                            objectName: "shapeSettings",
                            propertyName: "font"
                        },
                        value: settings.shapeSettings.font
                    },
                    fontSize: {
                        descriptor: {
                            objectName: "shapeSettings",
                            propertyName: "fontSize"
                        },
                        value: settings.shapeSettings.fontSize
                    }
                }
            }
        };
    }

    private createColorPickerSlice(objectName: string, propertyName: string, displayName: string, colorValue: string): powerbi.visuals.FormattingSlice {
        return {
            uid: `${propertyName}_uid`,
            displayName: displayName,
            control: {
                type: powerbi.visuals.FormattingComponent.ColorPicker,
                properties: {
                    descriptor: {
                        objectName: objectName,
                        propertyName: propertyName,
                        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule
                    },
                    value: { value: colorValue }
                }
            }
        };
    }

    private createNumberInputSlice(objectName: string, propertyName: string, displayName: string, value: number): powerbi.visuals.FormattingSlice {
        return {
            uid: `${propertyName}_uid`,
            displayName: displayName,
            control: {
                type: powerbi.visuals.FormattingComponent.NumUpDown,
                properties: {
                    descriptor: {
                        objectName: objectName,
                        propertyName: propertyName
                    },
                    value: value
                }
            }
        };
    }
}
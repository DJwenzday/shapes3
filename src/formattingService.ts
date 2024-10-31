//formattingService.ts
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import { VisualSettings } from './settings';

export class FormattingService { //three sections of Custom Format Pane
    public getFormattingModel(settings: VisualSettings): powerbi.visuals.FormattingModel {
        console.log("Constructing formatting model");

        const cards: powerbi.visuals.FormattingCard[] = [
            this.createShapeFormattingCard(settings),  //Shape Settings
            this.createSeparatorFormattingCard(settings),  //Separator Settings
            this.createTooltipsFormattingCard(settings)  //Tooltips Settings
        ];

        settings.cards = cards; // Add cards to VisualSettings
        return { cards };       // Return formatting model with cards array
    }   

    private createShapeFormattingCard(settings: VisualSettings): powerbi.visuals.FormattingCard {
        return {
            uid: "shapeSettingsCard_uid",
            displayName: "Shape Settings",
            groups: [
                this.createGeneralSettingsGroup(settings),
                this.createMeasureFormattingGroup("Measure 1 ", settings.measure1Settings, "measure1Settings"),
                this.createMeasureFormattingGroup("Measure 2 ", settings.measure2Settings, "measure2Settings"),
                this.createMeasureFormattingGroup("Measure 3 ", settings.measure3Settings, "measure3Settings"),
                this.createMeasureFormattingGroup("Measure 4 ", settings.measure4Settings, "measure4Settings")
            ]
        };
    }

    private createGeneralSettingsGroup(settings: VisualSettings): powerbi.visuals.FormattingGroup {
        return {
                uid: "generalSettingsGroup_uid",
                displayName: "General Settings",
                slices: [
                    this.createDropdownSlice("Shape Type", "shapeSettings", "shapeType", settings.shapeSettings.shapeType), //Shape options
                    this.createNumberInputSlice("Shape Stroke", "shapeSettings", "shapeStroke", settings.shapeSettings.shapeStroke), // Stroke size
                    this.createDropdownSlice("Label Position", "shapeSettings", "labelPosition", settings.shapeSettings.labelPosition), //label above or centered on shape
                    this.createFontControlSlice(settings), //font family and font size
                    this.createToggleSlice("Show Labels", "shapeSettings", "show", settings.shapeSettings.show) // Toggle for labels
                ]
        };
    }    

    private createMeasureFormattingGroup(displayName: string, measureSettings: any, objectName: string):powerbi.visuals.FormattingGroup {
        return {
                uid: `${displayName.toLowerCase().replace(/\s+/g, '')}Group_uid`,
                displayName: `${displayName} Colors`,
                slices: [
                    this.createColorPickerSlice(objectName, "shapeFillColor", "Shape Fill", measureSettings.shapeFillColor),  //Conditional or Manual Shape Fill Color
                    this.createColorPickerSlice(objectName, "shapeStrokeColor", "Shape Stroke", measureSettings.shapeStrokeColor), //Conditional or Manual Shape Stroke Color
                    this.createColorPickerSlice(objectName, "labelFontColor", "Font Color", measureSettings.labelFontColor)  //Conditional or Manual Font Color
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
                        this.createColorPickerSlice("separatorSettings", "color", "Separator Color", settings.separatorSettings.color), //Conditional or Manual Separator Color
                        this.createNumberInputSlice("Separator Width", "separatorSettings", "width", settings.separatorSettings.width), //Manual Separator Size
                        this.createToggleSlice("Show Separator", "separatorSettings", "show", settings.separatorSettings.show) //Turn On or Off the Separator
                    ]
                }
            ]
        };
    }

    private createTooltipsFormattingCard(settings: VisualSettings): powerbi.visuals.FormattingCard {
        return {
            uid: "tooltipsSettingsCard_uid",
            displayName: "Tooltips Settings",
            groups: [
                {
                    uid: "tooltipGroup_uid",
                    displayName: undefined,
                    slices: [
                        
                        this.createToggleSlice("Tooltips", "tooltipSettings", "show", settings.tooltipSettings.show) //Turn On or Off thr Tooltips
                    ]
                }
            ]
        };
    }

    
    // Helper methods for creating slices
    private createToggleSlice(displayName: string, objectName: string, propertyName: string, value: boolean): powerbi.visuals.FormattingSlice {
        return {
            uid: `${propertyName}_uid`,
            displayName: displayName,
            control: {
                type: powerbi.visuals.FormattingComponent.ToggleSwitch,
                properties: {
                    descriptor: {
                        objectName: objectName,
                        propertyName: propertyName
                    },
                    value: value
                }
            }
        }
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

    private createNumberInputSlice(displayName: string, objectName: string, propertyName: string, value: number): powerbi.visuals.FormattingSlice {
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
}
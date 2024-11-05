//formattingService.ts

// Import the VisualSettings class for accessing visual configuration settings
import { VisualSettings } from './settings';

// The FormattingService class handles creating the formatting model for the custom format pane
export class FormattingService {
    // Method to create and return the formatting model for the visual
    public getFormattingModel(settings: VisualSettings): powerbi.visuals.FormattingModel {
        console.log("Constructing formatting model"); // Debug log for monitoring

        // Define formatting cards to organize different sections of the format pane
        const cards: powerbi.visuals.FormattingCard[] = [
            this.createShapeFormattingCard(settings),  // Card for shape settings
            this.createSeparatorFormattingCard(settings),  // Card for separator settings
            this.createTooltipsFormattingCard(settings)  // Card for tooltip settings
        ];

        // Save the cards to the settings object for further reference
        settings.cards = cards;
        return { cards }; // Return the formatting model as an object with the cards array
    }

    // Method to create the Shape Settings card
    private createShapeFormattingCard(settings: VisualSettings): powerbi.visuals.FormattingCard {
        return {
            uid: "shapeSettingsCard_uid", // Unique identifier for this card
            displayName: "Shape Settings", // Display name for the card in the format pane
            groups: [ // Grouping allows related settings to be organized together
                this.createGeneralSettingsGroup(settings), // General shape settings group
                this.createMeasureFormattingGroup("Measure 1 ", settings.measure1Settings, "measure1Settings"),
                this.createMeasureFormattingGroup("Measure 2 ", settings.measure2Settings, "measure2Settings"),
                this.createMeasureFormattingGroup("Measure 3 ", settings.measure3Settings, "measure3Settings"),
                this.createMeasureFormattingGroup("Measure 4 ", settings.measure4Settings, "measure4Settings")
            ]
        };
    }

    // Method to create the General Settings group for the Shape card
    private createGeneralSettingsGroup(settings: VisualSettings): powerbi.visuals.FormattingGroup {
        return {
            uid: "generalSettingsGroup_uid", // Unique ID for this group
            displayName: "General Settings", // Display name in the format pane
            slices: [ // Slices represent individual settings within a group
                this.createDropdownSlice("Shape Type", "shapeSettings", "shapeType", settings.shapeSettings.shapeType), // Dropdown for selecting shape type
                this.createNumberInputSlice("Shape Stroke", "shapeSettings", "shapeStrokeWidth", settings.shapeSettings.shapeStrokeWidth), // Number input for stroke width
                this.createDropdownSlice("Label Position", "shapeSettings", "labelPosition", settings.shapeSettings.labelPosition), // Dropdown for label position
                this.createFontControlSlice(settings), // Font control slice for label font settings
                this.createToggleSlice("Show Labels", "shapeSettings", "show", settings.shapeSettings.show) // Toggle for showing/hiding labels
            ]
        };
    }

    // Method to create a Measure Formatting group for a given measure
    private createMeasureFormattingGroup(displayName: string, measureSettings: any, objectName: string): powerbi.visuals.FormattingGroup {
        return {
            uid: `${displayName.toLowerCase().replace(/\s+/g, '')}Group_uid`, // Unique ID generated from the display name
            displayName: `${displayName} Colors`, // Display name for the group
            slices: [ // Individual settings for the measure
                this.createColorPickerSlice(objectName, "shapeFillColor", "Shape Fill", measureSettings.shapeFillColor), // Color picker for shape fill
                this.createColorPickerSlice(objectName, "shapeStrokeColor", "Shape Stroke", measureSettings.shapeStrokeColor), // Color picker for shape stroke
                this.createColorPickerSlice(objectName, "labelFontColor", "Font Color", measureSettings.labelFontColor), // Color picker for label font
                // Optional: Add slices for conditional rules or other advanced settings
            ]
        };
    }

    // Method to create the Separator Settings card
    private createSeparatorFormattingCard(settings: VisualSettings): powerbi.visuals.FormattingCard {
        return {
            uid: "separatorSettingsCard_uid", // Unique ID for the separator card
            displayName: "Separator Settings", // Display name for the card
            groups: [
                {
                    uid: "separatorGroup_uid", // Unique ID for the group within the card
                    displayName: undefined, // No display name for simplicity
                    slices: [
                        this.createColorPickerSlice("separatorSettings", "color", "Separator Color", settings.separatorSettings.color), // Color picker for separator color
                        this.createNumberInputSlice("Separator Width", "separatorSettings", "width", settings.separatorSettings.width), // Number input for separator width
                        this.createToggleSlice("Show Separator", "separatorSettings", "show", settings.separatorSettings.show) // Toggle for showing/hiding separator
                    ]
                }
            ]
        };
    }

    // Method to create the Tooltips Settings card
    private createTooltipsFormattingCard(settings: VisualSettings): powerbi.visuals.FormattingCard {
        return {
            uid: "tooltipsSettingsCard_uid", // Unique ID for the tooltips card
            displayName: "Tooltips Settings", // Display name for the card
            groups: [
                {
                    uid: "tooltipGroup_uid", // Unique ID for the group
                    displayName: undefined, // No display name needed
                    slices: [
                        this.createToggleSlice("Tooltips", "tooltipSettings", "show", settings.tooltipSettings.show) // Toggle for enabling/disabling tooltips
                    ]
                }
            ]
        };
    }

    // Helper method to create a toggle switch slice
    private createToggleSlice(displayName: string, objectName: string, propertyName: string, value: boolean): powerbi.visuals.FormattingSlice {
        return {
            uid: `${propertyName}_uid`, // Unique ID for the slice
            displayName: displayName, // Label for the setting in the format pane
            control: {
                type: powerbi.visuals.FormattingComponent.ToggleSwitch, // Control type
                properties: {
                    descriptor: {
                        objectName: objectName, // Object name to map the setting to
                        propertyName: propertyName // Property name for the setting
                    },
                    value: value // Default value
                }
            }
        }
    }

    // Helper method to create a dropdown slice
    private createDropdownSlice(displayName: string, objectName: string, propertyName: string, value: any): powerbi.visuals.FormattingSlice {
        return {
            uid: `${propertyName}_uid`, // Unique ID for the slice
            displayName: displayName, // Label for the setting in the format pane
            control: {
                type: powerbi.visuals.FormattingComponent.Dropdown, // Control type
                properties: {
                    descriptor: {
                        objectName: objectName, // Object name for mapping
                        propertyName: propertyName // Property name for the setting
                    },
                    value: value // Default value
                }
            }
        };
    }

    // Helper method to create a number input slice
    private createNumberInputSlice(displayName: string, objectName: string, propertyName: string, value: number): powerbi.visuals.FormattingSlice {
        return {
            uid: `${propertyName}_uid`, // Unique ID for the slice
            displayName: displayName, // Label for the setting
            control: {
                type: powerbi.visuals.FormattingComponent.NumUpDown, // Control type for numeric input
                properties: {
                    descriptor: {
                        objectName: objectName, // Object name for mapping
                        propertyName: propertyName // Property name for the setting
                    },
                    value: value // Default value
                }
            }
        };
    }

    // Helper method to create a font control slice
    private createFontControlSlice(settings: VisualSettings): powerbi.visuals.FormattingSlice {
        return {
            uid: "fontControlSlice_uid", // Unique ID for the slice
            displayName: "Font", // Display name for the setting
            control: {
                type: powerbi.visuals.FormattingComponent.FontControl, // Control type for font settings
                properties: {
                    fontFamily: {
                        descriptor: {
                            objectName: "shapeSettings", // Object name for mapping
                            propertyName: "font" // Property name for font family
                        },
                        value: settings.shapeSettings.font // Default value for font family
                    },
                    fontSize: {
                        descriptor: {
                            objectName: "shapeSettings", // Object name for mapping
                            propertyName: "fontSize" // Property name for font size
                        },
                        value: settings.shapeSettings.fontSize // Default value for font size
                    }
                }
            }
        };
    }

    // Helper method to create a color picker slice
    private createColorPickerSlice(objectName: string, propertyName: string, displayName: string, defaultColor: string): powerbi.visuals.FormattingSlice {
        return {
            uid: `${propertyName}_uid`, // Unique ID for the slice
            displayName: displayName, // Display name for the setting
            control: {
                type: powerbi.visuals.FormattingComponent.ColorPicker, // Control type for color picking
                properties: {
                    descriptor: {
                        objectName: objectName, // Object name for mapping
                        propertyName: propertyName, // Property name for color property
                        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule // Instance kind for property
                    },
                    value: { value: defaultColor } // Default color value
                }
            }
        };
    }
}

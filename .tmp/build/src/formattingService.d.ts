import { VisualSettings } from './settings';
export declare class FormattingService {
    getFormattingModel(settings: VisualSettings): powerbi.visuals.FormattingModel;
    private createShapeFormattingCard;
    private createGeneralSettingsGroup;
    private createMeasureFormattingGroup;
    private createSeparatorFormattingCard;
    private createTooltipsFormattingCard;
    private createToggleSlice;
    private createDropdownSlice;
    private createNumberInputSlice;
    private createFontControlSlice;
    private createColorPickerSlice;
}

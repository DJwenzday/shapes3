import { VisualSettings } from './settings';
export declare class FormattingService {
    getFormattingModel(settings: VisualSettings): powerbi.visuals.FormattingModel;
    private createShapeFormattingCard;
    private createMeasureFormattingCard;
    private createSeparatorFormattingCard;
    private createToggleSlice;
    private createDropdownSlice;
    private createNumberInputSlice;
    private createFontControlSlice;
    private createColorPickerSlice;
}

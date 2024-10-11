import { VisualSettings } from './settings';
export declare class FormattingService {
    getFormattingModel(settings: VisualSettings): powerbi.visuals.FormattingModel;
    private createShapeFormattingCard;
    private createMeasureFormattingCard;
    private createSeparatorFormattingCard;
    private createDropdownSlice;
    private createFontControlSlice;
    private createColorPickerSlice;
    private createNumberInputSlice;
}

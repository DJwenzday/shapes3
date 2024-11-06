import * as d3 from 'd3';
export declare class Separators {
    private container;
    constructor(container: d3.Selection<SVGElement, unknown, HTMLElement, any>);
    /**
     * Method to draw a vertical line in the container.
     * @param xPosition - The x-coordinate where the vertical line should be drawn.
     * @param height - The height of the line.
     * @param settings - An object containing style settings for the line (e.g., color, width).
     */
    drawVerticalLine(xPosition: number, height: number, settings: any): void;
    /**
     * Method to draw a horizontal line in the container.
     * @param yPosition - The y-coordinate where the horizontal line should be drawn.
     * @param width - The length of the line (width).
     * @param settings - An object containing style settings for the line (e.g., color, width).
     * @param offset - An optional offset to adjust the y-position of the line.
     */
    drawHorizontalLine(yPosition: number, width: number, settings: any, offset?: number): void;
    updateSeparators(width: number, height: number, settings: any): void;
}

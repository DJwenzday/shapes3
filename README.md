# Shapes3 Power BI Custom Visual

## Overview

The Shapes3 Power BI Custom Visual is a highly customizable visual representation tool designed to visualize data using geometric shapes within a quad chart format. The visual provides functionality to adjust shapes, colors, and labels based on user-selected measures, with support for conditional formatting.

## Requirements

### Features
1. **Quad Chart Visualization:**
   - Displays four quadrants with customizable shapes representing different data measures.
   - Supports circle, square, and triangle shapes for visualization.

2. **Shape Settings:**
   - **Shape Type:** Allows selection of shape type (Circle, Square, or Triangle) for all quadrants.
   - **Label Position:** Customizable label position (Centered or Above) relative to the shape.
   - **Font Customization:** Users can set the font type, font size, and font color for shape labels.
   - **Conditional Formatting:** Ability to apply rule-based (conditional) formatting to shape colors, label colors, and borders.

3. **Separator Settings:**
   - **Color:** Customizable separator line color that divides the quadrants.
   - **Width:** Ability to set the width of the separator line.

### Data Binding
1. **Data Roles:** 
   - Supports four separate data roles, each representing a measure:
     - Shape1 Measure
     - Shape2 Measure
     - Shape3 Measure
     - Shape4 Measure

2. **Data Mapping:**
   - Each measure is associated with its specific shape and label.
   - Shape labels dynamically update to show the measure display name.

### Conditional Formatting
- **Shape Fill and Stroke Colors:**
  - Supports conditional formatting (fx button) to change the fill and stroke colors of each shape based on rules.
- **Label Font Color:**
  - Each label has a customizable font color with conditional formatting options.

### Formatting Pane
- **Custom Control Sections:**
  - **Separator Settings**
    - Color
    - Width
  - **Shape Settings**
    - Shape Type
    - Label Position
    - Font Family
    - Font Size
  - **Measure-Specific Settings (For each measure)**
    - Shape Fill (Color) with conditional formatting
    - Shape Stroke (Color) with conditional formatting
    - Label Font Color with conditional formatting

## File Structure

The project follows a modular file structure to maintain clean and organized code. Below is the outline of the directory and file structure used:

```plaintext
/.
├── .vscode/
│   ├── launch.json
│   ├── settings.json
├── assets/
│   ├── icon.png
│   ├── styles.css
├── src/
│   ├── components/
│   │   ├── QuadChart.ts
│   │   ├── Separators.ts
│   │   ├── Shape.ts
│   │   ├── Label.ts
│   ├── data/
│   │   ├── dataModel.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── utilityFunctions.ts
│   ├── services/
│   │   ├── colorService.ts
│   │   ├── tooltipService.ts
│   │   ├── drilldownService.ts
│   ├── formattingService.ts
│   ├── settings.ts
│   ├── visual.ts
├── style/
│   ├── visual.less
├── capabilities.json
├── eslint.config.mjs
├── package.json
├── pbiviz.json
├── tsconfig.json
├── index.ts


Make sure to install the following dependencies for the project:
npm install powerbi-visuals-tools -g
npm install powerbi-visuals-utils-formattingmodel
npm install powerbi-visuals-utils-dataviewutils

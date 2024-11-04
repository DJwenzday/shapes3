# Shapes3 Power BI Custom Visual

## Overview
Shapes3 is a custom Power BI visual designed to display shapes (circles, squares, triangles) in a quadrant layout with customizable settings. It supports dynamic data-driven shapes, conditional formatting, tooltips, and interactive context menus.

## Features
- **Shapes**: Choose between circle, square, and triangle.
- **Labels**: Customizable label position (centered or above the shape).
- **Conditional Formatting**: Apply rules for shape fill color, stroke color, and label font color.
- **Interaction**: Supports tooltips and a single context menu for the entire visual.
- **Drill-through**: Integration for Power BI's context menu to trigger drill-through functionality.
- **Customization**: Options for customizing shape size, color, and stroke width.
- **Debugging**: Console logs for detailed debugging and transparency during development.

## Installation
1. Download the `shapes3.pbiviz` file.
2. Open Power BI Desktop.
3. Navigate to **File > Import > Import from file** and select the `shapes3.pbiviz` file.

## Usage
1. Add the Shapes3 visual to your Power BI report.
2. Drag and drop data into the measure fields.
3. Customize the visual using the format pane settings.
4. Set up conditional formatting rules for enhanced data visualization.

## Known Issues
- Conditional formatting for shapes only works if font conditional formatting is set. Without it, other rule-based conditions may not apply.
- Dynamic Tooltips

## Future Enhancements
- Optimize conditional formatting handling for independent rule-based settings.
- Improve label positioning for various display options.

## Troubleshooting
- If conditional formatting does not work as expected, ensure that font color conditional formatting is set.
- For detailed debugging, refer to the console logs in your browser or development tool.

## Contributions
Contributions are welcome! Please submit a pull request or report issues via GitHub.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

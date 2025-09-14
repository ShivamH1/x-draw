import { Shape } from "../types";
import { drawArrow, drawDiamond } from "../utils/drawingUtils";
import { shapesEqual } from "../utils/shapeUtils";

/**
 * ShapeRenderer class handles the rendering of shapes on the canvas.
 * It provides methods to draw both finalized shapes and preview shapes during drawing.
 * 
 * Usage:
 * - Create an instance with a canvas context
 * - Call drawShapes() to render all existing shapes
 * - Call drawPreviewShape() to show a preview while drawing
 */
export class ShapeRenderer {
  private ctx: CanvasRenderingContext2D;

  /**
   * Constructor initializes the renderer with a canvas context
   * @param ctx - The 2D rendering context of the canvas
   */
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  /**
   * Draws all shapes on the canvas with optional highlighting for selected shape
   * @param shapes - Array of shapes to render
   * @param highlighted - Optional shape to highlight (used for selection)
   */
  drawShapes(shapes: Shape[], highlighted?: Shape | null) {
    shapes.forEach((shape) => {
      // Check if current shape should be highlighted (selected)
      const isHighlighted = highlighted && shapesEqual(shape, highlighted);
      
      // Set visual style based on whether shape is highlighted
      // Highlighted shapes are yellow, normal shapes are white
      this.ctx.strokeStyle = isHighlighted ? "rgba(255, 255, 0)" : "rgba(255, 255, 255)";
      this.ctx.fillStyle = isHighlighted ? "rgba(255, 255, 0)" : "rgba(255, 255, 255)";
      this.ctx.lineWidth = isHighlighted ? 3 : 2; // Thicker line for highlighted shapes

      // Render shape based on its type
      switch (shape.type) {
        case "rect":
          // Draw rectangle using x, y, width, height
          this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
          break;
        case "circle":
          // Draw circle using center point and radius
          this.ctx.beginPath();
          this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
          this.ctx.stroke();
          break;
        case "line":
          // Draw straight line from start to end point
          this.ctx.beginPath();
          this.ctx.moveTo(shape.startX, shape.startY);
          this.ctx.lineTo(shape.endX, shape.endY);
          this.ctx.stroke();
          break;
        case "arrow":
          // Draw arrow using utility function (includes arrowhead)
          drawArrow(this.ctx, shape.startX, shape.startY, shape.endX, shape.endY);
          break;
        case "diamond":
          // Draw diamond using utility function
          drawDiamond(this.ctx, shape.x, shape.y, shape.width, shape.height);
          break;
        case "text":
          // Draw text with specified font and color
          this.ctx.font = shape.font;
          this.ctx.fillStyle = isHighlighted ? "rgba(255, 255, 0)" : shape.color;
          this.ctx.fillText(shape.text, shape.x, shape.y);
          break;
      }
    });
  }

  /**
   * Draws a preview of the shape being drawn (shown while dragging)
   * Uses dashed lines and semi-transparent style to indicate it's a preview
   * @param startX - X coordinate where drawing started
   * @param startY - Y coordinate where drawing started
   * @param currentX - Current X coordinate of mouse/cursor
   * @param currentY - Current Y coordinate of mouse/cursor
   * @param toolType - Type of shape being drawn
   */
  drawPreviewShape(
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
    toolType: string
  ) {
    // Set preview style: semi-transparent white with dashed lines
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    this.ctx.setLineDash([5, 5]); // Create dashed line pattern

    // Calculate dimensions based on start and current positions
    const width = currentX - startX;
    const height = currentY - startY;

    // Draw preview shape based on tool type
    switch (toolType) {
      case "rect":
        // Preview rectangle from start point to current cursor position
        this.ctx.strokeRect(startX, startY, width, height);
        break;
      case "circle":
        // Preview circle with radius calculated from start to current position
        const radius = Math.sqrt(width ** 2 + height ** 2);
        this.ctx.beginPath();
        this.ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        break;
      case "line":
        // Preview line from start to current position
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(currentX, currentY);
        this.ctx.stroke();
        break;
      case "arrow":
        // Preview arrow from start to current position
        drawArrow(this.ctx, startX, startY, currentX, currentY);
        break;
      case "diamond":
        // Preview diamond with calculated width and height
        drawDiamond(this.ctx, startX, startY, width, height);
        break;
    }

    // Reset line dash to solid lines for subsequent drawing
    this.ctx.setLineDash([]);
  }
}

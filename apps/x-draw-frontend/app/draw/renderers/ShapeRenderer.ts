import { Shape } from "../types";
import { drawArrow, drawDiamond } from "../utils/drawingUtils";
import { shapesEqual } from "../utils/shapeUtils";

export class ShapeRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  drawShapes(shapes: Shape[], highlighted?: Shape | null) {
    shapes.forEach((shape) => {
      const isHighlighted = highlighted && shapesEqual(shape, highlighted);
      
      // Set style based on whether shape is highlighted
      this.ctx.strokeStyle = isHighlighted ? "rgba(255, 255, 0)" : "rgba(255, 255, 255)";
      this.ctx.fillStyle = isHighlighted ? "rgba(255, 255, 0)" : "rgba(255, 255, 255)";
      this.ctx.lineWidth = isHighlighted ? 3 : 2;

      switch (shape.type) {
        case "rect":
          this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
          break;
        case "circle":
          this.ctx.beginPath();
          this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
          this.ctx.stroke();
          break;
        case "line":
          this.ctx.beginPath();
          this.ctx.moveTo(shape.startX, shape.startY);
          this.ctx.lineTo(shape.endX, shape.endY);
          this.ctx.stroke();
          break;
        case "arrow":
          drawArrow(this.ctx, shape.startX, shape.startY, shape.endX, shape.endY);
          break;
        case "diamond":
          drawDiamond(this.ctx, shape.x, shape.y, shape.width, shape.height);
          break;
        case "text":
          this.ctx.font = shape.font;
          this.ctx.fillStyle = isHighlighted ? "rgba(255, 255, 0)" : shape.color;
          this.ctx.fillText(shape.text, shape.x, shape.y);
          break;
      }
    });
  }

  drawPreviewShape(
    startX: number,
    startY: number,
    currentX: number,
    currentY: number,
    toolType: string
  ) {
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    this.ctx.setLineDash([5, 5]);

    const width = currentX - startX;
    const height = currentY - startY;

    switch (toolType) {
      case "rect":
        this.ctx.strokeRect(startX, startY, width, height);
        break;
      case "circle":
        const radius = Math.sqrt(width ** 2 + height ** 2);
        this.ctx.beginPath();
        this.ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        break;
      case "line":
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(currentX, currentY);
        this.ctx.stroke();
        break;
      case "arrow":
        drawArrow(this.ctx, startX, startY, currentX, currentY);
        break;
      case "diamond":
        drawDiamond(this.ctx, startX, startY, width, height);
        break;
    }

    this.ctx.setLineDash([]);
  }
}

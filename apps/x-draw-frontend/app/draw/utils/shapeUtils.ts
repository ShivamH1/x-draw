import { Shape } from "../types";

/**
 * Finds the topmost shape at a given position on the canvas
 * @param x - X coordinate to check
 * @param y - Y coordinate to check
 * @param shapes - Array of shapes to search through
 * @returns The topmost shape at the position, or null if no shape is found
 */
export function findShapeAtPosition(x: number, y: number, shapes: Shape[]): Shape | null {
  // Check shapes in reverse order (last drawn first - topmost)
  // This ensures we select the shape that appears on top when shapes overlap
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];
    if (isPointInShape(x, y, shape)) {
      return shape;
    }
  }
  return null;
}

/**
 * Determines if a point is inside or on the boundary of a shape
 * @param x - X coordinate of the point to test
 * @param y - Y coordinate of the point to test
 * @param shape - The shape to test against
 * @returns True if the point is inside or on the shape, false otherwise
 */
export function isPointInShape(x: number, y: number, shape: Shape): boolean {
  switch (shape.type) {
    case 'rect':
      // For rectangles, check if point is within the bounding box
      return x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height;
    case 'circle':
      // For circles, calculate distance from center and compare to radius
      const distance = Math.sqrt((x - shape.centerX) ** 2 + (y - shape.centerY) ** 2);
      return distance <= shape.radius;
    case 'line':
      // For lines, check if point is within 5 pixels of the line (tolerance for easier selection)
      return distanceFromPointToLine(x, y, shape.startX, shape.startY, shape.endX, shape.endY) <= 5;
    case 'arrow':
      // For arrows, treat the same as lines (check distance from the main arrow line)
      return distanceFromPointToLine(x, y, shape.startX, shape.startY, shape.endX, shape.endY) <= 5;
    case 'diamond':
      // Check if point is inside diamond using diamond boundary calculation
      // A diamond is defined by the equation: |x-centerX|/halfWidth + |y-centerY|/halfHeight <= 1
      const midX = shape.x + shape.width / 2;
      const midY = shape.y + shape.height / 2;
      const dx = Math.abs(x - midX);
      const dy = Math.abs(y - midY);
      return (dx / (shape.width / 2) + dy / (shape.height / 2)) <= 1;
    case 'text':
      // Simple bounding box for text - could be improved with actual text metrics
      // Approximate text dimensions based on character count and typical font size
      const textWidth = shape.text.length * 12; // Approximate width (12px per character)
      const textHeight = 24; // Approximate height (24px for typical font)
      // Text baseline is at shape.y, so check from y-height to y for vertical bounds
      return x >= shape.x && x <= shape.x + textWidth &&
        y >= shape.y - textHeight && y <= shape.y;
    default:
      // Unknown shape type - return false for safety
      return false;
  }
}

/**
 * Calculates the shortest distance from a point to a line segment
 * @param px - X coordinate of the point
 * @param py - Y coordinate of the point
 * @param x1 - X coordinate of line start point
 * @param y1 - Y coordinate of line start point
 * @param x2 - X coordinate of line end point
 * @param y2 - Y coordinate of line end point
 * @returns The shortest distance from the point to the line segment
 */
export function distanceFromPointToLine(
  px: number, 
  py: number, 
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number
): number {
  // Vector from line start to point
  const A = px - x1;
  const B = py - y1;
  // Vector representing the line direction
  const C = x2 - x1;
  const D = y2 - y1;

  // Calculate dot product and line length squared
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  // Parameter t represents position along the line (0 = start, 1 = end)
  let param = -1;
  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    // Point is closest to the start of the line segment
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    // Point is closest to the end of the line segment
    xx = x2;
    yy = y2;
  } else {
    // Point is closest to somewhere along the line segment
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  // Calculate final distance from point to closest point on line
  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Compares two shapes for equality
 * @param shape1 - First shape to compare
 * @param shape2 - Second shape to compare
 * @returns True if shapes are equal, false otherwise
 */
export function shapesEqual(shape1: Shape, shape2: Shape): boolean {
  // Different types are never equal
  if (shape1.type !== shape2.type) return false;

  // Use id if available (for shapes with id) - this is the most reliable comparison
  const shape1WithId = shape1 as Shape & { id?: string };
  const shape2WithId = shape2 as Shape & { id?: string };
  if (shape1WithId.id && shape2WithId.id) {
    return shape1WithId.id === shape2WithId.id;
  }

  // Fallback to property comparison when no IDs are available
  // Compare all relevant properties for each shape type
  if (shape1.type === "rect" && shape2.type === "rect") {
    return shape1.x === shape2.x && shape1.y === shape2.y &&
      shape1.width === shape2.width && shape1.height === shape2.height;
  } else if (shape1.type === "circle" && shape2.type === "circle") {
    return shape1.centerX === shape2.centerX && shape1.centerY === shape2.centerY &&
      shape1.radius === shape2.radius;
  } else if (shape1.type === "line" && shape2.type === "line") {
    return shape1.startX === shape2.startX && shape1.startY === shape2.startY &&
      shape1.endX === shape2.endX && shape1.endY === shape2.endY;
  } else if (shape1.type === "arrow" && shape2.type === "arrow") {
    return shape1.startX === shape2.startX && shape1.startY === shape2.startY &&
      shape1.endX === shape2.endX && shape1.endY === shape2.endY;
  } else if (shape1.type === "diamond" && shape2.type === "diamond") {
    return shape1.x === shape2.x && shape1.y === shape2.y &&
      shape1.width === shape2.width && shape1.height === shape2.height;
  } else if (shape1.type === "text" && shape2.type === "text") {
    return shape1.x === shape2.x && shape1.y === shape2.y &&
      shape1.text === shape2.text;
  }

  // If we reach here, shapes are of the same type but comparison failed
  return false;
}

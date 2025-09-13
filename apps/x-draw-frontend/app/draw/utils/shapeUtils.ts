import { Shape } from "../types";

export function findShapeAtPosition(x: number, y: number, shapes: Shape[]): Shape | null {
  // Check shapes in reverse order (last drawn first - topmost)
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];
    if (isPointInShape(x, y, shape)) {
      return shape;
    }
  }
  return null;
}

export function isPointInShape(x: number, y: number, shape: Shape): boolean {
  switch (shape.type) {
    case 'rect':
      return x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height;
    case 'circle':
      const distance = Math.sqrt((x - shape.centerX) ** 2 + (y - shape.centerY) ** 2);
      return distance <= shape.radius;
    case 'line':
      return distanceFromPointToLine(x, y, shape.startX, shape.startY, shape.endX, shape.endY) <= 5;
    case 'arrow':
      return distanceFromPointToLine(x, y, shape.startX, shape.startY, shape.endX, shape.endY) <= 5;
    case 'diamond':
      // Check if point is inside diamond using diamond boundary calculation
      const midX = shape.x + shape.width / 2;
      const midY = shape.y + shape.height / 2;
      const dx = Math.abs(x - midX);
      const dy = Math.abs(y - midY);
      return (dx / (shape.width / 2) + dy / (shape.height / 2)) <= 1;
    case 'text':
      // Simple bounding box for text - could be improved with actual text metrics
      const textWidth = shape.text.length * 12; // Approximate width
      const textHeight = 24; // Approximate height
      return x >= shape.x && x <= shape.x + textWidth &&
        y >= shape.y - textHeight && y <= shape.y;
    default:
      return false;
  }
}

export function distanceFromPointToLine(
  px: number, 
  py: number, 
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number
): number {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

export function shapesEqual(shape1: Shape, shape2: Shape): boolean {
  if (shape1.type !== shape2.type) return false;

  // Use id if available (for shapes with id)
  const shape1WithId = shape1 as Shape & { id?: string };
  const shape2WithId = shape2 as Shape & { id?: string };
  if (shape1WithId.id && shape2WithId.id) {
    return shape1WithId.id === shape2WithId.id;
  }

  // Fallback to property comparison
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

  return false;
}

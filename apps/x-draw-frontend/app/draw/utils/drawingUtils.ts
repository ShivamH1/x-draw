/**
 * Draws an arrow on the canvas from one point to another with an arrowhead
 * @param ctx - The 2D rendering context of the canvas
 * @param fromX - Starting X coordinate of the arrow
 * @param fromY - Starting Y coordinate of the arrow
 * @param toX - Ending X coordinate of the arrow (where arrowhead points)
 * @param toY - Ending Y coordinate of the arrow (where arrowhead points)
 */
export function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
) {
  // Length of the arrowhead lines in pixels
  const headlen = 10;
  
  // Calculate the difference between start and end points
  const dx = toX - fromX;
  const dy = toY - fromY;
  
  // Calculate the angle of the main arrow line using arctangent
  // This gives us the direction the arrow is pointing
  const angle = Math.atan2(dy, dx);
  
  // Start drawing the arrow
  ctx.beginPath();
  
  // Draw the main line of the arrow from start to end point
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  
  // Draw the first arrowhead line
  // Calculate position by going back from the tip at an angle of -30 degrees (PI/6)
  ctx.lineTo(
    toX - headlen * Math.cos(angle - Math.PI / 6),
    toY - headlen * Math.sin(angle - Math.PI / 6)
  );
  
  // Move back to the arrow tip to draw the second arrowhead line
  ctx.moveTo(toX, toY);
  
  // Draw the second arrowhead line
  // Calculate position by going back from the tip at an angle of +30 degrees (PI/6)
  ctx.lineTo(
    toX - headlen * Math.cos(angle + Math.PI / 6),
    toY - headlen * Math.sin(angle + Math.PI / 6)
  );
  
  // Actually draw the arrow on the canvas
  ctx.stroke();
}

/**
 * Draws a diamond shape on the canvas
 * @param ctx - The 2D rendering context of the canvas
 * @param x - Left edge X coordinate of the diamond's bounding rectangle
 * @param y - Top edge Y coordinate of the diamond's bounding rectangle
 * @param width - Width of the diamond's bounding rectangle
 * @param height - Height of the diamond's bounding rectangle
 */
export function drawDiamond(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  // Calculate the center points of the diamond
  const midX = x + width / 2;
  const midY = y + height / 2;
  
  // Start drawing the diamond shape
  ctx.beginPath();
  
  // Move to the top point of the diamond (center horizontally, top vertically)
  ctx.moveTo(midX, y);
  
  // Draw line to the right point (right edge, center vertically)
  ctx.lineTo(x + width, midY);
  
  // Draw line to the bottom point (center horizontally, bottom vertically)
  ctx.lineTo(midX, y + height);
  
  // Draw line to the left point (left edge, center vertically)
  ctx.lineTo(x, midY);
  
  // Close the path to complete the diamond shape (connects back to starting point)
  ctx.closePath();
  
  // Actually draw the diamond outline on the canvas
  ctx.stroke();
}

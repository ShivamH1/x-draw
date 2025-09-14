https://www.notion.so/X-Draw-Application-26d4f8643bc380c1b9aadad99298b4a0?source=copy_link

# 🎨 Canvas & Drawing System Documentation

## 📋 Table of Contents
- [System Architecture](#system-architecture)
- [Canvas Component](#canvas-component)
- [Drawing Manager](#drawing-manager)
- [Shape System](#shape-system)
- [Tool System](#tool-system)
- [Rendering System](#rendering-system)
- [Event Handling](#event-handling)
- [WebSocket Integration](#websocket-integration)
- [Utilities & Services](#utilities--services)

---

## 🏗️ System Architecture

### Overview
The drawing system is built using a **Singleton Pattern** with the `DrawingManager` as the central coordinator. The architecture separates concerns into distinct layers:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Canvas.tsx    │───▶│ DrawingManager  │───▶│  ShapeRenderer  │
│  (React Layer)  │    │  (Core Logic)   │    │  (Rendering)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Shape Service  │
                       │   (Persistence) │
                       └─────────────────┘
```

### Key Components
- **Canvas.tsx**: React wrapper component
- **DrawingManager**: Singleton managing all drawing operations
- **ShapeRenderer**: Handles shape rendering and previews
- **ShapeService**: Manages shape persistence
- **Utilities**: Hit detection, geometric calculations

---

## 🖼️ Canvas Component

### Purpose
React component that provides the HTML5 Canvas interface and initializes the drawing system.

### Props Interface
```typescript
interface CanvasProps {
  roomId: string;        // Room identifier for WebSocket
  socket: WebSocket | null;  // WebSocket connection
  currentTool: DrawingTool;  // Active drawing tool
  zoom: number;             // Current zoom level
}
```

### Lifecycle Management
```typescript
// Canvas initialization
useEffect(() => {
  if (canvasRef.current && socket) {
    const cleanup = await initDraw(canvas, roomId, socket, currentTool, zoom);
    return cleanup; // Cleanup function for event listeners
  }
}, [canvasRef, socket, roomId, currentTool, zoom]);

// Tool updates (separate effect to avoid canvas recreation)
useEffect(() => {
  updateDrawingTool(currentTool);
}, [currentTool]);

// Zoom updates
useEffect(() => {
  updateDrawingZoom(zoom);
}, [zoom]);
```

### Canvas Configuration
- **Responsive sizing**: Uses window dimensions
- **Dynamic cursor**: Changes based on active tool
- **Overflow handling**: `overflow-hidden` for proper clipping

---

## ⚙️ Drawing Manager

### Core Architecture
**Singleton Pattern**: Ensures single instance across the application
```typescript
export class DrawingManager {
  private static instance: DrawingManager | null = null;
  
  static getInstance(): DrawingManager {
    if (!DrawingManager.instance) {
      DrawingManager.instance = new DrawingManager();
    }
    return DrawingManager.instance;
  }
}
```

### State Properties
```typescript
// Canvas references
private canvas: HTMLCanvasElement | null = null;
private ctx: CanvasRenderingContext2D | null = null;

// Session state
private roomId: string = "";
private socket: WebSocket | null = null;
private currentTool: DrawingTool = "pointer";
private zoom: number = 1;

// Drawing state
private existingShapes: Shape[] = [];
private selectedShape: Shape | null = null;
private isDrawing = false;

// Interaction coordinates
private startX = 0;
private startY = 0;

// Pan/zoom state
private panOffsetX = 0;
private panOffsetY = 0;
```

### Initialization Process
1. **Cleanup**: Remove existing event listeners
2. **Setup**: Initialize canvas context and properties
3. **Load Data**: Fetch existing shapes via ShapeService
4. **Event Binding**: Attach mouse and socket listeners
5. **Render**: Initial canvas render
6. **Return Cleanup**: Provide cleanup function

### Tool Management
```typescript
updateTool(tool: DrawingTool) {
  this.currentTool = tool;
  
  // Clear selection for drawing tools
  if (tool !== "pointer") {
    this.selectedShape = null;
    this.clearAndRedraw();
  }
  
  // Update cursor style
  switch (tool) {
    case "hand": canvas.style.cursor = "grab"; break;
    case "pointer": canvas.style.cursor = "default"; break;
    case "eraser": canvas.style.cursor = "crosshair"; break;
    default: canvas.style.cursor = "crosshair";
  }
}
```

---

## 🔷 Shape System

### Shape Types Overview
The system supports 6 shape types, each with specific properties and behaviors:

### 📐 Rectangle
```typescript
type Rectangle = {
  type: "rect";
  x: number;        // Top-left corner X
  y: number;        // Top-left corner Y
  width: number;    // Rectangle width
  height: number;   // Rectangle height
}
```
**Creation**: Click and drag from start point
**Rendering**: `ctx.strokeRect(x, y, width, height)`
**Hit Detection**: Point-in-rectangle bounds check

### ⭕ Circle
```typescript
type Circle = {
  type: "circle";
  centerX: number;  // Center point X
  centerY: number;  // Center point Y
  radius: number;   // Circle radius
}
```
**Creation**: Center at click point, radius = distance to mouse
**Rendering**: `ctx.arc(centerX, centerY, radius, 0, 2π)`
**Hit Detection**: Distance from point to center ≤ radius

### 📏 Line
```typescript
type Line = {
  type: "line";
  startX: number;   // Start point X
  startY: number;   // Start point Y
  endX: number;     // End point X
  endY: number;     // End point Y
}
```
**Creation**: From mouse down to mouse up points
**Rendering**: `ctx.moveTo()` + `ctx.lineTo()`
**Hit Detection**: Distance from point to line ≤ 5px

### ➡️ Arrow
```typescript
type Arrow = {
  type: "arrow";
  startX: number;   // Start point X
  startY: number;   // Start point Y
  endX: number;     // End point X
  endY: number;     // End point Y
}
```
**Creation**: Same as line, with arrowhead calculation
**Rendering**: Line + triangular arrowhead at end
**Hit Detection**: Same as line
**Special**: Arrowhead angle calculation using `Math.atan2()`

### 💎 Diamond
```typescript
type Diamond = {
  type: "diamond";
  x: number;        // Bounding box top-left X
  y: number;        // Bounding box top-left Y
  width: number;    // Bounding box width
  height: number;   // Bounding box height
}
```
**Creation**: Bounding rectangle determines diamond size
**Rendering**: Four points connected: top, right, bottom, left
**Hit Detection**: Point-in-diamond using distance formula

### 📝 Text
```typescript
type Text = {
  type: "text";
  x: number;        // Text position X
  y: number;        // Text position Y
  text: string;     // Text content
  font: string;     // Font specification
  color: string;    // Text color
}
```
**Creation**: Prompt for text input at click position
**Rendering**: `ctx.fillText(text, x, y)`
**Hit Detection**: Simple bounding box approximation

---

## 🔧 Tool System

### Available Tools
```typescript
type DrawingTool = "pointer" | "hand" | "rect" | "circle" | 
                   "line" | "diamond" | "arrow" | "text" | "eraser";
```

### Tool Behaviors

#### 👆 Pointer Tool
- **Purpose**: Selection and manipulation
- **Behavior**: Click to select shapes
- **Visual**: Default cursor, highlights selected shapes in yellow
- **Special**: Only tool that doesn't clear selection on activation

#### ✋ Hand Tool (Pan)
- **Purpose**: Canvas navigation
- **Behavior**: Click and drag to pan canvas
- **Visual**: "grab" cursor, changes to "grabbing" when active
- **State**: Updates `panOffsetX` and `panOffsetY`

#### 🎨 Drawing Tools (rect, circle, line, diamond, arrow)
- **Purpose**: Shape creation
- **Behavior**: 
  1. Mouse down: Start drawing, clear selection
  2. Mouse move: Show preview with dashed lines
  3. Mouse up: Create final shape
- **Visual**: Crosshair cursor
- **Preview**: Semi-transparent dashed outline

#### 📝 Text Tool
- **Purpose**: Text annotation
- **Behavior**: Click → prompt for text → place at position
- **Properties**: 20px Arial font, white color
- **No Preview**: Immediate creation on click

#### 🗑️ Eraser Tool
- **Purpose**: Shape deletion
- **Behavior**: Click on shape to delete
- **Visual**: Crosshair cursor
- **Network**: Sends delete message to other clients

---

## 🎨 Rendering System

### ShapeRenderer Class
Central rendering engine handling both final shapes and preview states.

### Drawing Pipeline
```typescript
clearAndRedraw() {
  // 1. Clear canvas with transform reset
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Black background
  
  // 2. Apply zoom and pan transforms
  ctx.translate(panOffsetX, panOffsetY);
  ctx.scale(zoom, zoom);
  
  // 3. Render all shapes
  shapeRenderer.drawShapes(existingShapes, selectedShape);
}
```

### Shape Styling
```typescript
// Normal shapes
ctx.strokeStyle = "rgba(255, 255, 255)";  // White
ctx.lineWidth = 2;

// Selected shapes
ctx.strokeStyle = "rgba(255, 255, 0)";    // Yellow highlight
ctx.lineWidth = 3;

// Preview shapes
ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";  // Semi-transparent
ctx.setLineDash([5, 5]);  // Dashed outline
```

### Shape-Specific Rendering

#### Rectangle & Diamond
- Rectangle: Simple `strokeRect()`
- Diamond: Four connected points forming diamond shape

#### Circle
- Uses `ctx.arc()` with full 2π rotation
- Radius calculated from diagonal distance during creation

#### Line & Arrow
- Line: `moveTo()` + `lineTo()`
- Arrow: Line + arrowhead triangles calculated with trigonometry

#### Text
- Uses `ctx.fillText()` instead of stroke
- Font and color properties applied directly

### Preview System
During drawing (mouse move), shows preview with:
- Dashed lines (`setLineDash([5, 5])`)
- Semi-transparent color
- Same shape logic as final render
- Cleared on each mouse move and redrawn

---

## 🖱️ Event Handling

### Mouse Event Pipeline
```typescript
mousedown → mouseup → mousemove
    ↓         ↓         ↓
handleMouseDown → handleMouseUp → handleMouseMove
    ↓         ↓         ↓
Tool-specific logic
```

### Coordinate Transformation
```typescript
getCanvasCoordinates(e: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left - panOffsetX) / zoom;
  const y = (e.clientY - rect.top - panOffsetY) / zoom;
  return { x, y };
}
```
**Accounts for**: Canvas position, pan offset, and zoom level

### Tool-Specific Event Handling

#### Drawing Tools Flow
1. **Mouse Down**: 
   - Record start coordinates
   - Clear selection
   - Set `isDrawing = true`

2. **Mouse Move** (while drawing):
   - Calculate current coordinates
   - Clear and redraw existing shapes
   - Draw preview shape with dashed lines

3. **Mouse Up**:
   - Calculate final dimensions
   - Create shape object
   - Add to shape array
   - Send via WebSocket

#### Pointer Tool Flow
1. **Mouse Down**:
   - Find shape at click position
   - Set as selected shape
   - Redraw with highlight

#### Hand Tool Flow
1. **Mouse Down**:
   - Record pan start position
   - Change cursor to "grabbing"

2. **Mouse Move**:
   - Calculate delta movement
   - Update pan offsets
   - Redraw canvas

#### Eraser Tool Flow
1. **Mouse Down**:
   - Find shape at position
   - Remove from shape array
   - Clear selection
   - Send delete message

---

## 🌐 WebSocket Integration

### Message Protocol
```typescript
// Shape creation/update
{
  type: "chat",
  roomId: string,
  message: JSON.stringify({
    shape: Shape
  })
}

// Shape deletion
{
  type: "chat", 
  roomId: string,
  message: JSON.stringify({
    action: 'delete',
    shapeId: string
  })
}
```

### Real-time Synchronization
```typescript
handleSocketMessage(event: MessageEvent) {
  const messageData = JSON.parse(event.data);
  if (messageData.type === "chat") {
    const parsed = JSON.parse(messageData.message);
    
    if (parsed.shape?.type) {
      // Add new shape
      this.existingShapes.push(parsed.shape);
      this.clearAndRedraw();
    } else if (parsed.action === 'delete') {
      // Remove shape
      this.existingShapes = this.existingShapes.filter(
        s => s.id !== parsed.shapeId
      );
      this.clearAndRedraw();
    }
  }
}
```

### State Persistence
- Shapes stored as chat messages in backend
- Each shape gets unique ID (`Date.now().toString()`)
- On room join, fetch all existing shapes via ShapeService
- Real-time updates propagated to all connected clients

---

## 🛠️ Utilities & Services

### ShapeService
**Purpose**: Handle shape persistence and retrieval

```typescript
class ShapeService {
  // Fetch existing shapes from backend
  static async getExistingShapes(roomIdentifier: string): Promise<Shape[]>
}
```

**Process**:
1. Resolve room ID (handle slug vs numeric ID)
2. Fetch chat messages for room
3. Parse shape data from messages
4. Filter and return valid shapes

### Shape Utilities

#### Hit Detection
```typescript
isPointInShape(x: number, y: number, shape: Shape): boolean
```
- **Rectangle**: Bounds checking
- **Circle**: Distance from center
- **Line/Arrow**: Distance from line ≤ 5px
- **Diamond**: Proportional distance formula
- **Text**: Approximate bounding box

#### Shape Selection
```typescript
findShapeAtPosition(x: number, y: number, shapes: Shape[]): Shape | null
```
- Iterates shapes in reverse order (topmost first)
- Returns first shape containing the point
- Used by pointer and eraser tools

#### Shape Comparison
```typescript
shapesEqual(shape1: Shape, shape2: Shape): boolean
```
- Primary: Compare by ID if available
- Fallback: Deep property comparison
- Used for selection highlighting

### Drawing Utilities

#### Arrow Rendering
```typescript
drawArrow(ctx, fromX, fromY, toX, toY)
```
- Draws main line
- Calculates arrowhead angle using `Math.atan2()`
- Draws two arrowhead lines at ±30° angles

#### Diamond Rendering
```typescript
drawDiamond(ctx, x, y, width, height)
```
- Calculates center point
- Connects four corner points: top, right, bottom, left
- Forms closed path

---

## 🔄 State Management

### Shape State
- **existingShapes**: Array of all shapes in room
- **selectedShape**: Currently selected shape (pointer tool)
- **Shape IDs**: Unique timestamps for tracking

### Drawing State
- **isDrawing**: Boolean flag for active drawing
- **startX/Y**: Initial click coordinates
- **currentTool**: Active drawing tool

### View State
- **zoom**: Scale factor (default: 1.0)
- **panOffsetX/Y**: Canvas pan position
- **Canvas transforms**: Applied during rendering

### Synchronization
- Local state updated immediately for responsiveness
- Changes broadcast via WebSocket for real-time collaboration
- Persistence handled through chat message system
- Room-based isolation of shape collections

---

## 🎯 Key Design Patterns

### Singleton Pattern
- DrawingManager ensures single instance
- Prevents multiple event listener bindings
- Maintains consistent state across components

### Command Pattern
- Each tool implements specific behavior
- Mouse events delegate to tool-specific handlers
- Consistent interface for all drawing operations

### Observer Pattern
- WebSocket messages trigger state updates
- Canvas redraws on state changes
- Real-time collaboration through event propagation

### Factory Pattern
- Shape creation based on tool type
- Consistent shape object structure
- Extensible for new shape types

---

## 🚀 Performance Considerations

### Rendering Optimization
- **Clear and redraw**: Full canvas clear on each update
- **Transform management**: Proper save/restore of canvas state
- **Selective rendering**: Only redraw when necessary

### Event Optimization
- **Bound methods**: Pre-bound event handlers prevent recreation
- **Coordinate caching**: Transform calculations cached per event
- **Debounced updates**: Mouse move events optimized

### Memory Management
- **Cleanup functions**: Proper event listener removal
- **Singleton pattern**: Single instance prevents memory leaks
- **Shape filtering**: Remove deleted shapes from arrays

---

This documentation provides a comprehensive overview of the Canvas and drawing system architecture. Each component works together to provide a real-time collaborative drawing experience with support for multiple shape types, tools, and seamless WebSocket synchronization.

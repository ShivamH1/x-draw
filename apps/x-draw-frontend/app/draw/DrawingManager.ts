import { Shape, DrawingTool } from "./types";
import { ShapeRenderer } from "./renderers/ShapeRenderer";
import { ShapeService } from "./services/ShapeService";
import { findShapeAtPosition } from "./utils/shapeUtils";

export class DrawingManager {
  private static instance: DrawingManager | null = null;
  
  // Core properties
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private roomId: string = "";
  private socket: WebSocket | null = null;
  private currentTool: DrawingTool = "pointer";
  private zoom: number = 1;
  
  // State properties
  private existingShapes: Shape[] = [];
  private selectedShape: Shape | null = null;
  private isDrawing = false;
  private startX = 0;
  private startY = 0;
  private panStartX = 0;
  private panStartY = 0;
  private panOffsetX = 0;
  private panOffsetY = 0;
  
  // Renderers
  private shapeRenderer: ShapeRenderer | null = null;
  
  // Event handlers
  private boundHandleMouseDown = this.handleMouseDown.bind(this);
  private boundHandleMouseUp = this.handleMouseUp.bind(this);
  private boundHandleMouseMove = this.handleMouseMove.bind(this);
  private boundHandleSocketMessage = this.handleSocketMessage.bind(this);

  private constructor() {}

  static getInstance(): DrawingManager {
    if (!DrawingManager.instance) {
      DrawingManager.instance = new DrawingManager();
    }
    return DrawingManager.instance;
  }

  async initialize(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket,
    currentTool: DrawingTool,
    zoom: number
  ): Promise<() => void> {
    // Clean up previous instance if exists
    this.cleanup();
    
    // Initialize properties
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.roomId = roomId;
    this.socket = socket;
    this.currentTool = currentTool;
    this.zoom = zoom;
    
    if (!this.ctx) {
      throw new Error("Unable to get canvas context");
    }
    
    // Initialize renderers
    this.shapeRenderer = new ShapeRenderer(this.ctx);
    
    // Load existing shapes
    this.existingShapes = await ShapeService.getExistingShapes(roomId);
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initial render
    this.clearAndRedraw();
    
    // Return cleanup function
    return () => this.cleanup();
  }

  updateTool(tool: DrawingTool) {
    this.currentTool = tool;
    
    // Clear selection when switching to drawing tools
    if (tool !== "pointer") {
      this.selectedShape = null;
      this.clearAndRedraw();
    }
    
    // Update cursor style based on tool
    if (this.canvas) {
      switch (tool) {
        case "hand":
          this.canvas.style.cursor = "grab";
          break;
        case "pointer":
          this.canvas.style.cursor = "default";
          break;
        case "eraser":
          this.canvas.style.cursor = "crosshair";
          break;
        default:
          this.canvas.style.cursor = "crosshair";
      }
    }
  }

  updateZoom(zoom: number) {
    this.zoom = zoom;
    this.clearAndRedraw();
  }

  private setupEventListeners() {
    if (!this.canvas || !this.socket) return;
    
    this.canvas.addEventListener("mousedown", this.boundHandleMouseDown);
    this.canvas.addEventListener("mouseup", this.boundHandleMouseUp);
    this.canvas.addEventListener("mousemove", this.boundHandleMouseMove);
    this.socket.addEventListener("message", this.boundHandleSocketMessage);
  }

  private cleanup() {
    if (this.canvas) {
      this.canvas.removeEventListener("mousedown", this.boundHandleMouseDown);
      this.canvas.removeEventListener("mouseup", this.boundHandleMouseUp);
      this.canvas.removeEventListener("mousemove", this.boundHandleMouseMove);
    }
    
    if (this.socket) {
      this.socket.removeEventListener("message", this.boundHandleSocketMessage);
    }
  }

  private clearAndRedraw() {
    if (!this.ctx || !this.canvas || !this.shapeRenderer) return;
    
    // Clear the entire canvas with proper transform reset
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0, 0, 0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();

    // Apply transforms and draw all shapes
    this.ctx.save();
    this.ctx.translate(this.panOffsetX, this.panOffsetY);
    this.ctx.scale(this.zoom, this.zoom);
    this.shapeRenderer.drawShapes(this.existingShapes, this.selectedShape);
    this.ctx.restore();
  }

  private getCanvasCoordinates(e: MouseEvent) {
    if (!this.canvas) return { x: 0, y: 0 };
    
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.panOffsetX) / this.zoom;
    const y = (e.clientY - rect.top - this.panOffsetY) / this.zoom;
    return { x, y };
  }

  private handleSocketMessage(event: MessageEvent) {
    try {
      const messageData = JSON.parse(event.data);
      if (messageData.type === "chat" && messageData.message) {
        const parsedMessage = JSON.parse(messageData.message);
        if (parsedMessage?.shape?.type) {
          this.existingShapes.push(parsedMessage.shape);
          this.clearAndRedraw();
        } else if (parsedMessage?.action === 'delete' && parsedMessage.shapeId) {
          this.existingShapes = this.existingShapes.filter(
            s => (s as Shape & { id?: string }).id !== parsedMessage.shapeId
          );
          this.clearAndRedraw();
        }
      }
    } catch (error) {
      console.error("Error processing socket message:", error);
    }
  }

  private handleMouseDown(e: MouseEvent) {
    const coords = this.getCanvasCoordinates(e);
    this.startX = coords.x;
    this.startY = coords.y;

    if (this.currentTool === "pointer") {
      const clickedShape = findShapeAtPosition(coords.x, coords.y, this.existingShapes);
      this.selectedShape = clickedShape;
      this.clearAndRedraw();
      return;
    }

    if (this.currentTool === "text") {
      this.handleTextTool();
      return;
    }

    if (this.currentTool === "eraser") {
      this.handleEraser(coords.x, coords.y);
      return;
    }

    if (this.currentTool === "hand") {
      this.handlePanStart(e);
      return;
    }

    // For drawing tools, clear selection and start drawing
    this.selectedShape = null;
    this.isDrawing = true;
  }

  private handleMouseUp(e: MouseEvent) {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    
    if (this.canvas) {
      this.canvas.style.cursor = "crosshair";
    }

    const { x: endX, y: endY } = this.getCanvasCoordinates(e);
    const width = endX - this.startX;
    const height = endY - this.startY;
    const shape = this.createShape(width, height, endX, endY);

    if (shape) {
      this.addShape(shape);
    }
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.isDrawing || !this.ctx || !this.shapeRenderer) return;

    if (this.currentTool === "hand") {
      this.handlePanMove(e);
      return;
    }

    const { x: currentX, y: currentY } = this.getCanvasCoordinates(e);
    this.clearAndRedraw();

    this.ctx.save();
    this.ctx.translate(this.panOffsetX, this.panOffsetY);
    this.ctx.scale(this.zoom, this.zoom);
    this.shapeRenderer.drawPreviewShape(
      this.startX, 
      this.startY, 
      currentX, 
      currentY, 
      this.currentTool
    );
    this.ctx.restore();
  }

  private handleTextTool() {
    const text = prompt("Enter text:");
    if (text) {
      const shape: Shape = {
        type: "text",
        x: this.startX,
        y: this.startY,
        text,
        font: "20px Arial",
        color: "white",
        id: Date.now().toString(),
      } as Shape & { id: string };
      this.addShape(shape);
    }
  }

  private handleEraser(x: number, y: number) {
    const shapeToDelete = findShapeAtPosition(x, y, this.existingShapes);
    if (shapeToDelete) {
      const shapeWithId = shapeToDelete as Shape & { id?: string };
      this.existingShapes = this.existingShapes.filter(
        s => (s as Shape & { id?: string }).id !== shapeWithId.id
      );
      this.selectedShape = null;
      this.clearAndRedraw();
      this.sendMessage({
        action: 'delete',
        shapeId: shapeWithId.id
      });
    }
  }

  private handlePanStart(e: MouseEvent) {
    this.isDrawing = true;
    this.panStartX = e.clientX;
    this.panStartY = e.clientY;
    if (this.canvas) {
      this.canvas.style.cursor = "grabbing";
    }
  }

  private handlePanMove(e: MouseEvent) {
    const dx = e.clientX - this.panStartX;
    const dy = e.clientY - this.panStartY;
    this.panOffsetX += dx;
    this.panOffsetY += dy;
    this.panStartX = e.clientX;
    this.panStartY = e.clientY;
    this.clearAndRedraw();
  }

  private createShape(width: number, height: number, endX: number, endY: number): Shape | null {
    const id = Date.now().toString();

    switch (this.currentTool) {
      case "rect":
        return { type: "rect", x: this.startX, y: this.startY, width, height, id } as Shape & { id: string };
      case "circle":
        const radius = Math.sqrt(width ** 2 + height ** 2);
        return {
          type: "circle",
          centerX: this.startX,
          centerY: this.startY,
          radius,
          id
        } as Shape & { id: string };
      case "line":
        return { type: "line", startX: this.startX, startY: this.startY, endX, endY, id } as Shape & { id: string };
      case "arrow":
        return { type: "arrow", startX: this.startX, startY: this.startY, endX, endY, id } as Shape & { id: string };
      case "diamond":
        return { type: "diamond", x: this.startX, y: this.startY, width, height, id } as Shape & { id: string };
      default:
        return null;
    }
  }

  private addShape(shape: Shape) {
    this.existingShapes.push(shape);
    this.clearAndRedraw();
    this.sendMessage({ shape });
  }

  private sendMessage(message: { shape?: Shape; action?: string; shapeId?: string }) {
    if (!this.socket) return;
    
    this.socket.send(
      JSON.stringify({
        type: "chat",
        roomId: this.roomId,
        message: JSON.stringify(message),
      })
    );
  }
}

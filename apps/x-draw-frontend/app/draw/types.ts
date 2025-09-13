export type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }
  | {
      type: "diamond";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "arrow";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }
  | {
      type: "text";
      x: number;
      y: number;
      text: string;
      font: string;
      color: string;
    };

export type DrawingTool =
  | "pointer"
  | "hand"
  | "rect"
  | "circle"
  | "line"
  | "diamond"
  | "arrow"
  | "text"
  | "eraser";

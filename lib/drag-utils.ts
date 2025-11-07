// Corner positions
export type Corner = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export interface Position {
  x: number;
  y: number;
}

export interface CornerPosition {
  corner: Corner;
  position: Position;
}

// Detect which corner based on current position
export function detectCorner(x: number, y: number, windowWidth: number, windowHeight: number): Corner {
  const midX = windowWidth / 2;
  const midY = windowHeight / 2;

  const isRight = x >= midX;
  const isBottom = y >= midY;

  if (isRight && isBottom) return 'bottom-right';
  if (!isRight && isBottom) return 'bottom-left';
  if (isRight && !isBottom) return 'top-right';
  return 'top-left';
}

// Get final position for a corner (with padding)
// For bottom corners: returns bottom-anchored position (from bottom of viewport)
// For top corners: returns top-anchored position (from top of viewport)
export function getCornerPosition(corner: Corner, windowWidth: number, windowHeight: number): Position {
  const padding = 20; // padding from edges

  switch (corner) {
    case 'bottom-right':
      return { x: windowWidth - 320 - padding, y: windowHeight - padding }; // bottom-anchored
    case 'bottom-left':
      return { x: padding, y: windowHeight - padding }; // bottom-anchored
    case 'top-right':
      return { x: windowWidth - 320 - padding, y: padding };
    case 'top-left':
      return { x: padding, y: padding };
  }
}

// Get notes box offset based on corner
export function getNotesOffset(corner: Corner): Position {
  const gap = 16; // Gap between mini player and notes box
  const notesWidth = 256; // 16rem = 256px

  switch (corner) {
    case 'bottom-right':
    case 'top-right':
      // Notes to the left of mini player
      return { x: -(notesWidth + gap), y: 0 };
    case 'bottom-left':
    case 'top-left':
      // Notes to the right of mini player
      return { x: 320 + gap, y: 0 };
  }
}

// Clamp position within viewport
export function clampPosition(x: number, y: number, width: number, height: number, windowWidth: number, windowHeight: number): Position {
  return {
    x: Math.max(0, Math.min(x, windowWidth - width)),
    y: Math.max(0, Math.min(y, windowHeight - height)),
  };
}

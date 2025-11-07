"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { Corner, Position, detectCorner, getCornerPosition, clampPosition } from '@/lib/drag-utils';

interface UseDraggableProps {
  initialCorner?: Corner;
  onCornerChange?: (corner: Corner) => void;
}

export function useDraggable({ initialCorner = 'bottom-right', onCornerChange }: UseDraggableProps = {}) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentCorner, setCurrentCorner] = useState<Corner>(initialCorner);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  const elementRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Initialize position based on corner
  useEffect(() => {
    const updatePosition = () => {
      const cornerPos = getCornerPosition(currentCorner, window.innerWidth, window.innerHeight);
      setPosition(cornerPos);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [currentCorner]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
    isDraggingRef.current = true;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    const clamped = clampPosition(newX, newY, 320, 200, window.innerWidth, window.innerHeight);
    setPosition(clamped);
  }, [dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;

    setIsDragging(false);
    isDraggingRef.current = false;

    // Detect which corner and snap
    const corner = detectCorner(position.x, position.y, window.innerWidth, window.innerHeight);
    const finalPosition = getCornerPosition(corner, window.innerWidth, window.innerHeight);

    setCurrentCorner(corner);
    setPosition(finalPosition);

    if (onCornerChange) {
      onCornerChange(corner);
    }
  }, [position, onCornerChange]);

  // Add/remove global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    elementRef,
    position,
    currentCorner,
    isDragging,
    handleMouseDown,
  };
}

"use client";

import React, { useState, useEffect } from 'react';
import { useCall } from '@/contexts/CallContext';
import { getNotesOffset } from '@/lib/drag-utils';

interface NotesMiniBoxProps {
  miniPlayerPosition: { x: number; y: number };
  onNotesChange: (contactId: string, notes: string) => void;
}

export function NotesMiniBox({ miniPlayerPosition, onNotesChange }: NotesMiniBoxProps) {
  const { isMiniPlayerVisible, currentContactId, currentContactNotes, updateContactNotes, currentCorner, shouldBounceNotes, resetNotesBounce, isDragging } = useCall();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isBouncing, setIsBouncing] = useState(false);

  // Follow mini player with spring animation
  useEffect(() => {
    const offset = getNotesOffset(currentCorner);
    
    // During dragging, stay in place at current position
    // After dragging ends, follow the mini player to its final corner
    if (!isDragging) {
      const notesBoxHeight = 168; // Height of notes box in pixels
      const viewportHeight = window.innerHeight;
      const padding = 20; // Safe padding from bottom
      
      let yPosition = miniPlayerPosition.y + offset.y;
      
      // Check if notes box would overflow at the bottom
      if (yPosition + notesBoxHeight + padding > viewportHeight) {
        // Adjust to keep within viewport
        yPosition = viewportHeight - notesBoxHeight - padding;
      }
      
      setPosition({
        x: miniPlayerPosition.x + offset.x,
        y: yPosition,
      });
    }
  }, [miniPlayerPosition, currentCorner, isDragging]);

  // Handle bounce animation
  useEffect(() => {
    if (shouldBounceNotes) {
      setIsBouncing(true);
      setTimeout(() => {
        setIsBouncing(false);
        resetNotesBounce();
      }, 400);
    }
  }, [shouldBounceNotes, resetNotesBounce]);

  if (!isMiniPlayerVisible || !currentContactId) return null;

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    updateContactNotes(newNotes);
    onNotesChange(currentContactId, newNotes);
  };

  return (
    <div
      className={`fixed z-50 ${isBouncing ? 'animate-bounce-scale' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging ? 'none' : (isBouncing ? 'none' : 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'),
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl p-4 w-64 border border-gray-200 flex flex-col" style={{ height: '168px' }}>
        <div className="text-xs font-semibold text-gray-700 mb-2">Notes</div>
        <textarea
          value={currentContactNotes}
          onChange={handleNotesChange}
          placeholder="Add notes..."
          className="flex-1 w-full text-sm p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>
    </div>
  );
}

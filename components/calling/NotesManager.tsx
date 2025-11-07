"use client";

import React, { useState, useEffect } from 'react';
import { NotesMiniBox } from '@/components/calling/NotesMiniBox';
import { useCall } from '@/contexts/CallContext';
import { getCornerPosition } from '@/lib/drag-utils';

export function NotesManager() {
  const { currentCorner } = useCall();
  const [miniPlayerPosition, setMiniPlayerPosition] = useState({ x: 0, y: 0 });

  // Update position when corner changes
  useEffect(() => {
    const pos = getCornerPosition(currentCorner, window.innerWidth, window.innerHeight);
    setMiniPlayerPosition(pos);

    const handleResize = () => {
      const newPos = getCornerPosition(currentCorner, window.innerWidth, window.innerHeight);
      setMiniPlayerPosition(newPos);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentCorner]);

  const handleNotesChange = (contactId: string, notes: string) => {
    // The context will handle the callback to update the table
    // This is just a pass-through from NotesMiniBox
  };

  return <NotesMiniBox miniPlayerPosition={miniPlayerPosition} onNotesChange={handleNotesChange} />;
}

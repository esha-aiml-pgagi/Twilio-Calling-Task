"use client";

import React from 'react';
import { useCall } from '@/contexts/CallContext';

interface PhoneNumberCellProps {
  phoneNumber: string;
  contactId: string;
  contactNotes?: string;
}

export function PhoneNumberCell({ phoneNumber, contactId, contactNotes = '' }: PhoneNumberCellProps) {
  const { openMiniPlayer, isCallActiveOrDialing } = useCall();

  if (!phoneNumber) return <span className="text-gray-400">—</span>;

  const handleClick = () => {
    // Check if call is active or dialing
    if (isCallActiveOrDialing()) {
      alert('Please hang up the current call before starting a new one.');
      return;
    }

    // Open mini player with new number
    openMiniPlayer(phoneNumber, contactId, contactNotes);
  };

  return (
    <button
      onClick={handleClick}
      className="text-blue-600 hover:bg-blue-50 hover:underline rounded-md px-2 py-1 text-xs sm:text-sm transition-all duration-300 cursor-pointer font-medium"
    >
      {phoneNumber}
    </button>
  );
}

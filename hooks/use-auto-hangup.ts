"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCall } from '@/contexts/CallContext';

export function useAutoHangupOnRouteChange() {
  const pathname = usePathname();
  const { hangUpCall, callSession } = useCall();

  useEffect(() => {
    // Auto hang-up if navigating to login page and call is active
    if (pathname === '/login' && callSession) {
      console.log('🔴 Route changed to login - hanging up call');
      hangUpCall();
    }
  }, [pathname, callSession, hangUpCall]);

  // Also handle page unload (closing tab/window)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (callSession) {
        console.log('🔴 Page unloading - hanging up call');
        hangUpCall();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [callSession, hangUpCall]);
}

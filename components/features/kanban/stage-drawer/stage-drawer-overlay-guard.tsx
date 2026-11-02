'use client';

import * as React from 'react';
import type { DrawerRootChangeEventDetails } from '@base-ui/react/drawer';

interface StageDrawerOverlayGuardContextValue {
  reportSelectOpenChange: (isOpen: boolean) => void;
}

const StageDrawerOverlayGuardContext =
  React.createContext<StageDrawerOverlayGuardContextValue | null>(null);

export function useStageDrawerOverlayGuard() {
  return React.useContext(StageDrawerOverlayGuardContext);
}

export function useDrawerOverlayGuard(
  onOpenChange?: (open: boolean) => void,
  cooldownMs = 150,
) {
  const isSelectOpenRef = React.useRef(false);
  const lastClosedAtRef = React.useRef(0);

  const reportSelectOpenChange = React.useCallback((isOpen: boolean) => {
    isSelectOpenRef.current = isOpen;
    if (!isOpen) {
      lastClosedAtRef.current = Date.now();
    }
  }, []);

  const handleDrawerOpenChange = React.useCallback(
    (nextOpen: boolean, eventDetails?: DrawerRootChangeEventDetails) => {
      if (!nextOpen && eventDetails) {
        const isRecentlyClosed =
          Date.now() - lastClosedAtRef.current < cooldownMs;
        const isGuarded = isSelectOpenRef.current || isRecentlyClosed;

        if (
          isGuarded &&
          (eventDetails.reason === 'outside-press' ||
            eventDetails.reason === 'escape-key')
        ) {
          eventDetails.cancel();
          return;
        }
      }

      onOpenChange?.(nextOpen);
    },
    [onOpenChange, cooldownMs],
  );

  return {
    isSelectOpenRef,
    lastClosedAtRef,
    reportSelectOpenChange,
    handleDrawerOpenChange,
    cooldownMs,
  };
}

export function StageDrawerOverlayGuardProvider({
  children,
  reportSelectOpenChange,
}: {
  children: React.ReactNode;
  reportSelectOpenChange: (isOpen: boolean) => void;
}) {
  const value = React.useMemo(
    () => ({ reportSelectOpenChange }),
    [reportSelectOpenChange],
  );

  return (
    <StageDrawerOverlayGuardContext.Provider value={value}>
      {children}
    </StageDrawerOverlayGuardContext.Provider>
  );
}

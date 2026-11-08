'use client';

import * as React from 'react';
import { Toast } from '@heroui/react';
import { useIsMobile } from '@/hooks/use-mobile';

export function HeroUIToastProvider() {
  const isMobile = useIsMobile();

  return <Toast.Provider placement={isMobile ? 'top' : 'top end'} />;
}


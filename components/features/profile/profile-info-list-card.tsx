'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface ProfileDetailItem {
  label: string;
  value: string;
}

interface ProfileInfoListCardProps {
  details: ProfileDetailItem[];
}

export function ProfileInfoListCard({ details }: ProfileInfoListCardProps) {
  return (
    <div className='flex flex-col gap-2'>
      {/* Section Label */}
      <h3 className='text-xs font-bold tracking-wider text-muted-foreground uppercase px-1'>
        Informasi Akun
      </h3>

      {/* Card with list rows */}
      <Card className='rounded-2xl border border-border/70 bg-card shadow-xs overflow-hidden'>
        <CardContent className='p-0 divide-y divide-border/60'>
          {details.map((item, index) => (
            <div
              key={index}
              className='flex items-center justify-between px-4 sm:px-6 py-3.5 text-xs sm:text-sm transition-colors hover:bg-muted/30'
            >
              <span className='text-muted-foreground font-normal'>
                {item.label}
              </span>
              <span className='font-semibold text-foreground text-right truncate max-w-[60%]'>
                {item.value || '-'}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


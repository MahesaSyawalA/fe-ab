'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileHeroCardProps {
  name: string;
  email: string;
  roleLabel: string;
  initials: string;
  isLoading?: boolean;
}

export function ProfileHeroCard({
  name,
  email,
  roleLabel,
  initials,
  isLoading = false,
}: ProfileHeroCardProps) {
  if (isLoading) {
    return (
      <Card className='rounded-2xl border border-border/70 bg-card shadow-xs'>
        <CardContent className='flex flex-col items-center text-center p-6 sm:p-8'>
          <Skeleton className='size-24 rounded-full' />
          <Skeleton className='mt-4 h-6 w-36 rounded-md' />
          <Skeleton className='mt-2 h-4 w-48 rounded-md' />
          <Skeleton className='mt-3 h-6 w-20 rounded-lg' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='rounded-2xl border border-border/70 bg-card shadow-xs'>
      <CardContent className='flex flex-col items-center text-center p-6 sm:p-8'>
        {/* Large Avatar */}
        <div className='size-24 rounded-full bg-primary text-white flex items-center justify-center text-2xl sm:text-3xl font-bold select-none shadow-md shadow-primary/20'>
          {initials}
        </div>

        {/* User Details */}
        <h2 className='mt-4 text-lg sm:text-xl font-bold tracking-tight text-foreground'>
          {name}
        </h2>
        <p className='mt-0.5 text-xs sm:text-sm text-muted-foreground'>
          {email}
        </p>

        {/* Role Badge */}
        <div className='mt-3'>
          <span className='inline-flex items-center rounded-lg border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent'>
            {roleLabel}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

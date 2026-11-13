import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';

interface WizardStepCardProps {
  icon: React.ReactNode;
  title: string;
  badgeText?: string;
  children: React.ReactNode;
}

export function WizardStepCard({
  icon,
  title,
  badgeText,
  children,
}: WizardStepCardProps) {
  return (
    <Card
      size='sm'
      className='w-full min-w-0 rounded-2xl border border-border ring-0 py-4 md:py-6 shadow-2xs bg-card'
    >
      <CardContent className='gap-5 px-4 md:px-6'>
        <SectionHeader icon={icon} title={title} badgeText={badgeText} />
        {children}
      </CardContent>
    </Card>
  );
}

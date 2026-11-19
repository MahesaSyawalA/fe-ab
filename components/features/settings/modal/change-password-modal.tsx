'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { ChangePasswordDialog } from './change-password-dialog';
import { ChangePasswordDrawer } from './change-password-drawer';
import {
  useChangePasswordForm,
  type ChangePasswordModalProps,
} from './change-password-form';

export type { ChangePasswordModalProps };

export function ChangePasswordModal(props: ChangePasswordModalProps) {
  const isMobile = useIsMobile();
  const formState = useChangePasswordForm(props);

  if (isMobile) {
    return <ChangePasswordDrawer open={props.open} formState={formState} />;
  }

  return <ChangePasswordDialog open={props.open} formState={formState} />;
}

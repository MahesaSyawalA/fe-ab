import { RoleLayoutShell } from '@/components/layout/role-layout-shell';

export default function DirectorLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayoutShell role='director'>{children}</RoleLayoutShell>;
}

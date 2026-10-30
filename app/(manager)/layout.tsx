import { RoleLayoutShell } from '@/components/layout/role-layout-shell';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayoutShell role='manager'>{children}</RoleLayoutShell>;
}

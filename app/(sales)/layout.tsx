import { RoleLayoutShell } from '@/components/layout/role-layout-shell';

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayoutShell role='sales'>{children}</RoleLayoutShell>;
}

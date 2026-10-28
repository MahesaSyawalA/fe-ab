import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar'
import { AppHeader } from '@/components/layout/header/app-header'

export default function DirectorLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar role='director' />
            <SidebarInset>
                <AppHeader />
                <main className='flex flex-1 flex-col gap-4 p-4 bg-card '>
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
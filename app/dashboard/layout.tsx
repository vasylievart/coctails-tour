// app/dashboard/layout.tsx
import { SessionProvider } from "../hooks/SessionContext"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { cookies } from "next/headers"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SessionProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </SessionProvider>
  )
}

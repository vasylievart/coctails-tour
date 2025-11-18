import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import { SessionProvider } from "../hooks/SessionContext"
import Dashboard from "./page"


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  

  
  return (
    <SessionProvider>
      <Dashboard children={children}/>
    </SessionProvider>
    
  )
}
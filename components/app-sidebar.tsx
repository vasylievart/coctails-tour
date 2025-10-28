import { Calendar, Home, BookMarked, ChartNoAxesCombined, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard/home",
    icon: Home,
  },
  {
    title: "Bookings",
    url: "/dashboard/bookings",
    icon: BookMarked,
  },
  {
    title: "Slots",
    url: "/dashboard/slots",
    icon: Calendar,
  },
  {
    title: "Stats",
    url: "/dashboard/stats",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: User,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
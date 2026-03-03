"use client"

import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import {
  Home,
  LayoutDashboard,
  Video,
  Info,
  Play,
  Upload,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Videos", url: "/dashboard?section=videos", icon: Video },
  { title: "Upload", url: "/upload", icon: Upload },
  { title: "About", url: "/about", icon: Info },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar {...props} className="border-r border-base-300 bg-base-200">
      {/* Project Branding */}
      <SidebarHeader className="border-b border-base-300 pb-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Play className="h-5 w-5 text-primary-content" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-base-content">
              StreamVault
            </span>
            <span className="text-xs text-base-content/60">
              Media Platform
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="py-4">
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.url === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.url.split("?")[0])

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="text-base-content/70 hover:text-primary hover:bg-base-300 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                    >
                      <a
                        href={item.url}
                        className="flex items-center gap-3 px-3 py-2"
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}

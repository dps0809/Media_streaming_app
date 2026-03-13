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
import { motion } from "motion/react"
import { GlareCard } from "@/components/ui/glare-card"

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
        <GlareCard className="rounded-lg">
          <div className="flex items-center gap-3 px-2 py-1">
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
        </GlareCard>
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
                      className="text-base-content/70 hover:text-primary hover:bg-base-300 relative overflow-hidden group data-[active=true]:text-primary data-[active=true]:bg-transparent"
                    >
                      <a
                        href={item.url}
                        className="flex items-center gap-3 px-3 py-2 w-full relative z-10"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="active-nav-bg"
                            className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}
                        <item.icon className="h-5 w-5 relative z-10" />
                        <span className="font-medium relative z-10">{item.title}</span>
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

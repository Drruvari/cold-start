import {
    Settings2,
    SquareTerminal,
    UploadCloud,
    UserCircle,
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = typeof window !== "undefined" ? window.location.pathname : ""

    const data = {
        user: {
            name: "User",
            email: "user@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        teams: [
            {
                name: "Cold Start",
                logo: UploadCloud,
                plan: "Enterprise",
            },
        ],
        navMain: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: SquareTerminal,
                isActive: pathname.startsWith("/dashboard"),
            },
            {
                title: "Upload CSV",
                url: "/upload",
                icon: UploadCloud,
                isActive: pathname.startsWith("/upload"),
            },
            {
                title: "Account",
                url: "#",
                icon: UserCircle,
                items: [
                    { title: "Profile", url: "#" },
                    { title: "Notifications", url: "#" },
                ],
            },
            {
                title: "Settings",
                url: "#",
                icon: Settings2,
                items: [{ title: "General", url: "#" }],
            },
        ],
        projects: [],
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {data.projects.length > 0 && <NavProjects projects={data.projects} />}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

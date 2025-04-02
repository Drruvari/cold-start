import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { UserButton } from "@clerk/clerk-react"
import { Outlet, useLocation } from "react-router-dom"

export default function AppLayout() {
    const location = useLocation()

    const getCurrentPageName = () => {
        if (location.pathname.startsWith("/upload")) return "Upload"
        if (location.pathname.startsWith("/dashboard")) return "Dashboard"
        return "App"
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 items-center justify-between gap-2 px-4 border-b">
                    {/* Left side: Breadcrumbs */}
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{getCurrentPageName()}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    {/* Right side: User avatar */}
                    <UserButton afterSwitchSessionUrl="/sign-in" />
                </header>

                {/* Main content */}
                <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

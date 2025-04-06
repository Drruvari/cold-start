import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { DBLead } from "@/types/db"

export function LeadDrawer({
    lead,
    open,
    onOpenChange,
}: {
    lead: DBLead
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    if (!lead) return null

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="p-4">
                <DrawerHeader>
                    <DrawerTitle>
                        {lead.name} — {lead.job_title} @ {lead.company}
                    </DrawerTitle>
                    <DrawerDescription className="text-sm text-muted-foreground">
                        {lead.email}
                    </DrawerDescription>
                </DrawerHeader>

                <div className="py-2 px-4 space-y-3 text-sm">
                    <p className="whitespace-pre-wrap">{lead.email_text}</p>

                    {lead.company_mission && <p>🌱 <strong>Mission:</strong> {lead.company_mission}</p>}
                    {lead.recent_linkedin_post && <p>🔗 <strong>Post:</strong> {lead.recent_linkedin_post}</p>}

                    {lead.sent_at && <p>📤 <strong>Sent:</strong> {new Date(lead.sent_at).toLocaleDateString()}</p>}
                    {lead.opened_at && <p>📬 <strong>Opened</strong></p>}
                    {lead.clicked_at && <p>🔗 <strong>Clicked</strong></p>}
                    {lead.replied_at && <p>💬 <strong>Replied</strong></p>}
                </div>

                <DrawerFooter className="mt-4">
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

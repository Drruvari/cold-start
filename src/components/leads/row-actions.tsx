import { Button } from "@/components/ui/button"
import { useSendEmail } from "@/hooks/useSendEmail"
import { getSupabaseWithAuth } from "@/lib/supabase"
import { DBLead } from "@/types/db"
import { useAuth } from "@clerk/clerk-react"
import { useQueryClient } from "@tanstack/react-query"
import { SendHorizonal, Trash } from "lucide-react"
import { toast } from "sonner"

export function LeadRowActions({ lead }: { lead: DBLead }) {
    const { mutateAsync: sendEmail } = useSendEmail()
    const queryClient = useQueryClient()
    const { getToken } = useAuth()

    const handleSend = async () => {
        const token = await getToken({ template: "supabase" })
        const supabase = getSupabaseWithAuth(token!)

        const trackingPixel = `<img src="${window.location.origin}/api/track/open?leadId=${lead.id}" width="1" height="1" style="display:none;" />`
        const trackedEmailText = lead.email_text.replace(/https?:\/\/[^\s)]+/g, (url) => {
            return `${window.location.origin}/api/track/click?leadId=${lead.id}&url=${encodeURIComponent(url)}`
        })
        const finalEmail = `${trackedEmailText}\n\n${trackingPixel}`

        await sendEmail({
            to: lead.email,
            subject: `Reaching out: ${lead.company}`,
            html: finalEmail,
        })

        await supabase
            .from("leads")
            .update({
                status: "sent",
                sent_at: new Date().toISOString(),
                email_text: finalEmail,
            })
            .eq("id", lead.id)

        queryClient.invalidateQueries({ queryKey: ["leads"] })
        toast.success("Email sent ✅")
    }

    return (
        <div className="flex gap-2">
            <Button size="sm" onClick={handleSend} disabled={lead.status !== "approved"}>
                <SendHorizonal className="h-4 w-4 mr-1" /> Send
            </Button>
            <Button size="sm" variant="destructive">
                <Trash className="h-4 w-4 mr-1" /> Delete
            </Button>
        </div>
    )
}

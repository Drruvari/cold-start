import { DBLead } from "@/types/db"
import { ArrowDownUp, Eye, Inbox, MessageCircle, TextCursor } from "lucide-react"

function LeadTrackingTimeline({ lead }: { lead: DBLead }) {
    const items = [
        lead.sent_at && {
            icon: <Inbox size={14} className="text-muted-foreground" />,
            label: "Sent",
            time: new Date(lead.sent_at).toLocaleDateString(),
        },
        lead.opened_at && {
            icon: <Eye size={14} className="text-green-600" />,
            label: "Opened",
            time: new Date(lead.opened_at).toLocaleDateString(),
        },
        lead.clicked_at && {
            icon: <TextCursor size={14} className="text-blue-600" />,
            label: "Clicked",
            time: new Date(lead.clicked_at).toLocaleDateString(),
        },
        lead.replied_at && {
            icon: <MessageCircle size={14} className="text-purple-600" />,
            label: "Replied",
            time: new Date(lead.replied_at).toLocaleDateString(),
        },
        lead.follow_up_sent_at && {
            icon: <ArrowDownUp size={14} className="text-muted-foreground" />,
            label: "Follow-up",
            time: new Date(lead.follow_up_sent_at).toLocaleDateString(),
        },
    ].filter(Boolean)

    return (
        <div className="mt-4 border-t pt-2 space-y-1 text-sm text-muted-foreground">
            {items.map((item, idx) => (
                item && (
                    <div key={idx} className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.label} — {item.time}</span>
                    </div>
                )
            ))}
        </div>
    )
}

export default LeadTrackingTimeline

import { DBLead } from "@/types/db"
import Papa from "papaparse"

export function exportLeadsToCsv(leads: DBLead[], filename = "leads.csv") {
    const normalized = leads.map((lead) => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        company: lead.company,
        job_title: lead.job_title,
        email_text: lead.email_text,
        user_id: lead.user_id,
        status: lead.status,
        created_at: lead.created_at,
        company_mission: lead.company_mission || "",
        recent_linkedin_post: lead.recent_linkedin_post || "",
        sent_at: lead.sent_at || "",
        opened_at: lead.opened_at || "",
        clicked_at: lead.clicked_at || "",
        replied_at: lead.replied_at || "",
        follow_up_sent_at: lead.follow_up_sent_at || "",
        follow_up_enabled: lead.follow_up_enabled ? "true" : "false",
        follow_up_delay_days: lead.follow_up_delay_days.toString(),
    }))

    const csv = Papa.unparse(normalized)

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

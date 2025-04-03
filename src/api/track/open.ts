import { sendEmail } from "@/lib/sendEmail"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
    const now = new Date()

    const { data: leads, error } = await supabaseAdmin
        .from("leads")
        .select("*")
        .eq("status", "sent")
        .eq("follow_up_enabled", true)
        .is("replied_at", null)

    if (error) {
        console.error("Error fetching leads:", error)
        return new Response("Failed to fetch leads", { status: 500 })
    }

    const leadsToFollowUp = leads.filter((lead) => {
        const sentAt = new Date(lead.sent_at)
        const diffDays = Math.floor((now.getTime() - sentAt.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays >= lead.follow_up_delay_days
    })

    for (const lead of leadsToFollowUp) {
        const followupBody = `Hi ${lead.name.split(" ")[0]}, just checking if you saw my previous email. Let me know if you'd like a demo.\n\nBest,\n[Your Name]`

        try {
            await sendEmail({
                to: lead.email,
                subject: `Following up on ${lead.company}`,
                html: `${followupBody}<img src="${process.env.BASE_URL}/api/track/open?leadId=${lead.id}" width="1" height="1" style="display:none;" />`,
            })

            await supabaseAdmin.from("leads").update({
                follow_up_sent_at: now.toISOString(),
            }).eq("id", lead.id)

            console.log("Follow-up sent to:", lead.email)
        } catch (err) {
            console.error("Failed to send follow-up to", lead.email, err)
        }
    }

    return new Response("Follow-ups processed")
}

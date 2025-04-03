import dotenv from "dotenv"
import cron from "node-cron"
import { sendEmail } from "../src/lib/sendEmail"
import { supabaseAdmin } from "../src/lib/supabase-admin"

dotenv.config()

cron.schedule("0 8 * * *", async () => {
    console.log("📆 Running follow-up cron job...")

    const { data: leads, error } = await supabaseAdmin
        .from("leads")
        .select("*")
        .eq("follow_up_enabled", true)
        .is("follow_up_sent_at", null)
        .is("replied_at", null)

    if (error) {
        console.error("❌ Failed to fetch leads:", error)
        return
    }

    const today = new Date()

    for (const lead of leads || []) {
        if (!lead.sent_at) {
            console.warn(`⚠️ Skipping ${lead.email} — sent_at missing`)
            continue
        }

        const delay = Number(lead.follow_up_delay_days ?? 0)
        if (isNaN(delay)) {
            console.warn(`⚠️ Skipping ${lead.email} — invalid delay`)
            continue
        }

        const sentAt = new Date(lead.sent_at)
        const dueDate = new Date(sentAt)
        dueDate.setDate(sentAt.getDate() + delay)

        if (today < dueDate) {
            console.log(`⏭️ Skipping ${lead.email} — follow-up not due yet`)
            continue
        }

        try {
            const followUpText = `
                Hi ${lead.name?.split(" ")[0] || "there"},

                Just checking in on my previous email. Let me know if you're interested in chatting!

                Best,
                [Your Name]
            `.trim()

            const html = `
                ${followUpText}
                <br /><br />
                <img src="${process.env.BASE_URL}/api/track/open?leadId=${lead.id}" width="1" height="1" style="display:none;" />
      `

            await sendEmail({
                to: lead.email,
                subject: `Quick follow-up: ${lead.company}`,
                html,
            })

            await supabaseAdmin
                .from("leads")
                .update({ follow_up_sent_at: new Date().toISOString() })
                .eq("id", lead.id)

            console.log(`✅ Follow-up sent to ${lead.email}`)
        } catch (err) {
            console.error(`❌ Failed to send to ${lead.email}`, err)
        }
    }
})

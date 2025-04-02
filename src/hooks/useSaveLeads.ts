import { getSupabaseWithAuth } from "@/lib/supabase"
import { UINewLead } from "@/types/leads"
import { useAuth, useUser } from "@clerk/clerk-react"
import { useMutation } from "@tanstack/react-query"

export const useSaveLeads = () => {
    const { getToken } = useAuth()
    const { user } = useUser()

    return useMutation({
        mutationFn: async (leads: (UINewLead & { emailText: string })[]) => {
            const token = await getToken({ template: "supabase" })
            if (!token) throw new Error("Missing Clerk token")
            if (!user?.id) throw new Error("Missing Clerk user")

            const supabase = getSupabaseWithAuth(token)

            const { error } = await supabase.from("leads").insert(
                leads.map((lead) => ({
                    name: lead.name,
                    email: lead.email,
                    company: lead.company,
                    job_title: lead.job_title,
                    email_text: lead.emailText,
                    status: lead.status || "draft",
                    user_id: user.id,
                    company_mission: lead.company_mission || "",
                    recent_linkedin_post: lead.recent_linkedin_post || "",
                }))
            )

            if (error) throw error
        },
    })
}

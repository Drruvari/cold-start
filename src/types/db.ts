export type DBLead = {
    id: string
    name: string
    email: string
    company: string
    job_title: string
    email_text: string
    user_id: string
    status: "draft" | "approved" | "sent"
    created_at: string
    company_mission?: string
    recent_linkedin_post?: string
}

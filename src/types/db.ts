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
    sent_at?: string
    opened_at?: string
    clicked_at?: string
    replied_at?: string
    follow_up_sent_at?: string
    follow_up_enabled: boolean
    follow_up_delay_days: number
}

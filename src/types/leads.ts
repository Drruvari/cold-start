export type UINewLead = {
    name: string
    email: string
    company: string
    job_title: string
    emailText: string
    status: "draft" | "approved" | "sent"
    company_mission?: string
    recent_linkedin_post?: string
}

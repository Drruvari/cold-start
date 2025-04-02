import { UINewLead } from "@/types/leads"

export const BASE_PROMPT = (lead: UINewLead) => `
    Write a cold outreach email to ${lead.name}, a ${lead.job_title} at ${lead.company}.

    Use the following context:
    - Company mission: ${lead.company_mission || "No mission provided"}
    - LinkedIn post: "${lead.recent_linkedin_post || "No recent post"}"
    - Email goal: Book a short call to show a product demo

    Keep it concise, personalized, and friendly. 3–4 sentences max.
`.trim()

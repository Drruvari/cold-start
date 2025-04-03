import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get("leadId")
    const redirectUrl = searchParams.get("url")

    if (!leadId || !redirectUrl) {
        return new Response("Missing parameters", { status: 400 })
    }

    await supabaseAdmin
        .from("leads")
        .update({ clicked_at: new Date().toISOString() })
        .eq("id", leadId)

    return Response.redirect(redirectUrl)
}

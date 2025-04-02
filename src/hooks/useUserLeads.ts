import { getSupabaseWithAuth } from "@/lib/supabase"
import { DBLead } from "@/types/db"
import { useAuth, useUser } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query"

export const useUserLeads = () => {
    const { user } = useUser()
    const { getToken } = useAuth()

    return useQuery<DBLead[]>({
        queryKey: ["user-leads", user?.id],
        queryFn: async () => {
            if (!user) return []

            const token = await getToken({ template: "supabase" })
            if (!token) throw new Error("Missing Clerk token")

            const supabase = getSupabaseWithAuth(token)

            const { data, error } = await supabase
                .from("leads")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })

            if (error) throw error
            return data as DBLead[]
        },
        enabled: !!user,
    })
}

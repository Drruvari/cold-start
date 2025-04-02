import { getSupabaseWithAuth } from "@/lib/supabase"
import { DBLead } from "@/types/db"
import { useAuth } from "@clerk/clerk-react"
import { useMutation } from "@tanstack/react-query"

export const useUpdateLead = () => {
    const { getToken } = useAuth()

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string, updates: Partial<DBLead> }) => {
            const token = await getToken({ template: "supabase" })
            if (!token) throw new Error("Missing Clerk token")

            const supabase = getSupabaseWithAuth(token)

            const { error } = await supabase
                .from("leads")
                .update(updates)
                .eq("id", id)

            if (error) throw error
        }
    })
}

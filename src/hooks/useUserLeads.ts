import { getSupabaseWithAuth } from "@/lib/supabase/client"
import { DBLead } from "@/types/db"
import { useAuth } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query"

export function useUserLeads() {
    const { getToken } = useAuth()

    return useQuery({
        queryKey: ["user-leads"],
        queryFn: async (): Promise<DBLead[]> => {
            const token = await getToken({ template: "supabase" })
            const supabase = getSupabaseWithAuth(token!)

            const { data, error } = await supabase.from("leads").select("*")

            if (error) throw new Error(error.message)
            return data ?? []
        },
    })
}

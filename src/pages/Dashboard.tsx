import LeadItem from "@/components/LeadItem"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUserLeads } from "@/hooks/useUserLeads"
import { exportLeadsToCsv } from "@/lib/exportCsv"
import { DBLead } from "@/types/db"
import { useEffect, useState } from "react"

export default function DashboardPage() {
    const [query, setQuery] = useState("")
    const { data, isLoading } = useUserLeads()
    const [leads, setLeads] = useState<DBLead[]>([])
    const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "approved" | "sent">("all")

    useEffect(() => {
        if (data) setLeads(data)
    }, [data])

    const filteredLeads = leads.filter((lead) => {
        const matchesSearch = `${lead.name} ${lead.company} ${lead.job_title} ${lead.email_text}`.toLowerCase().includes(query.toLowerCase())
        const matchesStatus = statusFilter === "all" || lead.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleDeleteLead = (id: string) => {
        setLeads((prev) => prev.filter((l) => l.id !== id))
    }

    const handleUpdateLead = (updated: DBLead) => {
        setLeads((prev) =>
            prev.map((lead) => (lead.id === updated.id ? updated : lead))
        )
    }

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">Leads Dashboard</h1>
                <p className="text-sm text-muted-foreground">View, filter, and manage your cold outreach leads.</p>
            </div>
            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <Input
                    placeholder="Search by name, company, or job title"
                    className="w-full max-w-sm border-none bg-muted/30 shadow-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="flex gap-2">
                    {["all", "draft", "approved", "sent"].map((status) => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? "default" : "outline"}
                            size="sm"
                            className="px-4 uppercase text-xs font-medium"
                            onClick={() => setStatusFilter(status as typeof statusFilter)}
                        >
                            {status}
                        </Button>
                    ))}
                </div>
            </div>
            {/* Content */}
            <div className="border-t border-border pt-6">
                {isLoading ? (
                    <p className="text-muted-foreground">Loading leads...</p>
                ) : filteredLeads.length > 0 ? (
                    <ul className="space-y-4">
                        {filteredLeads.map((lead) => (
                            <LeadItem
                                key={lead.id}
                                lead={lead}
                                onDelete={handleDeleteLead}
                                onUpdate={handleUpdateLead}
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground">No saved leads yet.</p>
                )}
            </div>
            {/* Export */}
            {leads.length > 0 && (
                <div className="pt-4 border-t border-border">
                    <Button onClick={() => exportLeadsToCsv(leads)} className="w-full md:w-auto">
                        Export to CSV
                    </Button>
                </div>
            )}
        </div>
    )
}

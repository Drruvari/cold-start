import Papa from "papaparse"
import { useState } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CsvDropzone } from "@/components/ui/csv-dropzone"
import { Label } from "@/components/ui/label"
import { useGenerateEmail } from "@/hooks/useGenerateEmail"
import { useSaveLeads } from "@/hooks/useSaveLeads"
import { UINewLead } from "@/types/leads"
import { toast } from "sonner"

export default function UploadPage() {
    const [leads, setLeads] = useState<UINewLead[]>([])
    const { mutateAsync: generateEmail, isPending } = useGenerateEmail()
    const { mutate: saveLeads, isPending: isSaving } = useSaveLeads()

    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const rawRows = results.data as Record<string, string>[]
                const headers = results.meta.fields ?? []

                console.log("CSV Headers:", headers)

                const enrichedLeads = rawRows.map((row) => ({
                    name: row.name || row.full_name || row.contact || "",
                    email: row.email || row.mail || "",
                    company: row.company || row.organization || "",
                    job_title: row.job_title || row.role || row.position || "",
                    emailText: "",
                    status: "draft" as const,
                }))

                setLeads(enrichedLeads)
            },
        })
    }

    const handleGenerateAll = async () => {
        const updated = await Promise.all(
            leads.map(async (lead) => {
                const emailText = await generateEmail(lead)
                return { ...lead, emailText, status: "draft" as const }
            })
        )
        setLeads(updated)
    }

    const handleSave = () => {
        const leadsToSave = leads
            .filter((lead): lead is UINewLead & { emailText: string } => !!lead.emailText)
            .map((lead) => ({ ...lead, status: lead.status || "draft" }))

        saveLeads(leadsToSave, {
            onSuccess: () => {
                toast.success("Leads saved successfully!")
            },
            onError: (error) => {
                console.error("Failed to save leads:", error)
                toast.error("Failed to save leads. Please try again.")
            },
        })
    }

    return (
        <div className="flex flex-col gap-6 p-4">
            <div>
                <h1 className="text-xl font-semibold">Upload Lead CSV</h1>
                <p className="text-muted-foreground text-sm">
                    Import contacts and generate cold emails in one click.
                </p>
            </div>

            <Card className="w-full max-w-full border-muted bg-background">
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="file-upload" className="text-base font-medium">
                            Upload CSV
                        </Label>

                        <CsvDropzone onChange={handleCSVUpload} />

                        <p className="text-sm text-muted-foreground text-center">
                            Your CSV should include columns: <code>name</code>, <code>email</code>, <code>company</code>, <code>job_title</code>
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2 justify-start">
                        <Button onClick={handleGenerateAll} disabled={isPending}>
                            {isPending ? "Generating..." : "Generate Emails"}
                        </Button>
                        <Button variant="secondary" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Leads"}
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link to="/dashboard">View saved leads</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {leads.length > 0 && (
                <div className="mt-6 space-y-4">
                    <h2 className="text-lg font-semibold">Preview</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {leads.map((lead, i) => (
                            <li key={i} className="border bg-white p-4">
                                <p className="font-medium">{lead.name} — {lead.job_title}</p>
                                <p className="text-sm text-muted-foreground">{lead.email}</p>
                                <p className="text-sm mt-2 text-muted-foreground whitespace-pre-wrap">
                                    {lead.emailText ? (
                                        <em>{lead.emailText}</em>
                                    ) : (
                                        <span className="text-yellow-600">Awaiting generation...</span>
                                    )}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

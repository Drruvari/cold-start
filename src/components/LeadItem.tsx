import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useDialog } from "@/hooks/useDialog"
import { useSendEmail } from "@/hooks/useSendEmail"
import { getSupabaseWithAuth } from "@/lib/supabase"
import { DBLead } from "@/types/db"
import { useAuth } from "@clerk/clerk-react"
import { useQueryClient } from "@tanstack/react-query"
import {
    Trash
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import LeadTrackingTimeline from "./LeadTrackingTimeline"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "./ui/alert-dialog"
import { Input } from "./ui/input"

function LeadItem({
    lead,
    onDelete,
    onUpdate,
}: {
    lead: DBLead
    onDelete: (id: string) => void
    onUpdate: (updated: DBLead) => void
}) {
    const { mutateAsync: sendEmail } = useSendEmail()
    const queryClient = useQueryClient()

    function stripHtml(html: string): string {
        const div = document.createElement("div")
        div.innerHTML = html
        return div.textContent || ""
    }

    useEffect(() => {
        // Only do this once on first load
        if (!lead.email_subject && lead.email_text?.toLowerCase().startsWith("subject:")) {
            const [firstLine, ...rest] = lead.email_text.split("\n")
            const subjectLine = firstLine.replace(/^subject:\s*/i, "").trim()
            const body = rest.join("\n").trim()

            setEditedSubject(subjectLine)
            setEditedText(body)
        } else {
            setEditedSubject(lead.email_subject || "")
            setEditedText(stripHtml(lead.email_text || ""))
        }
    }, [lead])

    const [editedText, setEditedText] = useState(cleanEmailPreview(lead.email_text || ""))
    const [editedSubject, setEditedSubject] = useState(lead.email_subject || "")
    const [status, setStatus] = useState<DBLead["status"]>(lead.status)
    const [currentText, setCurrentText] = useState(lead.email_text || "")

    const editDialog = useDialog()
    const confirmDialog = useDialog()

    const { getToken } = useAuth()

    const handleUpdate = async (approve = false) => {
        const token = await getToken({ template: "supabase" })
        const supabase = getSupabaseWithAuth(token!)

        const updates: Partial<DBLead> = {
            email_text: editedText,
            email_subject: editedSubject,
            ...(approve && { status: "approved" }),
        }

        const { data, error } = await supabase
            .from("leads")
            .update(updates)
            .eq("id", lead.id)
            .select()
            .single()

        if (error) {
            toast.error("Failed to update lead")
            return
        }

        setCurrentText(editedText)
        setStatus(data.status)
        onUpdate(data)

        editDialog.close()
        toast.success(approve ? "Saved & Approved" : "Saved")
    }

    const handleDelete = async () => {
        const token = await getToken({ template: "supabase" })
        const supabase = getSupabaseWithAuth(token!)

        const { error } = await supabase.from("leads").delete().eq("id", lead.id)

        if (error) {
            toast.error("Failed to delete lead")
            return
        }

        onDelete(lead.id)
        confirmDialog.close()
        toast.success("Lead deleted")
    }

    const handleSend = async () => {
        const token = await getToken({ template: "supabase" })
        const supabase = getSupabaseWithAuth(token!)

        const trackingPixel = `<img src="${window.location.origin}/api/track/open?leadId=${lead.id}" width="1" height="1" style="display:none;" />`
        const finalEmail = `
        <p>${editedText.trim().split("\n").map(line => `${line}<br>`).join("")}</p>
        ${trackingPixel}
      `.trim()

        try {
            await sendEmail({
                to: lead.email,
                subject: lead.email_subject || `Reaching out: ${lead.company}`,
                html: finalEmail,
            })

            const { data, error } = await supabase
                .from("leads")
                .update({
                    status: "sent",
                    sent_at: new Date().toISOString(),
                    email_text: finalEmail,
                })
                .eq("id", lead.id)
                .select()
                .single()

            if (error) {
                toast.error("Failed to update status in DB")
                return
            }

            setStatus("sent")
            onUpdate(data)
            toast.success("Email sent ✅")
            queryClient.invalidateQueries({ queryKey: ["leads"] })
        } catch (err: unknown) {
            console.error(err)
            toast.error("Failed to send email")
        }
    }

    function cleanEmailPreview(html: string): string {
        return html.replace(/<img[^>]+track\/(open|click)[^>]*>/gi, "").trim()
    }

    return (
        <li className="border p-4 rounded-xl space-y-2">
            <p>
                <strong>{lead.name}</strong> — {lead.job_title} at {lead.company}
            </p>
            <p className="text-sm text-muted-foreground">{lead.email}</p>

            {/* Email preview (sanitized) */}
            <div
                className="text-sm mt-4 whitespace-pre-wrap leading-6 text-gray-800 max-w-prose"
                dangerouslySetInnerHTML={{
                    __html: cleanEmailPreview(currentText),
                }}
            />

            <p className="text-xs uppercase font-medium text-muted-foreground">Status: {status}</p>

            <LeadTrackingTimeline lead={lead} />

            <div className="flex gap-2 mt-2">
                <Dialog open={editDialog.isOpen} onOpenChange={editDialog.setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Edit</Button>
                    </DialogTrigger>

                    <Button size="sm" onClick={handleSend} disabled={status !== "approved"}>
                        Send
                    </Button>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Email</DialogTitle>
                            <DialogDescription>
                                You can personalize this cold email before sending or approving.
                            </DialogDescription>
                        </DialogHeader>

                        <Input
                            value={editedSubject}
                            onChange={(e) => setEditedSubject(e.target.value)}
                            placeholder="Email subject"
                            className="mb-4"
                        />

                        <Textarea
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="min-h-[200px]"
                        />
                        <DialogFooter className="mt-4 flex gap-2 justify-end">
                            <Button variant="secondary" onClick={() => handleUpdate(false)}>Save</Button>
                            <Button onClick={() => handleUpdate(true)}>Save & Approve</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <AlertDialog open={confirmDialog.isOpen} onOpenChange={confirmDialog.setIsOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            <Trash className="w-4 h-4 mr-1" /> Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this lead?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{lead.name}</strong> from your saved leads.
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Yes, Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </li>
    )
}

export default LeadItem

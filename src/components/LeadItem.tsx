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
import { getSupabaseWithAuth } from "@/lib/supabase"
import { DBLead } from "@/types/db"
import { useAuth } from "@clerk/clerk-react"
import { Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"

function LeadItem({
    lead,
    onDelete,
    onUpdate,
}: {
    lead: DBLead
    onDelete: (id: string) => void
    onUpdate: (updated: DBLead) => void
}) {
    const [editedText, setEditedText] = useState(lead.email_text || "")
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

    return (
        <li className="border p-4 rounded-xl space-y-2">
            <p>
                <strong>{lead.name}</strong> — {lead.job_title} at {lead.company}
            </p>
            <p className="text-sm text-muted-foreground">{lead.email}</p>
            <p className="text-sm mt-2 whitespace-pre-wrap">{currentText}</p>
            <p className="text-xs uppercase font-medium text-muted-foreground">Status: {status}</p>
            {lead.company_mission && (
                <p className="text-sm text-muted-foreground">🌱 Mission: {lead.company_mission}</p>
            )}
            {lead.recent_linkedin_post && (
                <p className="text-sm text-muted-foreground">🔗 Post: {lead.recent_linkedin_post}</p>
            )}

            <div className="flex gap-2 mt-2">
                <Dialog open={editDialog.isOpen} onOpenChange={editDialog.setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Email</DialogTitle>
                            <DialogDescription>
                                You can personalize this cold email before sending or approving.
                            </DialogDescription>
                        </DialogHeader>
                        <Textarea
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="min-h-[200px]"
                        />
                        <DialogFooter className="mt-4 flex gap-2 justify-end">
                            <Button variant="secondary" onClick={() => handleUpdate(false)}>
                                Save
                            </Button>
                            <Button onClick={() => handleUpdate(true)}>
                                Save & Approve
                            </Button>
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
                            <AlertDialogTitle>
                                Are you sure you want to delete this lead?
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{lead.name}</strong> from your saved leads.
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                                Yes, Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </li>
    )
}

export default LeadItem

import { Button } from "@/components/ui/button"
import { DBLead } from "@/types/db"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil } from "lucide-react"

export const leadColumns: ColumnDef<DBLead>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "company",
        header: "Company",
    },
    {
        accessorKey: "job_title",
        header: "Title",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const lead = row.original

            return (
                <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => lead.onView?.(lead)}>
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => lead.onEdit?.(lead)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                </div>
            )
        },
    },
]

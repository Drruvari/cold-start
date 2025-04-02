import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Upload } from "lucide-react"

interface CsvDropzoneProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
}

export const CsvDropzone = ({ onChange, className }: CsvDropzoneProps) => {
    return (
        <label
            htmlFor="csv-upload"
            className={cn(
                "group flex h-48 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted p-4 text-center transition hover:bg-muted/40",
                className
            )}
        >
            <div className="rounded-full border border-muted p-2 group-hover:border-black/70">
                <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium text-muted-foreground">
                Drag ‘n’ drop your CSV or click to browse
            </div>
            <div className="text-xs text-muted-foreground">
                Max 1 file — CSV only
            </div>
            <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={onChange}
            />
        </label>
    )
}

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@supabase/supabase-js"
import { useState } from "react"
import { toast } from "sonner";

interface Step {
    delay_days: number
    subject: string
    body: string
}

function SequenceBuilder() {
    const [steps, setSteps] = useState<Step[]>([
        { delay_days: 0, subject: "", body: "" },
    ])
    const [sequenceName, setSequenceName] = useState("")

    const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

    const addStep = () => {
        setSteps([...steps, { delay_days: 3, subject: "", body: "" }])
    }

    const updateStep = (index: number, field: string, value: string | number) => {
        setSteps((prev) =>
            prev.map((step, i) =>
                i === index ? { ...step, [field]: value } : step
            )
        )
    }

    const saveSequence = async () => {
        const { data: sequence, error } = await supabase
            .from("sequences")
            .insert({ name: sequenceName })
            .select()
            .single()

        if (error) return console.error("❌ Error saving sequence:", error)

        const stepsWithSequenceId = steps.map((s) => ({
            ...s,
            sequence_id: sequence.id,
        }))

        const { error: stepErr } = await supabase.from("sequence_steps").insert(stepsWithSequenceId)
        if (stepErr) return console.error("❌ Error saving steps:", stepErr)

        toast.success("✅ Sequence saved!")

        // Reset
        setSequenceName("")
        setSteps([{ delay_days: 0, subject: "", body: "" }])
    }

    return (
        <div className="space-y-4 max-w-xl mx-auto p-4">
            <Input
                placeholder="Sequence Name"
                value={sequenceName}
                onChange={(e) => setSequenceName(e.target.value)}
            />

            {steps.map((step, i) => (
                <div key={i} className="border p-4 rounded space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Step {i + 1}</p>

                    <Input
                        value={step.subject}
                        onChange={(e) => updateStep(i, "subject", e.target.value)}
                        placeholder="Subject"
                    />

                    <Textarea
                        value={step.body}
                        onChange={(e) => updateStep(i, "body", e.target.value)}
                        placeholder="Body"
                    />

                    <Input
                        type="number"
                        value={step.delay_days}
                        onChange={(e) => updateStep(i, "delay_days", parseInt(e.target.value))}
                        placeholder="Delay (days)"
                    />
                </div>
            ))}

            <Button onClick={addStep} variant="outline">+ Add Step</Button>
            <Button onClick={saveSequence} className="w-full">Save Sequence</Button>
        </div>
    )
}

export default SequenceBuilder

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Step {
    delay_days: number;
    subject: string;
    body: string;
}

function SequenceBuilder() {
    const [steps, setSteps] = useState([
        { delay_days: 0, subject: "", body: "" },
    ])

    const addStep = () => {
        setSteps([...steps, { delay_days: 3, subject: "", body: "" }])
    }

    const updateStep = (index: number, key: keyof Step, value: string | number) => {
        setSteps((steps: Step[]) =>
            steps.map((step, i) =>
                i === index ? { ...step, [key]: value } : step
            )
        );
    };

    return (
        <div className="space-y-4">
            {steps.map((step, i) => (
                <div key={i} className="border p-4 rounded">
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
            <Button onClick={addStep}>+ Add Step</Button>
        </div>
    )
}

export default SequenceBuilder

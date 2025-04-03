import { useMutation } from "@tanstack/react-query"

type Payload = {
    to: string
    subject: string
    html: string
}

export const useSendEmail = () => {
    return useMutation({
        mutationFn: async (payload: Payload) => {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error?.message || "Email failed")
            }

            return res.json()
        },
    })
}

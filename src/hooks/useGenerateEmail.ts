import { BASE_PROMPT } from "@/lib/prompt"
import { UINewLead } from "@/types/leads"
import { useMutation } from "@tanstack/react-query"

export const useGenerateEmail = () => {
    return useMutation({
        mutationFn: async (lead: UINewLead) => {
            const prompt = BASE_PROMPT(lead)

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                    "HTTP-Referer": "http://localhost:5173", // Required by OpenRouter
                    "X-Title": "cold-email-engine"
                },
                body: JSON.stringify({
                    model: "mistralai/mistral-small-3.1-24b-instruct:free", // free fast model
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            })

            const data = await response.json()
            const generated = data?.choices?.[0]?.message?.content || ""
            return generated.trim()
        }
    })
}

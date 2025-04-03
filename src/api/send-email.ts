import { sendEmail } from "@/lib/sendEmail"
import { Request, Response } from "express"

export const sendEmailHandler = async (req: Request, res: Response): Promise<void> => {
    const { to, subject, html } = req.body

    if (!to || !subject || !html) {
        res.status(400).json({ error: "Missing required fields" })
        return
    }

    try {
        const result = await sendEmail({ to, subject, html })

        res.status(200).json({ success: true, result })
    } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong"
        res.status(500).json({ error: message })
    }
}

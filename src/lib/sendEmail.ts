import dotenv from "dotenv"
import { Resend } from "resend"

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY!)

export const sendEmail = async ({
    to,
    subject,
    html,
}: {
    to: string
    subject: string
    html: string
}) => {
    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev", // use a verified domain or `onboarding@resend.dev`
        to,
        subject,
        html,
    })

    if (error) throw new Error(error.message)
    return data
}

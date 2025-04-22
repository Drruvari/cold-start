import { sendEmail } from "@/lib/sendEmail";
import { Request, Response } from "express"; // Assuming you're using Express.js

// Handler for sending emails
const sendEmailHandler = async (req: Request, res: Response): Promise<void> => {
    // Allow only POST requests
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ error: "Method Not Allowed" });
        return;
    }

    const { to, subject, html } = req.body;

    // Validate required fields
    if (!to || !subject || !html) {
        res.status(400).json({ error: "Missing required fields: 'to', 'subject', or 'html'" });
        return;
    }

    try {
        // Construct tracking URL using request origin or environment variable
        const baseUrl = req.headers.origin || process.env.BASE_URL;
        if (!baseUrl) {
            throw new Error("BASE_URL is not defined in the environment variables");
        }

        // Send the email
        const result = await sendEmail({ to, subject, html });

        // Respond with success
        res.status(200).json({ success: true, result });
    } catch (err) {
        // Handle errors gracefully
        const message = err instanceof Error ? err.message : "An unexpected error occurred";
        res.status(500).json({ error: message });
    }
};

export default sendEmailHandler;

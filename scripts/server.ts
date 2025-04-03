import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { sendEmailHandler } from "../src/api/send-email"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8787

app.use(cors())
app.use(express.json())

app.post("/api/send-email", sendEmailHandler) // ✅ now this will work

app.listen(PORT, () => {
    console.log(`✅ Email server running at http://localhost:${PORT}`)
})

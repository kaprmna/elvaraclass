let messages = [
  { id: 1, message: "ELVARAAAA", timestamp: "2026-02-19T11:57:31.860Z" },
  { id: 2, message: "ELVARA JAYAAAAA!!!", timestamp: "2026-02-19T15:54:22.837Z" },
  { id: 3, message: "Nengah Dester", timestamp: "2026-02-19T16:19:00.284Z" },
  { id: 4, message: "TEMBEM", timestamp: "2026-02-19T20:09:32.253Z" },
  { id: 5, message: "🎸🥰", timestamp: "2026-02-19T20:10:56.071Z" },
  { id: 6, message: "hbd🥳", timestamp: "2026-02-19T20:13:22.994Z" },
  { id: 7, message: "kerennn", timestamp: "2026-02-19T20:17:18.026Z" },
  { id: 8, message: "😂😂😂😂", timestamp: "2026-02-19T20:19:24.594Z" },
  { id: 9, message: "El Nino", timestamp: "2026-02-19T20:43:05.373Z" },
  { id: 10, message: "imut", timestamp: "2026-02-19T20:43:05.373Z" },
  { id: 11, message: "siapa buat ni?", timestamp: "2026-02-20T16:39:21.035Z" },
  { id: 12, message: "Dika Budi yg buat", timestamp: "2026-02-20T18:58:54.298Z" },
  { id: 13, message: "ah ah ah", timestamp: "2026-02-20T18:59:58.080Z" },
  { id: 14, message: "Kawiy diem", timestamp: "2026-02-20T19:02:14.707Z" }
]

export default async function handler(req, res) {

  if (req.method === "GET") {
    return res.status(200).json(messages)
  }

  if (req.method === "POST") {

    const { message } = req.body
    if (!message) {
      return res.status(400).json({ error: "Message required" })
    }

    const newMessage = {
      id: Date.now(),
      message,
      timestamp: new Date().toISOString(),
    }

    messages.push(newMessage)

    try {
      // kirim file JSON ke Discord
      const jsonContent = JSON.stringify(messages, null, 2)

      const formData = new FormData()
      formData.append("file", new Blob([jsonContent], { type: "application/json" }), "chat-backup.json")
      formData.append("payload_json", JSON.stringify({
        content: "📦 Chat Backup Updated"
      }))

      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        body: formData
      })

    } catch (err) {
      console.error("Discord backup failed:", err)
    }

    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
import { createClient } from '@supabase/supabase-js'

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

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('chat')
      .select('*')
      .order('id', { ascending: true })

    if (error) return res.status(500).json({ error })

    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: "Message required" })
    }

    const { data, error } = await supabase
      .from('chat')
      .insert([{ message }])
      .select()

    if (error) return res.status(500).json({ error })

    await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `💬 New Chat\nMessage: ${message}\nTime: ${new Date().toISOString()}`
      })
    })

    return res.status(200).json(data)
  }

  res.status(405).json({ error: "Method not allowed" })
}
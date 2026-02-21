import { createClient } from '@supabase/supabase-js'

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
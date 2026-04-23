import { Resend } from 'resend'

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { to, subject, html } = req.body
    if (!to || !subject || !html) return res.status(400).json({ error: 'Missing fields' })
    const { data, error } = await resend.emails.send({
      from: 'ChoirOS <noreply@choiros.app>',
      to, subject, html
    })
    if (error) return res.status(500).json({ error })
    return res.status(200).json({ data })
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Unknown error' })
  }
}

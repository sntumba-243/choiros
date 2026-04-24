import { applyCors, handleOptions } from './_utils/cors'
import { provisionAccount } from './_utils/provision'

export default async function handler(req: any, res: any) {
  applyCors(res)
  if (handleOptions(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { email, password, choirName, adminName, timezone } = req.body
    if (!email || !password || !choirName || !adminName) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const result = await provisionAccount({
      email,
      password,
      adminName,
      choirName,
      timezone,
      plan: 'free',
    })
    return res.status(200).json({ success: true, ...result })
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Unknown error' })
  }
}

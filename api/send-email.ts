import { Resend } from 'resend'

// To enable custom email sending from welcome@choiros.app:
//   1. Go to https://resend.com/domains
//   2. Add choiros.app as a sending domain
//   3. Add the DNS records shown to Cloudflare DNS
//   4. Once verified, update the `from` address below to noreply@choiros.app
//
// Until the domain is verified, this endpoint returns { skipped: true } so
// callers do not fail. Supabase's built-in transactional email handles
// password recovery / welcome flows in the meantime.

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('send-email: RESEND_API_KEY not configured, skipping')
      return res.status(200).json({ skipped: true, reason: 'resend_not_configured' })
    }

    const { to, subject, html } = req.body || {}
    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const resend = new Resend(apiKey)

    const { data, error } = await resend.emails.send({
      from: 'ChoirOS <onboarding@resend.dev>',
      to,
      subject,
      html,
    })

    if (error) {
      console.error('send-email: resend error', error)
      return res.status(200).json({ skipped: true, error: String(error.message || error) })
    }

    return res.status(200).json({ data })
  } catch (err: any) {
    console.error('send-email: unhandled error', err)
    return res.status(200).json({ skipped: true, error: err?.message || 'Unknown error' })
  }
}

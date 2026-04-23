import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) return res.status(500).json({ error: 'Server configuration error' })

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const { email, password, choirName, adminName, timezone } = req.body
    if (!email || !password || !choirName || !adminName) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    if (authError) return res.status(400).json({ error: authError.message })

    const userId = authData.user.id
    const slug = choirName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({ name: choirName, slug, plan: 'free', subscription_status: 'active', member_limit: 15, choir_limit: 1 })
      .select().single()
    if (orgError) return res.status(500).json({ error: orgError.message })

    const { data: choir, error: choirError } = await supabase
      .from('choirs')
      .insert({ organization_id: org.id, name: choirName, timezone: timezone || 'America/New_York' })
      .select().single()
    if (choirError) return res.status(500).json({ error: choirError.message })

    const nameParts = adminName.trim().split(' ')
    const { error: memberError } = await supabase
      .from('members')
      .insert({
        choir_id: choir.id,
        organization_id: org.id,
        user_id: userId,
        first_name: nameParts[0] || adminName,
        last_name: nameParts.slice(1).join(' ') || '',
        email,
        role: 'admin',
        status: 'active',
      })
    if (memberError) return res.status(500).json({ error: memberError.message })

    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const emailResult = await resend.emails.send({
        from: 'ChoirOS <noreply@choiros.app>',
        to: email,
        subject: 'Welcome to ChoirOS!',
        html: '<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px"><h1 style="color:#1a2744">Welcome to ChoirOS! 🎵</h1><p style="color:#4b5563;font-size:16px">Hi ' + adminName + ',</p><p style="color:#4b5563;font-size:16px">Your choir <strong>' + choirName + '</strong> is ready. Log in to get started.</p><a href="https://choiros.app/login" style="display:inline-block;background:#1a2744;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;margin:16px 0">Log in to ChoirOS</a><p style="color:#9ca3af;font-size:14px;margin-top:32px">© 2026 ChoirOS by iSpeed Tech</p></div>'
      })
      console.log('Welcome email result:', JSON.stringify(emailResult))
    } catch (emailErr: any) {
      console.error('Welcome email error:', emailErr?.message)
    }

    return res.status(200).json({ success: true, choirId: choir.id })

  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Unknown error' })
  }
}

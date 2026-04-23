import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || `choir-${Date.now()}`
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', process.env.VITE_APP_URL || 'https://choiros.app')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { email, password, choirName, adminName, timezone } = req.body || {}
    if (!email || !password || !choirName || !adminName) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    if (authError) return res.status(400).json({ error: authError.message })

    const userId = authData.user!.id

    const { data: org, error: orgErr } = await supabase
      .from('organizations')
      .insert({
        name: choirName,
        slug: slugify(choirName),
        plan: 'free',
        subscription_status: 'active',
        member_limit: 15,
        choir_limit: 1,
      })
      .select()
      .single()
    if (orgErr) return res.status(500).json({ error: orgErr.message })

    const { data: choir, error: choirErr } = await supabase
      .from('choirs')
      .insert({
        organization_id: org.id,
        name: choirName,
        timezone: timezone || 'America/New_York',
      })
      .select()
      .single()
    if (choirErr) return res.status(500).json({ error: choirErr.message })

    const nameParts = (adminName || '').trim().split(/\s+/)
    const firstName = nameParts[0] || email.split('@')[0]
    const lastName = nameParts.slice(1).join(' ')

    const { error: memberErr } = await supabase.from('members').insert({
      choir_id: choir.id,
      organization_id: org.id,
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      email,
      role: 'admin',
      status: 'active',
    })
    if (memberErr) return res.status(500).json({ error: memberErr.message })

    return res.status(200).json({ success: true })
  } catch (err: any) {
    console.error('free-signup error', err)
    return res.status(500).json({ error: err.message || 'Internal error' })
  }
}

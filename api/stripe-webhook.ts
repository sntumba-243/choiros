import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
})

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

function randomPassword(length = 16): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'
  let out = ''
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || `choir-${Date.now()}`
}

async function readRawBody(req: any): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

async function sendWelcomeEmail(email: string, adminName: string, choirName: string) {
  if (!resend) return
  try {
    await resend.emails.send({
      from: 'ChoirOS <welcome@choiros.app>',
      to: email,
      subject: `Welcome to ChoirOS, ${choirName}!`,
      html: `<div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#1e293b">
        <h1 style="color:#0C447C">Welcome to ChoirOS</h1>
        <p>Hi ${adminName || 'there'},</p>
        <p>Your 30-day free trial of ChoirOS is active and <strong>${choirName}</strong> is ready to go.</p>
        <p>We just sent a separate email with a link to set your password and sign in.</p>
        <p>Sing well,<br/>The ChoirOS team</p>
      </div>`,
    })
  } catch (e) {
    console.error('welcome email failed', e)
  }
}

async function provisionAccount(params: {
  email: string
  choirName: string
  adminName: string
  timezone?: string
  plan: 'starter' | 'growth' | 'network'
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}) {
  const { email, choirName, adminName, timezone, plan, stripeCustomerId, stripeSubscriptionId } = params

  const { data: existing } = await supabase.auth.admin.listUsers()
  const existingUser = existing?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase())

  let userId = existingUser?.id
  if (!userId) {
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      password: randomPassword(16),
    })
    if (authErr) throw authErr
    userId = authData.user!.id
  }

  const memberLimits: Record<string, number | null> = {
    starter: 50,
    growth: null,
    network: null,
  }
  const choirLimits: Record<string, number> = {
    starter: 1,
    growth: 1,
    network: 10,
  }

  const trialEnds = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .insert({
      name: choirName,
      slug: slugify(choirName),
      plan,
      subscription_status: 'trialing',
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      trial_ends_at: trialEnds,
      member_limit: memberLimits[plan],
      choir_limit: choirLimits[plan],
    })
    .select()
    .single()
  if (orgErr) throw orgErr

  const { data: choir, error: choirErr } = await supabase
    .from('choirs')
    .insert({
      organization_id: org.id,
      name: choirName,
      timezone: timezone || 'America/New_York',
    })
    .select()
    .single()
  if (choirErr) throw choirErr

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
  if (memberErr) throw memberErr

  try {
    await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: `${process.env.VITE_APP_URL || 'https://choiros.app'}/login` },
    })
  } catch (e) {
    console.error('recovery link failed', e)
  }

  await sendWelcomeEmail(email, adminName, choirName)
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end()

  const signature = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signature || !webhookSecret) {
    return res.status(400).json({ error: 'Missing signature or secret' })
  }

  let event: Stripe.Event
  try {
    const rawBody = await readRawBody(req)
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err: any) {
    console.error('webhook signature error', err.message)
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const md = session.metadata || {}
        const plan = (md.plan as 'starter' | 'growth' | 'network') || 'starter'
        await provisionAccount({
          email: md.email || session.customer_email || '',
          choirName: md.choirName || 'My Choir',
          adminName: md.adminName || '',
          timezone: md.timezone,
          plan,
          stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
          stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : undefined,
        })
        break
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const status = sub.status
        const mapped =
          status === 'trialing' || status === 'active' ? status
          : status === 'past_due' ? 'past_due'
          : 'canceled'
        await supabase
          .from('organizations')
          .update({ subscription_status: mapped })
          .eq('stripe_subscription_id', sub.id)
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await supabase
          .from('organizations')
          .update({ subscription_status: 'canceled' })
          .eq('stripe_subscription_id', sub.id)
        break
      }
      default:
        break
    }
    return res.status(200).json({ received: true })
  } catch (err: any) {
    console.error('webhook handler error', err)
    return res.status(500).json({ error: err.message || 'Internal error' })
  }
}

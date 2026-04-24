import Stripe from 'stripe'
import { createServerSupabase } from './_utils/supabase'
import { provisionAccount } from './_utils/provision'

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
})

async function readRawBody(req: any): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
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

  const supabase = createServerSupabase()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const subscriptionId =
          typeof session.subscription === 'string' ? session.subscription : undefined

        if (subscriptionId) {
          const { data: existing } = await supabase
            .from('organizations')
            .select('id')
            .eq('stripe_subscription_id', subscriptionId)
            .single()
          if (existing) {
            console.log('Webhook already processed for subscription:', subscriptionId)
            return res.status(200).json({ received: true })
          }
        }

        const md = session.metadata || {}
        const plan = (md.plan as 'starter' | 'growth' | 'network') || 'starter'
        await provisionAccount({
          email: md.email || session.customer_email || '',
          choirName: md.choirName || 'My Choir',
          adminName: md.adminName || '',
          timezone: md.timezone,
          plan,
          stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
          stripeSubscriptionId: subscriptionId,
        })
        break
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const status = sub.status
        const mapped =
          status === 'trialing' || status === 'active'
            ? status
            : status === 'past_due'
              ? 'past_due'
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

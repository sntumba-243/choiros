import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
})

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', process.env.VITE_APP_URL || 'https://choiros.app')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { plan, email, choirName, adminName, choirSize, timezone } = req.body || {}

    if (!plan || !email || !choirName) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const PRICE_IDS: Record<string, string | undefined> = {
      starter: process.env.STRIPE_STARTER_PRICE_ID,
      growth: process.env.STRIPE_GROWTH_PRICE_ID,
      network: process.env.STRIPE_NETWORK_PRICE_ID,
    }

    const priceId = PRICE_IDS[plan]
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid plan' })
    }

    const appUrl = process.env.VITE_APP_URL || 'https://choiros.app'

    const metadata = {
      choirName: String(choirName),
      adminName: String(adminName ?? ''),
      email: String(email),
      choirSize: String(choirSize ?? ''),
      timezone: String(timezone ?? ''),
      plan: String(plan),
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      metadata,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 30,
        metadata,
      },
      success_url: `${appUrl}/register/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/register`,
    })

    return res.status(200).json({ url: session.url })
  } catch (err: any) {
    console.error('create-checkout error:', err)
    return res.status(500).json({ error: err.message || 'Internal error' })
  }
}

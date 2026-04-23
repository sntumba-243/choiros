export type PlanId = 'free' | 'starter' | 'growth' | 'network'

export interface Plan {
  id: PlanId
  name: string
  price: number
  priceId: string
  memberLimit: number | null
  choirLimit: number
  features: string[]
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: import.meta.env.VITE_STRIPE_FREE_PRICE_ID,
    memberLimit: 15,
    choirLimit: 1,
    features: [
      '1 choir',
      'Up to 15 members',
      'Basic scheduling',
      'Member directory',
      'Email support',
    ],
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 19,
    priceId: import.meta.env.VITE_STRIPE_STARTER_PRICE_ID,
    memberLimit: 50,
    choirLimit: 1,
    features: [
      '1 choir',
      'Up to 50 members',
      'Sheet music library',
      'QR attendance',
      'Event management',
      'Priority support',
    ],
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    price: 39,
    priceId: import.meta.env.VITE_STRIPE_GROWTH_PRICE_ID,
    memberLimit: null,
    choirLimit: 1,
    features: [
      '1 choir',
      'Unlimited members',
      'AI vocal coach',
      'Audio practice tracks',
      'Advanced analytics',
      'Priority support',
    ],
  },
  network: {
    id: 'network',
    name: 'Network',
    price: 79,
    priceId: import.meta.env.VITE_STRIPE_NETWORK_PRICE_ID,
    memberLimit: null,
    choirLimit: 10,
    features: [
      'Up to 10 choirs',
      'Unlimited members',
      'All Growth features',
      'Multi-choir management',
      'Custom branding',
      'Dedicated support',
    ],
  },
}

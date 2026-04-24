import { createServerSupabase } from './supabase'
import { sendWelcomeEmail } from './email'

export interface ProvisionInput {
  email: string
  password?: string
  adminName: string
  choirName: string
  timezone?: string
  plan: 'free' | 'starter' | 'growth' | 'network'
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  subscriptionStatus?: string
}

export interface ProvisionResult {
  userId: string
  orgId: string
  choirId: string
  memberId: string
}

export async function provisionAccount(input: ProvisionInput): Promise<ProvisionResult> {
  const supabase = createServerSupabase()
  const { email, adminName, choirName, timezone, plan, stripeCustomerId, stripeSubscriptionId } = input

  const userPayload: { email: string; email_confirm: boolean; password?: string } = {
    email,
    email_confirm: true,
  }
  if (input.password) userPayload.password = input.password

  const { data: authData, error: authError } = await supabase.auth.admin.createUser(userPayload)
  if (authError || !authData?.user) throw new Error('Auth error: ' + (authError?.message || 'unknown'))
  const userId = authData.user.id

  const slug =
    choirName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') +
    '-' +
    Date.now()

  const planLimits: Record<string, { member_limit: number | null; choir_limit: number }> = {
    free: { member_limit: 15, choir_limit: 1 },
    starter: { member_limit: 50, choir_limit: 1 },
    growth: { member_limit: null, choir_limit: 1 },
    network: { member_limit: null, choir_limit: 10 },
  }
  const limits = planLimits[plan] || planLimits.free

  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name: choirName,
      slug,
      plan,
      subscription_status:
        input.subscriptionStatus || (plan === 'free' ? 'active' : 'trialing'),
      stripe_customer_id: stripeCustomerId || null,
      stripe_subscription_id: stripeSubscriptionId || null,
      trial_ends_at:
        plan === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      member_limit: limits.member_limit,
      choir_limit: limits.choir_limit,
    })
    .select()
    .single()
  if (orgError) throw new Error('Org error: ' + orgError.message)

  const { data: choir, error: choirError } = await supabase
    .from('choirs')
    .insert({
      organization_id: org.id,
      name: choirName,
      timezone: timezone || 'America/New_York',
    })
    .select()
    .single()
  if (choirError) throw new Error('Choir error: ' + choirError.message)

  const nameParts = adminName.trim().split(' ')
  const { data: member, error: memberError } = await supabase
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
    .select()
    .single()
  if (memberError) throw new Error('Member error: ' + memberError.message)

  await sendWelcomeEmail(email, adminName, choirName)

  return { userId, orgId: org.id, choirId: choir.id, memberId: member.id }
}

import { createClient } from '@supabase/supabase-js'

export default async function handler(req: any, res: any) {
  const appUrl = (process.env.VITE_APP_URL || 'https://choiros.app').trim()
  res.setHeader('Access-Control-Allow-Origin', appUrl)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const url = (process.env.SUPABASE_URL || '').trim()
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  if (!url || !serviceKey) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const supabaseAdmin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      voicePart,
      role,
      choirId,
      organizationId,
      choirName,
    } = req.body || {}

    if (!email || !choirId || !organizationId) {
      return res.status(400).json({ error: 'email, choirId and organizationId are required' })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const firstNameClean = (firstName || '').trim()
    const lastNameClean = (lastName || '').trim()

    const memberPayload: Record<string, any> = {
      choir_id: choirId,
      organization_id: organizationId,
      first_name: firstNameClean || normalizedEmail.split('@')[0],
      last_name: lastNameClean,
      email: normalizedEmail,
      phone: phone ? String(phone).trim() : null,
      voice_part: voicePart || null,
      role: role || 'member',
      status: 'active',
    }

    // CASE 4 (orphan): existing member row for this email+choir with no user_id.
    // We will invite/link instead of erroring or inserting a duplicate.
    const { data: orphanMember } = await supabaseAdmin
      .from('members')
      .select('id, user_id')
      .eq('email', normalizedEmail)
      .eq('choir_id', choirId)
      .is('user_id', null)
      .maybeSingle()

    // Step 1: try to invite a brand-new auth user.
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      normalizedEmail,
      {
        redirectTo: appUrl + '/login',
        data: {
          first_name: firstNameClean,
          last_name: lastNameClean,
        },
      },
    )

    let userId: string | undefined = inviteData?.user?.id
    let authWasNew = !inviteError && !!inviteData?.user?.id

    if (inviteError) {
      const alreadyExists = inviteError.message.toLowerCase().includes('already')
      if (!alreadyExists) {
        return res.status(400).json({ error: inviteError.message })
      }
      // Look up existing auth user by email.
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find(
        (u) => u.email?.toLowerCase() === normalizedEmail,
      )
      if (!existingUser) {
        return res.status(400).json({ error: 'User exists but could not be located' })
      }
      userId = existingUser.id
      authWasNew = false
    }

    if (!userId) {
      return res.status(500).json({ error: 'No user id after invite' })
    }

    // Orphan case: update the existing member row with the new user_id.
    if (orphanMember) {
      const { data: updatedMember, error: updateError } = await supabaseAdmin
        .from('members')
        .update({
          user_id: userId,
          first_name: firstNameClean || undefined,
          last_name: lastNameClean || undefined,
          phone: memberPayload.phone,
          voice_part: memberPayload.voice_part,
          role: memberPayload.role,
        })
        .eq('id', orphanMember.id)
        .select()
        .single()
      if (updateError) {
        return res.status(500).json({ error: updateError.message })
      }
      return res.status(200).json({
        member: updatedMember,
        invited: authWasNew,
        message:
          (firstNameClean || 'The member') +
          ' has been re-invited to ' +
          (choirName || 'your choir') +
          '. They will receive an email to set their password.',
      })
    }

    // Check if they're already a fully-linked member of this choir.
    const { data: existingMember } = await supabaseAdmin
      .from('members')
      .select('id')
      .eq('user_id', userId)
      .eq('choir_id', choirId)
      .maybeSingle()
    if (existingMember) {
      return res
        .status(409)
        .json({ error: 'This person is already a member of your choir.' })
    }

    // Insert the new member record.
    const { data: member, error: memberError } = await supabaseAdmin
      .from('members')
      .insert({ ...memberPayload, user_id: userId })
      .select()
      .single()

    if (memberError) {
      // Rollback only if we just created the auth user. Never delete an existing account.
      if (authWasNew) {
        await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => {})
      }
      return res.status(500).json({ error: memberError.message })
    }

    return res.status(200).json({
      member,
      invited: authWasNew,
      message: authWasNew
        ? (firstNameClean || 'They') +
          ' has been invited to join ' +
          (choirName || 'your choir') +
          '. They will receive an email to set their password.'
        : (firstNameClean || 'They') + ' has been added to ' + (choirName || 'your choir') + '.',
    })
  } catch (err: any) {
    console.error('invite-member error:', err)
    return res.status(500).json({ error: err?.message || 'Internal server error' })
  }
}

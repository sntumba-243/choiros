import { Resend } from 'resend'

export async function sendWelcomeEmail(
  to: string,
  adminName: string,
  choirName: string,
  loginLink?: string,
) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'ChoirOS <noreply@choiros.app>',
      to,
      subject: 'Welcome to ChoirOS! 🎵',
      html: generateWelcomeHtml(adminName, choirName, loginLink),
    })
  } catch (err) {
    console.error('Welcome email failed:', err)
  }
}

function generateWelcomeHtml(adminName: string, choirName: string, loginLink?: string): string {
  const href = loginLink || 'https://choiros.app/login'
  return [
    '<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#fff">',
    '<div style="margin-bottom:32px"><span style="font-size:24px;font-weight:700;color:#1a2744">Choir</span><span style="font-size:24px;font-weight:700;color:#185FA5">OS</span></div>',
    '<h1 style="font-size:28px;font-weight:700;color:#1a2744;margin:0 0 16px">Welcome to ChoirOS! 🎵</h1>',
    '<p style="color:#4b5563;font-size:16px;line-height:1.6;margin:0 0 16px">Hi ' + adminName + ',</p>',
    '<p style="color:#4b5563;font-size:16px;line-height:1.6;margin:0 0 24px">Your choir <strong>' + choirName + '</strong> is ready. Sign in to get started managing your members, events, and repertoire.</p>',
    '<a href="' + href + '" style="display:inline-block;background:#1a2744;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;margin-bottom:32px">Log in to ChoirOS →</a>',
    '<hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0">',
    '<p style="color:#9ca3af;font-size:13px;margin:0">© 2026 ChoirOS by iSpeed Tech · <a href="https://choiros.app/privacy" style="color:#9ca3af">Privacy</a> · <a href="https://choiros.app/terms" style="color:#9ca3af">Terms</a></p>',
    '</div>',
  ].join('')
}

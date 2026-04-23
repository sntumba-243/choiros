import { LegalLayout } from '../components/LegalLayout'

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="April 22, 2026">
      <section>
        <h2 className="text-2xl font-semibold text-slate-800">1. Who we are</h2>
        <p>
          ChoirOS (&ldquo;ChoirOS&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is a product of iSpeed Tech. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the ChoirOS platform at choiros.app.
        </p>
        <p>
          If you have any questions, contact us at <a href="mailto:support@choiros.app" className="text-primary-600">support@choiros.app</a>.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">2. Information we collect</h2>
        <p>We collect information in the following categories:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Account data:</strong> name, email address, password (hashed), choir name, role, and billing contact details.</li>
          <li><strong>Choir content:</strong> member rosters, event schedules, sheet music, audio files, attendance records, and messages you upload.</li>
          <li><strong>Usage data:</strong> device type, browser, IP address, pages visited, and interactions with features, collected via standard web logs.</li>
          <li><strong>Payment data:</strong> subscription status and billing history. Card details are processed by Stripe and never stored by us.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">3. How we use your information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Provide, operate, and maintain the ChoirOS service.</li>
          <li>Process subscriptions, send billing receipts, and manage trials.</li>
          <li>Send service announcements, password resets, and essential notices.</li>
          <li>Improve and secure the platform, diagnose issues, and prevent abuse.</li>
          <li>Comply with applicable laws and enforce our Terms.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">4. Legal basis (GDPR)</h2>
        <p>
          If you are in the European Economic Area or the United Kingdom, we process your personal data on the following legal bases: performance of a contract (providing the service you subscribed to), legitimate interests (securing and improving the platform), consent (for optional marketing emails), and legal obligations.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">5. Your rights</h2>
        <p>Subject to applicable law, you have the right to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your personal data (&ldquo;right to be forgotten&rdquo;).</li>
          <li>Restrict or object to processing.</li>
          <li>Request portability of your data in a machine-readable format.</li>
          <li>Withdraw consent at any time where processing is based on consent.</li>
          <li>Lodge a complaint with your local data protection authority.</li>
        </ul>
        <p>To exercise any of these rights, email <a href="mailto:support@choiros.app" className="text-primary-600">support@choiros.app</a>.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">6. Cookies</h2>
        <p>
          We use strictly necessary cookies to keep you signed in and to remember your preferences. We do not use advertising cookies. You can disable cookies in your browser, but some features may stop working.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">7. Third parties we use</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Supabase</strong> — authentication, database, and file storage.</li>
          <li><strong>Stripe</strong> — payment processing and subscription billing.</li>
          <li><strong>Resend</strong> — transactional email delivery.</li>
          <li><strong>Vercel</strong> — hosting and content delivery.</li>
        </ul>
        <p>Each of these providers processes data under their own privacy policies and DPAs.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">8. Data retention</h2>
        <p>
          We keep your account and choir content for as long as your subscription is active. After cancellation, we retain data for up to 30 days in case you want to reactivate, then we permanently delete it, except where retention is required by law.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">9. International transfers</h2>
        <p>
          Your data may be transferred to, and processed in, countries other than your own. We rely on Standard Contractual Clauses and equivalent mechanisms to ensure your data remains protected.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">10. Security</h2>
        <p>
          We use industry-standard safeguards, including encryption in transit and at rest, row-level security in our database, and restricted administrative access. No method of transmission over the internet is 100% secure, so we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">11. Children</h2>
        <p>
          ChoirOS is not directed at children under 13. If a choir member is under 13, their parent or guardian must provide consent before they may use the service.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">12. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of material changes by email or through an in-app notice before the changes take effect.
        </p>
      </section>
    </LegalLayout>
  )
}

import { LegalLayout } from '../components/LegalLayout'

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" updated="April 22, 2026">
      <section>
        <h2 className="text-2xl font-semibold text-slate-800">1. Agreement</h2>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of ChoirOS (the &ldquo;Service&rdquo;), provided by iSpeed Tech (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By creating an account or using the Service, you agree to these Terms.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">2. Account and eligibility</h2>
        <p>
          You must be at least 18 years old and able to enter into a binding contract. You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">3. Subscriptions, billing, and trials</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Paid plans are billed monthly in advance. Prices are listed in USD and shown on the pricing page.</li>
          <li>New paid subscriptions include a 30-day free trial. You will not be charged during the trial and may cancel at any time before it ends.</li>
          <li>By subscribing, you authorize us and our payment processor, Stripe, to charge your chosen payment method on a recurring basis until you cancel.</li>
          <li>If payment fails, we may suspend or downgrade your account after reasonable retries.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">4. Cancellation and refunds</h2>
        <p>
          You can cancel your subscription at any time from the billing page. Cancellation takes effect at the end of the current billing period; you retain access until that date. We do not offer refunds for partial months, except where required by law.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">5. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Use the Service for any unlawful, harmful, fraudulent, or infringing purpose.</li>
          <li>Upload content you do not have the legal right to upload, including copyrighted sheet music or recordings without permission.</li>
          <li>Attempt to reverse engineer, scrape, or disrupt the Service.</li>
          <li>Send unsolicited marketing messages through the Service.</li>
          <li>Impersonate any person or misrepresent your affiliation with any organization.</li>
        </ul>
        <p>We may suspend or terminate accounts that violate these rules.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">6. Your content and data ownership</h2>
        <p>
          You retain all ownership rights in the content you upload to ChoirOS (member rosters, sheet music, events, messages, etc.). You grant us a limited license to host, display, process, and transmit that content solely to provide the Service to you.
        </p>
        <p>
          On termination, you may export your data for 30 days, after which we will permanently delete it.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">7. Service availability</h2>
        <p>
          We target 99.9% monthly uptime for the Service, measured on a rolling 30-day basis, and use reasonable commercial efforts to maintain it. Planned maintenance will be announced in advance where practical. The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis, subject to the SLA for paid plans as described in your order form, if any.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">8. Third-party services</h2>
        <p>
          The Service integrates with third-party providers (Supabase, Stripe, Resend, Vercel). Your use of those providers is also governed by their terms. We are not responsible for third-party outages or actions.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">9. Intellectual property</h2>
        <p>
          The ChoirOS brand, software, and design are owned by iSpeed Tech and protected by applicable intellectual-property laws. We grant you a non-exclusive, non-transferable right to use the Service during your subscription.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">10. Disclaimer of warranties</h2>
        <p>
          To the maximum extent permitted by law, the Service is provided without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">11. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, in no event will iSpeed Tech be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits or revenues, whether incurred directly or indirectly, arising out of your use of the Service. Our total liability for any claim arising from these Terms is limited to the amount you paid us in the 12 months preceding the event giving rise to the claim.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">12. Termination</h2>
        <p>
          You may stop using the Service at any time. We may suspend or terminate your access if you materially breach these Terms, fail to pay, or in response to legal requirements.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">13. Changes to the Service or Terms</h2>
        <p>
          We may update the Service and these Terms from time to time. For material changes, we will give you reasonable advance notice by email or in-app notice. Continued use after the effective date constitutes acceptance.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800">14. Contact</h2>
        <p>
          Questions about these Terms? Email <a href="mailto:support@choiros.app" className="text-primary-600">support@choiros.app</a>.
        </p>
      </section>
    </LegalLayout>
  )
}

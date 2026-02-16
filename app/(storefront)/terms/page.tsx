import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Legal
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            Terms of Service
          </h1>
          <p className="mt-2 text-slate-500">
            Last updated: February 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-950">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using {APP_NAME} (&quot;the Platform&quot;),
              you agree to be bound by these Terms of Service. If you do not
              agree, you may not use the Platform.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              {APP_NAME} is a procurement platform connecting building
              contractors in Ghana with verified material suppliers. We
              facilitate:
            </p>
            <ul>
              <li>Catalog browsing and wholesale price discovery.</li>
              <li>Proforma invoice generation with time-limited pricing.</li>
              <li>Stakeholder approval workflows.</li>
              <li>Payment processing and order fulfillment coordination.</li>
            </ul>

            <h2>3. User Accounts</h2>
            <ul>
              <li>
                You must provide accurate and complete information when
                registering.
              </li>
              <li>
                You are responsible for maintaining the security of your account
                credentials.
              </li>
              <li>
                You must be at least 18 years old and legally able to enter into
                contracts in Ghana.
              </li>
              <li>
                One person or business may not maintain more than one account
                without our prior approval.
              </li>
            </ul>

            <h2>4. Proformas and Pricing</h2>
            <ul>
              <li>
                Prices displayed on the Platform are wholesale indicative prices
                and are subject to change without notice.
              </li>
              <li>
                Once a proforma is generated, the prices listed are locked for 7
                calendar days. After expiry, a new proforma must be generated.
              </li>
              <li>
                A proforma is not a binding contract until the associated order
                is confirmed and paid.
              </li>
              <li>
                All prices are quoted in Ghana Cedis (GH¢) and include
                applicable taxes unless otherwise stated.
              </li>
            </ul>

            <h2>5. Orders and Payment</h2>
            <ul>
              <li>
                An order is confirmed once payment has been successfully
                processed through our payment provider (Paystack).
              </li>
              <li>
                We reserve the right to cancel orders due to pricing errors,
                stock unavailability, or suspected fraud.
              </li>
              <li>
                Refunds for cancelled orders will be processed within 5–7
                business days to the original payment method.
              </li>
            </ul>

            <h2>6. Delivery</h2>
            <ul>
              <li>
                Delivery timelines are estimates and not guarantees unless
                covered by an Enterprise SLA.
              </li>
              <li>
                Risk of loss transfers to you upon delivery to the specified
                site address.
              </li>
              <li>
                You must inspect materials upon delivery. Claims for damage must
                be reported within 24 hours.
              </li>
              <li>
                We are not responsible for delays caused by force majeure,
                including but not limited to weather, road conditions, or
                government action.
              </li>
            </ul>

            <h2>7. Supplier Relationships</h2>
            <p>
              {APP_NAME} acts as a marketplace intermediary. While we vet all
              suppliers, the contractual relationship for material supply is
              between you and the supplier. We coordinate fulfillment but do not
              manufacture or warehouse materials.
            </p>

            <h2>8. Intellectual Property</h2>
            <p>
              All content, branding, software, and design on the Platform are
              owned by {APP_NAME} or its licensors. You may not copy,
              reproduce, or distribute any part of the Platform without written
              permission.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, {APP_NAME} shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising from your use of the Platform.
            </p>
            <p>
              Our total liability for any claim shall not exceed the amount you
              paid to us in the 12 months preceding the claim.
            </p>

            <h2>10. Termination</h2>
            <p>
              We may suspend or terminate your account at any time for violation
              of these terms. You may close your account by contacting us. Upon
              termination, your right to use the Platform ceases immediately.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Republic of Ghana. Any
              disputes shall be resolved through arbitration in Accra, Ghana.
            </p>

            <h2>12. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Material changes will
              be communicated via email. Continued use after changes constitutes
              acceptance.
            </p>

            <h2>13. Contact</h2>
            <p>
              Questions about these Terms? Contact us at{" "}
              <a href="mailto:primebuild@gmail.com">
                primebuild@gmail.com
              </a>{" "}
              or visit our <Link href="/contact">Contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

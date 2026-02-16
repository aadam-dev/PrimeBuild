import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Legal
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            Privacy Policy
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
            <h2>1. Introduction</h2>
            <p>
              {APP_NAME} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
              operates the primebuild.com.gh website and related services. This
              Privacy Policy describes how we collect, use, and protect your
              personal information when you use our platform.
            </p>
            <p>
              By using {APP_NAME}, you agree to the collection and use of
              information in accordance with this policy.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>Information You Provide</h3>
            <ul>
              <li>
                <strong>Account information:</strong> Name, email address, phone
                number, and company name when you register.
              </li>
              <li>
                <strong>Order information:</strong> Shipping addresses, project
                names, and material quantities when you create proformas or
                place orders.
              </li>
              <li>
                <strong>Communication data:</strong> Messages you send through
                our contact form or WhatsApp integration.
              </li>
            </ul>
            <h3>Information Collected Automatically</h3>
            <ul>
              <li>
                <strong>Usage data:</strong> Pages visited, features used, and
                time spent on the platform.
              </li>
              <li>
                <strong>Device information:</strong> Browser type, operating
                system, and screen resolution.
              </li>
              <li>
                <strong>Cookies:</strong> Session and preference cookies as
                described in our{" "}
                <Link href="/cookies">Cookie Policy</Link>.
              </li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Process and fulfill your orders and proforma requests.</li>
              <li>
                Send transactional notifications (order confirmations, delivery
                updates) via email and WhatsApp.
              </li>
              <li>Improve our platform, catalog, and user experience.</li>
              <li>
                Provide customer support and respond to your inquiries.
              </li>
              <li>
                Detect and prevent fraud or unauthorized access.
              </li>
            </ul>

            <h2>4. Information Sharing</h2>
            <p>
              We do not sell your personal information. We share data only with:
            </p>
            <ul>
              <li>
                <strong>Suppliers:</strong> Order details are shared with
                verified suppliers to fulfill your orders.
              </li>
              <li>
                <strong>Payment processors:</strong> Paystack processes your
                payments securely. We do not store card details.
              </li>
              <li>
                <strong>Service providers:</strong> Hosting (Vercel), email
                (Resend), and analytics services that help us operate the
                platform.
              </li>
              <li>
                <strong>Legal requirements:</strong> When required by law or to
                protect our rights.
              </li>
            </ul>

            <h2>5. Data Security</h2>
            <p>
              We implement industry-standard security measures including
              encrypted connections (TLS/SSL), secure authentication, and access
              controls. However, no method of transmission over the internet is
              100% secure.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active.
              Order and proforma records are kept for a minimum of 6 years for
              accounting and legal compliance. You can request deletion of your
              account by contacting us.
            </p>

            <h2>7. Your Rights</h2>
            <p>Under the Ghana Data Protection Act, 2012 (Act 843), you have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data (subject to legal obligations).</li>
              <li>Object to processing of your data for marketing purposes.</li>
            </ul>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes via email or a notice on our
              platform.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, contact us at{" "}
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

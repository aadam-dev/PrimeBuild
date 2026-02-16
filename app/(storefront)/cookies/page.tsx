import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Legal
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            Cookie Policy
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
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a
              website. They help the site remember your preferences and improve
              your experience.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>{APP_NAME} uses the following types of cookies:</p>

            <h3>Essential Cookies</h3>
            <p>
              These are required for the Platform to function. They enable core
              features like user authentication, session management, and
              security.
            </p>
            <div className="rounded-xl border border-slate-200 overflow-hidden not-prose">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-slate-950">Cookie</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-950">Purpose</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-950">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">session_token</td>
                    <td className="px-4 py-3 text-slate-600">Keeps you signed in</td>
                    <td className="px-4 py-3 text-slate-600">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">csrf_token</td>
                    <td className="px-4 py-3 text-slate-600">Prevents cross-site request forgery</td>
                    <td className="px-4 py-3 text-slate-600">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">cart_data</td>
                    <td className="px-4 py-3 text-slate-600">Stores guest cart items</td>
                    <td className="px-4 py-3 text-slate-600">30 days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Analytics Cookies</h3>
            <p>
              We use analytics cookies to understand how visitors use our
              Platform. This data is aggregated and anonymized.
            </p>
            <div className="rounded-xl border border-slate-200 overflow-hidden not-prose">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-slate-950">Cookie</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-950">Purpose</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-950">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">_ga</td>
                    <td className="px-4 py-3 text-slate-600">Google Analytics visitor tracking</td>
                    <td className="px-4 py-3 text-slate-600">2 years</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">_gid</td>
                    <td className="px-4 py-3 text-slate-600">Google Analytics session tracking</td>
                    <td className="px-4 py-3 text-slate-600">24 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>3. Managing Cookies</h2>
            <p>
              You can control cookies through your browser settings. Most
              browsers allow you to:
            </p>
            <ul>
              <li>View what cookies are stored and delete them individually.</li>
              <li>Block third-party cookies.</li>
              <li>Block cookies from specific sites.</li>
              <li>Block all cookies.</li>
              <li>Delete all cookies when you close your browser.</li>
            </ul>
            <p>
              <strong>Note:</strong> Blocking essential cookies will prevent you
              from using key features like signing in and adding items to your
              cart.
            </p>

            <h2>4. Third-Party Cookies</h2>
            <p>
              Our payment provider (Paystack) may set cookies during the
              checkout process. These are governed by{" "}
              <a
                href="https://paystack.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Paystack&apos;s Privacy Policy
              </a>
              .
            </p>

            <h2>5. Updates</h2>
            <p>
              We may update this Cookie Policy as our use of cookies evolves.
              Changes will be posted on this page with an updated date.
            </p>

            <h2>6. Contact</h2>
            <p>
              Questions about our use of cookies? Email{" "}
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

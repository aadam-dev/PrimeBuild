import type { Metadata } from "next";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Building,
} from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = { title: "Contact Us" };

const offices = [
  {
    city: "Accra",
    address: "15 Independence Ave, Ridge",
    region: "Greater Accra Region",
    phone: CONTACT.accraPhone,
  },
  {
    city: "Kumasi",
    address: "Asafo Market Road, Block C",
    region: "Ashanti Region",
    phone: CONTACT.kumasiPhone,
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
              Contact
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Get in touch
            </h1>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed max-w-2xl">
              Have a question about bulk orders, supplier partnerships, or need
              help with your account? Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Send us a message
              </h2>
              <p className="mt-2 text-slate-500">
                We typically respond within 2 business hours.
              </p>

              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Quick Contact */}
              <div className="rounded-2xl border border-slate-200/60 bg-white p-7">
                <h3 className="font-bold text-slate-950">Quick Contact</h3>
                <p className="mt-1 text-sm text-slate-500">
                  For urgent orders or immediate assistance.
                </p>
                <div className="mt-6 space-y-4">
                  <a
                    href={`https://wa.me/${CONTACT.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl border border-slate-200/60 p-4 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                      <MessageCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-950">WhatsApp</p>
                      <p className="text-sm text-slate-500">
                        Fastest response — send a message now
                      </p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 rounded-xl border border-slate-200/60 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-950">Email</p>
                      <p className="text-sm text-slate-500">
                        {CONTACT.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl border border-slate-200/60 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-950">
                        Business Hours
                      </p>
                      <p className="text-sm text-slate-500">
                        Mon–Fri: 7 AM – 6 PM &middot; Sat: 8 AM – 2 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offices */}
              <div className="rounded-2xl border border-slate-200/60 bg-white p-7">
                <h3 className="font-bold text-slate-950">Our Offices</h3>
                <div className="mt-6 space-y-6">
                  {offices.map((office) => (
                    <div key={office.city} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <Building className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-950">
                          {office.city}
                        </p>
                        <p className="text-sm text-slate-500">
                          {office.address}
                        </p>
                        <p className="text-sm text-slate-500">
                          {office.region}
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {office.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

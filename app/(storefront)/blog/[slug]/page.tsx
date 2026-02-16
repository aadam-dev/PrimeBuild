import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Tag,
  Share2,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const posts: Record<
  string,
  {
    title: string;
    category: string;
    readTime: string;
    date: string;
    author: string;
    content: string[];
  }
> = {
  "proforma-guide-ghana": {
    title:
      "The Complete Guide to Proforma Invoices for Ghanaian Contractors",
    category: "Guides",
    readTime: "8 min read",
    date: "February 10, 2026",
    author: "Prime Build Team",
    content: [
      "If you're a contractor in Ghana, you've likely dealt with the frustration of fluctuating material prices, slow approvals, and untracked orders. Proforma invoices solve all three problems — and they're the backbone of how Prime Build works.",
      "## What Is a Proforma Invoice?",
      "A proforma invoice is a preliminary bill of sale sent to a buyer before a shipment or delivery of goods. In construction procurement, it serves as a formal price quotation that your client or finance team can review and approve before you commit to a purchase.",
      "Unlike a regular invoice, a proforma is not a demand for payment. Think of it as a 'this is what it will cost' document — one that locks in wholesale prices for a defined period.",
      "## Why Proformas Matter for Ghanaian Contractors",
      "In Ghana's construction market, material prices can swing 5–15% within a single week, especially for cement, steel rods, and roofing sheets. A proforma locks your prices, typically for 7 days, giving you time to:",
      "- Get approval from your client or project owner\n- Arrange financing or budget allocation\n- Coordinate delivery timing with your site schedule\n- Compare quotes from different suppliers",
      "## The Traditional Way vs. Prime Build",
      "**The old way:** Call 3–5 suppliers, wait for them to send prices via WhatsApp, manually compile an Excel spreadsheet, print it, drive it to your client's office, wait days for a signature, then call back to confirm the order — hoping prices haven't changed.",
      "**The Prime Build way:** Browse the catalog, add items to your Quote Builder, generate a proforma in one click, share a link with your stakeholder, get instant approval notification, and proceed to checkout. All in under 10 minutes.",
      "## How to Generate a Proforma on Prime Build",
      "1. **Browse the Catalog** — Search for the materials you need. Filter by category (Cement, Steel, Roofing, etc.) and add items to your Quote Builder.\n2. **Review Your Quote** — Open the Quote Builder to adjust quantities. You'll see real-time pricing for each line item.\n3. **Generate the Proforma** — Click 'Generate Proforma.' Your prices are now locked for 7 days.\n4. **Share for Approval** — Copy the unique approval link and send it to your client via WhatsApp or email.\n5. **Get Approved** — Your stakeholder reviews the breakdown and clicks 'Approve.' You're notified instantly.\n6. **Checkout** — Proceed to payment. Your materials are dispatched within 24 hours.",
      "## Tips for Faster Approvals",
      "- **Include the project name** in your proforma so stakeholders know exactly what it's for.\n- **Share the link via WhatsApp** — it's faster than email in Ghana's business culture.\n- **Generate proformas early in the week** — decision-makers are more responsive Monday through Wednesday.\n- **Follow up within 48 hours** if you haven't received a response.",
      "## What Happens If a Proforma Expires?",
      "If the 7-day validity period passes without approval, simply generate a new proforma. Prices will be updated to reflect current wholesale rates. There's no charge for generating proformas.",
      "## Ready to Try It?",
      "Create a free account on Prime Build and generate your first proforma in under 5 minutes. No credit card required.",
    ],
  },
  "cement-prices-2026": {
    title: "Ghana Cement Prices 2026: Trends, Forecasts, and Buying Tips",
    category: "Market Insights",
    readTime: "6 min read",
    date: "February 3, 2026",
    author: "Prime Build Research",
    content: [
      "Cement remains the single largest material cost for most construction projects in Ghana. Whether you're building a residential home in East Legon or a commercial complex in Kumasi, understanding cement pricing trends can save you thousands of cedis.",
      "## Current Wholesale Prices (Q1 2026)",
      "Here's a snapshot of wholesale cement prices across major brands as of February 2026:",
      "- **Ghacem Cement (42.5R):** GH¢ 85–92 per bag\n- **Diamond Cement (42.5N):** GH¢ 80–88 per bag\n- **CIMAF Cement (32.5R):** GH¢ 72–78 per bag\n- **Dangote Cement (42.5R):** GH¢ 82–90 per bag",
      "These prices reflect bulk wholesale rates (50+ bags). Retail prices at local hardware stores are typically 10–20% higher.",
      "## Price Trends Over the Past 12 Months",
      "Cement prices in Ghana increased by approximately 12% over the course of 2025, driven by:\n\n- **Cedi depreciation** against the dollar (clinker imports become more expensive)\n- **Rising energy costs** affecting production\n- **Increased construction activity** across Greater Accra and Ashanti regions",
      "The good news: prices have stabilized in early 2026, and analysts expect only modest increases (3–5%) through mid-year.",
      "## How to Get the Best Cement Prices",
      "1. **Buy in bulk** — Prices drop significantly when ordering 100+ bags. Prime Build negotiates wholesale rates directly with factories.\n2. **Lock prices with proformas** — Generate a proforma to freeze rates for 7 days while you get approval.\n3. **Compare brands** — Diamond and CIMAF are 8–15% cheaper than Ghacem for many applications. Consult your structural engineer.\n4. **Time your purchases** — Prices tend to dip slightly in the rainy season (May–August) when construction activity slows.\n5. **Order through a platform** — Platforms like Prime Build aggregate demand, which means better rates than calling individual suppliers.",
      "## Ghacem vs. Diamond vs. CIMAF: Which to Choose?",
      "Each brand has its strengths:\n\n- **Ghacem 42.5R:** The industry standard. Best for structural work, beams, and foundations. Highest early strength.\n- **Diamond 42.5N:** Excellent all-purpose cement. Good for blocks, plastering, and general construction.\n- **CIMAF 32.5R:** Budget-friendly option for non-structural applications like block-laying and plastering.\n- **Dangote 42.5R:** Competitive pricing with good availability in the Ashanti and Northern regions.",
      "## Track Prices on Prime Build",
      "Our catalog shows real-time wholesale prices from verified suppliers. Prices update daily so you always have an accurate picture before generating a proforma. Sign up free to access the full catalog.",
    ],
  },
  "delivery-logistics-accra": {
    title: "How We Deliver Materials to Your Site in Under 24 Hours",
    category: "Behind the Scenes",
    readTime: "5 min read",
    date: "January 27, 2026",
    author: "Prime Build Operations",
    content: [
      "When you place an order on Prime Build, our goal is simple: get your materials to your construction site as fast as possible, without damage, at the quoted price. Here's how our fulfillment engine works behind the scenes.",
      "## The Fulfillment Pipeline",
      "Every order goes through four stages, each tracked in real-time on your dashboard:\n\n1. **Supplier Confirmed** — The assigned supplier acknowledges your order and begins preparation.\n2. **Loaded** — Materials are loaded onto the delivery vehicle at the supplier's warehouse.\n3. **En Route** — The truck is on its way to your site. You'll receive a WhatsApp notification.\n4. **Delivered** — Materials arrive at your specified address. You confirm receipt with a delivery code.",
      "## Our Supplier Network",
      "We work with 40+ verified suppliers across Ghana, strategically located to minimize delivery times:\n\n- **Greater Accra:** 15 suppliers covering Tema, Spintex, Kasoa, and surrounding areas\n- **Ashanti Region:** 10 suppliers in Kumasi and surrounding districts\n- **Western Region:** 8 suppliers in Takoradi and Sekondi\n- **Other regions:** Growing network with priority fulfillment partnerships",
      "## How We Assign Orders",
      "When you place an order, our system automatically identifies the best supplier based on:\n\n- Proximity to your delivery address\n- Current stock levels\n- Historical reliability and delivery speed\n- Price competitiveness",
      "For Professional and Enterprise plan holders, orders placed before 10 AM in Accra qualify for same-day delivery.",
      "## Quality Assurance",
      "Every supplier on our platform goes through a three-step vetting process:\n\n1. **Business verification** — Ghana Revenue Authority registration, SSNIT compliance, and business license checks.\n2. **Quality sampling** — We inspect material samples before listing any supplier.\n3. **Trial period** — New suppliers handle small orders first. Only after 10 successful deliveries are they fully activated.",
      "## What to Do When Your Order Arrives",
      "1. Verify the delivery code matches what's shown in your dashboard.\n2. Inspect materials for quantity and condition before signing.\n3. Report any issues immediately via WhatsApp — we'll arrange replacement within 24 hours.\n4. Confirm receipt in the app to close the order.",
      "## Delivery Fees",
      "Delivery fees depend on distance and volume. Most orders within city limits include free delivery. For larger or out-of-city orders, fees are calculated at checkout and clearly displayed before you pay.",
    ],
  },
  "stakeholder-approval-tips": {
    title: "5 Tips to Get Your Proforma Approved Faster",
    category: "Tips & Tricks",
    readTime: "4 min read",
    date: "January 20, 2026",
    author: "Prime Build Team",
    content: [
      "Waiting for proforma approval is one of the biggest bottlenecks in construction procurement. Here are five practical strategies to speed up the process.",
      "## 1. Include Full Project Context",
      "When generating your proforma, always include the project name and site location. Stakeholders approve faster when they immediately understand what the materials are for. 'Airport Residential Phase 2 — Foundation Materials' is far more compelling than a list of items without context.",
      "## 2. Share via WhatsApp, Not Email",
      "In Ghana's business culture, WhatsApp is the fastest communication channel. When you share your proforma link via WhatsApp, it arrives instantly, opens in the browser with one tap, and can be approved on mobile without logging in.",
      "Our data shows that proformas shared via WhatsApp are approved 3x faster than those sent by email.",
      "## 3. Send Early in the Week",
      "Decision-makers are most responsive Monday through Wednesday morning. Proformas sent on Friday afternoon often wait until the following week. Plan your procurement timeline accordingly.",
      "## 4. Follow Up at 48 Hours",
      "If you haven't received a response within 48 hours, send a gentle follow-up. Most stakeholders appreciate the reminder — they're busy and your proforma may have scrolled past in their messages.",
      "A simple message like: 'Hi, just checking — did you get a chance to review the material quote for [Project Name]? The prices are locked for 7 days, so we have until [date].' works perfectly.",
      "## 5. Pre-Align on Budget",
      "The fastest approvals happen when the stakeholder already expects the cost. Before generating a proforma, share a rough estimate verbally or via message. When the formal proforma arrives, there are no surprises.",
      "## Bonus: What If It Gets Declined?",
      "If a proforma is declined, your stakeholder can add a comment explaining why. Common reasons include:\n\n- Budget exceeded — try reducing quantities or switching to a more affordable brand\n- Timing — they want to wait for the next payment cycle\n- Missing items — they want additional materials included\n\nJust adjust and generate a new proforma. There's no limit and no cost.",
    ],
  },
  "building-materials-quality": {
    title:
      "How to Verify the Quality of Building Materials in Ghana",
    category: "Guides",
    readTime: "7 min read",
    date: "January 13, 2026",
    author: "Prime Build Quality Team",
    content: [
      "Using substandard building materials is one of the leading causes of structural failure in Ghana. As a contractor, knowing how to verify quality protects your reputation, your clients, and most importantly, lives.",
      "## Cement Quality Checks",
      "- **Color:** Good cement should be uniform grey. Avoid cement with lumps or discoloration.\n- **Texture:** Rub between your fingers — it should feel smooth, not gritty.\n- **Date of manufacture:** Cement loses strength over time. Use within 3 months of manufacture.\n- **GSA certification:** Look for the Ghana Standards Authority (GSA) mark on the bag.\n- **Bag condition:** Reject bags that are torn, wet, or show signs of hardening.",
      "## Steel Rod (Rebar) Quality",
      "- **Markings:** Check for manufacturer's stamp and size markings. Unmarked rods may be substandard.\n- **Bend test:** A quality 12mm rod should bend to 45° without cracking.\n- **Rust:** Surface rust is normal, but deep pitting or flaking indicates poor storage.\n- **Weight:** A standard 12mm × 12m rod should weigh approximately 10.7kg. Significantly lighter rods are likely undersize.\n- **Certification:** Ask for the mill certificate or test report from the manufacturer.",
      "## Roofing Sheets",
      "- **Thickness:** Standard roofing sheets should be 0.40mm–0.55mm. Thinner sheets may dent and leak.\n- **Coating:** For galvanized sheets, the zinc coating should be uniform. Bare spots will rust quickly.\n- **Edges:** Check for sharp, clean edges. Rough or uneven cuts suggest poor manufacturing.\n- **Brand reputation:** Stick to known brands like Aluworks, Rider, or B5 Plus.",
      "## Blocks",
      "- **Dimensions:** Standard blocks (150mm) should measure consistently. Irregular blocks make walls uneven.\n- **Strength:** Drop a block from waist height — it should not shatter or break into pieces.\n- **Cure time:** Good blocks have been cured for at least 14 days. Ask the block factory about their curing process.\n- **Surface:** Look for uniform texture and color. Smooth, consistent blocks indicate proper mixing.",
      "## How Prime Build Ensures Quality",
      "Every supplier on our platform undergoes quality verification:\n\n1. We inspect product samples before onboarding any supplier.\n2. Suppliers must provide certification and test reports for key materials.\n3. We accept customer feedback and remove suppliers who consistently fall short.\n4. Our fulfillment team conducts random spot-checks on deliveries.",
      "## Report Quality Issues",
      "If you receive substandard materials through Prime Build, report it immediately via WhatsApp. We take quality complaints seriously — every report is investigated within 24 hours, and affected items are replaced at no cost.",
    ],
  },
  "digital-procurement-benefits": {
    title:
      "Why Digital Procurement Is the Future of Construction in Ghana",
    category: "Industry",
    readTime: "5 min read",
    date: "January 6, 2026",
    author: "Prime Build Insights",
    content: [
      "Ghana's construction industry is booming, but the way most contractors buy materials hasn't changed in decades. Phone calls, physical visits to suppliers, handwritten receipts, and Excel-based tracking are still the norm. That's changing fast.",
      "## The Problem with Traditional Procurement",
      "Traditional material procurement in Ghana suffers from:\n\n- **Price opacity:** Without a transparent marketplace, contractors often pay retail prices even for bulk orders.\n- **Time waste:** A single procurement cycle — getting quotes, comparing prices, getting approval — can take 3–5 days.\n- **No audit trail:** WhatsApp messages and cash receipts don't create the documentation that large projects require.\n- **Fragmented communication:** Information is scattered across phone calls, messages, and notebooks.",
      "## What Digital Procurement Solves",
      "Digital platforms like Prime Build address every one of these problems:\n\n- **Transparent pricing:** See wholesale rates from multiple suppliers in one catalog.\n- **Speed:** Generate proformas in minutes, not days. Get instant approval notifications.\n- **Documentation:** Every quote, approval, payment, and delivery is recorded and downloadable.\n- **Centralization:** One dashboard for all your projects, quotes, orders, and deliveries.",
      "## The Numbers Speak",
      "Contractors using digital procurement platforms report:\n\n- **30% time savings** on the procurement cycle\n- **8–15% cost savings** from wholesale pricing and price comparison\n- **50% faster approvals** through shareable digital proformas\n- **Near-zero disputes** thanks to documented, transparent transactions",
      "## What's Holding Contractors Back?",
      "The main barriers to digital adoption in Ghana are:\n\n1. **Habit:** 'This is how we've always done it.'\n2. **Trust:** 'Can I trust an online platform with large orders?'\n3. **Connectivity:** Not all sites have reliable internet.\n4. **Digital literacy:** Some team members aren't comfortable with apps.",
      "## How Prime Build Addresses These Concerns",
      "- **Trust:** Every supplier is verified. Payments are secured through Paystack. You have full delivery tracking.\n- **Simplicity:** Our platform is designed for mobile-first use. If you can use WhatsApp, you can use Prime Build.\n- **WhatsApp integration:** For those who prefer messaging, our WhatsApp channel handles orders, updates, and support.\n- **Offline-friendly:** Download proforma PDFs when you have connectivity and use them on-site.",
      "## The Future Is Already Here",
      "Leading construction firms in Ghana are already making the switch. The question isn't whether digital procurement will become standard — it's whether you'll adopt it early and gain a competitive advantage, or wait and play catch-up.",
      "Start with a free account. Generate your first proforma. See how much time you save.",
    ],
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: "Post Not Found" };
  return { title: post.title };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  const allSlugs = Object.keys(posts);
  const currentIndex = allSlugs.indexOf(slug);
  const nextSlug = allSlugs[currentIndex + 1];
  const nextPost = nextSlug ? posts[nextSlug] : null;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-16 max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-950 transition-colors mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Blog
          </Link>
          <Badge
            variant="outline"
            className="rounded-md text-xs font-medium border-amber-200 text-amber-600 bg-amber-50 mb-4"
          >
            {post.category}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl leading-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>{post.author}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-li:leading-relaxed prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-950">
            {post.content.map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={i}>{block.replace("## ", "")}</h2>
                );
              }
              if (block.includes("\n")) {
                const lines = block.split("\n").filter(Boolean);
                const isList = lines.every((l) => l.startsWith("- "));
                if (isList) {
                  return (
                    <ul key={i}>
                      {lines.map((line, j) => (
                        <li
                          key={j}
                          dangerouslySetInnerHTML={{
                            __html: line
                              .replace(/^- /, "")
                              .replace(
                                /\*\*(.*?)\*\*/g,
                                "<strong>$1</strong>"
                              ),
                          }}
                        />
                      ))}
                    </ul>
                  );
                }
                const hasListPart = lines.some((l) => l.startsWith("- "));
                if (hasListPart) {
                  const textParts = lines.filter((l) => !l.startsWith("- "));
                  const listParts = lines.filter((l) => l.startsWith("- "));
                  return (
                    <div key={i}>
                      {textParts.map((t, j) => (
                        <p
                          key={`t-${j}`}
                          dangerouslySetInnerHTML={{
                            __html: t.replace(
                              /\*\*(.*?)\*\*/g,
                              "<strong>$1</strong>"
                            ),
                          }}
                        />
                      ))}
                      <ul>
                        {listParts.map((line, j) => (
                          <li
                            key={j}
                            dangerouslySetInnerHTML={{
                              __html: line
                                .replace(/^- /, "")
                                .replace(
                                  /\*\*(.*?)\*\*/g,
                                  "<strong>$1</strong>"
                                ),
                            }}
                          />
                        ))}
                      </ul>
                    </div>
                  );
                }
                return lines.map((line, j) => {
                  if (line.startsWith("1. ") || /^\d+\.\s/.test(line)) {
                    return null;
                  }
                  return (
                    <p
                      key={`${i}-${j}`}
                      dangerouslySetInnerHTML={{
                        __html: line.replace(
                          /\*\*(.*?)\*\*/g,
                          "<strong>$1</strong>"
                        ),
                      }}
                    />
                  );
                });
              }
              if (block.startsWith("1. ")) {
                const items = block.split("\n").filter(Boolean);
                return (
                  <ol key={i}>
                    {items.map((item, j) => (
                      <li
                        key={j}
                        dangerouslySetInnerHTML={{
                          __html: item
                            .replace(/^\d+\.\s/, "")
                            .replace(
                              /\*\*(.*?)\*\*/g,
                              "<strong>$1</strong>"
                            ),
                        }}
                      />
                    ))}
                  </ol>
                );
              }
              return (
                <p
                  key={i}
                  dangerouslySetInnerHTML={{
                    __html: block.replace(
                      /\*\*(.*?)\*\*/g,
                      "<strong>$1</strong>"
                    ),
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Share + Next */}
      <section className="border-t border-slate-200/60 bg-slate-50/50">
        <div className="container mx-auto px-4 lg:px-8 py-12 max-w-3xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Found this helpful?
              </p>
              <p className="text-sm text-slate-500">
                Share it with a fellow contractor.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 font-medium"
              asChild
            >
              <a
                href={`https://wa.me/233559602056?text=Check out this article: ${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Share2 className="h-4 w-4 mr-1.5" />
                Share on WhatsApp
              </a>
            </Button>
          </div>

          {nextPost && nextSlug && (
            <div className="mt-8 pt-8 border-t border-slate-200/60">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                Next Article
              </p>
              <Link
                href={`/blog/${nextSlug}`}
                className="group flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-semibold text-slate-950 group-hover:text-amber-600 transition-colors">
                    {nextPost.title}
                  </p>
                  <p className="text-sm text-slate-500">{nextPost.readTime}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-amber-500 transition-colors" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Tag,
  TrendingUp,
  Truck,
  FileText,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Blog" };

const posts = [
  {
    slug: "proforma-guide-ghana",
    title: "The Complete Guide to Proforma Invoices for Ghanaian Contractors",
    excerpt:
      "Learn how formal proforma invoices protect your pricing, speed up approvals, and keep your projects on schedule. A practical guide for construction professionals.",
    category: "Guides",
    readTime: "8 min read",
    date: "Feb 10, 2026",
    icon: FileText,
    featured: true,
  },
  {
    slug: "cement-prices-2026",
    title: "Ghana Cement Prices 2026: Trends, Forecasts, and Buying Tips",
    excerpt:
      "A deep dive into the cement market — current wholesale rates for Ghacem, Diamond, and other brands, plus strategies to lock in the best prices.",
    category: "Market Insights",
    readTime: "6 min read",
    date: "Feb 3, 2026",
    icon: TrendingUp,
    featured: true,
  },
  {
    slug: "delivery-logistics-accra",
    title: "How We Deliver Materials to Your Site in Under 24 Hours",
    excerpt:
      "Behind the scenes of our fulfillment process — from supplier warehouse to your site. How we coordinate same-day delivery across Greater Accra.",
    category: "Behind the Scenes",
    readTime: "5 min read",
    date: "Jan 27, 2026",
    icon: Truck,
    featured: false,
  },
  {
    slug: "stakeholder-approval-tips",
    title: "5 Tips to Get Your Proforma Approved Faster",
    excerpt:
      "Stakeholder approval doesn't have to be a bottleneck. Here are practical strategies to speed up the decision-making process on your project.",
    category: "Tips & Tricks",
    readTime: "4 min read",
    date: "Jan 20, 2026",
    icon: Tag,
    featured: false,
  },
  {
    slug: "building-materials-quality",
    title: "How to Verify the Quality of Building Materials in Ghana",
    excerpt:
      "Not all materials are created equal. Learn what to look for when inspecting cement, rebar, roofing sheets, and blocks — and how Prime Build vets suppliers.",
    category: "Guides",
    readTime: "7 min read",
    date: "Jan 13, 2026",
    icon: Building,
    featured: false,
  },
  {
    slug: "digital-procurement-benefits",
    title: "Why Digital Procurement Is the Future of Construction in Ghana",
    excerpt:
      "The construction industry is going digital. Here's why forward-thinking contractors are moving from phone calls to platforms — and what they gain.",
    category: "Industry",
    readTime: "5 min read",
    date: "Jan 6, 2026",
    icon: TrendingUp,
    featured: false,
  },
];

export default function BlogPage() {
  const featured = posts.filter((p) => p.featured);
  const regular = posts.filter((p) => !p.featured);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Blog
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Insights for builders
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl">
            Market trends, procurement guides, and tips for construction
            professionals in Ghana.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
            Featured
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {featured.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group relative flex flex-col rounded-2xl border border-slate-200/60 bg-white p-8 transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                    <post.icon className="h-5 w-5 text-amber-600" />
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-md text-xs font-medium border-slate-200 text-slate-500"
                  >
                    {post.category}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-slate-950 group-hover:text-amber-600 transition-colors">
                  {post.title}
                </h3>
                <p className="mt-3 text-slate-500 leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime}
                  </span>
                  <span>{post.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16 lg:py-20 border-t border-slate-200/60 bg-slate-50/50">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
            All Articles
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {regular.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-slate-200/60 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                    <post.icon className="h-4 w-4 text-slate-500" />
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-md text-[10px] font-medium border-slate-200 text-slate-500"
                  >
                    {post.category}
                  </Badge>
                </div>
                <h3 className="font-bold text-slate-950 group-hover:text-amber-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                  <span>{post.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-slate-200/60 bg-slate-950">
        <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-white">
            Stay informed on Ghana&apos;s building materials market
          </h2>
          <p className="mt-3 text-slate-400 max-w-lg mx-auto">
            Get weekly pricing trends, procurement tips, and industry news
            delivered to your inbox.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full h-11 rounded-xl bg-slate-800 border border-slate-700 px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
            <Button className="shrink-0 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold px-6 h-11">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

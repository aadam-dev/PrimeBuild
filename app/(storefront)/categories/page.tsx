import Link from "next/link";
import {
  Layers,
  Grid3X3,
  Home,
  Wrench,
  Zap,
  Box,
  PaintBucket,
  ArrowRight,
} from "lucide-react";
import { getCategories } from "@/lib/data/catalogue";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  cement: Layers,
  "steel-rebar": Grid3X3,
  roofing: Home,
  plumbing: Wrench,
  electrical: Zap,
  hardware: Wrench,
  "blocks-bricks": Box,
  "paint-finishes": PaintBucket,
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Banner */}
      <div className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Catalog
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Building Materials
          </h1>
          <p className="mt-2 text-lg text-slate-500 max-w-xl">
            Browse our wholesale catalog. All prices include bulk discounts and
            are locked for 7 days on your proforma.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => {
            const Icon = iconMap[cat.slug] || Box;
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-amber-500/10">
                  <Icon className="h-6 w-6 text-slate-600 group-hover:text-amber-600 transition-colors" />
                </div>
                <h2 className="text-lg font-semibold text-slate-950">
                  {cat.name}
                </h2>
                {cat.description && (
                  <p className="mt-1 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-amber-600 opacity-0 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0">
                  View materials <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

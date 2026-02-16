import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategoryBySlug, getProducts } from "@/lib/data/catalogue";
import { ProductCard } from "@/components/catalogue/ProductCard";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const products = await getProducts(slug);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1.5 text-sm text-slate-500">
            <Link href="/categories" className="hover:text-slate-950 transition-colors">
              Catalog
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-950 font-medium">{category.name}</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-2 text-lg text-slate-500 max-w-xl">
              {category.description}
            </p>
          )}
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {products.length} {products.length === 1 ? "product" : "products"} available
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length === 0 && (
          <div className="rounded-2xl border border-slate-200/60 bg-white p-12 text-center">
            <p className="text-lg font-medium text-slate-400">
              No products in this category yet.
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Check back soon — we&apos;re always adding new materials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

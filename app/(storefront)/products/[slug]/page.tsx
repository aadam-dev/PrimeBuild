import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Package,
  Shield,
  Truck,
  Clock,
} from "lucide-react";
import { getProductBySlug, getCategories } from "@/lib/data/catalogue";
import { AddToCartButton } from "@/components/catalogue/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const categories = await getCategories();
  const category = categories.find((c) => c.id === product.category_id);
  const hasDiscount =
    product.compare_at_price != null &&
    product.compare_at_price > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.compare_at_price! - product.price) /
          product.compare_at_price!) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Top Bar */}
      <div className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <nav className="flex items-center gap-1.5 text-sm text-slate-500">
            <Link
              href="/categories"
              className="hover:text-slate-950 transition-colors"
            >
              Catalog
            </Link>
            {category && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link
                  href={`/categories/${category.slug}`}
                  className="hover:text-slate-950 transition-colors"
                >
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-950 font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/60 overflow-hidden relative">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-20 w-20 text-slate-200" />
              </div>
            )}
            {hasDiscount && (
              <Badge className="absolute top-4 left-4 bg-amber-500 text-slate-950 hover:bg-amber-500 font-bold text-sm px-3 py-1">
                Save {discountPct}%
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {category && (
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                {category.name}
              </span>
            )}
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {product.name}
            </h1>
            {product.sku && (
              <p className="mt-1 text-sm text-slate-400 font-mono">
                SKU: {product.sku}
              </p>
            )}

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-950">
                GH&cent; {product.price.toLocaleString("en-GH")}
              </span>
              {hasDiscount && (
                <span className="text-lg text-slate-400 line-through">
                  GH&cent;{" "}
                  {product.compare_at_price!.toLocaleString("en-GH")}
                </span>
              )}
              <span className="text-sm text-slate-400">/ {product.unit}</span>
            </div>

            {product.short_description && (
              <p className="mt-4 text-lg text-slate-500 leading-relaxed">
                {product.short_description}
              </p>
            )}

            {product.description && (
              <p className="mt-4 text-slate-600 leading-relaxed">
                {product.description}
              </p>
            )}

            <Separator className="my-6" />

            {/* Add to Cart */}
            <div className="space-y-4">
              <AddToCartButton product={product} />
            </div>

            <Separator className="my-6" />

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: Shield,
                  label: "Verified Supplier",
                },
                {
                  icon: Truck,
                  label: "24h Delivery",
                },
                {
                  icon: Clock,
                  label: "7-Day Price Lock",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-slate-200/60 bg-white p-4 text-center"
                >
                  <item.icon className="h-5 w-5 text-amber-600" />
                  <span className="text-xs font-medium text-slate-600">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

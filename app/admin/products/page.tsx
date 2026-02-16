import { Package } from "lucide-react";
import { getAllProductsAdmin, getAllCategoriesForProducts } from "@/lib/actions/products";
import { ProductsClient } from "./ProductsClient";

export const metadata = { title: "Products | Admin" };

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProductsAdmin(),
    getAllCategoriesForProducts(),
  ]);

  const serialized = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    categoryId: p.categoryId,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    unit: p.unit,
    description: p.description,
    stockQuantity: p.stockQuantity,
    isActive: p.isActive,
  }));

  const cats = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <Package className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-950">Products</h2>
          <p className="text-sm text-slate-500">{products.length} materials in catalog</p>
        </div>
      </div>

      <ProductsClient products={serialized} categories={cats} />
    </div>
  );
}

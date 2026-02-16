import { Layers } from "lucide-react";
import { getAllCategoriesAdmin } from "@/lib/actions/categories";
import { CategoriesClient } from "./CategoriesClient";

export const metadata = { title: "Categories | Admin" };

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAdmin();

  const data = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    sortOrder: c.sortOrder,
    isActive: c.isActive,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
          <Layers className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-950">Categories</h2>
          <p className="text-sm text-slate-500">{categories.length} categories</p>
        </div>
      </div>

      <CategoriesClient categories={data} />
    </div>
  );
}

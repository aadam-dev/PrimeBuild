"use client";

import { useState, useTransition } from "react";
import { Plus, Search, Edit, Power, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { createProductAction, updateProductAction, toggleProductActiveAction } from "@/lib/actions/products";
import { exportToCSV } from "@/lib/utils/export";

type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  categoryId: string;
  price: number;
  compareAtPrice: number | null;
  unit: string;
  description: string | null;
  stockQuantity: number | null;
  isActive: boolean;
};

type Category = { id: string; name: string; slug: string };

export function ProductsClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchCat = filterCat === "all" || p.categoryId === filterCat;
    return matchSearch && matchCat;
  });

  function openCreate() {
    setEditing(null);
    setSheetOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setSheetOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      if (editing) {
        formData.set("id", editing.id);
        await updateProductAction(formData);
      } else {
        await createProductAction(formData);
      }
      setSheetOpen(false);
      setEditing(null);
    });
  }

  async function handleToggle(productId: string, isActive: boolean) {
    startTransition(async () => {
      await toggleProductActiveAction(productId, !isActive);
    });
  }

  function handleExport() {
    exportToCSV(
      filtered.map((p) => ({
        Name: p.name,
        SKU: p.sku ?? "",
        Category: catMap.get(p.categoryId) ?? "",
        Price: p.price,
        Unit: p.unit,
        Stock: p.stockQuantity ?? "",
        Active: p.isActive ? "Yes" : "No",
      })),
      "products-export"
    );
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <Button variant="outline" size="sm" onClick={handleExport} className="rounded-xl gap-1.5">
          <Download className="h-3.5 w-3.5" /> CSV
        </Button>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={openCreate} className="rounded-xl bg-slate-950 text-white hover:bg-slate-800 gap-1.5">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{editing ? "Edit Product" : "Add Product"}</SheetTitle>
            </SheetHeader>
            <form action={handleSubmit} className="mt-6 space-y-4">
              <div>
                <Label>Name *</Label>
                <Input name="name" defaultValue={editing?.name ?? ""} required className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label>Slug *</Label>
                <Input name="slug" defaultValue={editing?.slug ?? ""} required className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label>SKU</Label>
                <Input name="sku" defaultValue={editing?.sku ?? ""} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label>Category *</Label>
                <select name="categoryId" defaultValue={editing?.categoryId ?? ""} required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Price (GHS) *</Label>
                  <Input name="price" type="number" step="0.01" defaultValue={editing?.price ?? ""} required className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label>Compare At Price</Label>
                  <Input name="compareAtPrice" type="number" step="0.01" defaultValue={editing?.compareAtPrice ?? ""} className="mt-1 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Unit</Label>
                  <Input name="unit" defaultValue={editing?.unit ?? "piece"} className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label>Stock Quantity</Label>
                  <Input name="stockQuantity" type="number" defaultValue={editing?.stockQuantity ?? ""} className="mt-1 rounded-xl" />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  name="description"
                  defaultValue={editing?.description ?? ""}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm resize-none"
                />
              </div>
              <Button type="submit" disabled={isPending} className="w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800">
                {isPending ? "Saving…" : editing ? "Update Product" : "Create Product"}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/60 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50/80">
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Category</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Unit</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Stock</th>
                <th className="text-center px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-950">{p.name}</p>
                    {p.sku && <p className="text-xs text-slate-400">{p.sku}</p>}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant="outline" className="rounded-md text-xs border-slate-200 text-slate-500">
                      {catMap.get(p.categoryId) ?? "—"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-slate-950">
                    GHS {p.price.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{p.unit}</td>
                  <td className="px-5 py-3.5 text-right">
                    {p.stockQuantity != null ? (
                      <span className={p.stockQuantity <= 10 ? "text-red-600 font-medium" : "text-slate-600"}>
                        {p.stockQuantity}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <Badge variant={p.isActive ? "default" : "secondary"} className="text-xs">
                      {p.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggle(p.id, p.isActive)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          p.isActive ? "text-amber-500 hover:bg-amber-50" : "text-emerald-500 hover:bg-emerald-50"
                        }`}
                        title={p.isActive ? "Deactivate" : "Activate"}
                      >
                        <Power className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Plus, Edit, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createCategoryAction, updateCategoryAction, toggleCategoryActiveAction } from "@/lib/actions/categories";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};

export function CategoriesClient({ categories }: { categories: Category[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setDialogOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      if (editing) {
        formData.set("id", editing.id);
        await updateCategoryAction(formData);
      } else {
        await createCategoryAction(formData);
      }
      setDialogOpen(false);
      setEditing(null);
    });
  }

  async function handleToggle(catId: string, isActive: boolean) {
    startTransition(async () => {
      await toggleCategoryActiveAction(catId, !isActive);
    });
  }

  return (
    <>
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="rounded-xl bg-slate-950 text-white hover:bg-slate-800 gap-1.5">
              <Plus className="h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label>Name *</Label>
                <Input name="name" defaultValue={editing?.name ?? ""} required className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label>Slug *</Label>
                <Input name="slug" defaultValue={editing?.slug ?? ""} required className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  name="description"
                  defaultValue={editing?.description ?? ""}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm resize-none"
                />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? 0} className="mt-1 rounded-xl" />
              </div>
              <Button type="submit" disabled={isPending} className="w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800">
                {isPending ? "Saving…" : editing ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div
            key={c.id}
            className={`flex items-center justify-between rounded-2xl border bg-white p-5 ${
              c.isActive ? "border-slate-200/60" : "border-slate-200/40 opacity-60"
            }`}
          >
            <div className="min-w-0">
              <p className="font-semibold text-slate-950">{c.name}</p>
              <p className="mt-0.5 text-sm text-slate-400">{c.slug}</p>
              {c.description && <p className="mt-1 text-xs text-slate-400 line-clamp-2">{c.description}</p>}
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-3">
              <Badge variant={c.isActive ? "default" : "secondary"} className="text-[10px]">
                {c.isActive ? "Active" : "Off"}
              </Badge>
              <button
                onClick={() => openEdit(c)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleToggle(c.id, c.isActive)}
                className={`p-1.5 rounded-lg transition-colors ${
                  c.isActive ? "text-amber-500 hover:bg-amber-50" : "text-emerald-500 hover:bg-emerald-50"
                }`}
              >
                <Power className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

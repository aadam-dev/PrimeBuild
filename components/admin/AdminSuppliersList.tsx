"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupplierAction } from "@/lib/actions/admin";

type SupplierRow = { id: string; name: string; email: string | null; phone: string | null };

export function AdminSuppliersList({ initialSuppliers = [] }: { initialSuppliers: SupplierRow[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const res = await createSupplierAction({ name: name.trim(), email: email.trim() || undefined, phone: phone.trim() || undefined });
    setLoading(false);
    if (res.ok) {
      setName("");
      setEmail("");
      setPhone("");
      router.refresh();
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <Card>
        <CardContent className="p-4">
          <h2 className="font-medium mb-2">Add supplier</h2>
          <div className="flex flex-wrap gap-2 items-end">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-48" />
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-48" />
            <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-32" />
            <Button onClick={handleAdd} disabled={loading || !name.trim()}>Add</Button>
          </div>
        </CardContent>
      </Card>
      <ul className="space-y-2">
        {initialSuppliers.map((s) => (
          <li key={s.id}>
            <Card>
              <CardContent className="p-3">
                <span className="font-medium">{s.name}</span>
                {s.email && <span className="text-muted-foreground text-sm ml-2">{s.email}</span>}
                {s.phone && <span className="text-muted-foreground text-sm ml-2">{s.phone}</span>}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
      {initialSuppliers.length === 0 && <p className="text-muted-foreground">No suppliers yet. Add one above.</p>}
    </div>
  );
}

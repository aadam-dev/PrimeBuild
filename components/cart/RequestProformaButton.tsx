"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartEntry } from "@/lib/hooks/use-cart";
import { authClient } from "@/lib/auth-client";
import { createProformaFromCartAction } from "@/lib/actions/proformas";

export function RequestProformaButton({
  disabled,
  cartEntries,
}: {
  disabled: boolean;
  cartEntries: CartEntry[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session } = authClient.useSession();

  const handleRequest = async () => {
    if (!session?.user) {
      router.push("/login?callbackUrl=" + encodeURIComponent("/cart"));
      return;
    }
    setLoading(true);
    const result = await createProformaFromCartAction(
      cartEntries.map((e) => ({
        productId: e.productId,
        quantity: e.quantity,
      }))
    );
    setLoading(false);
    if (result.ok && result.proformaId) {
      if (typeof window !== "undefined")
        window.dispatchEvent(new Event("primebuild-cart-updated"));
      router.push(`/account/proformas/${result.proformaId}`);
    }
  };

  return (
    <Button
      disabled={disabled || loading}
      onClick={handleRequest}
      className="w-full rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold animate-pulse-ring"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FileText className="h-4 w-4 mr-1.5" />
          Generate Proforma
        </>
      )}
    </Button>
  );
}

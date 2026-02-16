import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { getSession } from "@/lib/auth-server";
import { getProformaForUser } from "@/lib/actions/proformas";

type Props = { searchParams: Promise<{ proforma?: string }> };

export default async function CheckoutPage({ searchParams }: Props) {
  const { proforma: proformaId } = await searchParams;
  const session = await getSession();
  if (!session)
    redirect(
      "/login?callbackUrl=" +
        encodeURIComponent(
          "/checkout" + (proformaId ? `?proforma=${proformaId}` : "")
        )
    );
  const proforma = proformaId ? await getProformaForUser(proformaId) : null;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Checkout
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Confirm Your Order
          </h1>
          <p className="mt-2 text-lg text-slate-500 max-w-xl">
            Review your details and complete payment. Your materials will be
            dispatched within 24 hours.
          </p>
        </div>
      </div>
      <div className="container mx-auto max-w-3xl px-4 lg:px-8 py-12">
        <CheckoutForm proforma={proforma} />
      </div>
    </div>
  );
}

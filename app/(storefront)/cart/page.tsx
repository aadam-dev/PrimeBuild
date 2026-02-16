import { CartContent } from "@/components/cart/CartContent";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Quote Builder
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Your Materials
          </h1>
          <p className="mt-2 text-lg text-slate-500 max-w-xl">
            Review your selections, adjust quantities, then generate a formal
            proforma or proceed to checkout.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <CartContent />
      </div>
    </div>
  );
}

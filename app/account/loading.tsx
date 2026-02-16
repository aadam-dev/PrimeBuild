export default function AccountLoading() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/60 bg-white p-6"
          >
            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
            <div className="mt-4 h-8 w-16 animate-pulse rounded-lg bg-slate-100" />
            <div className="mt-2 h-4 w-24 animate-pulse rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/60 bg-white p-6"
          >
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 animate-pulse rounded-2xl bg-slate-100" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-4 w-48 animate-pulse rounded-lg bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

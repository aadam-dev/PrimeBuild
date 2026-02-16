import { ProformasList } from "@/components/account/ProformasList";
import { getProformasForUser } from "@/lib/actions/proformas";

export default async function ProformasPage() {
  const list = await getProformasForUser();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-950">My Proformas</h2>
        <p className="mt-1 text-sm text-slate-500">
          View and share your quotes. Copy the share link so stakeholders can
          approve with one click.
        </p>
      </div>
      <ProformasList initialList={list} />
    </div>
  );
}

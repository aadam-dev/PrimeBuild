import { notFound } from "next/navigation";
import { ProformaDetailClient } from "@/components/account/ProformaDetailClient";
import { getProformaForUser } from "@/lib/actions/proformas";

type Props = { params: Promise<{ id: string }> };

export default async function ProformaDetailPage({ params }: Props) {
  const { id } = await params;
  if (!id) notFound();
  const proforma = await getProformaForUser(id);
  if (!proforma) notFound();
  return <ProformaDetailClient proforma={proforma} />;
}

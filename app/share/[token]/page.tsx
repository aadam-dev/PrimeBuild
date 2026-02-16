import { notFound } from "next/navigation";
import { ShareProformaView } from "@/components/proforma/ShareProformaView";
import { getProformaByToken } from "@/lib/actions/proformas";

type Props = { params: Promise<{ token: string }> };

export default async function ShareProformaPage({ params }: Props) {
  const { token } = await params;
  if (!token) notFound();
  const proforma = await getProformaByToken(token);
  return <ShareProformaView token={token} initialProforma={proforma} />;
}

import { notFound } from "next/navigation";
import { OrderDetailClient } from "@/components/account/OrderDetailClient";
import { getOrderForUser } from "@/lib/actions/orders";

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  if (!id) notFound();
  const order = await getOrderForUser(id);
  if (!order) notFound();
  return <OrderDetailClient order={order} />;
}

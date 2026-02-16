const STORAGE_KEY = "primebuild_orders";

export type OrderStored = {
  id: string;
  orderNumber: string;
  proformaId: string;
  status: "confirmed" | "with_supplier" | "dispatched" | "delivered" | "cancelled";
  paymentStatus: "pending" | "deposit_paid" | "paid" | "failed";
  items: { productName: string; unitPrice: number; quantity: number; lineTotal: number }[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
};

function loadOrders(): OrderStored[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveOrders(list: OrderStored[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("storage"));
}

export function getOrders(): OrderStored[] {
  return loadOrders();
}

export function getOrderById(id: string): OrderStored | null {
  return loadOrders().find((o) => o.id === id) ?? null;
}

export function createOrderFromProforma(proforma: {
  id: string;
  items: { productName: string; unitPrice: number; quantity: number; lineTotal: number }[];
  subtotal: number;
  tax: number;
  total: number;
}): OrderStored {
  const list = loadOrders();
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${list.length + 1}`;
  const order: OrderStored = {
    id: `order-${Date.now()}`,
    orderNumber,
    proformaId: proforma.id,
    status: "confirmed",
    paymentStatus: "paid",
    items: proforma.items,
    subtotal: proforma.subtotal,
    tax: proforma.tax,
    total: proforma.total,
    createdAt: new Date().toISOString(),
  };
  list.unshift(order);
  saveOrders(list);
  return order;
}

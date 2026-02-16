export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  short_description: string | null;
  unit: string;
  price: number;
  compare_at_price: number | null;
  images: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
};

export type Proforma = {
  id: string;
  user_id: string;
  proforma_number: string;
  share_token: string;
  status: string;
  valid_until: string;
  subtotal: number;
  tax: number;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ProformaItem = {
  id: string;
  proforma_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
};

export type Order = {
  id: string;
  user_id: string;
  proforma_id: string | null;
  order_number: string;
  status: string;
  payment_status: string;
  payment_reference: string | null;
  subtotal: number;
  tax: number;
  total: number;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
};

export type ApprovalAction = {
  id: string;
  proforma_id: string;
  action: string;
  actor_name: string | null;
  actor_email: string | null;
  comment: string | null;
  created_at: string;
};

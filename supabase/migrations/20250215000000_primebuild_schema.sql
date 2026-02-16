-- Prime Build schema — run this only on a dedicated Prime Build Supabase project.
-- Tables use clean names (no prefix); this project should contain only Prime Build data.

-- Profiles (extends auth.users from Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Categories (product categories)
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name text NOT NULL,
  slug text NOT NULL,
  sku text,
  description text,
  short_description text,
  unit text NOT NULL DEFAULT 'piece',
  price numeric(12,2) NOT NULL CHECK (price >= 0),
  compare_at_price numeric(12,2),
  images text[] DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(category_id, slug)
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active) WHERE is_active = true;

-- Cart items (user_id = auth.users.id)
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity int NOT NULL CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_cart_items_user ON public.cart_items(user_id);

-- Proformas
CREATE TABLE IF NOT EXISTS public.proformas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  proforma_number text NOT NULL UNIQUE,
  share_token text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('draft','pending','approved','declined','expired','converted')),
  valid_until date NOT NULL,
  subtotal numeric(12,2) NOT NULL,
  tax numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.proformas ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_proformas_user ON public.proformas(user_id);
CREATE INDEX IF NOT EXISTS idx_proformas_share_token ON public.proformas(share_token);
CREATE INDEX IF NOT EXISTS idx_proformas_status ON public.proformas(status);

-- Proforma line items
CREATE TABLE IF NOT EXISTS public.proforma_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proforma_id uuid NOT NULL REFERENCES public.proformas(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  unit_price numeric(12,2) NOT NULL,
  quantity int NOT NULL,
  line_total numeric(12,2) NOT NULL
);

ALTER TABLE public.proforma_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_proforma_items_proforma ON public.proforma_items(proforma_id);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  proforma_id uuid REFERENCES public.proformas(id) ON DELETE SET NULL,
  order_number text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed','with_supplier','dispatched','delivered','cancelled')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','deposit_paid','paid','failed')),
  payment_reference text,
  subtotal numeric(12,2) NOT NULL,
  tax numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_proforma ON public.orders(proforma_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Order line items
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  unit_price numeric(12,2) NOT NULL,
  quantity int NOT NULL,
  line_total numeric(12,2) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- Approval actions (for shared proforma approve/decline)
CREATE TABLE IF NOT EXISTS public.approval_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proforma_id uuid NOT NULL REFERENCES public.proformas(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('approved','declined')),
  actor_name text,
  actor_email text,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.approval_actions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_approval_actions_proforma ON public.approval_actions(proforma_id);

-- RLS: profiles
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- RLS: categories
CREATE POLICY "Anyone can read active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- RLS: products
CREATE POLICY "Anyone can read active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- RLS: cart_items
CREATE POLICY "Users can manage own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- RLS: proformas
CREATE POLICY "Users can read own proformas" ON public.proformas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own proformas" ON public.proformas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can read all proformas" ON public.proformas FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- RLS: proforma_items
CREATE POLICY "Users can read own proforma items" ON public.proforma_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.proformas pf WHERE pf.id = proforma_id AND pf.user_id = auth.uid())
);
CREATE POLICY "Users can insert proforma items for own proformas" ON public.proforma_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.proformas pf WHERE pf.id = proforma_id AND pf.user_id = auth.uid())
);
CREATE POLICY "Admins can read all proforma items" ON public.proforma_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- RLS: orders
CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can read and update all orders" ON public.orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- RLS: order_items
CREATE POLICY "Users can read own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
CREATE POLICY "Users can insert order items for own orders" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
CREATE POLICY "Admins can read all order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- RLS: approval_actions
CREATE POLICY "Users can read approval actions for own proformas" ON public.approval_actions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.proformas pf WHERE pf.id = proforma_id AND pf.user_id = auth.uid())
);
CREATE POLICY "Admins can read all approval actions" ON public.approval_actions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Functions for public proforma share (no auth required)
CREATE OR REPLACE FUNCTION public.get_proforma_by_share_token(token text)
RETURNS SETOF public.proformas
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.proformas WHERE share_token = token AND status != 'draft';
$$;

GRANT EXECUTE ON FUNCTION public.get_proforma_by_share_token(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_proforma_by_share_token(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_proforma_items_by_share_token(token text)
RETURNS TABLE (
  id uuid,
  proforma_id uuid,
  product_id uuid,
  product_name text,
  unit_price numeric,
  quantity int,
  line_total numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT pi.id, pi.proforma_id, pi.product_id, pi.product_name, pi.unit_price, pi.quantity, pi.line_total
  FROM public.proforma_items pi
  JOIN public.proformas p ON p.id = pi.proforma_id
  WHERE p.share_token = token;
$$;

GRANT EXECUTE ON FUNCTION public.get_proforma_items_by_share_token(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_proforma_items_by_share_token(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.approve_or_decline_proforma(
  token text,
  action text,
  actor_name text DEFAULT NULL,
  actor_email text DEFAULT NULL,
  comment text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pid uuid;
  aid uuid;
BEGIN
  IF action NOT IN ('approved', 'declined') THEN
    RAISE EXCEPTION 'Invalid action';
  END IF;
  SELECT id INTO pid FROM public.proformas WHERE share_token = token AND status = 'pending';
  IF pid IS NULL THEN
    RAISE EXCEPTION 'Proforma not found or not pending';
  END IF;
  INSERT INTO public.approval_actions (proforma_id, action, actor_name, actor_email, comment)
  VALUES (pid, action, actor_name, actor_email, comment)
  RETURNING id INTO aid;
  UPDATE public.proformas SET status = action, updated_at = now() WHERE id = pid;
  RETURN aid;
END;
$$;

GRANT EXECUTE ON FUNCTION public.approve_or_decline_proforma(text, text, text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.approve_or_decline_proforma(text, text, text, text, text) TO authenticated;

-- Trigger: create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

import type { Category, Product } from "./database.types";

export const mockCategories: Category[] = [
  { id: "cat-cement", name: "Cement & Concrete", slug: "cement-concrete", description: "Portland cement, ready-mix, and concrete admixtures.", image_url: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-steel", name: "Steel & Rebar", slug: "steel-rebar", description: "Reinforcement bars, BRC mesh, binding wire.", image_url: null, sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-roofing", name: "Roofing Materials", slug: "roofing", description: "Aluzinc sheets, aluminum roofing, ridge caps.", image_url: null, sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-plumbing", name: "Plumbing & Pipes", slug: "plumbing-pipes", description: "PVC pipes, fittings, taps, water tanks.", image_url: null, sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-electrical", name: "Electrical Supplies", slug: "electrical", description: "Cables, switches, breakers, panels.", image_url: null, sort_order: 5, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-hardware", name: "Hardware & Fasteners", slug: "hardware-fasteners", description: "Nails, screws, bolts, hinges, locks.", image_url: null, sort_order: 6, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-blocks", name: "Blocks & Bricks", slug: "blocks-bricks", description: "Hollow blocks, solid blocks, clay bricks.", image_url: null, sort_order: 7, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-paint", name: "Paint & Finishes", slug: "paint-finishes", description: "Interior and exterior paints, varnishes.", image_url: null, sort_order: 8, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-timber", name: "Timber & Wood", slug: "timber-wood", description: "Sawn timber, plywood, MDF boards.", image_url: null, sort_order: 9, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-doors", name: "Doors & Windows", slug: "doors-windows", description: "Wooden doors, metal doors, aluminum windows.", image_url: null, sort_order: 10, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-tiles", name: "Tiles & Flooring", slug: "tiles-flooring", description: "Ceramic tiles, porcelain tiles, granite.", image_url: null, sort_order: 11, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-waterproof", name: "Waterproofing & Insulation", slug: "waterproofing", description: "Bitumen membranes, sealants, DPC.", image_url: null, sort_order: 12, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-aggregates", name: "Sand, Gravel & Aggregates", slug: "aggregates", description: "Building sand, gravel, chippings, laterite.", image_url: null, sort_order: 13, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-safety", name: "Safety Equipment", slug: "safety-equipment", description: "Hard hats, safety boots, high-vis vests.", image_url: null, sort_order: 14, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-tools", name: "Tools & Machinery", slug: "tools-machinery", description: "Power tools, hand tools, mixers, vibrators.", image_url: null, sort_order: 15, is_active: true, created_at: "", updated_at: "" },
];

const p = (id: string, catId: string, name: string, slug: string, price: number, unit: string, cap: number | null = null): Product => ({
  id, category_id: catId, name, slug, sku: null, description: name, short_description: null, unit, price, compare_at_price: cap, images: [], is_active: true, created_at: "", updated_at: "",
});

export const mockProducts: Product[] = [
  // Cement
  p("p-cem-1", "cat-cement", "Ghacem Portland Cement 42.5R 50kg", "ghacem-portland-42-5r-50kg", 88, "bag", 95),
  p("p-cem-2", "cat-cement", "Ghacem Portland Cement 32.5R 50kg", "ghacem-portland-32-5r-50kg", 82, "bag", 88),
  p("p-cem-3", "cat-cement", "Diamond Cement 42.5N 50kg", "diamond-cement-42-5n-50kg", 84, "bag", 90),
  p("p-cem-4", "cat-cement", "CIMAF Cement 32.5R 50kg", "cimaf-cement-32-5r-50kg", 75, "bag", 82),
  p("p-cem-5", "cat-cement", "Dangote Cement 42.5R 50kg", "dangote-cement-42-5r-50kg", 86, "bag", 92),
  p("p-cem-6", "cat-cement", "SupaFix Tile Adhesive 25kg", "supafix-tile-adhesive-25kg", 55, "bag", 62),
  // Steel
  p("p-stl-1", "cat-steel", "Steel Rebar Y10 (10mm) 12m", "steel-rebar-y10-12m", 62, "length", 68),
  p("p-stl-2", "cat-steel", "Steel Rebar Y12 (12mm) 12m", "steel-rebar-y12-12m", 95, "length", 105),
  p("p-stl-3", "cat-steel", "Steel Rebar Y16 (16mm) 12m", "steel-rebar-y16-12m", 168, "length", 180),
  p("p-stl-4", "cat-steel", "Steel Rebar Y20 (20mm) 12m", "steel-rebar-y20-12m", 265, "length", 285),
  p("p-stl-5", "cat-steel", "BRC Mesh A142 (2.4m x 4.8m)", "brc-mesh-a142", 285, "sheet", 310),
  p("p-stl-6", "cat-steel", "Binding Wire 25kg Roll", "binding-wire-25kg", 145, "roll", 160),
  // Roofing
  p("p-rof-1", "cat-roofing", "Aluzinc Roofing Sheet 0.40mm (per meter)", "aluzinc-roofing-0-40mm", 38, "meter", 42),
  p("p-rof-2", "cat-roofing", "Aluzinc Roofing Sheet 0.55mm (per meter)", "aluzinc-roofing-0-55mm", 52, "meter", 58),
  p("p-rof-3", "cat-roofing", "Aluminum Roofing Sheet 0.55mm (per meter)", "aluminum-roofing-0-55mm", 65, "meter"),
  p("p-rof-4", "cat-roofing", "Ridge Cap Aluminum", "ridge-cap-aluminum", 45, "piece", 50),
  // Plumbing
  p("p-plb-1", "cat-plumbing", "PVC Pipe 4\" (100mm) Class D", "pvc-pipe-4in-class-d", 48, "length", 55),
  p("p-plb-2", "cat-plumbing", "PVC Pipe 3\" (75mm) Class D", "pvc-pipe-3in-class-d", 35, "length", 40),
  p("p-plb-3", "cat-plumbing", "PVC Elbow 90° 4\"", "pvc-elbow-90-4in", 8.5, "piece"),
  p("p-plb-4", "cat-plumbing", "Polytank Water Tank 1000L", "polytank-water-tank-1000l", 850, "piece", 950),
  // Electrical
  p("p-elc-1", "cat-electrical", "Armoured Cable 16mm² (per meter)", "armoured-cable-16mm", 28, "meter", 32),
  p("p-elc-2", "cat-electrical", "Twin & Earth Cable 2.5mm² (100m)", "twin-earth-cable-2-5mm-100m", 280, "roll", 320),
  p("p-elc-3", "cat-electrical", "MCB Circuit Breaker 32A", "mcb-circuit-breaker-32a", 22, "piece", 26),
  p("p-elc-4", "cat-electrical", "Distribution Board 12-Way", "distribution-board-12-way", 165, "piece", 185),
  // Hardware
  p("p-hw-1", "cat-hardware", "Wire Nails 3\" (25kg Box)", "wire-nails-3in-25kg", 145, "box", 160),
  p("p-hw-2", "cat-hardware", "Wood Screws 3\" (Box of 200)", "wood-screws-3in-200", 28, "box", 32),
  p("p-hw-3", "cat-hardware", "Padlock 60mm Heavy Duty", "padlock-60mm-heavy-duty", 45, "piece", 52),
  // Blocks
  p("p-blk-1", "cat-blocks", "Hollow Block 6\" (150mm)", "hollow-block-6in", 5.5, "piece", 6),
  p("p-blk-2", "cat-blocks", "Hollow Block 9\" (225mm)", "hollow-block-9in", 8.5, "piece", 9.5),
  p("p-blk-3", "cat-blocks", "Solid Block 6\" (150mm)", "solid-block-6in", 7, "piece"),
  p("p-blk-4", "cat-blocks", "Paving Interlock (S-Shape)", "paving-interlock-s-shape", 4.5, "piece"),
  // Paint
  p("p-pnt-1", "cat-paint", "Latex Silk Emulsion 20L (White)", "latex-silk-emulsion-20l-white", 320, "bucket", 360),
  p("p-pnt-2", "cat-paint", "Exterior Weathercoat 20L", "exterior-weathercoat-20l", 420, "bucket", 470),
  p("p-pnt-3", "cat-paint", "Primer Undercoat 20L", "primer-undercoat-20l", 195, "bucket", 220),
  // Timber
  p("p-tbr-1", "cat-timber", "Wawa Timber 2\"x4\" (per length)", "wawa-timber-2x4", 25, "length"),
  p("p-tbr-2", "cat-timber", "Marine Plywood 18mm (4x8 ft)", "marine-plywood-18mm", 220, "sheet", 250),
  p("p-tbr-3", "cat-timber", "Plywood 12mm (4x8 ft)", "plywood-12mm", 145, "sheet"),
  // Doors & Windows
  p("p-dw-1", "cat-doors", "Flush Door (Hardwood) 3ft x 7ft", "flush-door-hardwood-3x7", 450, "piece", 520),
  p("p-dw-2", "cat-doors", "Metal Security Door", "metal-security-door", 1200, "piece", 1400),
  p("p-dw-3", "cat-doors", "Aluminum Sliding Window 4ft x 4ft", "aluminum-sliding-window-4x4", 380, "piece", 420),
  // Tiles
  p("p-til-1", "cat-tiles", "Ceramic Floor Tile 40x40cm (Box)", "ceramic-floor-tile-40x40", 65, "box", 75),
  p("p-til-2", "cat-tiles", "Porcelain Floor Tile 60x60cm (Box)", "porcelain-floor-tile-60x60", 120, "box", 140),
  p("p-til-3", "cat-tiles", "Wall Tile 25x40cm (Box)", "wall-tile-25x40", 55, "box"),
  // Waterproofing
  p("p-wp-1", "cat-waterproof", "Bitumen Membrane 1m x 10m Roll", "bitumen-membrane-1x10m", 280, "roll", 320),
  p("p-wp-2", "cat-waterproof", "Damp Proof Course (DPC) 225mm x 30m", "damp-proof-course-225mm", 55, "roll"),
  // Aggregates
  p("p-agg-1", "cat-aggregates", "Building Sand (per trip - 5 tons)", "building-sand-5-ton", 850, "trip", 950),
  p("p-agg-2", "cat-aggregates", "Gravel/Chippings 3/4\" (per trip - 5 tons)", "gravel-chippings-3-4-5-ton", 950, "trip", 1050),
  // Safety
  p("p-saf-1", "cat-safety", "Safety Helmet (Hard Hat)", "safety-helmet-hard-hat", 25, "piece", 30),
  p("p-saf-2", "cat-safety", "Safety Boots (Steel Toe)", "safety-boots-steel-toe", 120, "pair", 145),
  p("p-saf-3", "cat-safety", "High-Vis Reflective Vest", "high-vis-reflective-vest", 15, "piece"),
  // Tools
  p("p-tm-1", "cat-tools", "Concrete Mixer 1-Bag (Electric)", "concrete-mixer-1-bag-electric", 4500, "piece", 5200),
  p("p-tm-2", "cat-tools", "Wheelbarrow (Heavy Duty)", "wheelbarrow-heavy-duty", 250, "piece", 285),
  p("p-tm-3", "cat-tools", "Spirit Level 4ft (1200mm)", "spirit-level-4ft", 45, "piece"),
];

export const categoryIcons: Record<string, string> = {
  "cement-concrete": "🧱",
  "steel-rebar": "🔩",
  "roofing": "🏠",
  "plumbing-pipes": "🔧",
  "electrical": "⚡",
  "hardware-fasteners": "🔨",
  "blocks-bricks": "🧊",
  "paint-finishes": "🎨",
  "timber-wood": "🪵",
  "doors-windows": "🚪",
  "tiles-flooring": "🔲",
  "waterproofing": "💧",
  "aggregates": "⛏️",
  "safety-equipment": "🦺",
  "tools-machinery": "🔧",
};

export const liveTicker = [
  "🚚 50 bags Ghacem Cement delivered to Tema Site — 23 mins ago",
  "✅ Proforma PB-20260042 approved by Kofi Mensah — 1 hr ago",
  "📦 Steel Rebar Y16 restocked — 500 lengths available",
  "🏗️ New supplier onboarded: B5 Plus Steel Ghana",
  "🚚 Roofing sheets dispatched to Kumasi — En Route",
  "✅ Order ORD-20260018 marked as delivered — Spintex",
  "📦 Polytank 2500L back in stock — Limited quantity",
  "🔥 20% off Aluzinc 0.40mm this week only",
  "🚚 Building sand delivered to East Legon project",
  "✅ 3 proformas approved in Ashanti Region today",
];

import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { randomUUID } from "crypto";
import * as schema from "../lib/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// ========== HELPERS ==========
const uuid = () => randomUUID();
const days = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};
const hashPw = async (pw: string) => {
  const { hashPassword } = await import("better-auth/crypto");
  return hashPassword(pw);
};

// ========== CATEGORIES ==========
const categoryData = [
  { id: uuid(), name: "Cement & Concrete", slug: "cement-concrete", description: "Portland cement, ready-mix, and concrete admixtures from top Ghanaian and international brands.", sortOrder: 1 },
  { id: uuid(), name: "Steel & Rebar", slug: "steel-rebar", description: "Reinforcement bars, BRC mesh, binding wire, and structural steel for foundations and frames.", sortOrder: 2 },
  { id: uuid(), name: "Roofing Materials", slug: "roofing", description: "Aluzinc sheets, aluminum roofing, ridge caps, roofing nails, and accessories.", sortOrder: 3 },
  { id: uuid(), name: "Plumbing & Pipes", slug: "plumbing-pipes", description: "PVC pipes, fittings, taps, water tanks, and drainage systems.", sortOrder: 4 },
  { id: uuid(), name: "Electrical Supplies", slug: "electrical", description: "Cables, switches, breakers, panels, and wiring accessories.", sortOrder: 5 },
  { id: uuid(), name: "Hardware & Fasteners", slug: "hardware-fasteners", description: "Nails, screws, bolts, hinges, locks, and general hardware.", sortOrder: 6 },
  { id: uuid(), name: "Blocks & Bricks", slug: "blocks-bricks", description: "Hollow blocks, solid blocks, clay bricks, and paving interlocks.", sortOrder: 7 },
  { id: uuid(), name: "Paint & Finishes", slug: "paint-finishes", description: "Interior and exterior paints, varnishes, primers, and decorative coatings.", sortOrder: 8 },
  { id: uuid(), name: "Timber & Wood", slug: "timber-wood", description: "Sawn timber, plywood, MDF boards, and treated poles.", sortOrder: 9 },
  { id: uuid(), name: "Doors & Windows", slug: "doors-windows", description: "Wooden doors, metal doors, aluminum windows, and glass fittings.", sortOrder: 10 },
  { id: uuid(), name: "Tiles & Flooring", slug: "tiles-flooring", description: "Ceramic tiles, porcelain tiles, granite, and terrazzo materials.", sortOrder: 11 },
  { id: uuid(), name: "Waterproofing & Insulation", slug: "waterproofing", description: "Bitumen membranes, sealants, damp-proof courses, and thermal insulation.", sortOrder: 12 },
  { id: uuid(), name: "Sand, Gravel & Aggregates", slug: "aggregates", description: "Building sand, gravel, chippings, laterite, and fill materials.", sortOrder: 13 },
  { id: uuid(), name: "Safety Equipment", slug: "safety-equipment", description: "Hard hats, safety boots, high-vis vests, gloves, and site safety gear.", sortOrder: 14 },
  { id: uuid(), name: "Tools & Machinery", slug: "tools-machinery", description: "Power tools, hand tools, mixers, vibrators, and construction equipment.", sortOrder: 15 },
];

const catMap: Record<string, string> = {};
categoryData.forEach((c) => { catMap[c.slug] = c.id; });

// ========== PRODUCTS ==========
const productData = [
  // ---- Cement & Concrete ----
  { categorySlug: "cement-concrete", name: "Ghacem Portland Cement 42.5R 50kg", slug: "ghacem-portland-42-5r-50kg", sku: "CEM-GHA-425R", unit: "bag", price: "88.00", compareAtPrice: "95.00", stock: 2500, desc: "Ghacem's premium rapid-strength Portland cement. Ideal for structural concrete, beams, and foundations. GSA certified." },
  { categorySlug: "cement-concrete", name: "Ghacem Portland Cement 32.5R 50kg", slug: "ghacem-portland-32-5r-50kg", sku: "CEM-GHA-325R", unit: "bag", price: "82.00", compareAtPrice: "88.00", stock: 3000, desc: "General-purpose Ghacem cement for block-laying, plastering, and mortar work." },
  { categorySlug: "cement-concrete", name: "Diamond Cement 42.5N 50kg", slug: "diamond-cement-42-5n-50kg", sku: "CEM-DIA-425N", unit: "bag", price: "84.00", compareAtPrice: "90.00", stock: 2800, desc: "Diamond Cement normal-strength 42.5 grade. Excellent for all-purpose construction work." },
  { categorySlug: "cement-concrete", name: "CIMAF Cement 32.5R 50kg", slug: "cimaf-cement-32-5r-50kg", sku: "CEM-CIM-325R", unit: "bag", price: "75.00", compareAtPrice: "82.00", stock: 1800, desc: "Budget-friendly CIMAF cement for non-structural applications. Block-laying and plastering." },
  { categorySlug: "cement-concrete", name: "Dangote Cement 42.5R 50kg", slug: "dangote-cement-42-5r-50kg", sku: "CEM-DAN-425R", unit: "bag", price: "86.00", compareAtPrice: "92.00", stock: 2200, desc: "Dangote rapid-strength cement. Strong availability in Northern and Ashanti regions." },
  { categorySlug: "cement-concrete", name: "SupaFix Tile Adhesive 25kg", slug: "supafix-tile-adhesive-25kg", sku: "CEM-SFA-TA25", unit: "bag", price: "55.00", compareAtPrice: "62.00", stock: 800, desc: "High-bond tile adhesive for ceramic and porcelain tiles. Interior and exterior use." },
  { categorySlug: "cement-concrete", name: "Concrete Plasticizer 25L", slug: "concrete-plasticizer-25l", sku: "CEM-PLS-25L", unit: "drum", price: "185.00", compareAtPrice: null, stock: 200, desc: "Water-reducing admixture for improving concrete workability and strength." },

  // ---- Steel & Rebar ----
  { categorySlug: "steel-rebar", name: "Steel Rebar Y10 (10mm) 12m", slug: "steel-rebar-y10-12m", sku: "STL-Y10-12M", unit: "length", price: "62.00", compareAtPrice: "68.00", stock: 5000, desc: "10mm deformation steel reinforcement bar. 12-meter length. For light structural work." },
  { categorySlug: "steel-rebar", name: "Steel Rebar Y12 (12mm) 12m", slug: "steel-rebar-y12-12m", sku: "STL-Y12-12M", unit: "length", price: "95.00", compareAtPrice: "105.00", stock: 4500, desc: "12mm reinforcement bar for columns, beams, and slabs. Standard structural grade." },
  { categorySlug: "steel-rebar", name: "Steel Rebar Y16 (16mm) 12m", slug: "steel-rebar-y16-12m", sku: "STL-Y16-12M", unit: "length", price: "168.00", compareAtPrice: "180.00", stock: 3200, desc: "16mm heavy-duty rebar for major structural elements. High tensile strength." },
  { categorySlug: "steel-rebar", name: "Steel Rebar Y20 (20mm) 12m", slug: "steel-rebar-y20-12m", sku: "STL-Y20-12M", unit: "length", price: "265.00", compareAtPrice: "285.00", stock: 1500, desc: "20mm rebar for foundations, retaining walls, and heavy structural applications." },
  { categorySlug: "steel-rebar", name: "Steel Rebar Y25 (25mm) 12m", slug: "steel-rebar-y25-12m", sku: "STL-Y25-12M", unit: "length", price: "420.00", compareAtPrice: null, stock: 800, desc: "25mm heavy rebar for commercial and industrial structures." },
  { categorySlug: "steel-rebar", name: "BRC Mesh A142 (2.4m x 4.8m)", slug: "brc-mesh-a142", sku: "STL-BRC-A142", unit: "sheet", price: "285.00", compareAtPrice: "310.00", stock: 600, desc: "Welded mesh for slab reinforcement. 4.8m x 2.4m sheets." },
  { categorySlug: "steel-rebar", name: "BRC Mesh A193 (2.4m x 4.8m)", slug: "brc-mesh-a193", sku: "STL-BRC-A193", unit: "sheet", price: "380.00", compareAtPrice: null, stock: 400, desc: "Heavy-duty welded mesh. Suitable for suspended slabs and driveways." },
  { categorySlug: "steel-rebar", name: "Binding Wire 25kg Roll", slug: "binding-wire-25kg", sku: "STL-BW-25KG", unit: "roll", price: "145.00", compareAtPrice: "160.00", stock: 1200, desc: "Annealed binding wire for tying rebar at intersections." },

  // ---- Roofing Materials ----
  { categorySlug: "roofing", name: "Aluzinc Roofing Sheet 0.40mm (per meter)", slug: "aluzinc-roofing-0-40mm", sku: "ROF-ALZ-040", unit: "meter", price: "38.00", compareAtPrice: "42.00", stock: 8000, desc: "Long-span aluzinc-coated roofing sheet. 0.40mm gauge. Cut to length." },
  { categorySlug: "roofing", name: "Aluzinc Roofing Sheet 0.55mm (per meter)", slug: "aluzinc-roofing-0-55mm", sku: "ROF-ALZ-055", unit: "meter", price: "52.00", compareAtPrice: "58.00", stock: 5000, desc: "Premium thick-gauge aluzinc roofing. Superior durability and lifespan." },
  { categorySlug: "roofing", name: "Aluminum Roofing Sheet 0.55mm (per meter)", slug: "aluminum-roofing-0-55mm", sku: "ROF-ALU-055", unit: "meter", price: "65.00", compareAtPrice: null, stock: 3000, desc: "Pure aluminum roofing by Aluworks. Lightweight, rust-proof, and long-lasting." },
  { categorySlug: "roofing", name: "Ridge Cap Aluminum", slug: "ridge-cap-aluminum", sku: "ROF-RCA-STD", unit: "piece", price: "45.00", compareAtPrice: "50.00", stock: 2000, desc: "Aluminum ridge cap for a professional roof finish." },
  { categorySlug: "roofing", name: "Roofing Nails 3\" (25kg Box)", slug: "roofing-nails-3in-25kg", sku: "ROF-NL3-25K", unit: "box", price: "220.00", compareAtPrice: null, stock: 500, desc: "Galvanized roofing nails with rubber washer. 25kg box." },
  { categorySlug: "roofing", name: "Roof Underlayment Felt 1m x 15m", slug: "roof-underlayment-felt", sku: "ROF-FLT-15M", unit: "roll", price: "85.00", compareAtPrice: null, stock: 400, desc: "Bituminous felt underlay for additional waterproofing under roofing sheets." },

  // ---- Plumbing & Pipes ----
  { categorySlug: "plumbing-pipes", name: "PVC Pipe 4\" (100mm) Class D", slug: "pvc-pipe-4in-class-d", sku: "PLB-PVC-4CD", unit: "length", price: "48.00", compareAtPrice: "55.00", stock: 3000, desc: "4-inch PVC pressure pipe. 6-meter length. For drainage and water supply." },
  { categorySlug: "plumbing-pipes", name: "PVC Pipe 3\" (75mm) Class D", slug: "pvc-pipe-3in-class-d", sku: "PLB-PVC-3CD", unit: "length", price: "35.00", compareAtPrice: "40.00", stock: 2500, desc: "3-inch PVC pipe. 6-meter length. Suitable for waste and vent lines." },
  { categorySlug: "plumbing-pipes", name: "PVC Pipe 2\" (50mm) Class D", slug: "pvc-pipe-2in-class-d", sku: "PLB-PVC-2CD", unit: "length", price: "22.00", compareAtPrice: null, stock: 4000, desc: "2-inch PVC pipe for internal plumbing and water distribution." },
  { categorySlug: "plumbing-pipes", name: "PVC Elbow 90° 4\"", slug: "pvc-elbow-90-4in", sku: "PLB-ELB-4-90", unit: "piece", price: "8.50", compareAtPrice: null, stock: 5000, desc: "90-degree PVC elbow fitting for 4-inch pipes." },
  { categorySlug: "plumbing-pipes", name: "PVC Tee 4\"", slug: "pvc-tee-4in", sku: "PLB-TEE-4", unit: "piece", price: "12.00", compareAtPrice: null, stock: 3000, desc: "PVC tee junction fitting for 4-inch pipes." },
  { categorySlug: "plumbing-pipes", name: "Polytank Water Tank 1000L", slug: "polytank-water-tank-1000l", sku: "PLB-TNK-1000", unit: "piece", price: "850.00", compareAtPrice: "950.00", stock: 150, desc: "Polytank 1000-liter plastic water storage tank. UV resistant." },
  { categorySlug: "plumbing-pipes", name: "Polytank Water Tank 2500L", slug: "polytank-water-tank-2500l", sku: "PLB-TNK-2500", unit: "piece", price: "1850.00", compareAtPrice: "2100.00", stock: 80, desc: "Large 2500-liter overhead water tank. Heavy-duty construction." },

  // ---- Electrical Supplies ----
  { categorySlug: "electrical", name: "Armoured Cable 16mm² (per meter)", slug: "armoured-cable-16mm", sku: "ELC-AC-16MM", unit: "meter", price: "28.00", compareAtPrice: "32.00", stock: 5000, desc: "3-core steel wire armoured cable. 16mm² conductor. For main power supply." },
  { categorySlug: "electrical", name: "Armoured Cable 10mm² (per meter)", slug: "armoured-cable-10mm", sku: "ELC-AC-10MM", unit: "meter", price: "18.00", compareAtPrice: null, stock: 8000, desc: "3-core armoured cable. 10mm² for sub-main distribution." },
  { categorySlug: "electrical", name: "Twin & Earth Cable 2.5mm² (100m)", slug: "twin-earth-cable-2-5mm-100m", sku: "ELC-TE-25-100", unit: "roll", price: "280.00", compareAtPrice: "320.00", stock: 600, desc: "100-meter roll of 2.5mm² twin and earth cable for socket circuits." },
  { categorySlug: "electrical", name: "Twin & Earth Cable 1.5mm² (100m)", slug: "twin-earth-cable-1-5mm-100m", sku: "ELC-TE-15-100", unit: "roll", price: "195.00", compareAtPrice: null, stock: 800, desc: "100-meter roll of 1.5mm² cable for lighting circuits." },
  { categorySlug: "electrical", name: "MCB Circuit Breaker 32A", slug: "mcb-circuit-breaker-32a", sku: "ELC-MCB-32A", unit: "piece", price: "22.00", compareAtPrice: "26.00", stock: 2000, desc: "Miniature circuit breaker, 32 Amp, single pole. DIN rail mount." },
  { categorySlug: "electrical", name: "MCB Circuit Breaker 20A", slug: "mcb-circuit-breaker-20a", sku: "ELC-MCB-20A", unit: "piece", price: "18.00", compareAtPrice: null, stock: 2500, desc: "20 Amp MCB for lighting and small appliance circuits." },
  { categorySlug: "electrical", name: "Distribution Board 12-Way", slug: "distribution-board-12-way", sku: "ELC-DB-12W", unit: "piece", price: "165.00", compareAtPrice: "185.00", stock: 300, desc: "12-way consumer unit/distribution board with main switch." },
  { categorySlug: "electrical", name: "Light Switch (Gang 1)", slug: "light-switch-gang-1", sku: "ELC-SW-1G", unit: "piece", price: "8.00", compareAtPrice: null, stock: 5000, desc: "Single gang light switch. White finish. Flush mount." },
  { categorySlug: "electrical", name: "13A Double Socket Outlet", slug: "13a-double-socket-outlet", sku: "ELC-SOC-13A", unit: "piece", price: "15.00", compareAtPrice: null, stock: 4000, desc: "Double 13-amp socket outlet with switch. British standard." },

  // ---- Hardware & Fasteners ----
  { categorySlug: "hardware-fasteners", name: "Wire Nails 3\" (25kg Box)", slug: "wire-nails-3in-25kg", sku: "HW-NL3-25K", unit: "box", price: "145.00", compareAtPrice: "160.00", stock: 800, desc: "Common wire nails, 3-inch. 25kg box. For general carpentry and formwork." },
  { categorySlug: "hardware-fasteners", name: "Wire Nails 4\" (25kg Box)", slug: "wire-nails-4in-25kg", sku: "HW-NL4-25K", unit: "box", price: "150.00", compareAtPrice: null, stock: 600, desc: "4-inch wire nails for heavy-duty framing and construction." },
  { categorySlug: "hardware-fasteners", name: "Concrete Nails 3\" (10kg)", slug: "concrete-nails-3in-10kg", sku: "HW-CN3-10K", unit: "box", price: "85.00", compareAtPrice: null, stock: 500, desc: "Hardened steel concrete nails for fixing to masonry and concrete." },
  { categorySlug: "hardware-fasteners", name: "Wood Screws 3\" (Box of 200)", slug: "wood-screws-3in-200", sku: "HW-WS3-200", unit: "box", price: "28.00", compareAtPrice: "32.00", stock: 2000, desc: "Countersunk wood screws, 3-inch. 200 pieces per box." },
  { categorySlug: "hardware-fasteners", name: "Coach Bolts M12 x 150mm (10pc)", slug: "coach-bolts-m12-150mm", sku: "HW-CB-M12", unit: "pack", price: "35.00", compareAtPrice: null, stock: 1000, desc: "M12 x 150mm coach bolts with nuts and washers. Pack of 10." },
  { categorySlug: "hardware-fasteners", name: "Door Hinge 4\" Brass (Pair)", slug: "door-hinge-4in-brass", sku: "HW-HNG-4BR", unit: "pair", price: "25.00", compareAtPrice: null, stock: 1500, desc: "4-inch solid brass butt hinge. Sold in pairs." },
  { categorySlug: "hardware-fasteners", name: "Padlock 60mm Heavy Duty", slug: "padlock-60mm-heavy-duty", sku: "HW-PLK-60HD", unit: "piece", price: "45.00", compareAtPrice: "52.00", stock: 800, desc: "Heavy-duty 60mm padlock. Hardened steel shackle." },

  // ---- Blocks & Bricks ----
  { categorySlug: "blocks-bricks", name: "Hollow Block 6\" (150mm)", slug: "hollow-block-6in", sku: "BLK-HB-6", unit: "piece", price: "5.50", compareAtPrice: "6.00", stock: 50000, desc: "Standard 6-inch hollow sandcrete block. Machine-made, 14-day cured." },
  { categorySlug: "blocks-bricks", name: "Hollow Block 9\" (225mm)", slug: "hollow-block-9in", sku: "BLK-HB-9", unit: "piece", price: "8.50", compareAtPrice: "9.50", stock: 35000, desc: "9-inch load-bearing hollow block for walls and partitions." },
  { categorySlug: "blocks-bricks", name: "Solid Block 6\" (150mm)", slug: "solid-block-6in", sku: "BLK-SB-6", unit: "piece", price: "7.00", compareAtPrice: null, stock: 20000, desc: "Solid 6-inch sandcrete block. Higher strength for foundations." },
  { categorySlug: "blocks-bricks", name: "Clay Brick (Standard)", slug: "clay-brick-standard", sku: "BLK-CLB-STD", unit: "piece", price: "1.80", compareAtPrice: null, stock: 80000, desc: "Standard clay brick for decorative walls and boundary fencing." },
  { categorySlug: "blocks-bricks", name: "Paving Interlock (S-Shape)", slug: "paving-interlock-s-shape", sku: "BLK-PVS-S", unit: "piece", price: "4.50", compareAtPrice: null, stock: 25000, desc: "S-shaped interlocking paving block. 60mm thick. For driveways and walkways." },
  { categorySlug: "blocks-bricks", name: "Kerb Stone 600mm", slug: "kerb-stone-600mm", sku: "BLK-KRB-600", unit: "piece", price: "18.00", compareAtPrice: null, stock: 5000, desc: "Pre-cast concrete kerb stone. 600mm length for road edging." },

  // ---- Paint & Finishes ----
  { categorySlug: "paint-finishes", name: "Latex Silk Emulsion 20L (White)", slug: "latex-silk-emulsion-20l-white", sku: "PNT-LSE-20W", unit: "bucket", price: "320.00", compareAtPrice: "360.00", stock: 500, desc: "Premium latex silk emulsion. Washable, smooth finish. 20-liter bucket." },
  { categorySlug: "paint-finishes", name: "Latex Matt Emulsion 20L (White)", slug: "latex-matt-emulsion-20l-white", sku: "PNT-LME-20W", unit: "bucket", price: "280.00", compareAtPrice: "310.00", stock: 600, desc: "Interior matt emulsion paint. Low sheen, great coverage. 20 liters." },
  { categorySlug: "paint-finishes", name: "Exterior Weathercoat 20L", slug: "exterior-weathercoat-20l", sku: "PNT-WC-20L", unit: "bucket", price: "420.00", compareAtPrice: "470.00", stock: 350, desc: "All-weather exterior paint with UV and rain protection. 20 liters." },
  { categorySlug: "paint-finishes", name: "Oil-Based Gloss Paint 4L", slug: "oil-based-gloss-paint-4l", sku: "PNT-OBG-4L", unit: "tin", price: "95.00", compareAtPrice: null, stock: 800, desc: "High-gloss oil-based paint for metal gates, doors, and trim." },
  { categorySlug: "paint-finishes", name: "Wood Varnish (Clear) 4L", slug: "wood-varnish-clear-4l", sku: "PNT-WVC-4L", unit: "tin", price: "85.00", compareAtPrice: null, stock: 600, desc: "Clear polyurethane wood varnish. Interior and exterior use." },
  { categorySlug: "paint-finishes", name: "Primer Undercoat 20L", slug: "primer-undercoat-20l", sku: "PNT-PU-20L", unit: "bucket", price: "195.00", compareAtPrice: "220.00", stock: 400, desc: "Water-based primer for new walls before topcoat application." },
  { categorySlug: "paint-finishes", name: "Textured Paint (Rough Coat) 25kg", slug: "textured-paint-rough-coat-25kg", sku: "PNT-TXR-25K", unit: "bag", price: "120.00", compareAtPrice: null, stock: 300, desc: "Textured wall coating for external wall finishes." },

  // ---- Timber & Wood ----
  { categorySlug: "timber-wood", name: "Wawa Timber 2\"x4\" (per length)", slug: "wawa-timber-2x4", sku: "TBR-WW-2X4", unit: "length", price: "25.00", compareAtPrice: null, stock: 5000, desc: "2x4 inch Wawa sawn timber. ~3.6m length. For formwork and carpentry." },
  { categorySlug: "timber-wood", name: "Wawa Timber 2\"x6\" (per length)", slug: "wawa-timber-2x6", sku: "TBR-WW-2X6", unit: "length", price: "38.00", compareAtPrice: null, stock: 3500, desc: "2x6 inch Wawa sawn timber for roof trusses and general construction." },
  { categorySlug: "timber-wood", name: "Odum Timber 2\"x6\" (per length)", slug: "odum-timber-2x6", sku: "TBR-OD-2X6", unit: "length", price: "85.00", compareAtPrice: null, stock: 1200, desc: "Premium Odum hardwood. Termite-resistant. For structural beams." },
  { categorySlug: "timber-wood", name: "Marine Plywood 18mm (4x8 ft)", slug: "marine-plywood-18mm", sku: "TBR-PLY-18M", unit: "sheet", price: "220.00", compareAtPrice: "250.00", stock: 600, desc: "18mm marine-grade plywood. Water-resistant. For formwork and cabinetry." },
  { categorySlug: "timber-wood", name: "Plywood 12mm (4x8 ft)", slug: "plywood-12mm", sku: "TBR-PLY-12", unit: "sheet", price: "145.00", compareAtPrice: null, stock: 800, desc: "Standard 12mm plywood for general construction and furniture." },
  { categorySlug: "timber-wood", name: "MDF Board 18mm (4x8 ft)", slug: "mdf-board-18mm", sku: "TBR-MDF-18", unit: "sheet", price: "165.00", compareAtPrice: null, stock: 400, desc: "Medium density fibreboard. Smooth surface for painting and laminating." },

  // ---- Doors & Windows ----
  { categorySlug: "doors-windows", name: "Flush Door (Hardwood) 3ft x 7ft", slug: "flush-door-hardwood-3x7", sku: "DW-FDH-3X7", unit: "piece", price: "450.00", compareAtPrice: "520.00", stock: 200, desc: "Solid hardwood flush door. Standard 3ft x 7ft. Ready for finishing." },
  { categorySlug: "doors-windows", name: "Panel Door (4-Panel) 3ft x 7ft", slug: "panel-door-4-panel-3x7", sku: "DW-PD4-3X7", unit: "piece", price: "650.00", compareAtPrice: null, stock: 150, desc: "Classic 4-panel wooden door. Odum/Mahogany. 3ft x 7ft." },
  { categorySlug: "doors-windows", name: "Metal Security Door", slug: "metal-security-door", sku: "DW-MSD-STD", unit: "piece", price: "1200.00", compareAtPrice: "1400.00", stock: 80, desc: "Heavy-duty steel security door with frame. Standard size." },
  { categorySlug: "doors-windows", name: "Aluminum Sliding Window 4ft x 4ft", slug: "aluminum-sliding-window-4x4", sku: "DW-ASW-4X4", unit: "piece", price: "380.00", compareAtPrice: "420.00", stock: 250, desc: "Powder-coated aluminum sliding window with glass. 4ft x 4ft." },
  { categorySlug: "doors-windows", name: "Aluminum Casement Window 3ft x 4ft", slug: "aluminum-casement-window-3x4", sku: "DW-ACW-3X4", unit: "piece", price: "320.00", compareAtPrice: null, stock: 200, desc: "Single-opening casement window with mosquito mesh." },
  { categorySlug: "doors-windows", name: "Louver Blades (Glass) 6\" Set of 6", slug: "louver-blades-glass-6in", sku: "DW-LBG-6", unit: "set", price: "28.00", compareAtPrice: null, stock: 3000, desc: "6-inch glass louver blades. Set of 6 for one louvre frame." },

  // ---- Tiles & Flooring ----
  { categorySlug: "tiles-flooring", name: "Ceramic Floor Tile 40x40cm (Box)", slug: "ceramic-floor-tile-40x40", sku: "TIL-CFT-40", unit: "box", price: "65.00", compareAtPrice: "75.00", stock: 2000, desc: "Ceramic floor tile, 40x40cm. 12 tiles per box (1.92 sqm). Matt finish." },
  { categorySlug: "tiles-flooring", name: "Porcelain Floor Tile 60x60cm (Box)", slug: "porcelain-floor-tile-60x60", sku: "TIL-PFT-60", unit: "box", price: "120.00", compareAtPrice: "140.00", stock: 1200, desc: "Porcelain floor tile, 60x60cm. 4 tiles per box (1.44 sqm). Polished." },
  { categorySlug: "tiles-flooring", name: "Wall Tile 25x40cm (Box)", slug: "wall-tile-25x40", sku: "TIL-WT-2540", unit: "box", price: "55.00", compareAtPrice: null, stock: 1800, desc: "Glazed ceramic wall tile for kitchens and bathrooms. 12 per box." },
  { categorySlug: "tiles-flooring", name: "Granite Tile 60x60cm (Box)", slug: "granite-tile-60x60", sku: "TIL-GT-60", unit: "box", price: "185.00", compareAtPrice: "210.00", stock: 500, desc: "Natural granite floor tile. 4 tiles per box. For upscale finishes." },
  { categorySlug: "tiles-flooring", name: "Tile Grout 5kg (White)", slug: "tile-grout-5kg-white", sku: "TIL-GRT-5W", unit: "bag", price: "32.00", compareAtPrice: null, stock: 1500, desc: "White tile grout for filling joints. 5kg bag." },
  { categorySlug: "tiles-flooring", name: "Tile Spacers 3mm (Pack 200)", slug: "tile-spacers-3mm-200", sku: "TIL-SPC-3MM", unit: "pack", price: "8.00", compareAtPrice: null, stock: 3000, desc: "Plastic tile spacers, 3mm. Pack of 200." },

  // ---- Waterproofing & Insulation ----
  { categorySlug: "waterproofing", name: "Bitumen Membrane 1m x 10m Roll", slug: "bitumen-membrane-1x10m", sku: "WP-BM-1X10", unit: "roll", price: "280.00", compareAtPrice: "320.00", stock: 300, desc: "Self-adhesive bituminous waterproofing membrane for flat roofs and foundations." },
  { categorySlug: "waterproofing", name: "Damp Proof Course (DPC) 225mm x 30m", slug: "damp-proof-course-225mm", sku: "WP-DPC-225", unit: "roll", price: "55.00", compareAtPrice: null, stock: 600, desc: "Polyethylene damp proof course. 225mm wide, 30m roll." },
  { categorySlug: "waterproofing", name: "Silicone Sealant 280ml", slug: "silicone-sealant-280ml", sku: "WP-SS-280", unit: "tube", price: "18.00", compareAtPrice: null, stock: 2000, desc: "Clear silicone sealant for bathrooms, kitchens, and window frames." },
  { categorySlug: "waterproofing", name: "Waterproof Cement Additive 5L", slug: "waterproof-cement-additive-5l", sku: "WP-WCA-5L", unit: "jerry", price: "65.00", compareAtPrice: null, stock: 400, desc: "Liquid waterproofing admixture for concrete and mortar." },
  { categorySlug: "waterproofing", name: "Polythene Sheet 1000 Gauge (4m x 50m)", slug: "polythene-sheet-1000-gauge", sku: "WP-PS-1000G", unit: "roll", price: "320.00", compareAtPrice: null, stock: 200, desc: "Heavy-duty polythene sheeting for damp proofing under slabs." },

  // ---- Sand, Gravel & Aggregates ----
  { categorySlug: "aggregates", name: "Building Sand (per trip - 5 tons)", slug: "building-sand-5-ton", sku: "AGG-BSN-5T", unit: "trip", price: "850.00", compareAtPrice: "950.00", stock: 100, desc: "Clean building sand for plastering and mortar. 5-ton tipper load." },
  { categorySlug: "aggregates", name: "Gravel/Chippings 3/4\" (per trip - 5 tons)", slug: "gravel-chippings-3-4-5-ton", sku: "AGG-GRV-5T", unit: "trip", price: "950.00", compareAtPrice: "1050.00", stock: 80, desc: "Crushed granite chippings for concrete mix. 5-ton load." },
  { categorySlug: "aggregates", name: "Quarry Dust (per trip - 5 tons)", slug: "quarry-dust-5-ton", sku: "AGG-QDS-5T", unit: "trip", price: "600.00", compareAtPrice: null, stock: 100, desc: "Fine quarry dust for block-making and sub-base filling." },
  { categorySlug: "aggregates", name: "Laterite (per trip - 5 tons)", slug: "laterite-5-ton", sku: "AGG-LAT-5T", unit: "trip", price: "450.00", compareAtPrice: null, stock: 120, desc: "Laterite fill material for foundations and driveways." },

  // ---- Safety Equipment ----
  { categorySlug: "safety-equipment", name: "Safety Helmet (Hard Hat)", slug: "safety-helmet-hard-hat", sku: "SAF-HH-STD", unit: "piece", price: "25.00", compareAtPrice: "30.00", stock: 2000, desc: "HDPE construction safety helmet with adjustable harness. Yellow." },
  { categorySlug: "safety-equipment", name: "Safety Boots (Steel Toe)", slug: "safety-boots-steel-toe", sku: "SAF-SBT-STD", unit: "pair", price: "120.00", compareAtPrice: "145.00", stock: 500, desc: "Steel toe-cap safety boots. Oil and slip resistant. Various sizes." },
  { categorySlug: "safety-equipment", name: "High-Vis Reflective Vest", slug: "high-vis-reflective-vest", sku: "SAF-HVV-STD", unit: "piece", price: "15.00", compareAtPrice: null, stock: 3000, desc: "Fluorescent yellow/orange high-visibility vest with reflective strips." },
  { categorySlug: "safety-equipment", name: "Work Gloves (Heavy Duty) Pair", slug: "work-gloves-heavy-duty", sku: "SAF-WGH-STD", unit: "pair", price: "12.00", compareAtPrice: null, stock: 4000, desc: "Leather palm heavy-duty work gloves for construction sites." },
  { categorySlug: "safety-equipment", name: "Safety Goggles", slug: "safety-goggles", sku: "SAF-SGG-STD", unit: "piece", price: "18.00", compareAtPrice: null, stock: 1500, desc: "Anti-scratch polycarbonate safety goggles. Clear lens." },
  { categorySlug: "safety-equipment", name: "First Aid Kit (Site)", slug: "first-aid-kit-site", sku: "SAF-FAK-SITE", unit: "kit", price: "95.00", compareAtPrice: "110.00", stock: 200, desc: "Comprehensive construction site first aid kit. 50-piece." },

  // ---- Tools & Machinery ----
  { categorySlug: "tools-machinery", name: "Concrete Mixer 1-Bag (Electric)", slug: "concrete-mixer-1-bag-electric", sku: "TM-CMX-1B", unit: "piece", price: "4500.00", compareAtPrice: "5200.00", stock: 30, desc: "Electric concrete mixer. 1-bag (50kg) capacity. Portable." },
  { categorySlug: "tools-machinery", name: "Poker Vibrator 2\" Head", slug: "poker-vibrator-2in-head", sku: "TM-PVB-2IN", unit: "piece", price: "1800.00", compareAtPrice: null, stock: 50, desc: "Concrete poker vibrator with 2-inch head. For compacting fresh concrete." },
  { categorySlug: "tools-machinery", name: "Wheelbarrow (Heavy Duty)", slug: "wheelbarrow-heavy-duty", sku: "TM-WBR-HD", unit: "piece", price: "250.00", compareAtPrice: "285.00", stock: 200, desc: "Heavy-duty construction wheelbarrow. 65L capacity. Pneumatic tyre." },
  { categorySlug: "tools-machinery", name: "Spirit Level 4ft (1200mm)", slug: "spirit-level-4ft", sku: "TM-SLV-4FT", unit: "piece", price: "45.00", compareAtPrice: null, stock: 300, desc: "Professional aluminum spirit level. 4-foot length. 3 vials." },
  { categorySlug: "tools-machinery", name: "Measuring Tape 5m", slug: "measuring-tape-5m", sku: "TM-MT-5M", unit: "piece", price: "15.00", compareAtPrice: null, stock: 1500, desc: "5-meter retractable steel measuring tape with lock." },
  { categorySlug: "tools-machinery", name: "Plumb Bob (Brass)", slug: "plumb-bob-brass", sku: "TM-PBB-STD", unit: "piece", price: "22.00", compareAtPrice: null, stock: 800, desc: "Solid brass plumb bob for checking vertical alignment." },
  { categorySlug: "tools-machinery", name: "Hacksaw Frame with Blade", slug: "hacksaw-frame-with-blade", sku: "TM-HSF-STD", unit: "piece", price: "28.00", compareAtPrice: null, stock: 600, desc: "Adjustable hacksaw frame with bi-metal blade. For cutting rebar and pipes." },
];

// ========== SUPPLIERS ==========
const supplierData = [
  { id: uuid(), name: "Tema Steel Works Ltd", email: "orders@temasteelworks.com", phone: "+233 30 220 1234" },
  { id: uuid(), name: "Accra Cement Depot", email: "sales@accracementdepot.com", phone: "+233 30 221 5678" },
  { id: uuid(), name: "Kumasi Timber Merchants", email: "info@kumasitimber.com", phone: "+233 32 202 9012" },
  { id: uuid(), name: "Takoradi Roofing Supplies", email: "takoradiroofing@gmail.com", phone: "+233 31 203 3456" },
  { id: uuid(), name: "Spintex Hardware Centre", email: "spintexhardware@gmail.com", phone: "+233 55 123 4567" },
  { id: uuid(), name: "Kasoa Block Factory", email: "kasoablocks@gmail.com", phone: "+233 24 456 7890" },
  { id: uuid(), name: "B5 Plus Steel Ghana", email: "orders@b5plusghana.com", phone: "+233 30 225 6789" },
  { id: uuid(), name: "Aluworks Roofing Division", email: "roofing@aluworks.com", phone: "+233 30 220 4321" },
  { id: uuid(), name: "Dzorwulu Paint House", email: "dzorwulupaint@gmail.com", phone: "+233 20 987 6543" },
  { id: uuid(), name: "Adenta Electrical Supplies", email: "adentaelectric@gmail.com", phone: "+233 24 111 2222" },
];

// ========== SEED FUNCTION ==========
async function seed() {
  console.log("🌱 Seeding database...\n");

  // 1. Categories
  console.log("📦 Seeding categories...");
  for (const cat of categoryData) {
    await db.insert(schema.categories).values({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      sortOrder: cat.sortOrder,
      isActive: true,
    }).onConflictDoNothing();
  }
  console.log(`   ✓ ${categoryData.length} categories\n`);

  // 2. Products
  console.log("🏗️ Seeding products...");
  for (const p of productData) {
    const categoryId = catMap[p.categorySlug];
    if (!categoryId) { console.warn(`   ⚠ Category not found: ${p.categorySlug}`); continue; }
    await db.insert(schema.products).values({
      categoryId,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      description: p.desc,
      shortDescription: p.desc.split(".")[0] + ".",
      unit: p.unit,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      images: [],
      isActive: true,
      stockQuantity: p.stock,
    }).onConflictDoNothing();
  }
  console.log(`   ✓ ${productData.length} products\n`);

  // 3. Suppliers
  console.log("🚚 Seeding suppliers...");
  for (const s of supplierData) {
    await db.insert(schema.suppliers).values({
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      isActive: true,
    }).onConflictDoNothing();
  }
  console.log(`   ✓ ${supplierData.length} suppliers\n`);

  // 4. Admin accounts (via Better Auth tables)
  console.log("👤 Seeding admin accounts...");
  const admins = [
    { id: uuid(), name: "Super Admin", email: "admin@primebuild.com", password: "admin123456" },
    { id: uuid(), name: "Operations Manager", email: "operations@primebuild.com", password: "ops123456" },
    { id: uuid(), name: "Abdul", email: "abdul@primebuild.com", password: "abdul123456" },
  ];
  for (const admin of admins) {
    await db.insert(schema.user).values({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      emailVerified: true,
    }).onConflictDoNothing();

    await db.insert(schema.account).values({
      id: uuid(),
      userId: admin.id,
      accountId: admin.id,
      providerId: "credential",
      password: await hashPw(admin.password),
    }).onConflictDoNothing();

    await db.insert(schema.profile).values({
      id: admin.id,
      fullName: admin.name,
      role: "admin",
    }).onConflictDoNothing();
  }
  console.log(`   ✓ ${admins.length} admin accounts\n`);

  // 5. Demo customer accounts
  console.log("👥 Seeding demo customers...");
  const customers = [
    { id: uuid(), name: "Kwame Asante", email: "kwame@example.com", phone: "+233 20 111 0001" },
    { id: uuid(), name: "Ama Serwaa", email: "ama@example.com", phone: "+233 24 222 0002" },
    { id: uuid(), name: "Kofi Mensah", email: "kofi@example.com", phone: "+233 55 333 0003" },
    { id: uuid(), name: "Akua Boateng", email: "akua@example.com", phone: "+233 20 444 0004" },
    { id: uuid(), name: "Yaw Owusu", email: "yaw@example.com", phone: "+233 27 555 0005" },
  ];
  for (const c of customers) {
    await db.insert(schema.user).values({
      id: c.id,
      name: c.name,
      email: c.email,
      emailVerified: true,
    }).onConflictDoNothing();
    await db.insert(schema.account).values({
      id: uuid(),
      userId: c.id,
      accountId: c.id,
      providerId: "credential",
      password: await hashPw("demo123456"),
    }).onConflictDoNothing();
    await db.insert(schema.profile).values({
      id: c.id,
      fullName: c.name,
      phone: c.phone,
      role: "customer",
    }).onConflictDoNothing();
  }
  console.log(`   ✓ ${customers.length} demo customers\n`);

  // 6. Sample proformas
  console.log("📋 Seeding sample proformas...");
  const allProducts = await db.select().from(schema.products).limit(20);
  if (allProducts.length > 0) {
    const proformaStatuses = ["pending", "pending", "approved", "approved", "declined", "expired", "converted", "converted"];
    for (let i = 0; i < proformaStatuses.length; i++) {
      const customer = customers[i % customers.length];
      const status = proformaStatuses[i];
      const proformaId = uuid();
      const items = allProducts.slice(i * 2, i * 2 + 3).map((p) => ({
        productId: p.id,
        productName: p.name,
        unitPrice: p.price,
        quantity: Math.floor(Math.random() * 20) + 5,
      }));
      const subtotal = items.reduce((s, it) => s + Number(it.unitPrice) * it.quantity, 0);
      const total = subtotal;
      const createdAt = daysAgo(Math.floor(Math.random() * 30) + 1);

      await db.insert(schema.proformas).values({
        id: proformaId,
        userId: customer.id,
        proformaNumber: `PB-${2026}${String(i + 1).padStart(4, "0")}`,
        shareToken: uuid(),
        status,
        validUntil: days(status === "expired" ? -1 : 7),
        subtotal: subtotal.toFixed(2),
        tax: "0",
        total: total.toFixed(2),
        notes: `Demo proforma for ${customer.name}'s project`,
        createdAt,
        updatedAt: createdAt,
      }).onConflictDoNothing();

      for (const item of items) {
        await db.insert(schema.proformaItems).values({
          proformaId,
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: (Number(item.unitPrice) * item.quantity).toFixed(2),
        }).onConflictDoNothing();
      }

      if (status === "approved" || status === "converted") {
        await db.insert(schema.approvalActions).values({
          proformaId,
          action: "approved",
          actorName: "Project Manager",
          actorEmail: "pm@example.com",
          comment: "Approved for procurement",
          createdAt,
        }).onConflictDoNothing();
      }
      if (status === "declined") {
        await db.insert(schema.approvalActions).values({
          proformaId,
          action: "declined",
          actorName: "Finance Director",
          actorEmail: "finance@example.com",
          comment: "Budget exceeded for this quarter",
          createdAt,
        }).onConflictDoNothing();
      }
    }
    console.log(`   ✓ ${proformaStatuses.length} sample proformas\n`);

    // 7. Sample orders (from converted proformas)
    console.log("🛒 Seeding sample orders...");
    const orderStatuses: Array<{ status: string; payment: string }> = [
      { status: "confirmed", payment: "paid" },
      { status: "with_supplier", payment: "paid" },
      { status: "dispatched", payment: "paid" },
      { status: "delivered", payment: "paid" },
      { status: "confirmed", payment: "pending" },
    ];
    for (let i = 0; i < orderStatuses.length; i++) {
      const customer = customers[i % customers.length];
      const orderId = uuid();
      const orderItems = allProducts.slice(i * 2, i * 2 + 3).map((p) => ({
        productId: p.id,
        productName: p.name,
        unitPrice: p.price,
        quantity: Math.floor(Math.random() * 15) + 3,
      }));
      const subtotal = orderItems.reduce((s, it) => s + Number(it.unitPrice) * it.quantity, 0);
      const createdAt = daysAgo(Math.floor(Math.random() * 20) + 1);
      const supplier = supplierData[i % supplierData.length];

      await db.insert(schema.orders).values({
        id: orderId,
        userId: customer.id,
        orderNumber: `ORD-${2026}${String(i + 1).padStart(4, "0")}`,
        status: orderStatuses[i].status,
        paymentStatus: orderStatuses[i].payment,
        paymentReference: orderStatuses[i].payment === "paid" ? `PAY-${uuid().slice(0, 8)}` : null,
        assignedToSupplierId: orderStatuses[i].status !== "confirmed" ? supplier.id : null,
        subtotal: subtotal.toFixed(2),
        tax: "0",
        total: subtotal.toFixed(2),
        createdAt,
        updatedAt: createdAt,
      }).onConflictDoNothing();

      for (const item of orderItems) {
        await db.insert(schema.orderItems).values({
          orderId,
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: (Number(item.unitPrice) * item.quantity).toFixed(2),
        }).onConflictDoNothing();
      }
    }
    console.log(`   ✓ ${orderStatuses.length} sample orders\n`);
  }

  console.log("✅ Seeding complete!");
}

seed().catch((e) => {
  console.error("Seeding failed:", e);
  process.exit(1);
});

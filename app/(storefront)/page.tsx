import { getCategories, getProducts } from "@/lib/data/catalogue";
import { HeroSection } from "@/components/home/HeroSection";
import { LiveTicker } from "@/components/home/LiveTicker";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyPrimeBuild } from "@/components/home/WhyPrimeBuild";
import { CTASection } from "@/components/home/CTASection";

export default async function HomePage() {
  const categories = await getCategories();
  const products = await getProducts();

  return (
    <div className="flex flex-col">
      <HeroSection />
      <LiveTicker />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={products.slice(0, 6)} />
      <WhyPrimeBuild />
      <CTASection />
    </div>
  );
}

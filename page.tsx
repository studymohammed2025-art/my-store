import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FlashDeals from "@/components/home/FlashDeals";
import ProductSection from "@/components/home/ProductSection";
import PromoBanners from "@/components/home/PromoBanners";
import Brands from "@/components/home/Brands";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import Recommended from "@/components/home/Recommended";
import { products } from "@/data/products";

export default function HomePage() {
  const best = [...products].sort((a, b) => b.sold - a.sold).slice(0, 8);
  const fresh = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);
  return (
    <>
      <Hero />
      <Categories />
      <FlashDeals />
      <ProductSection id="best" titleKey="bestSellers" items={best} />
      <PromoBanners />
      <ProductSection id="new" titleKey="newArrivals" items={fresh} />
      <Recommended />
      <Brands />
      <Testimonials />
      <Newsletter />
    </>
  );
}

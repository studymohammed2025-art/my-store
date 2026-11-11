import { getProducts } from "@/lib/data";
import ProductsClient from "@/components/product/ProductsClient";

export const revalidate = 60;

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string } }) {
  const products = await getProducts();
  return <ProductsClient products={products} initialCategory={searchParams.category ?? ""} />;
}

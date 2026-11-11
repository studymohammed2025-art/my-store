import { getProduct, getProducts } from "@/lib/data";
import ProductDetails from "@/components/product/ProductDetails";
import NotFoundProduct from "@/components/product/NotFoundProduct";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: { id: string } }) {
  const [product, all] = await Promise.all([getProduct(params.id), getProducts()]);
  if (!product) return <NotFoundProduct />;
  const related = all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const others = all.filter((p) => p.category !== product.category).sort((a, b) => b.sold - a.sold).slice(0, 4);
  return <ProductDetails product={product} related={related} others={others} />;
}

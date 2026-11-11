"use client";
import { Heart } from "lucide-react";
import { products } from "@/data/products";
import { useStore, useT } from "@/store/useStore";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductCard from "@/components/product/ProductCard";

export default function WishlistClient() {
  const { t } = useT();
  const wishlist = useStore((s) => s.wishlist);
  const items = wishlist.flatMap((id) => products.find((p) => p.id === id) ?? []);
  return (
    <>
      <Breadcrumbs items={[{ label: t("wishTitle") }]} />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-extrabold md:text-3xl">{t("wishTitle")} ({items.length})</h1>
        {items.length === 0 ? (
          <div className="rounded-xl2 bg-card p-12 text-center">
            <Heart className="mx-auto mb-3 text-muted" size={40} />
            <p className="text-muted">{t("wishEmpty")}</p>
            <a href="/products" className="mt-5 inline-block rounded-full bg-accent px-7 py-3 font-bold text-accent-fg">{t("continueShop")}</a>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        )}
      </div>
    </>
  );
}

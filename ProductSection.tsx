"use client";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import type { TKey } from "@/lib/i18n";
import { useT } from "@/store/useStore";
import ProductCard from "@/components/product/ProductCard";
import ProductSkeleton from "@/components/product/ProductSkeleton";

export function useSimulatedLoading(ms = 700) {
  // محاكاة تحميل البيانات لعرض الـ Skeleton. في المرحلة 2 تُستبدل بحالة تحميل حقيقية من Supabase
  const [loading, setLoading] = useState(true);
  useEffect(() => { const id = setTimeout(() => setLoading(false), ms); return () => clearTimeout(id); }, [ms]);
  return loading;
}

export function ProductGrid({ items, loading }: { items: Product[]; loading: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {loading ? items.map((p) => <ProductSkeleton key={p.id} />) : items.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

export default function ProductSection({ id, titleKey, items }: { id: string; titleKey: TKey; items: Product[] }) {
  const { t } = useT();
  const loading = useSimulatedLoading();
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-extrabold md:text-3xl">{t(titleKey)}</h2>
        <a href="/products" className="text-sm font-semibold text-accent hover:underline">{t("viewAll")}</a>
      </div>
      <ProductGrid items={items} loading={loading} />
    </section>
  );
}

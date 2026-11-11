"use client";
import { useMemo } from "react";
import { products } from "@/data/products";
import { useStore, useT } from "@/store/useStore";
import { ProductGrid, useSimulatedLoading } from "./ProductSection";

/** مقترحات مبنية على المنتجات التي نقر عليها المستخدم (recent). وإن لم يوجد سجل نعرض الأعلى تقييماً */
export default function Recommended() {
  const { t } = useT();
  const recent = useStore((s) => s.recent);
  const loading = useSimulatedLoading(800);
  const items = useMemo(() => {
    const cats = new Set(recent.map((id) => products.find((p) => p.id === id)?.category).filter(Boolean));
    const pool = cats.size ? products.filter((p) => cats.has(p.category) && !recent.includes(p.id)) : [];
    const rest = [...products].sort((a, b) => b.rating - a.rating).filter((p) => !pool.includes(p));
    return [...pool, ...rest].slice(0, 4);
  }, [recent]);
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold md:text-3xl">{t("recommended")}</h2>
        <p className="mt-1 text-sm text-muted">{t("recommendedSub")}</p>
      </div>
      <ProductGrid items={items} loading={loading} />
    </section>
  );
}

"use client";
import { Zap } from "lucide-react";
import { products } from "@/data/products";
import { useT } from "@/store/useStore";
import Countdown from "@/components/ui/Countdown";
import { ProductGrid, useSimulatedLoading } from "./ProductSection";

export default function FlashDeals() {
  const { t } = useT();
  const loading = useSimulatedLoading(600);
  const items = products.filter((p) => p.flash).slice(0, 8);
  return (
    <section id="flash" className="mx-auto max-w-7xl px-4 py-6">
      <div className="rounded-xl2 border border-accent/30 bg-accent/5 p-4 md:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="fill-accent text-accent" />
            <h2 className="text-2xl font-extrabold md:text-3xl">{t("flashDeals")}</h2>
          </div>
          <div className="flex items-center gap-3"><span className="text-sm font-semibold text-muted">{t("endsIn")}</span><Countdown /></div>
        </div>
        <ProductGrid items={items} loading={loading} />
      </div>
    </section>
  );
}

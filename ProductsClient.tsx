"use client";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { categories } from "@/data/products";
import { useT } from "@/store/useStore";
import { useSimulatedLoading } from "@/components/home/ProductSection";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import FilterPanel, { type Filters } from "./FilterPanel";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;
type Sort = "new" | "low" | "high" | "rated" | "best";

export default function ProductsClient({ products, initialCategory }: { products: Product[]; initialCategory: string }) {
  const { t, lang } = useT();
  const loading = useSimulatedLoading(500);

  // حدود السعر وقوائم الفلاتر تُشتق من البيانات نفسها
  const bounds = useMemo(() => {
    const prices = products.map((p) => p.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [products]);
  const allBrands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products]);
  const allSizes = useMemo(() => Array.from(new Set(products.flatMap((p) => p.sizes))), [products]);
  const allColors = useMemo(() => Array.from(new Set(products.flatMap((p) => p.colors))), [products]);

  const initial: Filters = { category: initialCategory, min: bounds.min, max: bounds.max, sizes: [], colors: [], brands: [], rating: 0, sale: false, inStock: false };
  const [f, setF] = useState<Filters>(initial);
  const [sort, setSort] = useState<Sort>("new");
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(false);

  const set = (patch: Partial<Filters>) => { setF((x) => ({ ...x, ...patch })); setPage(1); };

  const filtered = useMemo(() => {
    const list = products.filter((p) =>
      (!f.category || p.category === f.category) &&
      p.price >= f.min && p.price <= f.max &&
      (!f.sizes.length || p.sizes.some((s) => f.sizes.includes(s))) &&
      (!f.colors.length || p.colors.some((c) => f.colors.includes(c))) &&
      (!f.brands.length || f.brands.includes(p.brand)) &&
      p.rating >= f.rating &&
      (!f.sale || Boolean(p.oldPrice)) &&
      (!f.inStock || p.stock > 0));
    const by: Record<Sort, (a: Product, b: Product) => number> = {
      new: (a, b) => b.createdAt.localeCompare(a.createdAt),
      low: (a, b) => a.price - b.price,
      high: (a, b) => b.price - a.price,
      rated: (a, b) => b.rating - a.rating,
      best: (a, b) => b.sold - a.sold,
    };
    return [...list].sort(by[sort]);
  }, [products, f, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const catName = categories.find((c) => c.id === f.category)?.name[lang];

  const panel = <FilterPanel f={f} set={set} bounds={bounds} allBrands={allBrands} allSizes={allSizes} allColors={allColors} />;

  return (
    <>
      <Breadcrumbs items={[{ label: catName ?? t("products") }]} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h2 className="font-extrabold">{t("pFilters")}</h2>
            <button onClick={() => { setF({ ...initial, category: "" }); setPage(1); }} className="text-sm font-semibold text-accent hover:underline">{t("pClear")}</button>
          </div>
          {panel}
        </aside>

        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted"><span className="font-bold text-fg">{filtered.length}</span> {t("pResults")}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setDrawer(true)} className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold lg:hidden"><SlidersHorizontal size={16} /> {t("pFilters")}</button>
              <select value={sort} onChange={(e) => { setSort(e.target.value as Sort); setPage(1); }} aria-label={t("pSort")}
                className="rounded-full border border-line bg-bg px-4 py-2 text-sm font-semibold outline-none focus:border-accent">
                <option value="new">{t("sortNew")}</option>
                <option value="best">{t("sortBest")}</option>
                <option value="rated">{t("sortRated")}</option>
                <option value="low">{t("sortLow")}</option>
                <option value="high">{t("sortHigh")}</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}</div>
          ) : shown.length === 0 ? (
            <p className="rounded-xl2 bg-card p-10 text-center text-muted">{t("pEmpty")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">{shown.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          )}

          {pages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-1" aria-label="pagination">
              <button disabled={current === 1} onClick={() => setPage(current - 1)} className="rounded-full px-4 py-2 text-sm font-semibold hover:bg-card disabled:opacity-40">{t("pPrev")}</button>
              {Array.from({ length: pages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} aria-current={current === i + 1} className={cn("h-9 w-9 rounded-full text-sm font-bold", current === i + 1 ? "bg-fg text-bg" : "hover:bg-card")}>{i + 1}</button>
              ))}
              <button disabled={current === pages} onClick={() => setPage(current + 1)} className="rounded-full px-4 py-2 text-sm font-semibold hover:bg-card disabled:opacity-40">{t("pNext")}</button>
            </nav>
          )}
        </section>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-[80] bg-black/50 lg:hidden" onClick={() => setDrawer(false)}>
          <div onClick={(e) => e.stopPropagation()} className="ms-auto flex h-full w-[22rem] max-w-[90%] flex-col bg-bg">
            <div className="flex items-center justify-between border-b border-line p-4">
              <h2 className="font-extrabold">{t("pFilters")}</h2>
              <button onClick={() => setDrawer(false)} aria-label={t("close")} className="rounded-full p-1.5 hover:bg-card"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4">{panel}</div>
            <div className="flex gap-2 border-t border-line p-4">
              <button onClick={() => { setF({ ...initial, category: "" }); setPage(1); }} className="rounded-full border border-line px-5 py-3 text-sm font-semibold">{t("pClear")}</button>
              <button onClick={() => setDrawer(false)} className="flex-1 rounded-full bg-accent py-3 font-bold text-accent-fg">{t("pShow")} ({filtered.length})</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

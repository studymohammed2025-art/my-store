"use client";
import { Star } from "lucide-react";
import { categories } from "@/data/products";
import { useT, usePrice } from "@/store/useStore";
import { cn } from "@/lib/utils";

export interface Filters {
  category: string;
  min: number;
  max: number;
  sizes: string[];
  colors: string[];
  brands: string[];
  rating: number;
  sale: boolean;
  inStock: boolean;
}

interface Props {
  f: Filters;
  set: (patch: Partial<Filters>) => void;
  bounds: { min: number; max: number };
  allBrands: string[];
  allSizes: string[];
  allColors: string[];
}

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line py-4">
      <legend className="mb-3 text-sm font-extrabold">{title}</legend>
      {children}
    </fieldset>
  );
}

export default function FilterPanel({ f, set, bounds, allBrands, allSizes, allColors }: Props) {
  const { t, lang } = useT();
  const price = usePrice();
  return (
    <div>
      <Group title={t("pCategory")}>
        <div className="flex flex-wrap gap-2">
          {[{ id: "", name: { ar: "الكل", en: "All" } }, ...categories].map((c) => (
            <button key={c.id} onClick={() => set({ category: c.id })}
              className={cn("rounded-full px-3 py-1.5 text-sm font-semibold", f.category === c.id ? "bg-fg text-bg" : "bg-card hover:bg-line")}>{c.name[lang]}</button>
          ))}
        </div>
      </Group>

      <Group title={t("pPrice")}>
        <div className="mb-2 flex justify-between text-sm font-semibold"><span>{price(f.min)}</span><span>{price(f.max)}</span></div>
        <div className="space-y-2">
          <input type="range" aria-label="min price" min={bounds.min} max={bounds.max} value={f.min} className="w-full accent-accent"
            onChange={(e) => set({ min: Math.min(Number(e.target.value), f.max) })} />
          <input type="range" aria-label="max price" min={bounds.min} max={bounds.max} value={f.max} className="w-full accent-accent"
            onChange={(e) => set({ max: Math.max(Number(e.target.value), f.min) })} />
        </div>
      </Group>

      <Group title={t("sizes")}>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((s) => (
            <button key={s} onClick={() => set({ sizes: toggle(f.sizes, s) })} aria-pressed={f.sizes.includes(s)}
              className={cn("min-w-10 rounded-lg border px-2.5 py-1 text-sm font-semibold", f.sizes.includes(s) ? "border-fg bg-fg text-bg" : "border-line hover:border-fg")}>{s}</button>
          ))}
        </div>
      </Group>

      <Group title={t("colors")}>
        <div className="flex flex-wrap gap-2">
          {allColors.map((c) => (
            <button key={c} onClick={() => set({ colors: toggle(f.colors, c) })} aria-label={c} aria-pressed={f.colors.includes(c)} style={{ background: c }}
              className={cn("h-7 w-7 rounded-full border border-line", f.colors.includes(c) && "ring-2 ring-accent ring-offset-2 ring-offset-bg")} />
          ))}
        </div>
      </Group>

      <Group title={t("pBrand")}>
        <ul className="space-y-2">
          {allBrands.map((b) => (
            <li key={b}>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={f.brands.includes(b)} onChange={() => set({ brands: toggle(f.brands, b) })} className="h-4 w-4 accent-accent" /> {b}
              </label>
            </li>
          ))}
        </ul>
      </Group>

      <Group title={t("pRating")}>
        <div className="space-y-1">
          {[4, 3, 2].map((r) => (
            <button key={r} onClick={() => set({ rating: f.rating === r ? 0 : r })} aria-pressed={f.rating === r}
              className={cn("flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm", f.rating === r ? "bg-card font-bold" : "hover:bg-card")}>
              <span className="flex">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} className={i <= r ? "fill-amber-400 text-amber-400" : "text-line"} />)}</span>
              {t("pAndUp")}
            </button>
          ))}
        </div>
      </Group>

      <div className="space-y-3 py-4 text-sm">
        <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={f.sale} onChange={() => set({ sale: !f.sale })} className="h-4 w-4 accent-accent" /> {t("pDiscount")}</label>
        <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={f.inStock} onChange={() => set({ inStock: !f.inStock })} className="h-4 w-4 accent-accent" /> {t("pInStock")}</label>
      </div>
    </div>
  );
}

"use client";
import { useMemo, useState } from "react";
import { BadgeCheck, ThumbsUp } from "lucide-react";
import type { Product } from "@/lib/types";
import { distribution, sampleReviews } from "@/data/reviews";
import { useT } from "@/store/useStore";
import Stars from "@/components/ui/Stars";
import { cn } from "@/lib/utils";

export default function Reviews({ product }: { product: Product }) {
  const { t, lang } = useT();
  const [star, setStar] = useState(0);
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const all = useMemo(() => sampleReviews(product), [product]);
  const dist = useMemo(() => distribution(product), [product]);
  const list = star ? all.filter((r) => r.rating === star) : all;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="mb-6 text-2xl font-extrabold">{t("pReviews")} ({product.reviews})</h2>
      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <div>
          <p className="text-5xl font-extrabold">{product.rating.toFixed(1)}</p>
          <Stars value={product.rating} size={18} />
          <ul className="mt-4 space-y-1.5">
            {[5, 4, 3, 2, 1].map((s) => (
              <li key={s}>
                <button onClick={() => setStar(star === s ? 0 : s)} aria-pressed={star === s} className={cn("flex w-full items-center gap-2 rounded px-1 text-sm", star === s && "bg-card")}>
                  <span className="w-4 font-semibold">{s}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-line"><span className="block h-full bg-amber-400" style={{ width: `${(dist[s] / product.reviews) * 100}%` }} /></span>
                  <span className="w-10 text-end text-muted">{dist[s]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            {[0, 5, 4, 3, 2].map((s) => (
              <button key={s} onClick={() => setStar(s)} className={cn("rounded-full px-3 py-1.5 text-sm font-semibold", star === s ? "bg-fg text-bg" : "bg-card hover:bg-line")}>{s === 0 ? t("pAllStars") : `${s} ★`}</button>
            ))}
          </div>
          <ul className="divide-y divide-line">
            {list.map((r) => (
              <li key={r.id} className="py-4">
                <div className="flex flex-wrap items-center gap-2"><Stars value={r.rating} /><span className="font-bold">{r.author[lang]}</span>
                  {r.verified && <span className="flex items-center gap-1 text-xs text-emerald-600"><BadgeCheck size={14} /> {t("verified")}</span>}
                  <span className="ms-auto text-xs text-muted" dir="ltr">{r.date}</span></div>
                <p className="mt-2 text-sm leading-7">{r.text[lang]}</p>
                <button onClick={() => setVoted((v) => ({ ...v, [r.id]: !v[r.id] }))} aria-pressed={Boolean(voted[r.id])}
                  className={cn("mt-2 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold", voted[r.id] ? "border-accent text-accent" : "border-line text-muted hover:border-fg")}>
                  <ThumbsUp size={13} /> {t("pHelpful")} ({r.helpful + (voted[r.id] ? 1 : 0)})
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">{t("pSample")}</p>
        </div>
      </div>
    </section>
  );
}

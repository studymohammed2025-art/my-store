"use client";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useStore, useT, usePrice } from "@/store/useStore";
import { cn } from "@/lib/utils";
import Stars from "@/components/ui/Stars";
import QuickView from "./QuickView";

export default function ProductCard({ product: p }: { product: Product }) {
  const { t, lang } = useT();
  const price = usePrice();
  const wished = useStore((s) => s.wishlist.includes(p.id));
  const toggleWish = useStore((s) => s.toggleWish);
  const addToCart = useStore((s) => s.addToCart);
  const pushRecent = useStore((s) => s.pushRecent);
  const [hover, setHover] = useState(false);
  const [qv, setQv] = useState(false);
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  return (
    <article className="group" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl2 bg-card">
        {/* الصورة الثانية تظهر عند المرور بالماوس */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <a href={`/product/${p.id}`} aria-label={p.name[lang]} onClick={() => pushRecent(p.id)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images[hover ? 1 : 0]} alt={p.name[lang]} loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </a>
        {p.stock <= 0 && <div className="absolute inset-0 grid place-items-center bg-bg/60 text-sm font-bold">{t("pOut")}</div>}
        <div className="absolute start-2 top-2 flex flex-col gap-1">
          {discount > 0 && <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-accent-fg">{discount}% {t("off")}</span>}
          {p.badges.includes("new") && <span className="rounded-md bg-fg px-2 py-0.5 text-xs font-bold text-bg">{t("badgeNew")}</span>}
          {p.badges.includes("best") && <span className="rounded-md bg-amber-400 px-2 py-0.5 text-xs font-bold text-black">{t("badgeBest")}</span>}
        </div>
        <button onClick={() => toggleWish(p.id)} aria-pressed={wished} aria-label={t("wishlist")}
          className="absolute end-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-bg/90 shadow-soft transition hover:scale-110">
          <Heart size={18} className={cn(wished && "fill-accent text-accent")} />
        </button>
        <div className="absolute inset-x-2 bottom-2 flex gap-2 opacity-100 transition md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <button onClick={() => addToCart(p.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-fg py-2 text-sm font-bold text-bg hover:bg-accent hover:text-accent-fg">
            <ShoppingBag size={15} /> {t("addToCart")}
          </button>
          <button onClick={() => setQv(true)} aria-label={t("quickView")} className="grid h-9 w-9 place-items-center rounded-full bg-bg/95 hover:bg-accent hover:text-accent-fg"><Eye size={16} /></button>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <a href={`/product/${p.id}`} className="block truncate text-sm font-medium hover:text-accent">{p.name[lang]}</a>
        <div className="flex items-center gap-1.5 text-xs text-muted"><Stars value={p.rating} size={12} /> ({p.reviews})</div>
        <div className="flex items-baseline gap-2">
          <span className="font-extrabold text-accent">{price(p.price)}</span>
          {p.oldPrice && <span className="text-xs text-muted line-through">{price(p.oldPrice)}</span>}
        </div>
      </div>
      <AnimatePresence>{qv && <QuickView product={p} onClose={() => setQv(false)} />}</AnimatePresence>
    </article>
  );
}

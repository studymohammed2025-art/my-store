"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Product } from "@/lib/types";
import { useStore, useT, usePrice } from "@/store/useStore";
import { cn } from "@/lib/utils";
import Stars from "@/components/ui/Stars";

export default function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const { t, lang } = useT();
  const price = usePrice();
  const addToCart = useStore((s) => s.addToCart);
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [img, setImg] = useState(0);

  return (
    <motion.div className="fixed inset-0 z-[75] grid place-items-center bg-black/55 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-label={product.name[lang]} onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97 }}
        className="relative grid max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl2 bg-bg shadow-lift md:grid-cols-2">
        <button onClick={onClose} aria-label={t("close")} className="absolute end-3 top-3 z-10 rounded-full bg-bg/90 p-1.5 hover:bg-card"><X size={18} /></button>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.images[img]} alt={product.name[lang]} className="aspect-[3/4] w-full object-cover" />
          <div className="flex gap-2 p-3">
            {product.images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" onClick={() => setImg(i)} className={cn("h-16 w-12 cursor-pointer rounded object-cover", img === i ? "ring-2 ring-accent" : "opacity-70")} />
            ))}
          </div>
        </div>
        <div className="flex flex-col p-6">
          <p className="text-sm text-muted">{product.brand}</p>
          <h3 className="mt-1 text-xl font-extrabold">{product.name[lang]}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm"><Stars value={product.rating} /> <span className="text-muted">({product.reviews})</span></div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-accent">{price(product.price)}</span>
            {product.oldPrice && <span className="text-sm text-muted line-through">{price(product.oldPrice)}</span>}
          </div>
          <p className="mb-2 mt-5 text-sm font-semibold">{t("colors")}</p>
          <div className="flex gap-2">
            {product.colors.map((c) => (
              <button key={c} onClick={() => setColor(c)} aria-label={c} style={{ background: c }}
                className={cn("h-8 w-8 rounded-full border border-line", color === c && "ring-2 ring-accent ring-offset-2 ring-offset-bg")} />
            ))}
          </div>
          <p className="mb-2 mt-5 text-sm font-semibold">{t("sizes")}</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)} className={cn("min-w-10 rounded-lg border px-3 py-1.5 text-sm font-semibold", size === s ? "border-fg bg-fg text-bg" : "border-line hover:border-fg")}>{s}</button>
            ))}
          </div>
          <button onClick={() => { addToCart(product.id, 1, { color, size }); onClose(); }} className="mt-auto rounded-full bg-accent py-3 font-bold text-accent-fg transition hover:opacity-90 md:mt-8">{t("addToCart")}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

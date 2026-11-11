"use client";
import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Tag, Trash2, Truck, X } from "lucide-react";
import { products } from "@/data/products";
import { FREE_SHIP_THRESHOLD, findCoupon, totals } from "@/lib/cart";
import { lineKey, useStore, useT, usePrice } from "@/store/useStore";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductCard from "@/components/product/ProductCard";

export default function CartClient() {
  const { t, lang } = useT();
  const price = usePrice();
  const { cart, saved, coupon } = useStore();
  const { setQty, removeLine, saveLine, moveSaved, removeSaved, applyCoupon, showToast } = useStore();
  const [code, setCode] = useState("");

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), []);
  const lines = cart.flatMap((i) => { const p = byId.get(i.id); return p ? [{ item: i, p, key: lineKey(i) }] : []; });
  const savedLines = saved.flatMap((i) => { const p = byId.get(i.id); return p ? [{ item: i, p, key: lineKey(i) }] : []; });

  const active = findCoupon(coupon);
  const sum = totals(lines.map((l) => ({ price: l.p.price, qty: l.item.qty })), active);
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - sum.after);

  // اقتراحات Cross-sell: الأكثر مبيعاً من نفس أقسام السلة ولم تُضف بعد
  const cross = useMemo(() => {
    const inCart = new Set(cart.map((i) => i.id));
    const cats = new Set(cart.map((i) => byId.get(i.id)?.category));
    const pool = [...products].sort((a, b) => b.sold - a.sold).filter((p) => !inCart.has(p.id) && p.stock > 0);
    return [...pool.filter((p) => cats.has(p.category)), ...pool.filter((p) => !cats.has(p.category))].slice(0, 4);
  }, [cart, byId]);

  const tryCoupon = () => {
    const c = findCoupon(code);
    if (!c) { showToast(t("couponBad")); return; }
    if (c.min && sum.subtotal < c.min) { showToast(`${t("couponBad")}: ${c.label[lang]}`); return; }
    applyCoupon(c.code); setCode(""); showToast(t("couponOk"));
  };

  return (
    <>
      <Breadcrumbs items={[{ label: t("cartTitle") }]} />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-extrabold md:text-3xl">{t("cartTitle")}</h1>

        {lines.length === 0 ? (
          <div className="rounded-xl2 bg-card p-12 text-center">
            <ShoppingBag className="mx-auto mb-3 text-muted" size={40} />
            <p className="text-muted">{t("cartEmpty")}</p>
            <a href="/products" className="mt-5 inline-block rounded-full bg-accent px-7 py-3 font-bold text-accent-fg">{t("continueShop")}</a>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div>
              {/* شريط تقدم الشحن المجاني */}
              <div className="mb-5 rounded-xl2 bg-card p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold"><Truck size={16} /> {sum.freeShip ? t("freeShipDone") : t("freeShipLeft").replace("{x}", price(remaining))}</p>
                <div className="h-2 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${sum.freeShip ? 100 : Math.min(100, (sum.after / FREE_SHIP_THRESHOLD) * 100)}%` }} /></div>
              </div>

              <ul className="divide-y divide-line">
                {lines.map(({ item, p, key }) => (
                  <li key={key} className="flex gap-4 py-5">
                    <a href={`/product/${p.id}`} className="shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.images[0]} alt={p.name[lang]} className="h-28 rounded-lg object-cover" style={{ width: 88 }} />
                    </a>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <a href={`/product/${p.id}`} className="font-semibold hover:text-accent">{p.name[lang]}</a>
                        <span className="font-extrabold">{price(p.price * item.qty)}</span>
                      </div>
                      <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                        {item.color && <span className="inline-block h-4 w-4 rounded-full border border-line" style={{ background: item.color }} />}
                        {item.size && <span>{t("pSize")}: {item.size}</span>}
                        <span>· {price(p.price)}</span>
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center rounded-full border border-line">
                          <button onClick={() => setQty(key, item.qty - 1)} aria-label="-" className="p-2"><Minus size={14} /></button>
                          <span className="w-7 text-center text-sm font-bold tabular-nums">{item.qty}</span>
                          <button onClick={() => setQty(key, item.qty + 1)} aria-label="+" className="p-2"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => saveLine(key)} className="text-sm font-semibold text-muted hover:text-fg">{t("saveLater")}</button>
                        <button onClick={() => removeLine(key)} className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:underline"><Trash2 size={14} /> {t("removeL")}</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* ملخص الطلب */}
            <aside className="h-fit rounded-xl2 border border-line p-5 lg:sticky lg:top-32">
              <div className="mb-4">
                {active ? (
                  <div className="flex items-center justify-between rounded-lg bg-accent/10 px-3 py-2 text-sm">
                    <span className="flex items-center gap-2 font-semibold"><Tag size={14} className="text-accent" /> {active.code} · {active.label[lang]}</span>
                    <button onClick={() => applyCoupon(null)} aria-label={t("couponRemove")} className="p-1 text-muted hover:text-fg"><X size={14} /></button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && tryCoupon()} placeholder={t("couponPh")} aria-label={t("couponPh")} dir="ltr"
                        className="min-w-0 flex-1 rounded-full border border-line bg-bg px-4 py-2.5 text-sm uppercase outline-none focus:border-accent" />
                      <button onClick={tryCoupon} className="rounded-full bg-fg px-5 text-sm font-bold text-bg hover:bg-accent hover:text-accent-fg">{t("applyL")}</button>
                    </div>
                    <p className="mt-1.5 text-xs text-muted">{t("couponHint")}</p>
                  </>
                )}
                {active && !sum.couponActive && <p className="mt-1.5 text-xs text-red-500">{active.label[lang]}</p>}
              </div>
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between"><dt className="text-muted">{t("subtotal")}</dt><dd className="font-semibold">{price(sum.subtotal)}</dd></div>
                {sum.discount > 0 && <div className="flex justify-between text-emerald-600"><dt>{t("discountL")}</dt><dd className="font-semibold">-{price(sum.discount)}</dd></div>}
                <div className="flex justify-between"><dt className="text-muted">{t("shippingL")}</dt><dd className="font-semibold">{sum.shipping === 0 ? t("freeL") : price(sum.shipping)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">{t("taxL")}</dt><dd className="font-semibold">{price(sum.tax)}</dd></div>
                <div className="flex justify-between border-t border-line pt-3 text-lg font-extrabold"><dt>{t("totalL")}</dt><dd className="text-accent">{price(sum.total)}</dd></div>
              </dl>
              <button onClick={() => showToast(t("checkoutSoon"))} className="mt-5 w-full rounded-full bg-accent py-3.5 font-bold text-accent-fg transition hover:opacity-90">{t("checkout")}</button>
              <a href="/products" className="mt-3 block text-center text-sm font-semibold text-muted hover:text-fg">{t("continueShop")}</a>
            </aside>
          </div>
        )}

        {savedLines.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-extrabold">{t("savedItems")} ({savedLines.length})</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {savedLines.map(({ item, p, key }) => (
                <li key={key} className="flex gap-3 rounded-xl2 border border-line p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images[0]} alt="" className="h-20 w-16 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name[lang]}</p>
                    <p className="text-sm font-bold text-accent">{price(p.price)}</p>
                    <div className="mt-2 flex gap-3 text-sm font-semibold">
                      <button onClick={() => moveSaved(key)} className="hover:text-accent">{t("moveToCart")}</button>
                      <button onClick={() => removeSaved(key)} className="text-red-500">{t("removeL")}</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-14">
          <h2 className="mb-6 text-2xl font-extrabold">{t("crossSell")}</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">{cross.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      </div>
    </>
  );
}

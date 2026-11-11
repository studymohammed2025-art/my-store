"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, User, X, ChevronDown } from "lucide-react";
import { categories, products } from "@/data/products";
import { useStore, useT, usePrice } from "@/store/useStore";
import { cn } from "@/lib/utils";
import type { Currency } from "@/lib/types";

const CURRENCIES: Currency[] = ["SAR", "AED", "EGP", "USD"];
const TRENDING = { ar: ["فستان", "عباية", "حذاء رياضي", "عطر"], en: ["dress", "abaya", "sneakers", "perfume"] };

export default function Header() {
  const { t, lang } = useT();
  const price = usePrice();
  const { theme, toggleTheme, setLang, currency, setCurrency } = useStore();
  const wishCount = useStore((s) => s.wishlist.length);
  const cartCount = useStore((s) => s.cart.reduce((n, i) => n + i.qty, 0));
  const user = useStore((s) => s.user);

  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // تأثير الظل عند التمرير
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // إغلاق نتائج البحث عند النقر خارجها
  useEffect(() => {
    const on = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setFocus(false); };
    document.addEventListener("mousedown", on);
    return () => document.removeEventListener("mousedown", on);
  }, []);

  // Autocomplete: منتجات + أقسام + علامات تجارية
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return null;
    const match = (v: string) => v.toLowerCase().includes(s);
    return {
      products: products.filter((p) => match(p.name.ar) || match(p.name.en)).slice(0, 5),
      cats: categories.filter((c) => match(c.name.ar) || match(c.name.en)).slice(0, 3),
      brands: Array.from(new Set(products.map((p) => p.brand))).filter(match).slice(0, 3),
    };
  }, [q]);
  const empty = results && !results.products.length && !results.cats.length && !results.brands.length;

  return (
    <header className={cn("sticky top-0 z-50 bg-bg/95 backdrop-blur transition-shadow", scrolled ? "shadow-soft" : "border-b border-line")}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:gap-6">
        <button className="rounded-full p-2 hover:bg-card lg:hidden" aria-label={t("menu")} onClick={() => setDrawer(true)}><Menu size={22} /></button>
        <a href="/" className="text-2xl font-extrabold tracking-tight">{t("brand")}<span className="text-accent">.</span></a>

        {/* البحث */}
        <div ref={boxRef} className="relative mx-auto hidden w-full max-w-xl md:block">
          <Search size={18} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setFocus(true)} placeholder={t("searchPh")}
            className="w-full rounded-full border border-line bg-card py-2.5 pe-4 ps-11 text-sm outline-none transition focus:border-accent" aria-label={t("searchPh")} />
          <AnimatePresence>
            {focus && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-xl2 border border-line bg-bg p-3 shadow-lift">
                {!results ? (
                  <div>
                    <p className="mb-2 text-xs font-semibold text-muted">{t("trending")}</p>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING[lang].map((w) => (
                        <button key={w} onClick={() => setQ(w)} className="rounded-full bg-card px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-fg">{w}</button>
                      ))}
                    </div>
                  </div>
                ) : empty ? (
                  <p className="p-2 text-sm text-muted">{t("noResults")}</p>
                ) : (
                  <div className="space-y-3">
                    {results.cats.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {results.cats.map((c) => <span key={c.id} className="rounded-full bg-card px-3 py-1 text-sm">{c.emoji} {c.name[lang]}</span>)}
                        {results.brands.map((b) => <span key={b} className="rounded-full border border-line px-3 py-1 text-sm">{b}</span>)}
                      </div>
                    )}
                    {results.products.length > 0 && <p className="text-xs font-semibold text-muted">{t("products")}</p>}
                    {results.products.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-card">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0]} alt="" className="h-12 w-10 rounded object-cover" />
                        <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{p.name[lang]}</p><p className="text-xs text-muted">{p.brand}</p></div>
                        <span className="text-sm font-bold text-accent">{price(p.price)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* الأدوات */}
        <div className="ms-auto flex items-center gap-1 md:ms-0">
          <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} aria-label={t("currency")}
            className="hidden rounded-full bg-transparent px-2 py-1.5 text-sm font-semibold outline-none hover:bg-card sm:block">
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-card">{t("language")}</button>
          <button onClick={toggleTheme} aria-label={t("darkMode")} className="rounded-full p-2 hover:bg-card">{theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}</button>
          <a href={user ? "/account" : "/login"} aria-label={t("account")} className="hidden rounded-full p-2 hover:bg-card sm:block"><User size={20} /></a>
          <a href="/wishlist" aria-label={t("wishlist")} className="relative rounded-full p-2 hover:bg-card">
            <Heart size={20} />
            {wishCount > 0 && <span className="absolute end-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-fg">{wishCount}</span>}
          </a>
          <a href="/cart" aria-label={t("cart")} className="relative rounded-full p-2 hover:bg-card">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="absolute end-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-fg">{cartCount}</span>}
          </a>
        </div>
      </div>

      {/* قائمة الأقسام + Mega Menu (ديسكتوب) */}
      <nav className="relative hidden border-t border-line lg:block" onMouseLeave={() => setMega(null)}>
        <ul className="mx-auto flex max-w-7xl items-center gap-1 px-4">
          <li><a href="/" className="block px-3 py-3 text-sm font-semibold hover:text-accent">{t("home")}</a></li>
          {categories.map((c) => (
            <li key={c.id} onMouseEnter={() => setMega(c.id)}>
              <a href={`/products?category=${c.id}`} className={cn("flex items-center gap-1 px-3 py-3 text-sm font-semibold hover:text-accent", mega === c.id && "text-accent")}>
                {c.name[lang]} <ChevronDown size={14} />
              </a>
            </li>
          ))}
          <li className="ms-auto"><a href="/#flash" className="block px-3 py-3 text-sm font-bold text-accent">{t("sale")}</a></li>
        </ul>
        <AnimatePresence>
          {mega && (
            <motion.div key={mega} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="absolute inset-x-0 top-full border-t border-line bg-bg shadow-lift">
              {categories.filter((c) => c.id === mega).map((c) => (
                <div key={c.id} className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] gap-8 px-4 py-6">
                  <div>
                    <p className="mb-3 text-lg font-extrabold">{c.name[lang]}</p>
                    <ul className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
                      {c.subs.map((s, i) => <li key={i}><a href={`/products?category=${c.id}`} className="text-sm text-muted hover:text-accent">{s[lang]}</a></li>)}
                    </ul>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt="" className="h-32 w-56 rounded-xl2 object-cover" />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* بحث الجوال */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input placeholder={t("searchPh")} aria-label={t("searchPh")} className="w-full rounded-full border border-line bg-card py-2 pe-4 ps-10 text-sm outline-none focus:border-accent" />
        </div>
      </div>

      {/* Drawer الجوال */}
      <AnimatePresence>
        {drawer && (
          <motion.div className="fixed inset-0 z-[80] bg-black/50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)}>
            <motion.aside onClick={(e) => e.stopPropagation()} initial={{ x: lang === "ar" ? "100%" : "-100%" }} animate={{ x: 0 }} exit={{ x: lang === "ar" ? "100%" : "-100%" }}
              transition={{ type: "tween", duration: 0.25 }} className="h-full w-80 max-w-[85%] overflow-y-auto bg-bg p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xl font-extrabold">{t("allCategories")}</span>
                <button onClick={() => setDrawer(false)} aria-label={t("close")} className="rounded-full p-2 hover:bg-card"><X size={20} /></button>
              </div>
              <ul className="space-y-1">
                {categories.map((c) => (
                  <li key={c.id}>
                    <a href={`/products?category=${c.id}`} onClick={() => setDrawer(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 font-semibold hover:bg-card">
                      <span className="text-xl">{c.emoji}</span> {c.name[lang]}
                    </a>
                  </li>
                ))}
              </ul>
              <a href={user ? "/account" : "/login"} onClick={() => setDrawer(false)} className="mt-4 flex items-center gap-3 rounded-lg border-t border-line px-3 py-3 font-semibold hover:bg-card"><User size={20} /> {user ? user.name : t("account")}</a>
              <div className="mt-2 flex flex-wrap gap-2 border-t border-line pt-4">
                {CURRENCIES.map((c) => (
                  <button key={c} onClick={() => setCurrency(c)} className={cn("rounded-full px-3 py-1.5 text-sm font-semibold", currency === c ? "bg-accent text-accent-fg" : "bg-card")}>{c}</button>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

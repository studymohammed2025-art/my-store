"use client";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronDown, Facebook, Heart, Link2, MessageCircle, Minus, Plus, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { categories, img } from "@/data/products";
import { faqs } from "@/data/reviews";
import { useStore, useT, usePrice } from "@/store/useStore";
import { cn } from "@/lib/utils";
import Stars from "@/components/ui/Stars";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductCard from "./ProductCard";
import SizeGuide from "./SizeGuide";
import Reviews from "./Reviews";

// مدن الشحن التجريبية وأيام التوصيل التقديرية
const CITIES = [
  { id: "riyadh", name: { ar: "الرياض", en: "Riyadh" }, days: "2-3" },
  { id: "jeddah", name: { ar: "جدة", en: "Jeddah" }, days: "2-4" },
  { id: "dubai", name: { ar: "دبي", en: "Dubai" }, days: "3-5" },
  { id: "cairo", name: { ar: "القاهرة", en: "Cairo" }, days: "4-6" },
];

export default function ProductDetails({ product: p, related, others }: { product: Product; related: Product[]; others: Product[] }) {
  const { t, lang } = useT();
  const price = usePrice();
  const addToCart = useStore((s) => s.addToCart);
  const wished = useStore((s) => s.wishlist.includes(p.id));
  const toggleWish = useStore((s) => s.toggleWish);
  const pushRecent = useStore((s) => s.pushRecent);
  const showToast = useStore((s) => s.showToast);

  const gallery = [...p.images, img(`${p.id}-c`), img(`${p.id}-d`)];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState(p.colors[0]);
  const [size, setSize] = useState<string | null>(p.sizes.length === 1 ? p.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [city, setCity] = useState("");
  const [guide, setGuide] = useState(false);
  const [tab, setTab] = useState<"desc" | "specs">("desc");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => { pushRecent(p.id); }, [p.id, pushRecent]);

  const cat = categories.find((c) => c.id === p.category);
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const out = p.stock <= 0;
  const eta = CITIES.find((c) => c.id === city);

  const add = (): boolean => {
    if (!size) { setSizeError(true); return false; }
    addToCart(p.id, qty, { color, size });
    return true;
  };
  const share = (kind: "wa" | "fb" | "copy") => {
    const href = typeof window !== "undefined" ? window.location.href : "";
    if (kind === "copy") { navigator.clipboard?.writeText(href).then(() => showToast(t("pLinkCopied"))).catch(() => undefined); return; }
    const u = kind === "wa" ? `https://wa.me/?text=${encodeURIComponent(p.name[lang] + " " + href)}` : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(href)}`;
    window.open(u, "_blank", "noopener,noreferrer");
  };

  const specs: [string, string][] = [
    [t("pBrand"), p.brand], [t("pCategory"), cat?.name[lang] ?? p.category], [t("colors"), String(p.colors.length)],
    [t("sizes"), p.sizes.join(" / ")], [t("pSku"), p.id.toUpperCase()],
  ];

  return (
    <>
      <Breadcrumbs items={[{ label: cat?.name[lang] ?? "", href: `/products?category=${p.category}` }, { label: p.name[lang] }]} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 lg:grid-cols-2 lg:gap-12">
        {/* المعرض */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex gap-2 sm:flex-col">
            {gallery.map((src, i) => (
              <button key={i} onClick={() => setActive(i)} aria-label={`image ${i + 1}`} className={cn("h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2", active === i ? "border-accent" : "border-transparent opacity-70 hover:opacity-100")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="relative flex-1 cursor-zoom-in overflow-hidden rounded-xl2 bg-card"
            onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
            onMouseLeave={() => setZoom(null)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gallery[active]} alt={p.name[lang]} className="aspect-[3/4] w-full object-cover transition-transform duration-150"
              style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
            {discount > 0 && <span className="absolute start-3 top-3 rounded-md bg-accent px-2.5 py-1 text-sm font-bold text-accent-fg">{discount}% {t("off")}</span>}
          </div>
        </div>

        {/* المعلومات */}
        <div>
          <p className="text-sm font-semibold text-muted">{p.brand}</p>
          <h1 className="mt-1 text-2xl font-extrabold md:text-3xl">{p.name[lang]}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm"><Stars value={p.rating} size={16} /><span className="font-bold">{p.rating}</span><span className="text-muted">({p.reviews}) · {p.sold} {t("sold")}</span></div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-accent">{price(p.price)}</span>
            {p.oldPrice && <span className="text-lg text-muted line-through">{price(p.oldPrice)}</span>}
          </div>
          <p className={cn("mt-2 text-sm font-semibold", out ? "text-red-500" : "text-emerald-600")}>{out ? t("pOut") : p.stock <= 10 ? `${t("pIn")} · ${p.stock} ${t("pLeft")}` : t("pIn")}</p>

          <p className="mb-2 mt-6 text-sm font-bold">{t("pColor")}</p>
          <div className="flex gap-2">
            {p.colors.map((c) => (
              <button key={c} onClick={() => setColor(c)} aria-label={c} aria-pressed={color === c} style={{ background: c }}
                className={cn("h-9 w-9 rounded-full border border-line", color === c && "ring-2 ring-accent ring-offset-2 ring-offset-bg")} />
            ))}
          </div>

          <div className="mb-2 mt-6 flex items-center justify-between">
            <p className="text-sm font-bold">{t("pSize")}</p>
            <button onClick={() => setGuide(true)} className="text-sm font-semibold text-accent hover:underline">{t("pSizeGuide")}</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {p.sizes.map((s) => (
              <button key={s} onClick={() => { setSize(s); setSizeError(false); }} aria-pressed={size === s}
                className={cn("min-w-12 rounded-lg border px-3 py-2 text-sm font-semibold", size === s ? "border-fg bg-fg text-bg" : "border-line hover:border-fg")}>{s}</button>
            ))}
          </div>
          {sizeError && <p className="mt-2 text-sm text-red-500" role="alert">{t("pPickSize")}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-line" role="group" aria-label={t("pQty")}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="-" className="p-3"><Minus size={16} /></button>
              <span className="w-8 text-center font-bold tabular-nums">{qty}</span>
              <button onClick={() => setQty(Math.min(Math.max(1, p.stock), qty + 1))} aria-label="+" className="p-3"><Plus size={16} /></button>
            </div>
            <button disabled={out} onClick={add} className="flex-1 rounded-full bg-fg py-3.5 font-bold text-bg transition hover:bg-accent hover:text-accent-fg disabled:cursor-not-allowed disabled:opacity-40">{t("addToCart")}</button>
            <button disabled={out} onClick={add} className="flex-1 rounded-full bg-accent py-3.5 font-bold text-accent-fg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">{t("pBuyNow")}</button>
            <button onClick={() => toggleWish(p.id)} aria-pressed={wished} aria-label={t("wishlist")} className="grid h-12 w-12 place-items-center rounded-full border border-line hover:border-fg"><Heart size={20} className={cn(wished && "fill-accent text-accent")} /></button>
          </div>

          <div className="mt-6 rounded-xl2 bg-card p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold"><Truck size={16} /> {t("pEta")}</p>
            <select value={city} onChange={(e) => setCity(e.target.value)} aria-label={t("pShipTo")} className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent">
              <option value="">{t("pShipTo")}...</option>
              {CITIES.map((c) => <option key={c.id} value={c.id}>{c.name[lang]}</option>)}
            </select>
            {eta && <p className="mt-2 text-sm">{eta.days} {t("pDays")}</p>}
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm">
            <span className="font-bold">{t("pShare")}</span>
            <button onClick={() => share("wa")} aria-label="WhatsApp" className="grid h-9 w-9 place-items-center rounded-full border border-line hover:bg-card"><MessageCircle size={16} /></button>
            <button onClick={() => share("fb")} aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full border border-line hover:bg-card"><Facebook size={16} /></button>
            <button onClick={() => share("copy")} aria-label={t("pCopyLink")} className="grid h-9 w-9 place-items-center rounded-full border border-line hover:bg-card"><Link2 size={16} /></button>
          </div>
        </div>
      </div>

      {/* الوصف والمواصفات */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-6 border-b border-line">
          {(["desc", "specs"] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)} className={cn("-mb-px border-b-2 pb-3 font-bold", tab === k ? "border-accent text-fg" : "border-transparent text-muted")}>{k === "desc" ? t("pDesc") : t("pSpecs")}</button>
          ))}
        </div>
        {tab === "desc" ? (
          <p className="max-w-2xl py-5 leading-8 text-muted">
            {lang === "ar"
              ? `${p.name.ar} من ${p.brand}. متوفر بـ ${p.colors.length} ألوان وقياسات متعددة. هذا وصف تجريبي؛ يُستبدل بوصف حقيقي لكل منتج من لوحة الأدمن في المرحلة 5.`
              : `${p.name.en} by ${p.brand}. Available in ${p.colors.length} colors and multiple sizes. This is placeholder copy; real per-product descriptions come from the admin dashboard in phase 5.`}
          </p>
        ) : (
          <dl className="max-w-md divide-y divide-line py-3">
            {specs.map(([k, v]) => <div key={k} className="flex justify-between py-2.5 text-sm"><dt className="text-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>)}
          </dl>
        )}
      </section>

      <Reviews product={p} />

      {/* الأسئلة الشائعة */}
      <section className="mx-auto max-w-3xl px-4 py-6">
        <h2 className="mb-4 text-2xl font-extrabold">{t("pFaq")}</h2>
        {faqs.map((f, i) => (
          <div key={i} className="border-b border-line">
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="flex w-full items-center justify-between py-4 text-start font-semibold">
              {f.q[lang]} <ChevronDown size={18} className={cn("transition", openFaq === i && "rotate-180")} />
            </button>
            {openFaq === i && <p className="pb-4 text-sm leading-7 text-muted">{f.a[lang]}</p>}
          </div>
        ))}
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="mb-6 text-2xl font-extrabold">{t("pYouMay")}</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">{related.map((x) => <ProductCard key={x.id} product={x} />)}</div>
        </section>
      )}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-6 text-2xl font-extrabold">{t("pAlsoViewed")}</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">{others.map((x) => <ProductCard key={x.id} product={x} />)}</div>
      </section>

      <AnimatePresence>{guide && <SizeGuide onClose={() => setGuide(false)} />}</AnimatePresence>
    </>
  );
}

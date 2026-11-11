"use client";
import { img } from "@/data/products";
import { useT } from "@/store/useStore";

const banners = [
  { id: "b1", image: img("promo-1", 900, 500), title: { ar: "عبايات وأزياء المناسبات", en: "Abayas & occasion wear" }, sub: { ar: "خصم حتى 40%", en: "Up to 40% off" } },
  { id: "b2", image: img("promo-2", 900, 500), title: { ar: "المنزل بلمسة جديدة", en: "Refresh your home" }, sub: { ar: "مفروشات وديكور", en: "Bedding & decor" } },
];

export default function PromoBanners() {
  const { t, lang } = useT();
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-2">
      {banners.map((b) => (
        <a key={b.id} href="#" className="group relative block h-48 overflow-hidden rounded-xl2 sm:h-60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={b.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 p-5 text-white">
            <p className="text-xl font-extrabold sm:text-2xl">{b.title[lang]}</p>
            <p className="text-sm text-white/85">{b.sub[lang]}</p>
            <span className="mt-3 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-bold text-black">{t("shopNow")}</span>
          </div>
        </a>
      ))}
    </section>
  );
}

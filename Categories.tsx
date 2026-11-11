"use client";
import { categories } from "@/data/products";
import { useT } from "@/store/useStore";

export default function Categories() {
  const { t, lang } = useT();
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="mb-6 text-2xl font-extrabold md:text-3xl">{t("shopByCategory")}</h2>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:gap-5 lg:grid-cols-8">
        {categories.map((c) => (
          <a key={c.id} href={`/products?category=${c.id}`} className="group flex w-24 shrink-0 flex-col items-center gap-2 md:w-auto">
            <span className="relative block aspect-square w-full overflow-hidden rounded-full border-2 border-transparent bg-card transition group-hover:border-accent">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              <span className="absolute inset-0 grid place-items-center bg-black/25 text-3xl">{c.emoji}</span>
            </span>
            <span className="text-sm font-semibold">{c.name[lang]}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

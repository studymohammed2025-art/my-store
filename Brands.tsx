"use client";
import { brands } from "@/data/products";
import { useT } from "@/store/useStore";

export default function Brands() {
  const { t } = useT();
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="mb-6 text-center text-xl font-extrabold">{t("brands")}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {brands.map((b) => (
          <div key={b} className="grid h-16 place-items-center rounded-xl2 border border-line text-lg font-extrabold tracking-tight text-muted transition hover:border-accent hover:text-fg" dir="ltr">{b}</div>
        ))}
      </div>
    </section>
  );
}

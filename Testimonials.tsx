"use client";
import { BadgeCheck } from "lucide-react";
import { testimonials } from "@/data/products";
import { useT } from "@/store/useStore";
import Stars from "@/components/ui/Stars";

export default function Testimonials() {
  const { t, lang } = useT();
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="mb-6 text-2xl font-extrabold md:text-3xl">{t("testimonials")}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((x) => (
          <figure key={x.id} className="rounded-xl2 border border-line bg-card p-6">
            <Stars value={x.rating} size={16} />
            <blockquote className="mt-3 text-sm leading-7">{x.text[lang]}</blockquote>
            <figcaption className="mt-4 flex items-center justify-between text-sm">
              <span className="font-bold">{x.name[lang]} <span className="font-normal text-muted">· {x.city[lang]}</span></span>
              <span className="flex items-center gap-1 text-xs text-emerald-600"><BadgeCheck size={14} /> {t("verified")}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

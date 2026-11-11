"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "@/data/products";
import { useT } from "@/store/useStore";
import { cn } from "@/lib/utils";

export default function Hero() {
  const { t, lang } = useT();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = heroSlides.length;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((x) => (x + 1) % n), 5500);
    return () => clearInterval(id);
  }, [paused, n]);

  const s = heroSlides[i];
  const Prev = lang === "ar" ? ChevronRight : ChevronLeft;
  const Next = lang === "ar" ? ChevronLeft : ChevronRight;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative h-[320px] overflow-hidden rounded-xl2 bg-card sm:h-[420px] lg:h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div key={s.id} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent sm:bg-gradient-to-r sm:from-black/65 sm:via-black/25 sm:to-transparent rtl:sm:bg-gradient-to-l" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:inset-y-0 sm:flex sm:max-w-lg sm:flex-col sm:justify-center sm:p-12">
              <motion.h1 initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="text-3xl font-extrabold leading-tight sm:text-5xl">{s.title[lang]}</motion.h1>
              <motion.p initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="mt-2 text-base text-white/85 sm:text-lg">{s.sub[lang]}</motion.p>
              <motion.a href={`/products?category=${s.cta}`} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
                className="mt-5 w-fit rounded-full bg-accent px-7 py-3 font-bold text-accent-fg transition hover:scale-105">{t("shopNow")}</motion.a>
            </div>
          </motion.div>
        </AnimatePresence>

        <button onClick={() => setI((i - 1 + n) % n)} aria-label="previous" className="absolute start-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-bg/90 p-2 shadow-soft hover:bg-bg sm:block"><Prev size={20} /></button>
        <button onClick={() => setI((i + 1) % n)} aria-label="next" className="absolute end-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-bg/90 p-2 shadow-soft hover:bg-bg sm:block"><Next size={20} /></button>
        <div className="absolute bottom-3 end-5 flex gap-1.5">
          {heroSlides.map((sl, k) => (
            <button key={sl.id} onClick={() => setI(k)} aria-label={`slide ${k + 1}`} className={cn("h-1.5 rounded-full transition-all", k === i ? "w-6 bg-white" : "w-1.5 bg-white/50")} />
          ))}
        </div>
      </div>
    </section>
  );
}

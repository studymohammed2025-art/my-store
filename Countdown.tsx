"use client";
import { useEffect, useState } from "react";
import { useT } from "@/store/useStore";

/** عداد تنازلي: الهدف = بعد `hours` ساعة من أول تحميل في المتصفح. يُحفظ في localStorage كي لا يُعاد عند التحديث */
export default function Countdown({ hours = 9 }: { hours?: number }) {
  const { t } = useT();
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const KEY = "souqi-flash-end";
    let end = 0;
    try { end = Number(localStorage.getItem(KEY)) || 0; } catch { /* تجاهل */ }
    if (end < Date.now()) {
      end = Date.now() + hours * 3600 * 1000;
      try { localStorage.setItem(KEY, String(end)); } catch { /* تجاهل */ }
    }
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [hours]);

  const s = Math.floor((left ?? 0) / 1000);
  const parts = [
    { v: Math.floor(s / 3600), l: t("hours") },
    { v: Math.floor((s % 3600) / 60), l: t("minutes") },
    { v: s % 60, l: t("seconds") },
  ];
  return (
    <div className="flex items-center gap-2" dir="ltr" aria-label={t("endsIn")}>
      {parts.map((p, i) => (
        <div key={i} className="flex items-baseline gap-1 rounded-lg bg-fg px-2.5 py-1.5 text-bg">
          <span className="min-w-[1.6rem] text-center text-lg font-extrabold tabular-nums">{left === null ? "--" : String(p.v).padStart(2, "0")}</span>
          <span className="text-[10px] opacity-70">{p.l}</span>
        </div>
      ))}
    </div>
  );
}

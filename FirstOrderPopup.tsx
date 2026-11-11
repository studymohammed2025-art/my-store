"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useStore, useT } from "@/store/useStore";

const KEY = "souqi-first-popup";

export default function FirstOrderPopup() {
  const { t } = useT();
  const showToast = useStore((s) => s.showToast);
  const [open, setOpen] = useState(false);

  // يظهر مرة واحدة بعد 6 ثوانٍ، ولا يتكرر بعد إغلاقه
  useEffect(() => {
    try { if (localStorage.getItem(KEY)) return; } catch { /* التخزين غير متاح */ }
    const id = setTimeout(() => setOpen(true), 6000);
    return () => clearTimeout(id);
  }, []);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(KEY, "1"); } catch { /* تجاهل */ }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText("WELCOME15"); } catch { /* تجاهل */ }
    showToast(t("copied"));
    close();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
          <motion.div role="dialog" aria-modal="true" aria-label={t("popupTitle")} onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }}
            className="relative w-full max-w-sm rounded-xl2 bg-bg p-7 text-center shadow-lift">
            <button onClick={close} aria-label={t("close")} className="absolute end-3 top-3 rounded-full p-1.5 text-muted hover:bg-card"><X size={18} /></button>
            <h2 className="text-xl font-extrabold">{t("popupTitle")}</h2>
            <p className="mt-1 text-sm text-muted">{t("popupSub")}</p>
            <div className="my-5 rounded-lg border-2 border-dashed border-accent py-3 text-2xl font-extrabold tracking-widest text-accent" dir="ltr">WELCOME15</div>
            <button onClick={copy} className="w-full rounded-full bg-accent py-3 font-bold text-accent-fg transition hover:opacity-90">{t("copy")}</button>
            <button onClick={close} className="mt-3 text-sm text-muted hover:text-fg">{t("noThanks")}</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

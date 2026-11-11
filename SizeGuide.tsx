"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useT } from "@/store/useStore";

// جدول قياسات عام (سم). يمكن تخصيصه لكل قسم لاحقاً
const rows = [["S", "86-91", "68-73", "92-97"], ["M", "92-97", "74-79", "98-103"], ["L", "98-103", "80-85", "104-109"], ["XL", "104-110", "86-92", "110-116"]];

export default function SizeGuide({ onClose }: { onClose: () => void }) {
  const { t, lang } = useT();
  const head = lang === "ar" ? ["المقاس", "الصدر", "الخصر", "الورك"] : ["Size", "Chest", "Waist", "Hip"];
  return (
    <motion.div className="fixed inset-0 z-[75] grid place-items-center bg-black/55 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-label={t("pSizeGuide")} onClick={(e) => e.stopPropagation()} initial={{ y: 12 }} animate={{ y: 0 }}
        className="w-full max-w-md rounded-xl2 bg-bg p-6 shadow-lift">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold">{t("pSizeGuide")} (cm)</h3>
          <button onClick={onClose} aria-label={t("close")} className="rounded-full p-1.5 hover:bg-card"><X size={18} /></button>
        </div>
        <table className="w-full text-center text-sm">
          <thead><tr className="bg-card">{head.map((h) => <th key={h} className="p-2 font-bold">{h}</th>)}</tr></thead>
          <tbody>{rows.map((r) => <tr key={r[0]} className="border-t border-line">{r.map((c, i) => <td key={i} className={i === 0 ? "p-2 font-bold" : "p-2"}>{c}</td>)}</tr>)}</tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}

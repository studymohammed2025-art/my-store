"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function Toaster() {
  const toast = useStore((s) => s.toast);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="flex items-center gap-2 rounded-full bg-fg px-4 py-2.5 text-sm font-medium text-bg shadow-lift">
            <Check size={16} className="text-accent" /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

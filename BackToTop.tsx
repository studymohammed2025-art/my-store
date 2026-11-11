"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useT } from "@/store/useStore";

export default function BackToTop() {
  const { t } = useT();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (!show) return null;
  return (
    <button aria-label={t("backToTop")} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 start-6 z-40 grid h-11 w-11 place-items-center rounded-full border border-line bg-bg text-fg shadow-soft transition hover:bg-accent hover:text-accent-fg">
      <ArrowUp size={18} />
    </button>
  );
}

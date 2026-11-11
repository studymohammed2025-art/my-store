"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "@/store/useStore";

export default function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const { t, lang } = useT();
  const Sep = lang === "ar" ? ChevronLeft : ChevronRight;
  const all = [{ label: t("home"), href: "/" }, ...items];
  return (
    <nav aria-label="breadcrumb" className="mx-auto max-w-7xl px-4 pt-5">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        {all.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <Sep size={14} />}
            {it.href ? <a href={it.href} className="hover:text-accent">{it.label}</a> : <span className="font-semibold text-fg">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

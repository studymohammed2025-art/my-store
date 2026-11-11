"use client";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useT } from "@/store/useStore";

const PAY = ["VISA", "Mastercard", "mada", "PayPal", "Apple Pay", "Google Pay", "COD"];

export default function Footer() {
  const { t } = useT();
  const help = ["faq", "trackOrder", "returns", "contact"] as const;
  const company = ["about", "privacy", "terms"] as const;
  return (
    <footer className="mt-16 border-t border-line bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="text-2xl font-extrabold">{t("brand")}<span className="text-accent">.</span></p>
          <p className="mt-3 max-w-xs text-sm text-muted">{t("newsletterSub")}</p>
          <p className="mb-2 mt-5 text-sm font-semibold">{t("followUs")}</p>
          <div className="flex gap-2">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="grid h-9 w-9 place-items-center rounded-full border border-line hover:bg-accent hover:text-accent-fg"><Icon size={16} /></a>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 font-bold">{t("help")}</p>
          <ul className="space-y-2 text-sm text-muted">{help.map((k) => <li key={k}><a href="#" className="hover:text-accent">{t(k)}</a></li>)}</ul>
        </div>
        <div>
          <p className="mb-3 font-bold">{t("company")}</p>
          <ul className="space-y-2 text-sm text-muted">{company.map((k) => <li key={k}><a href="#" className="hover:text-accent">{t(k)}</a></li>)}</ul>
        </div>
        <div>
          <p className="mb-3 font-bold">{t("payWith")}</p>
          <div className="flex flex-wrap gap-2">
            {PAY.map((p) => <span key={p} className="rounded-md border border-line bg-bg px-2.5 py-1 text-xs font-semibold" dir="ltr">{p}</span>)}
          </div>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">© {new Date().getFullYear()} {t("brand")}. {t("footerNote")}</div>
    </footer>
  );
}

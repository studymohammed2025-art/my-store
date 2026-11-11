"use client";
import { useState } from "react";
import { useStore, useT } from "@/store/useStore";

export default function Newsletter() {
  const { t } = useT();
  const showToast = useStore((s) => s.showToast);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  // التحقق من البريد محلياً. الحفظ الفعلي في قاعدة البيانات يضاف في المرحلة 2
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setError(!ok);
    if (ok) { showToast(t("subscribed")); setEmail(""); }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="rounded-xl2 bg-fg px-6 py-12 text-center text-bg md:px-16">
        <h2 className="text-2xl font-extrabold md:text-3xl">{t("newsletterTitle")}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm opacity-75">{t("newsletterSub")}</p>
        <form onSubmit={submit} noValidate className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("emailPh")} aria-label={t("emailPh")} aria-invalid={error}
            className="flex-1 rounded-full bg-bg px-5 py-3 text-sm text-fg outline-none focus:ring-2 focus:ring-accent" dir="ltr" />
          <button type="submit" className="rounded-full bg-accent px-7 py-3 font-bold text-accent-fg transition hover:opacity-90">{t("subscribe")}</button>
        </form>
        {error && <p className="mt-2 text-sm text-red-400" role="alert">{t("invalidEmail")}</p>}
      </div>
    </section>
  );
}

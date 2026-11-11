"use client";
import { useT } from "@/store/useStore";

export default function NotFoundProduct() {
  const { t } = useT();
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-extrabold">{t("pNotFound")}</h1>
      <a href="/products" className="mt-6 inline-block rounded-full bg-accent px-7 py-3 font-bold text-accent-fg">{t("pBack")}</a>
    </div>
  );
}

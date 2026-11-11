"use client";
import { useEffect } from "react";
import { getBrowserClient } from "@/lib/supabaseBrowser";
import { useStore, useT } from "@/store/useStore";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function AccountClient() {
  const { t } = useT();
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const showToast = useStore((s) => s.showToast);
  const wish = useStore((s) => s.wishlist.length);
  const cart = useStore((s) => s.cart.reduce((n, i) => n + i.qty, 0));

  // الحالة المحفوظة تُسترجع بعد أول رسم، لذلك نحوّل لصفحة الدخول بعد مهلة قصيرة إن لم يوجد مستخدم
  useEffect(() => {
    if (user) return;
    const id = setTimeout(() => { if (!useStore.getState().user) window.location.replace("/login"); }, 600);
    return () => clearTimeout(id);
  }, [user]);

  const logout = async () => {
    await getBrowserClient()?.auth.signOut();
    setUser(null);
    showToast(t("loggedOut"));
    window.location.assign("/");
  };

  if (!user) return null;
  return (
    <>
      <Breadcrumbs items={[{ label: t("accountTitle") }]} />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-extrabold md:text-3xl">{t("welcomeL")}، {user.name}</h1>
        <p className="mt-1 text-sm text-muted" dir="ltr">{user.email}{user.demo ? " · demo" : ""}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <a href="/wishlist" className="rounded-xl2 bg-card p-5 hover:bg-line"><p className="text-3xl font-extrabold">{wish}</p><p className="text-sm text-muted">{t("wishTitle")}</p></a>
          <a href="/cart" className="rounded-xl2 bg-card p-5 hover:bg-line"><p className="text-3xl font-extrabold">{cart}</p><p className="text-sm text-muted">{t("cartTitle")}</p></a>
        </div>
        <p className="mt-6 text-sm text-muted">{t("ordersSoon")}</p>
        <button onClick={logout} className="mt-6 rounded-full border border-line px-6 py-2.5 text-sm font-bold hover:bg-card">{t("logoutL")}</button>
      </div>
    </>
  );
}

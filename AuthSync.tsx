"use client";
import { useEffect } from "react";
import { getBrowserClient } from "@/lib/supabaseBrowser";
import { useStore } from "@/store/useStore";

/** يزامن جلسة Supabase مع حالة المتجر (يعمل فقط عند ضبط المتغيرات) */
export default function AuthSync() {
  const setUser = useStore((s) => s.setUser);
  useEffect(() => {
    const sb = getBrowserClient();
    if (!sb) return;
    const apply = (u: { email?: string; user_metadata?: Record<string, unknown> } | null | undefined) =>
      setUser(u ? { email: u.email ?? "", name: String(u.user_metadata?.name ?? u.user_metadata?.full_name ?? (u.email ?? "").split("@")[0]), demo: false } : null);
    // ننتظر استرجاع الحالة المحفوظة أولاً حتى لا نمسح المستخدم قبل قراءة الجلسة
    sb.auth.getSession().then(({ data }) => apply(data.session?.user));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => apply(session?.user));
    return () => sub.subscription.unsubscribe();
  }, [setUser]);
  return null;
}

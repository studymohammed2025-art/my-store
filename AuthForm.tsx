"use client";
import { useEffect, useState } from "react";
import { authEnabled, getBrowserClient } from "@/lib/supabaseBrowser";
import { useStore, useT } from "@/store/useStore";
import { cn } from "@/lib/utils";
import type { TKey } from "@/lib/i18n";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthForm() {
  const { t } = useT();
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const showToast = useStore((s) => s.showToast);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "password" | "form", TKey>>>({});
  const [info, setInfo] = useState<TKey | null>(null);
  const [busy, setBusy] = useState(false);

  // إن كان المستخدم مسجلاً فعلاً ننتقل لصفحة الحساب
  useEffect(() => { if (user) window.location.replace("/account"); }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (mode === "register" && !name.trim()) next.name = "errName";
    if (!EMAIL_RE.test(email)) next.email = "errEmail";
    if (password.length < 8) next.password = "errPass";
    setErrors(next); setInfo(null);
    if (Object.keys(next).length) return;

    const sb = getBrowserClient();
    if (!sb) {
      // وضع تجريبي بدون Supabase: لا نحفظ كلمة المرور إطلاقاً
      setUser({ email, name: name.trim() || email.split("@")[0], demo: true });
      showToast(t("loggedIn"));
      return;
    }
    setBusy(true);
    try {
      if (mode === "register") {
        const { data, error } = await sb.auth.signUp({ email, password, options: { data: { name: name.trim() } } });
        if (error) throw error;
        if (!data.session) { setInfo("checkEmail"); setMode("login"); } // تأكيد البريد مفعّل في Supabase
        else showToast(t("loggedIn"));
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showToast(t("loggedIn"));
      }
    } catch {
      setErrors({ form: "authFail" });
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const sb = getBrowserClient();
    if (!sb) return;
    await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/account` } });
  };

  const field = "w-full rounded-xl2 border border-line bg-bg px-4 py-3 text-sm outline-none focus:border-accent";

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="mb-6 flex rounded-full bg-card p-1">
        {(["login", "register"] as const).map((m) => (
          <button key={m} onClick={() => { setMode(m); setErrors({}); setInfo(null); }} aria-pressed={mode === m}
            className={cn("flex-1 rounded-full py-2.5 text-sm font-bold transition", mode === m ? "bg-bg shadow-soft" : "text-muted")}>{m === "login" ? t("loginL") : t("registerL")}</button>
        ))}
      </div>

      <form onSubmit={submit} noValidate className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="name">{t("nameL")}</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} aria-invalid={Boolean(errors.name)} />
            {errors.name && <p className="mt-1 text-xs text-red-500" role="alert">{t(errors.name)}</p>}
          </div>
        )}
        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="email">{t("emailL")}</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" dir="ltr" className={field} aria-invalid={Boolean(errors.email)} />
          {errors.email && <p className="mt-1 text-xs text-red-500" role="alert">{t(errors.email)}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold" htmlFor="password">{t("passL")}</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} dir="ltr" className={field} aria-invalid={Boolean(errors.password)} />
          {errors.password && <p className="mt-1 text-xs text-red-500" role="alert">{t(errors.password)}</p>}
        </div>
        {errors.form && <p className="text-sm text-red-500" role="alert">{t(errors.form)}</p>}
        {info && <p className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600" role="status">{t(info)}</p>}
        <button type="submit" disabled={busy} className="w-full rounded-full bg-accent py-3.5 font-bold text-accent-fg transition hover:opacity-90 disabled:opacity-50">{mode === "login" ? t("loginL") : t("registerL")}</button>
      </form>

      {authEnabled ? (
        <>
          <p className="my-4 text-center text-xs text-muted">{t("orL")}</p>
          <button onClick={google} className="w-full rounded-full border border-line py-3 text-sm font-bold hover:bg-card">{t("googleL")}</button>
        </>
      ) : (
        <p className="mt-5 rounded-lg bg-card p-3 text-xs leading-6 text-muted">{t("demoNote")}</p>
      )}
    </div>
  );
}

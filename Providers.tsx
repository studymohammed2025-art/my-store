"use client";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import Toaster from "@/components/ui/Toaster";
import WhatsAppButton from "./WhatsAppButton";
import FirstOrderPopup from "./FirstOrderPopup";
import AuthSync from "./AuthSync";

export default function Providers({ children }: { children: React.ReactNode }) {
  const lang = useStore((s) => s.lang);
  const theme = useStore((s) => s.theme);

  // استرجاع التفضيلات المحفوظة (لغة، ثيم، عملة، مفضلة، سلة) بعد أول رسم
  useEffect(() => { useStore.persist.rehydrate(); }, []);

  // مزامنة اتجاه الصفحة واللغة والوضع الداكن مع الحالة
  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "ar" ? "rtl" : "ltr";
    el.classList.toggle("dark", theme === "dark");
  }, [lang, theme]);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <BackToTop />
      <WhatsAppButton />
      <FirstOrderPopup />
      <Toaster />
      <AuthSync />
    </>
  );
}

"use client";
import { MessageCircle } from "lucide-react";
import { useT } from "@/store/useStore";

export default function WhatsAppButton() {
  const { t } = useT();
  // الرقم يُقرأ من .env.example → NEXT_PUBLIC_WHATSAPP_NUMBER
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966500000000";
  return (
    <a href={`https://wa.me/${number}`} target="_blank" rel="noopener noreferrer" aria-label={t("whatsapp")}
      className="fixed bottom-6 end-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-105">
      <MessageCircle size={22} />
    </a>
  );
}

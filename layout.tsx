import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "سوقي | Souqi",
  description: "متجر أزياء وجمال ومنزل بأسعار مميزة وشحن سريع.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // اللغة الافتراضية عربية؛ يتم تحديث lang/dir/theme من Providers بعد استرجاع تفضيلات المستخدم
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${cairo.variable} ${inter.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

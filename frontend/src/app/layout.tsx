import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = { variable: "font-inter" }; // Плейсхолдер для переменной

export const metadata: Metadata = {
  title: "Ashar-go — Краудфандинг платформа Кыргызстана",
  description:
    "Ashar-go — цифровая платформа коллективной поддержки проектов в Кыргызстане. Запускай проекты, собирай средства и поддерживай идеи других. Краудфандинг, стартапы, социальные проекты.",
  keywords: [
    "краудфандинг Кыргызстан",
    "собрать деньги на проект",
    "поддержать стартап",
    "ашар онлайн",
    "crowdfunding Kyrgyzstan",
    "ashar-go",
  ],
  openGraph: {
    title: "Ashar-go — Краудфандинг платформа Кыргызстана",
    description:
      "Цифровая платформа коллективной поддержки проектов. Запускай проекты, собирай средства и поддерживай идеи других.",
    type: "website",
    locale: "ru_KG",
    siteName: "Ashar-go",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-sans`} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
        <div className="noise-overlay" />
      </body>
    </html>
  );
}

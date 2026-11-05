import type { Metadata } from "next";
import "./globals.css";
import { DemoProvider } from "@/features/auth/DemoProvider";

export const metadata: Metadata = {
  title: "Kavi",
  description: "Platform Laporan & Diskusi Publik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}

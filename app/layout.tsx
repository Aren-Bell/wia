import type { Metadata } from "next";
import { DM_Sans, Joti_One } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const jotiOne = Joti_One({
  variable: "--font-joti-one",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Kavi | Platform Laporan & Diskusi Publik Warga Indonesia",
  description:
    "Kavi is a platform for addressing the issues faced by Indonesian citizens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${dmSans.variable} ${jotiOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

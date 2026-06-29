import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "KomunaID - Platform Ekosistem Komunitas",
  description:
    "CONNECT - COMMUNITY - GROW. Platform untuk Terhubung, Bergerak, dan Bertumbuh.",
  keywords: ["komunitas", "community", "event", "collaboration", "indonesia"],
  openGraph: {
    title: "KomunaID - Platform Ekosistem Komunitas",
    description:
      "CONNECT - COMMUNITY - GROW. Platform untuk Terhubung, Bergerak, dan Bertumbuh.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

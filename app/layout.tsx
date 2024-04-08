import type { Metadata } from "next";
import { Inter, PT_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const pt = PT_Mono({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Bunny ASCII",
  description: "Submission for BunnyHacks S2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pt.className} text-xs`}>{children}</body>
    </html>
  );
}

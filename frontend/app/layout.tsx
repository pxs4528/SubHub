import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { Metadata, Viewport } from "next";
import react from '@/public/icon512_rounded.png'


export const metadata: Metadata = {
  title: "SubHub",
  description: "Subscriptions made easy",
  manifest: "/manifest.json",
  icons: { apple: '/icon-192x192.png.png' }
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

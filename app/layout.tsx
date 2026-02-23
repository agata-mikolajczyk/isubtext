import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iSubtext",
  description: "Observe what lives between the lines.",
};

import Footer from "./Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">

        {/* CONTENT */}
        <main className="flex-1">
          {children}
        </main>

        {/* ✅ GDPR FOOTER */}
        <Footer />

      </body>
    </html>
  );
}
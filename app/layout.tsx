import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iSubtext",
  description: "Observe what lives between the lines.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} antialiased bg-neutral-950 text-neutral-100`}
      >
        {children}
      </body>
    </html>
  );
}

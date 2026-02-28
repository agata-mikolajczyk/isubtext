"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname() || "";
  const isPolish = pathname.startsWith("/pl");

  return (
    <footer className="pb-6 text-center text-xs text-neutral-400">
      <div className="flex justify-center gap-4">
        <Link
          href={isPolish ? "/pl/privacy" : "/privacy"}
          className="hover:text-neutral-600 transition-colors"
        >
          {isPolish ? "Prywatność" : "Privacy"}
        </Link>

        <Link
          href={isPolish ? "/pl/terms" : "/terms"}
          className="hover:text-neutral-600 transition-colors"
        >
          {isPolish ? "Regulamin" : "Terms"}
        </Link>
      </div>
    </footer>
  );
}
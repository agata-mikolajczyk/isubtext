"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname() || "";
  const isPolish = pathname.startsWith("/pl");

  return (
    <footer className="pb-6 text-center text-xs text-neutral-400">
      <a
        href={isPolish ? "/pl/privacy" : "/privacy"}
        className="hover:text-neutral-600 transition-colors"
      >
          <div className="flex justify-center gap-4">
          <a href={isPolish ? "/pl/privacy" : "/privacy"}>
            {isPolish ? "Prywatność" : "Privacy"}
          </a>
          <a href={isPolish ? "/pl/terms" : "/terms"}>
            {isPolish ? "Regulamin" : "Terms"}
          </a>
        </div>
      </a>
    </footer>
  );
}

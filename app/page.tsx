"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DEMO_INSIGHT =
  "One person keeps explaining, while the other keeps waiting to feel understood. The conversation moves forward, but emotional alignment stays slightly behind.";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [fullText, setFullText] = useState("");
  const [visibleText, setVisibleText] = useState("");

  const [showInsight, setShowInsight] = useState(false);
  const [breathing, setBreathing] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);

  // ✅ DODAJ TO TUTAJ
  const pathname = usePathname();
  const isPolish = pathname.startsWith("/pl");

  useEffect(() => setMounted(true), []);

  const analyzeConversation = async () => {
    if (!text.trim()) return;
    
    setHasTyped(true); // ⭐ KLUCZOWA LINIA
    setLoading(true);
    setShowInsight(true);   // pokaż box od razu
    setBreathing(false);

    setFullText("");
    setVisibleText("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      await new Promise((r) => setTimeout(r, 900));

      setFullText(data.insight);
      requestAnimationFrame(() => setShowInsight(true));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted || hasTyped) return;

    const t = setTimeout(() => {
      setFullText(DEMO_INSIGHT);
      requestAnimationFrame(() => setShowInsight(true));
    }, 1200);

    return () => clearTimeout(t);
  }, [mounted, hasTyped]);

  useEffect(() => {
    if (!fullText) return;

    let i = 0;

    const interval = setInterval(() => {
      setVisibleText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 18);

    return () => clearInterval(interval);
  }, [fullText]);

  useEffect(() => {
    if (visibleText === fullText && fullText) {
      const t = setTimeout(() => setBreathing(true), 400);
      return () => clearTimeout(t);
    } else {
      setBreathing(false);
    }
  }, [visibleText, fullText]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100 px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="space-y-10 rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-2xl p-10">
          
          {/* TITLE */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              iSubtext
            </h1>
            <p className="text-neutral-400 text-sm max-w-xs mx-auto">
              Observe what lives between the lines.
            </p>
          </div>

          {/* TEXTAREA */}
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setHasTyped(true);
            }}
            placeholder="Paste a conversation message..."
            className="w-full h-40 resize-none rounded-xl bg-neutral-900/80 border border-neutral-800 px-4 py-3 text-sm leading-relaxed transition focus:border-neutral-600"
          />

          {/* BUTTON */}
          <button
            onClick={analyzeConversation}
            disabled={loading}
            className="w-full rounded-xl bg-white text-black py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
          >
            {loading ? "Observing..." : "Analyze"}
          </button>

          {/* INSIGHT */}
          {(visibleText || loading) && (
            <div
              className={`
                rounded-xl border border-neutral-800 bg-neutral-900/80
                p-5 text-sm leading-relaxed text-neutral-200
                transition-all duration-700
                ${showInsight ? "opacity-100" : "opacity-0"}
                ${breathing ? "animate-breath" : ""}
              `}
            >
              {loading && !visibleText
                ? "Reading between the lines..."
                : visibleText}

              {visibleText !== fullText && (
                <span className="animate-pulse ml-1">▍</span>
              )}

              {visibleText === fullText && (
                <p className="mt-6 text-xs opacity-40 tracking-wide">
                  iSubtext.com
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

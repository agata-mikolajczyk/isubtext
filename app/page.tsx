"use client";

import { useEffect, useState } from "react";

// ---------------------------
// DEMO INSIGHT
// ---------------------------
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

  // hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // analyze
  const analyzeConversation = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setFullText("");
    setVisibleText("");
    setShowInsight(false);
    setBreathing(false);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      await new Promise((r) => setTimeout(r, 900));

      setFullText(data.insight);

      requestAnimationFrame(() => {
        setShowInsight(true);
      });
    } catch {
      setFullText("Something felt unclear in the exchange.");
      requestAnimationFrame(() => setShowInsight(true));
    } finally {
      setLoading(false);
    }
  };

  // auto demo
  useEffect(() => {
    if (!mounted || hasTyped) return;

    const timeout = setTimeout(() => {
      setFullText(DEMO_INSIGHT);
      requestAnimationFrame(() => setShowInsight(true));
    }, 1200);

    return () => clearTimeout(timeout);
  }, [mounted, hasTyped]);

  // typing effect
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

  // breathing
  useEffect(() => {
    if (!fullText) return;

    if (visibleText === fullText) {
      const t = setTimeout(() => setBreathing(true), 400);
      return () => clearTimeout(t);
    } else {
      setBreathing(false);
    }
  }, [visibleText, fullText]);

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-black text-neutral-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
        <div
          className="
            w-full max-w-lg
            space-y-10
            rounded-3xl
            border border-white/10
            bg-white/[0.06]
            backdrop-blur-xl
            shadow-[0_20px_80px_rgba(0,0,0,0.65)]
            p-10
          "
        >
          {/* TITLE */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              iSubtext
            </h1>
            <p className="text-neutral-400 text-sm max-w-sm mx-auto">
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
            className="
              w-full h-40 resize-none
              rounded-xl
              bg-neutral-900/80
              border border-neutral-800
              px-4 py-3
              text-sm leading-relaxed
              focus:border-neutral-600
              transition
            "
          />

          {/* BUTTON */}
          <button
            onClick={analyzeConversation}
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-white text-black
              py-3
              text-sm font-medium
              hover:opacity-90
              transition
              disabled:opacity-40
            "
          >
            {loading ? "Observing..." : "Analyze"}
          </button>

          {/* INSIGHT */}
          {(visibleText || loading) && (
            <div
              className={`
                rounded-xl border border-neutral-800
                bg-neutral-900/80
                p-5
                min-h-[120px]
                text-sm leading-relaxed text-neutral-200
                transition-all duration-700
                ${
                  showInsight
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }
                ${breathing ? "animate-breath" : ""}
              `}
            >
              {visibleText}
              {visibleText !== fullText && (
                <span className="animate-pulse ml-1">▍</span>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

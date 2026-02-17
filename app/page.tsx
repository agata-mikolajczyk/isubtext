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

  // hydration guard (IMPORTANT for Next.js)
  const [mounted, setMounted] = useState(false);

  // typing system
  const [fullText, setFullText] = useState("");
  const [visibleText, setVisibleText] = useState("");

  // animations
  const [showInsight, setShowInsight] = useState(false);
  const [breathing, setBreathing] = useState(false);

  // demo control
  const [hasTyped, setHasTyped] = useState(false);

  // ---------------------------
  // HYDRATION FIX
  // ---------------------------
  useEffect(() => {
    setMounted(true);
  }, []);

  // ---------------------------
  // ANALYZE
  // ---------------------------
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      // intentional AI thinking delay
      await new Promise((r) => setTimeout(r, 900));

      setFullText(data.insight);

      requestAnimationFrame(() => {
        setShowInsight(true);
      });
    } catch (err) {
      console.error(err);

      setFullText("Something felt unclear in the exchange.");

      requestAnimationFrame(() => {
        setShowInsight(true);
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // AUTO DEMO (stable version)
  // ---------------------------
  useEffect(() => {
    if (!mounted) return;
    if (hasTyped) return;

    const timeout = setTimeout(() => {
      setFullText(DEMO_INSIGHT);

      requestAnimationFrame(() => {
        setShowInsight(true);
      });
    }, 1200);

    return () => clearTimeout(timeout);
  }, [mounted, hasTyped]);

  // ---------------------------
  // TYPING EFFECT
  // ---------------------------
  useEffect(() => {
    if (!fullText) return;

    let i = 0;

    const interval = setInterval(() => {
      setVisibleText(fullText.slice(0, i + 1));
      i++;

      if (i >= fullText.length) {
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [fullText]);

  // ---------------------------
  // INSIGHT BREATH
  // ---------------------------
  useEffect(() => {
    if (!fullText) return;

    if (visibleText === fullText) {
      const timeout = setTimeout(() => {
        setBreathing(true);
      }, 400);

      return () => clearTimeout(timeout);
    } else {
      setBreathing(false);
    }
  }, [visibleText, fullText]);

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100 px-6">
      <div className="w-full max-w-xl space-y-8">
        {/* TITLE */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            iSubtext
          </h1>
          <p className="text-neutral-400 text-sm">
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
          className="w-full h-40 resize-none rounded-2xl bg-neutral-900 border border-neutral-800 p-4 outline-none focus:border-neutral-600 transition"
        />

        {/* BUTTON */}
        <button
          onClick={analyzeConversation}
          disabled={loading}
          className="w-full rounded-2xl bg-white text-black py-3 font-medium hover:opacity-90 transition disabled:opacity-40"
        >
          {loading ? "Observing..." : "Analyze"}
        </button>

        {/* INSIGHT */}
        {(visibleText || loading) && (
          <div
            className={`
              rounded-2xl border border-neutral-800 bg-neutral-900 p-6
              min-h-[120px] leading-relaxed text-neutral-200
              transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
              ${
                showInsight
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-[0.98] translate-y-2"
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
    </main>
  );
}

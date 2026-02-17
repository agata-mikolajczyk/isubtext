"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);
    setInsight("");

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setInsight(data.insight);
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 600, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h1>iSubtext</h1>

      <textarea
        placeholder="Paste a conversation message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        style={{ width: "100%", padding: 12 }}
      />

      <button
        onClick={analyze}
        style={{ marginTop: 12, padding: "10px 16px" }}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {insight && (
        <p style={{ marginTop: 24, fontSize: 18 }}>
          {insight}
        </p>
      )}
    </main>
  );
}

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ISUBTEXT_PROMPT } from "@/lib/isubtextPrompt";
import { checkDailyLimit, checkIpLimit } from "@/lib/safeMode";

const MICRO_LENSES = [
  "Focus on what remains unspoken but emotionally present.",
  "Reflect subtle emotional distance rather than explicit meaning.",
  "Notice hesitation and softness between the lines.",
  "Capture the feeling that lingers after the conversation ends.",
  "Sense quiet expectations that were never directly voiced.",
  "Reflect emotional tension gently, without explanation.",
  "Focus on what is felt but carefully avoided in words.",
  "Notice where effort and emotional return feel uneven.",
  "Reflect the gap between what is expressed and what is actually sustained."
];

function pickLens() {
  return MICRO_LENSES[Math.floor(Math.random() * MICRO_LENSES.length)];
}

/**
 * SAFE LIMITS
 */
const MAX_PER_MINUTE = Number(process.env.MAX_PER_MINUTE ?? 10);
const MAX_DAILY_ANALYSES = Number(process.env.MAX_DAILY_ANALYSES ?? 1000);

/**
 * OpenAI client
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Extract real IP (works behind nginx / proxy)
 */
function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

/**
 * POST /api/analyze
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // ✅ RATE LIMIT PER IP
    if (!checkIpLimit(ip, MAX_PER_MINUTE)) {
      return NextResponse.json(
        { error: "Too many requests." },
        { status: 429 }
      );
    }

    // ✅ DAILY COST CIRCUIT BREAKER
    if (!checkDailyLimit(MAX_DAILY_ANALYSES)) {
      return NextResponse.json(
        { error: "Daily limit reached." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const text: string = body.text;
    const lang: string = body.lang || "en";

    const lens = pickLens();

    // Basic validation
    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: "Conversation text too short." },
        { status: 400 }
      );
    }

    const languageInstruction =
      lang === "pl"
        ? "Write the insight in natural Polish. Use calm, reflective everyday language. Avoid formal or academic tone."
        : "Write the insight in natural English.";

    /**
     * OPENAI CALL WITH TIMEOUT
     * protects against hanging requests
     */
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000); // 10s hard timeout

    const completion = await openai.chat.completions.create(
      {
        model: "gpt-4o-mini",
        temperature: 0.9,
        messages: [
          {
            role: "system",
            content: `${ISUBTEXT_PROMPT}
${languageInstruction}`,
          },
          {
            role: "system",
            content: lens,
          },
          {
            role: "user",
            content: text,
          },
        ],
      },
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    const insight =
      completion.choices[0]?.message?.content?.trim() ?? "";

    if (!insight) {
      return NextResponse.json(
        { error: "No insight generated." },
        { status: 500 }
      );
    }

    /**
     * Intentional slow-AI feeling
     */
    await new Promise((resolve) => setTimeout(resolve, 900));

    return NextResponse.json({ insight });

  } catch (error: any) {
    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timeout." },
        { status: 504 }
      );
    }

    console.error("Analyze API error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
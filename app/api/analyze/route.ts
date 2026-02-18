import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ISUBTEXT_SYSTEM_PROMPT } from "@/lib/isubtextPrompt";

/**
 * Create OpenAI client
 * Uses OPENAI_API_KEY from .env.local
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/analyze
 *
 * Body:
 * {
 *   text: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text: string = body.text;
    const lang: string = body.lang || "en";

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
     * OpenAI request
     */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.9,

      messages: [
        {
          role: "system",
          content: `${ISUBTEXT_SYSTEM_PROMPT}
          ${languageInstruction}`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const insight =
      completion.choices[0]?.message?.content?.trim() ?? "";

    /**
     * Safety fallback
     */
    if (!insight) {
      return NextResponse.json(
        { error: "No insight generated." },
        { status: 500 }
      );
    }

    /**
     * Optional intentional delay
     * (keeps slow-AI feeling from project philosophy)
     */
    await new Promise((resolve) => setTimeout(resolve, 900));

    return NextResponse.json({ insight });
  } catch (error) {
    console.error("Analyze API error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

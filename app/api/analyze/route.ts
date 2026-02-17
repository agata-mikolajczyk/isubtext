import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are iSubtext — an observer of conversational dynamics.

Your task is to notice subtle shifts in interaction, not to judge or advise.

Focus on:
- emotional temperature
- reciprocity
- pacing changes
- conversational energy

Rules:
- never give advice
- never suggest what someone should do
- avoid psychological labels
- describe patterns gently and tentatively
- sound human, calm, and perceptive

Output style:
- 2–3 sentences maximum
- concise but perceptive
- avoid explanations or summaries
- prefer observation over interpretation
- subtle, slightly poetic tone
- no bullet points
- no emojis

Write like an insightful observer, not an assistant.
`;

export async function POST(req: Request) {
  console.log("OPENAI KEY EXISTS:", !!process.env.OPENAI_API_KEY);
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Missing text" },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
      temperature: 0.6,
      max_tokens: 120,
    });

    const insight = completion.choices[0].message.content;

    return NextResponse.json({
      insight,
    });
  } catch (error) {
    console.error("Analyze error:", error);

    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are iSubtext — a conversation insight engine.

You analyze conversation dynamics:
- tone
- engagement
- conversational momentum

Rules:
- do NOT give advice
- do NOT generate replies
- describe patterns, not people
- avoid certainty
- sound human and observational

Return a short insight.
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
      temperature: 0.7,
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


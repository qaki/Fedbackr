import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text, rating, businessName, tone } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY missing" }, { status: 500 });

  const prompt = `You are a helpful, professional customer support assistant for a local business named "${businessName || "our business"}".
Write a ${tone || "warm and professional"} public reply to this ${rating || "?"}-star review. 
Be concise (2–4 sentences), empathetic, and invite the customer to continue the conversation privately if needed.\n\nReview:\n"""\n${text || ""}\n"""`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    }),
  });
  if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 500 });
  const data = await res.json();
  const draft = data?.choices?.[0]?.message?.content?.trim() || "";

  return NextResponse.json({ draft });
}



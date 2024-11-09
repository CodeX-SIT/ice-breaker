import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not found");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  const { userMessage } = await req.json();

  try {
    const result = await model.generateContent(userMessage);
    return NextResponse.json({ botMessage: result.response.text() });
  } catch (error) {
    console.error("Error in chatbot response:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Only POST requests allowed." },
    { status: 405 },
  );
}

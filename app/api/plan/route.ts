import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const TRAVEL_SYSTEM_PROMPT = `You are an expert travel advisor. Only provide travel-related information and recommendations. 
If a question is not related to travel (destinations, accommodations, transportation, activities, travel tips, culture, or local customs), 
politely explain that you can only help with travel-related queries.`;

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    console.log("Received question:", question);

    const completion = await openai.chat.completions.create(
      {
        model: "qwen/qwen2.5-vl-32b-instruct:free",
        messages: [
          { role: "system", content: TRAVEL_SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
      },
      {
        headers: {
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "AI Travel Planner",
        },
      }
    );

    console.log("OpenRouter Response:", completion);

    if (!completion.choices?.[0]?.message?.content) {
      console.error("Unexpected API response format:", completion);
      return NextResponse.json(
        { error: "Invalid response from AI service" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("Error in request:", error);
    const errorMessage = error?.message || "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

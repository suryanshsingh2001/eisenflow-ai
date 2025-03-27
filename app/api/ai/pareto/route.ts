import { paretoAnalysis } from "@/lib/ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { tasks } = await request.json();

    const result = await paretoAnalysis(tasks);
    return Response.json(result);
  } catch (error) {
    console.error("Error analyzing tasks:", error);
    return Response.json({ error: "Failed to analyze tasks" }, { status: 500 });
  }
}

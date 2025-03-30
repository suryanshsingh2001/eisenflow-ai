import {  frogAnalysis } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";
import aj from "@/lib/arcjet";

const RATE_LIMIT_ENABLED = process.env.RATE_LIMIT_ENABLED === "true";

export async function POST(request: NextRequest) {
  try {
    const decision = await aj.protect(request);

    if (decision.isDenied() && RATE_LIMIT_ENABLED) {
      const ttl = decision.ttl;
      const hours = Math.floor(ttl / 3600);

      return NextResponse.json(
        {
          text: `You have exceeded the rate limit. Please try again in ${hours} hours.`,
        },
        { status: 429 }
      );
    }
    const body = await request.json();

    if (!Array.isArray(body.tasks)) {
      return NextResponse.json(
        { error: "Invalid input: tasks must be an array" },
        { status: 400 }
      );
    }

    const frogTasks = await frogAnalysis(body.tasks);

    return NextResponse.json({ success: true, results: frogTasks });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
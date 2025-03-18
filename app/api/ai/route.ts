import { categorizeTasks } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body.tasks)) {
      return NextResponse.json(
        { error: "Invalid input: tasks must be an array" },
        { status: 400 }
      );
    }

    const tasks = body.tasks.map((task: any) => ({
      title: String(task.title || ""),
      description: String(task.description || ""),
    }));

    const categorizedTasks = await categorizeTasks(tasks);

    return NextResponse.json({ results: categorizedTasks });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

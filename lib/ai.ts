import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function categorizeTasks(
  tasks: { title: string; description: string }[]
): Promise<{ quadrant: string; reasoning: string }[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are an AI task categorizer. Categorize these tasks into Eisenhower Matrix quadrants.
Return only a JSON array with no additional text or formatting.
Each object should have exactly two properties: "quadrant" and "reasoning".
Valid quadrant values are: "important-urgent", "important-not-urgent", "not-important-urgent", "not-important-not-urgent"

Input tasks:
${JSON.stringify(tasks, null, 2)}

Example expected format:
[{
    "quadrant": "important-urgent",
    "reasoning": "Brief explanation"
}]`;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error categorizing tasks:", error);
    return tasks.map(() => ({
      quadrant: "important-urgent",
      reasoning: "AI categorization failed, defaulting to Important & Urgent",
    }));
  }
}

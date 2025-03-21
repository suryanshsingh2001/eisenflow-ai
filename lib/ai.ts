import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

console.log(
  "Using model:",
  genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function categorizeTasks(
  tasks: { title: string; description: string }[]
): Promise<{ quadrant: string; reasoning: string }[]> {
  const sanitizedTasks = tasks.map(task => ({
    title: String(task.title).replace(/[^\w\s-]/g, ''),
    description: String(task.description).replace(/[^\w\s-]/g, '')
  }));

  const prompt = `You are an advanced AI task categorizer specializing in the Eisenhower Matrix.
Your role is strictly limited to categorizing tasks into the Eisenhower Matrix quadrants.

### Input Format
Each task has a sanitized title and description.

### Required Output Format
Return a JSON array where each object has exactly:
- "quadrant": One of ["important-urgent", "important-not-urgent", "not-important-urgent", "not-important-not-urgent"]
- "reasoning": Brief explanation (max 100 characters)

### Input Tasks:
${JSON.stringify(sanitizedTasks, null, 2)}

Respond only with valid JSON matching the specified format.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response
      .text()
      .replace(/```json\n|\n```/g, "")
      .trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error categorizing tasks:", error);
    return tasks.map(() => ({
      quadrant: "important-urgent",
      reasoning: "AI categorization failed, defaulting to Important & Urgent",
    }));
  }
}

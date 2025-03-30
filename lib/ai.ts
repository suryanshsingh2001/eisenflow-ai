import { FrogTask } from "@/app/frog/page";
import { ParetoTask } from "@/app/pareto/page";
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
  const sanitizedTasks = tasks.map((task) => ({
    title: String(task.title).replace(/[^\w\s-]/g, ""),
    description: String(task.description).replace(/[^\w\s-]/g, ""),
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

export async function paretoAnalysis(tasks: ParetoTask[]) {
  const prompt = `
  Analyze these tasks and provide:
  1. Suggested impact score (1-100)
  2. Suggested effort score (1-100)
  3. Brief optimization recommendation
  
  Consider:
  - Business value and ROI
  - Resource requirements
  - Time constraints
  - Dependencies
  - Potential risks
  
  Tasks: ${JSON.stringify(tasks, null, 2)}
  
  Respond in this JSON format:
  {
    "analysis": [
      {
        "title": "task title",
        "suggestedImpact": number,
        "suggestedEffort": number,
        "recommendation": "brief optimization advice"
      }
    ]
  }
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response
    .text()
    .replace(/```json\n|\n```/g, "")
    .trim();

  return JSON.parse(text);
}

export async function frogAnalysis(tasks: FrogTask[]) {
  try {
    const prompt = `
      Analyze these tasks and provide:
      1. Suggested order of completion
      2. Brief strategy for each task
      
      Consider:
      - Task complexity and difficulty
      - Dependencies between tasks
      - Best practices for task management
      - Energy levels required
      
      Tasks: ${JSON.stringify(tasks, null, 2)}
      
      Respond in this JSON format:
      {
        "analysis": [
          {
            "title": "task title",
            "strategy": "brief strategy advice",
            "priority": "explanation of why this order"
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response
      .text()
      .replace(/```json\n|\n```/g, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing tasks:", error);
  }
}

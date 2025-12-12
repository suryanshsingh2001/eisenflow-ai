import { FrogTask } from "@/app/frog/page";
import { ParetoTask } from "@/app/pareto/page";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

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
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });
    if (!response.text) {
      throw new Error("No response text from AI model");
    }
    const santizedResponse = response.text
      .replace(/```json\n|\n```/g, "")
      .trim();

    return JSON.parse(santizedResponse);
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

  const result = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });
  if (!result.text) {
    throw new Error("No response text from AI model");
  }
  const response = result.text;
  const sanitizedText = response.replace(/```json\n|\n```/g, "").trim();

  console.error("Pareto Analysis Response:", sanitizedText);
  return JSON.parse(sanitizedText);
}

export async function frogAnalysis(tasks: FrogTask[]) {
  try {
    const sanitizedTasks = tasks.map((task) => ({
      title: String(task.title).replace(/[^\w\s-]/g, ""),
      description: String(task.description).replace(/[^\w\s-]/g, ""),
    }));

    const prompt = `You are a task prioritization assistant.
  Your only role is to analyze and prioritize tasks using the "Eat That Frog" methodology.

  Required Output Format:
  Return a JSON array of sorted tasks based on priorityScore, where each task has:
  - "title": string (must match input)
  - "priorityScore": number (1-5 only)
  - "reasoning": string (max 100 characters)

  Input Tasks:
  ${JSON.stringify(sanitizedTasks, null, 2)}

  Respond only with valid JSON matching the specified format, sorted by priorityScore descending.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    if (!response.text) {
      throw new Error("No response text from AI model");
    }

    const text = response.text.replace(/```json\n|\n```/g, "").trim();

    console.error("Response text:", text);
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing tasks:", error);
  }
}

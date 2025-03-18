import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function categorizeTasks(tasks: { title: string; description: string }[]): Promise<{ quadrant: string; reasoning: string }[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Analyze these tasks and categorize them into the Eisenhower Matrix quadrants:
    1. Important & Urgent
    2. Important & Not Urgent
    3. Not Important & Urgent
    4. Not Important & Not Urgent

    For each task, provide the quadrant and a brief reasoning.
    Tasks: ${JSON.stringify(tasks, null, 2)}

    Respond in this format for each task:
    {
      "quadrant": "important-urgent",
      "reasoning": "Brief explanation"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error categorizing tasks:', error);
    return tasks.map(() => ({
      quadrant: 'important-urgent',
      reasoning: 'AI categorization failed, defaulting to Important & Urgent'
    }));
  }
}
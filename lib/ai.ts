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
  const prompt = `You are an advanced AI task categorizer specializing in the Eisenhower Matrix.  
Your goal is to categorize the given tasks into one of the four quadrants based on their urgency and importance.  

### Instructions:  
- Analyze each task carefully and determine its appropriate quadrant.  
- Return a **JSON array** with **no additional text or formatting**.  
- Each object must contain exactly **two properties**:  
  - **"quadrant"**: One of the following values:  
    - "important-urgent"  
    - "important-not-urgent"  
    - "not-important-urgent"  
    - "not-important-not-urgent"  
  - **"reasoning"**: A **concise yet clear** explanation for why the task belongs to that quadrant.  

### Input Tasks:  
${JSON.stringify(tasks, null, 2)}  

### Expected Output Format:  
\`\`\`json
[
  {
    "quadrant": "important-urgent",
    "reasoning": "This task has a strict deadline and significant consequences if not completed immediately."
  }
]
\`\`\`
Ensure your response is **strictly valid JSON** with no additional commentary.`;

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

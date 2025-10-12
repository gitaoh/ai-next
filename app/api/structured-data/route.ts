import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { recipeSchema } from "@/app/api/structured-data/schema";

export async function POST(req: Request) {
  try {
    const { dish } = await req.json();
    const result = streamObject({
      model: openai("gpt-4.1-nano"),
      schema: recipeSchema,
      prompt: `Generate a recipe for ${dish}`,
    });
    return result.toTextStreamResponse();
  } catch (e) {
    console.error("Error Generating Recipe: ", e);
    return new Response("Failed to Generate Recipe", { status: 500 });
  }
}

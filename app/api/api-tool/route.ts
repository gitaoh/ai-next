import {
  convertToModelMessages,
  InferUITools,
  stepCountIs,
  streamText,
  tool,
  UIDataTypes,
  UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const tools = {
  getWeather: tool({
    description: "Get the weather for a location",
    inputSchema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
    execute: async ({ city }) => {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`,
      );

      const data = await response.json();

      return {
        location: {
          name: data.location.name,
          country: data.location.country,
          localtime: data.location.locatime,
        },
        current: {
          temp_c: data.current.temp_c,
          condition: {
            text: data.current.condition.text,
            code: data.current.condition.code,
          },
        },
      };
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    const result = streamText({
      model: openai("gpt-4.1-nano"),
      messages: convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(2),
    });
    return result.toUIMessageStreamResponse();
  } catch (e) {
    console.error("Error Streaming chat completion: ", e);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}

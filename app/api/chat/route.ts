import { convertToModelMessages, streamText, UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    const result = streamText({
      model: openai("gpt-4.1-nano"),
      // messages: convertToModelMessages(messages),
      messages: [
        {
          role: "system",
          content: "Convert user questions about React into code examples",
          // content:
          //   "You are a helpful coding assistant. Keep your answers concise and focus on practical examples.",
        },
        // Few-short Learning
        {
          role: "user",
          content: "How to toggle a boolean?",
        },
        {
          role: "assistant",
          content:
            "const [isOpen, setIsOpen] = useState(false)\n const toggle = () => setIsOpen(!isOpen)",
        },
        ...convertToModelMessages(messages),
      ],
    });
    return result.toUIMessageStreamResponse();
  } catch (e) {
    console.error("Error Streaming chat completion: ", e);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}

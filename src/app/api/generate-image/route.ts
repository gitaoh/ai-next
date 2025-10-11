import { experimental_generateImage as generateImage } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { image } = await generateImage({
      model: openai.imageModel("dall-e-3"),
      prompt,
      size: "1024x1024",
      providerOptions: {
        openai: {
          style: "vivid",
          quality: "hd",
        },
      },
    });

    return Response.json(image.base64);
  } catch (e) {
    console.error("Error generating image: ", e);
    return new Response("Failed to generate image", { status: 500 });
  }
}

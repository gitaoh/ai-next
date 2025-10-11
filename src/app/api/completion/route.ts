import {generateText} from "ai";
import {openai} from "@ai-sdk/openai";

export async function POST(req: Request) {
    try {
        const {prompt} = await req.json()
        const {text} = await generateText({
            model: openai("gpt-4.1-nano"),
            prompt
        })
        return Response.json({text})
    } catch (e) {
        console.error("Error: ", e)
        return Response.json({error: e, message: "Failed to generate Text"}, {status: 500})
    }
}
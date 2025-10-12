"use client";

import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { ChatMessage } from "@/app/api/tools/route";

export default function ToolsChatPage() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error, stop } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: "/api/tools",
    }),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {error && <div className="mb-4 text-red-500">{error.message}</div>}

      {messages.map((message) => (
        <div key={message.id} className="mb-4">
          <div className="font-semibold">
            {message.role === "user" ? "You:" : "AI:"}
          </div>
          {message.parts.map((part, index) => {
            switch (part.type) {
              case "text":
                return (
                  <div
                    key={`${message.id}-${index}`}
                    className="whitespace-pre-wrap"
                  >
                    {part.text}
                  </div>
                );
              case "tool-getWeather":
                switch (part.state) {
                  case "input-streaming":
                    return (
                      <div
                        key={`${message.id}-getWeather-${index}`}
                        className="mt-1 mb-2 rounded border border-zinc-700 bg-zinc-800/50 p-2"
                      >
                        <div className="text-sm text-zinc-500">
                          🌤️ Receiving weather request...
                        </div>
                        <pre className="mt-1 text-xs text-zinc-600">
                          {JSON.stringify(part.input, null, 2)}
                        </pre>
                      </div>
                    );

                  case "input-available":
                    return (
                      <div
                        key={`${message.id}-getWeather-${index}`}
                        className="mt-1 mb-2 rounded border border-zinc-700 bg-zinc-800/50 p-2"
                      >
                        <div className="text-sm text-zinc-400">
                          🌤️ Getting weather for {part.input.city}...
                        </div>
                      </div>
                    );

                  case "output-available":
                    return (
                      <div
                        key={`${message.id}-getWeather-${index}`}
                        className="mt-1 mb-2 rounded border border-zinc-700 bg-zinc-800/50 p-2"
                      >
                        <div className="text-sm text-zinc-400">🌤️ Weather</div>
                        <div className="text-sm text-zinc-300">
                          <div>{part.output}</div>
                        </div>
                      </div>
                    );

                  case "output-error":
                    return (
                      <div
                        key={`${message.id}-getWeather-${index}`}
                        className="mt-1 mb-2 rounded border border-zinc-700 bg-zinc-800/50 p-2"
                      >
                        <div className="text-sm text-red-400">
                          Error: {part.errorText}
                        </div>
                      </div>
                    );

                  default:
                    return null;
                }
              default:
                return null;
            }
          })}
        </div>
      ))}
      {(status === "submitted" || status === "streaming") && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-400"></div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="fixed right-0 bottom-0 left-0 mx-auto w-full max-w-md border-t border-zinc-200 bg-zinc-50 p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex gap-2">
          <input
            className="flex-1 rounded border border-zinc-300 p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-800"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How can I help you?"
          />
          {status === "submitted" || status === "streaming" ? (
            <button
              onClick={stop}
              className="rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={status !== "ready"}
            >
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// Replace the messages rendering with below for all tool call states in the UI

// {messages.map((message) => (
//   <div key={message.id} className="mb-4">
//     <div className="font-semibold">
//       {message.role === "user" ? "You:" : "AI:"}
//     </div>
//     {message.parts.map((part, index) => {
//       switch (part.type) {
//         case "text":
//           return (
//             <div
//               key={`${message.id}-text-${index}`}
//               className="whitespace-pre-wrap"
//             >
//               {part.text}
//             </div>
//           );

//         case "tool-getLocation":
//           return (
//             <div key={`${message.id}-getLocation-${index}`} className="space-y-1 mt-1">
//               {/* Always show input-streaming as passed state */}
//               {(part.state === "input-streaming" || part.state === "input-available" || part.state === "output-available" || part.state === "output-error") && (
//                 <div className="bg-zinc-800/50 border border-zinc-700 p-2 rounded opacity-50">
//                   <div className="text-sm text-zinc-500">
//                     📍 [STATE: input-streaming] Receiving location request...
//                   </div>
//                   <pre className="text-xs text-zinc-600 mt-1">
//                     {JSON.stringify(part.input || {}, null, 2)}
//                   </pre>
//                 </div>
//               )}

//               {/* Show input-available if we're at or past that state */}
//               {(part.state === "input-available" || part.state === "output-available" || part.state === "output-error") && (
//                 <div className={`bg-zinc-800/50 border border-zinc-700 p-2 rounded ${part.state === "input-available" ? "" : "opacity-70"}`}>
//                   <div className="text-sm text-zinc-400">
//                     📍 [STATE: input-available] Getting location for {part.input.name}...
//                   </div>
//                 </div>
//               )}

//               {/* Show output-available if we're at that state */}
//               {part.state === "output-available" && (
//                 <div className="bg-zinc-800/50 border border-zinc-700 p-2 rounded">
//                   <div className="text-sm text-zinc-400">
//                     📍 [STATE: output-available] Location found
//                   </div>
//                   <div className="text-sm text-zinc-300">
//                     {part.output}
//                   </div>
//                 </div>
//               )}

//               {/* Show output-error if we're at that state */}
//               {part.state === "output-error" && (
//                 <div className="bg-zinc-800/50 border border-zinc-700 p-2 rounded">
//                   <div className="text-sm text-red-400">
//                     [STATE: output-error] Error: {part.errorText}
//                   </div>
//                 </div>
//               )}
//             </div>
//           );

//         case "tool-getWeather":
//           return (
//             <div key={`${message.id}-getWeather-${index}`} className="space-y-1 mt-1">
//               {/* Always show input-streaming as passed state */}
//               {(part.state === "input-streaming" || part.state === "input-available" || part.state === "output-available" || part.state === "output-error") && (
//                 <div className="bg-zinc-800/50 border border-zinc-700 p-2 rounded opacity-50">
//                   <div className="text-sm text-zinc-500">
//                     🌤️ [STATE: input-streaming] Receiving weather request...
//                   </div>
//                   <pre className="text-xs text-zinc-600 mt-1">
//                     {JSON.stringify(part.input || {}, null, 2)}
//                   </pre>
//                 </div>
//               )}

//               {/* Show input-available if we're at or past that state */}
//               {(part.state === "input-available" || part.state === "output-available" || part.state === "output-error") && (
//                 <div className={`bg-zinc-800/50 border border-zinc-700 p-2 rounded ${part.state === "input-available" ? "" : "opacity-70"}`}>
//                   <div className="text-sm text-zinc-400">
//                     🌤️ [STATE: input-available] Getting weather for {part.input.city}...
//                   </div>
//                 </div>
//               )}

//               {/* Show output-available if we're at that state */}
//               {part.state === "output-available" && (
//                 <div className="bg-zinc-800/50 border border-zinc-700 p-2 rounded">
//                   <div className="text-sm text-zinc-400">🌤️ [STATE: output-available] Weather</div>
//                   <div className="text-sm text-zinc-300">
//                     <div>{part.output}</div>
//                   </div>
//                 </div>
//               )}

//               {/* Show output-error if we're at that state */}
//               {part.state === "output-error" && (
//                 <div className="bg-zinc-800/50 border border-zinc-700 p-2 rounded">
//                   <div className="text-sm text-red-400">
//                     [STATE: output-error] Error: {part.errorText}
//                   </div>
//                 </div>
//               )}
//             </div>
//           );

//         default:
//           return null;
//       }
//     })}
//   </div>
// ))}

"use client";

import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function ProviderManagementPage() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/provider-management",
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

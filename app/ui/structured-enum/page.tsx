"use client";

import React, { useState } from "react";

export default function StructuredEnumPage() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSentiment = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);
    setText("");

    try {
      const response = await fetch("/api/structured-enum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSentiment(data);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {error && <div className="mb-4 text-red-500">{error}</div>}

      {isLoading ? (
        <div className="text-center">Analyzing sentiment...</div>
      ) : sentiment ? (
        <div className="text-center">
          <div className="text-3xl font-bold">
            {sentiment === "positive" && "😊 Positive"}
            {sentiment === "negative" && "😞 Negative"}
            {sentiment === "neutral" && "😐 Neutral"}
          </div>
        </div>
      ) : null}

      <form
        onSubmit={analyzeSentiment}
        className="fixed right-0 bottom-0 left-0 mx-auto w-full max-w-md border-t border-zinc-200 bg-zinc-50 p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex gap-2">
          <input
            className="flex-1 rounded border border-zinc-300 p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-800"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to analyze..."
          />
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading || !text.trim()}
          >
            Analyze
          </button>
        </div>
      </form>
    </div>
  );
}

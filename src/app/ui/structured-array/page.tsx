"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { pokemonUISchema } from "@/app/api/structured-array/schema";
import React, { useState } from "react";

export default function StructuredArrayPage() {
  const [type, setType] = useState("");
  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/structured-array",
    schema: pokemonUISchema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ type });
    setType("");
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col pt-12 pb-24">
      {error && <div className="mb-4 px-4 text-red-500">{error.message}</div>}

      <div className="space-y-8">
        {object?.map((pokemon) => (
          <div
            key={pokemon?.name}
            className="rounded-lg bg-zinc-50 p-6 shadow-sm dark:bg-zinc-800"
          >
            <h2 className="mb-4 text-2xl font-bold">{pokemon?.name}</h2>
            <div className="grid grid-cols-2 gap-4">
              {pokemon?.abilities?.map((ability) => (
                <div
                  key={ability}
                  className="rounded-md bg-zinc-100 p-3 dark:bg-zinc-700"
                >
                  {ability}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed right-0 bottom-0 left-0 mx-auto w-full max-w-2xl border-t border-zinc-200 bg-zinc-50 p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Enter a type..."
            className="flex-1 rounded border border-zinc-300 p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-800"
          />
          {isLoading ? (
            <button
              type="button"
              onClick={stop}
              className="rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading || !type.trim()}
              className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Generate
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

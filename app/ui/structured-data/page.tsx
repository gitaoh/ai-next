"use client";

import React, { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { recipeSchema } from "@/app/api/structured-data/schema";

export default function StructuredDataPage() {
  const [dishName, setDishName] = useState("");

  const { submit, object, isLoading, error, stop } = useObject({
    api: "/api/structured-data",
    schema: recipeSchema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ dish: dishName });
    setDishName("");
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col pt-12 pb-24">
      {error && <div className="mb-4 px-4 text-red-500">{error.message}</div>}
      {object?.recipe && (
        <div className="space-y-6 px-4">
          <h2 className="text-2xl font-bold">{object.recipe.name}</h2>

          {object?.recipe?.ingredients && (
            <div>
              <h3 className="mb-4 text-xl font-semibold">Ingredients</h3>
              <div className="grid grid-cols-2 gap-4">
                {object.recipe.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800"
                  >
                    <p className="font-medium">{ingredient?.name}</p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {ingredient?.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {object?.recipe?.steps && (
            <div>
              <h3 className="mb-4 text-xl font-semibold">Steps</h3>
              <ol className="space-y-4">
                {object.recipe.steps.map((step, index) => (
                  <li
                    key={index}
                    className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800"
                  >
                    <span className="mr-2 font-medium">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="fixed right-0 bottom-0 left-0 mx-auto w-full max-w-2xl border-t border-zinc-200 bg-zinc-50 p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            placeholder="Enter a dish name..."
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
              disabled={isLoading || !dishName}
              className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";

interface TranscriptResult {
  text: string;
  segments?: Array<{ start: number; end: number; text: string }>;
  language?: string;
  durationInSeconds?: number;
}

export default function TranscribeAudioPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTranscript(null);
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select an audio file");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);

      const response = await fetch("/api/transcribe-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const data = await response.json();
      setTranscript(data);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setTranscript(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {error && <div className="mb-4 text-red-500">{error}</div>}

      {isLoading && (
        <div className="mb-4 text-center">Transcribing audio...</div>
      )}

      {transcript && !isLoading && (
        <div className="mb-8 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
          <h3 className="mb-2 font-semibold">Transcript:</h3>
          <p className="whitespace-pre-wrap">{transcript.text}</p>

          {transcript.language && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Language: {transcript.language}
            </p>
          )}

          {transcript.durationInSeconds && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Duration: {transcript.durationInSeconds.toFixed(1)} seconds
            </p>
          )}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="fixed right-0 bottom-0 left-0 mx-auto w-full max-w-md border-t border-zinc-200 bg-zinc-50 p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex flex-col gap-2">
          {selectedFile && (
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Selected: {selectedFile.name}</span>
              <button
                type="button"
                onClick={resetForm}
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
              id="audio-upload"
            />
            <label
              htmlFor="audio-upload"
              className="flex-1 cursor-pointer rounded border border-zinc-300 p-2 text-center shadow-xl hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              {selectedFile ? "Change file" : "Select audio file"}
            </label>
            <button
              type="submit"
              disabled={isLoading || !selectedFile}
              className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Transcribe
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

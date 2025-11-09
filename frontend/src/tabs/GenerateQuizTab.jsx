import React, { useState } from "react";
import { generateQuiz, previewUrl } from "../services/api";
import QuizDisplay from "../components/QuizDisplay";
import TakeQuiz from "../components/TakeQuiz";

export default function GenerateQuizTab() {
  const [url, setUrl] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("review");

  const handlePreview = async () => {
    const trimmed = url.trim();
    if (!trimmed || !trimmed.includes("wikipedia.org/wiki/")) {
      setError("Please provide a valid Wikipedia article URL.");
      return;
    }
    setPreviewLoading(true);
    setError("");
    try {
      const preview = await previewUrl(trimmed);
      setPreviewData(preview);
    } catch (err) {
      setError(err.message || "Could not preview URL.");
      setPreviewData(null);
    }
    setPreviewLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please provide a Wikipedia article URL.");
      return;
    }
    setLoading(true);
    setError("");
    setQuizData(null);
    try {
      const res = await generateQuiz(trimmed);
      setQuizData(res);
      setMode("review");
      setUrl(trimmed);
    } catch (err) {
      setError(err.message || "Could not generate quiz. Invalid URL or server error.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="rounded-xl border bg-white">
        <div className="p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Enter Wikipedia URL</h2>
          <p className="text-sm text-gray-500 mb-4">Paste any Wikipedia article URL to generate an intelligent quiz</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              <input
                className="border rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="https://en.wikipedia.org/wiki/Article_Name"
                value={url}
                onChange={e => {
                  setUrl(e.target.value);
                  setPreviewData(null);
                }}
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={previewLoading || loading}
                  className="inline-flex items-center gap-2 justify-center rounded-md px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-60"
                >
                  {previewLoading ? "Previewing..." : "Preview"}
                </button>
                <button
                  className="inline-flex items-center gap-2 justify-center rounded-md px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-60"
                  disabled={loading}
                  type="submit"
                >
                  {loading && (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  )}
                  {loading ? "Generating..." : "Generate Quiz"}
                </button>
              </div>
            </div>
            {previewData && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="text-sm font-semibold text-blue-900">{previewData.title}</div>
                <div className="text-xs text-blue-700 mt-1">{previewData.summary}</div>
              </div>
            )}
            <div className="text-xs text-gray-500">Example: https://en.wikipedia.org/wiki/Artificial_intelligence</div>
            {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}
          </form>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border bg-white mt-6 shadow-sm">
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4"></div>
            <div className="text-lg font-semibold text-gray-800">Generating Your Quiz</div>
            <p className="text-sm text-gray-500 mt-2 max-w-xl">
              Our AI is analyzing the article, extracting key concepts, and crafting thoughtful questions...
            </p>
          </div>
        </div>
      )}

      {quizData && (
        <div className="space-y-3 mt-6">
          <div className="flex gap-2">
            <button
              type="button"
              className={`px-3 py-1 rounded border ${mode === "review" ? "bg-blue-500 text-white" : "bg-white"}`}
              onClick={() => setMode("review")}
            >
              Review Mode
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded border ${mode === "take" ? "bg-blue-500 text-white" : "bg-white"}`}
              onClick={() => setMode("take")}
            >
              Take Quiz
            </button>
          </div>
          {mode === "review" ? <QuizDisplay quizData={quizData} /> : <TakeQuiz quizData={quizData} />}
        </div>
      )}
    </div>
  );
}

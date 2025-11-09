import React, { useState } from "react";
import GenerateQuizTab from "./tabs/GenerateQuizTab";
import HistoryTab from "./tabs/HistoryTab";

const TABS = ["Generate Quiz", "Past Quizzes"];

export default function App() {
  const [active, setActive] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xl">🎓</div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">AI Wiki Quiz Generator</h1>
              <p className="text-sm text-gray-500">Transform Wikipedia articles into engaging quizzes</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-4 md:px-6 pt-4">
            <div className="inline-flex items-center rounded-lg bg-gray-100 p-1 text-sm">
              {TABS.map((tab, idx) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    active === idx
                      ? "bg-white shadow text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActive(idx)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 md:p-6">
            {active === 0 ? <GenerateQuizTab /> : <HistoryTab />}
          </div>
        </div>
      </main>
    </div>
  );
}

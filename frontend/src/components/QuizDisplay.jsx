import React from "react";

export default function QuizDisplay({ quizData, hideAnswers = false }) {
  if (!quizData) return null;
  const {
    title = "Wikipedia Quiz",
    summary = "",
    key_entities = {},
    sections = [],
    quiz = [],
    related_topics = [],
  } = quizData;
  const entities = {
    people: key_entities.people || [],
    organizations: key_entities.organizations || [],
    locations: key_entities.locations || [],
  };
  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      {summary && <p className="text-gray-700 mb-2 leading-relaxed">{summary}</p>}

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-2">People</div>
          <div className="flex flex-wrap gap-2">
            {entities.people.length > 0 ? (
              entities.people.map((p, i) => (
                <span key={i} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border">{p}</span>
              ))
            ) : (
              <span className="text-xs text-gray-500">Not specified</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-2">Organizations</div>
          <div className="flex flex-wrap gap-2">
            {entities.organizations.length > 0 ? (
              entities.organizations.map((p, i) => (
                <span key={i} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border">{p}</span>
              ))
            ) : (
              <span className="text-xs text-gray-500">Not specified</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-2">Locations</div>
          <div className="flex flex-wrap gap-2">
            {entities.locations.length > 0 ? (
              entities.locations.map((p, i) => (
                <span key={i} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border">{p}</span>
              ))
            ) : (
              <span className="text-xs text-gray-500">Not specified</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2">
        <div className="text-sm font-semibold text-gray-700 mb-2">Article Sections</div>
        <div className="flex flex-wrap gap-2">
          {sections.length > 0 ? (
            sections.map((s, i) => (
              <span key={i} className="px-2 py-1 rounded-full text-xs bg-white border text-gray-700">{s}</span>
            ))
          ) : (
            <span className="text-xs text-gray-500">Not specified</span>
          )}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mt-2">Quiz Questions:</h3>
        {quiz.map((q, idx) => (
          <div key={idx} className="my-3 p-3 bg-gray-50 rounded border">
            <b>Q{idx+1}:</b> {q.question}
            <ul className="list-disc list-inside ml-6">
              {q.options.map((opt, i) => (
                <li key={i}>{String.fromCharCode(65+i)}. {opt}</li>
              ))}
            </ul>
            {!hideAnswers && (
              <>
                <div className="text-green-600 mt-1">Correct: <b>{q.answer}</b> [{q.difficulty}]</div>
                <div className="text-xs text-gray-600">{q.explanation}</div>
              </>
            )}
          </div>
        ))}
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-2">Suggested Topics</div>
        <div className="flex flex-wrap gap-2">
          {related_topics.length > 0 ? (
            related_topics.map((t, i) => (
              <span key={i} className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">{t}</span>
            ))
          ) : (
            <span className="text-xs text-gray-500">Not specified</span>
          )}
        </div>
      </div>
    </div>
  );
}

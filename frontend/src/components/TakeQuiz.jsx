import React, { useState, useEffect } from "react";

export default function TakeQuiz({ quizData }) {
  const questions = quizData?.quiz ?? [];
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!quizData) return null;

  useEffect(() => {
    setSelected({});
    setSubmitted(false);
  }, [quizData?.id]);

  const handleSelect = (questionIndex, optionText) => {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [questionIndex]: optionText }));
  };

  const handleSubmit = () => {
    if (questions.length === 0) return;
    setSubmitted(true);
  };

  const score = submitted
    ? questions.reduce(
        (acc, question, idx) => acc + (selected[idx] === question.answer ? 1 : 0),
        0
      )
    : 0;

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">{quizData.title || "Take Quiz"}</h2>
      {quizData.summary && <p className="text-gray-700">{quizData.summary}</p>}

      {questions.map((question, qIdx) => {
        const userChoice = selected[qIdx];
        const isCorrect = submitted && userChoice === question.answer;
        return (
          <div key={qIdx} className="border rounded p-3 bg-gray-50">
            <div className="font-semibold">Q{qIdx + 1}: {question.question}</div>
            <div className="mt-2 space-y-2">
              {question.options.map((option, optIdx) => {
                const optionId = `q${qIdx}-opt${optIdx}`;
                const isSelected = userChoice === option;
                const isAnswer = question.answer === option;
                let optionClasses = "flex items-center gap-2 p-2 rounded border";

                if (submitted) {
                  if (isAnswer) {
                    optionClasses += " border-green-500 bg-green-50";
                  } else if (isSelected && !isAnswer) {
                    optionClasses += " border-red-400 bg-red-50";
                  }
                } else if (isSelected) {
                  optionClasses += " border-blue-400";
                }

                return (
                  <label key={optionId} className={optionClasses}>
                    <input
                      type="radio"
                      name={`question-${qIdx}`}
                      value={option}
                      checked={isSelected}
                      onChange={() => handleSelect(qIdx, option)}
                      className="mt-0.5"
                    />
                    <span>
                      {String.fromCharCode(65 + optIdx)}. {option}
                    </span>
                  </label>
                );
              })}
            </div>
            {submitted && (
              <div className="mt-2 text-sm text-gray-700">
                <div className={isCorrect ? "text-green-600" : "text-red-600"}>
                  {isCorrect ? "Correct!" : "Incorrect."}
                </div>
                <div className="text-gray-600">Explanation: {question.explanation}</div>
                <div className="text-gray-500">Difficulty: {question.difficulty}</div>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={submitted}
        >
          {submitted ? "Submitted" : "Submit Answers"}
        </button>
        {submitted && (
          <div className="text-lg font-semibold">
            Score: {score} / {questions.length}
          </div>
        )}
      </div>
    </div>
  );
}


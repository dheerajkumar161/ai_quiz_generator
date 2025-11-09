import React, { useState, useEffect } from "react";
import { getHistory, getQuiz } from "../services/api";
import HistoryTable from "../components/HistoryTable";
import Modal from "../components/Modal";
import QuizDisplay from "../components/QuizDisplay";

export default function HistoryTab() {
  const [history, setHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load quiz history.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDetails = async (quizId) => {
    try {
      const data = await getQuiz(quizId);
      setSelectedQuiz(data);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch quiz details.");
    }
  };

  return (
    <div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="p-4 md:p-6">
          <HistoryTable history={history} onDetails={handleDetails} loading={loading} />
        </div>
      </div>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedQuiz(null);
        }}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Quiz Details</h3>
            {/* Close handled by Modal's X */}
          </div>
          <div className="rounded-xl border bg-white">
            <div className="p-4 md:p-6">
              {selectedQuiz ? <QuizDisplay quizData={selectedQuiz} /> : <div>Loading...</div>}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

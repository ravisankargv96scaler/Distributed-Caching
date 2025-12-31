import React, { useState } from 'react';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const questions = [
  {
    id: 1,
    question: "Why is Modulo Hashing (hash % N) problematic for distributed caching?",
    options: [
      { id: 'a', text: "It is too computationally expensive." },
      { id: 'b', text: "Resizing the cluster (changing N) invalidates almost all cache keys." },
      { id: 'c', text: "It only supports integer keys." },
    ],
    correct: 'b',
    explanation: "When N changes, the remainder of the division changes for nearly every number, causing a massive cache miss storm."
  },
  {
    id: 2,
    question: "In Consistent Hashing, if a node crashes, how many keys need to move?",
    options: [
      { id: 'a', text: "All keys in the cluster." },
      { id: 'b', text: "50% of the keys." },
      { id: 'c', text: "Only the keys that belonged to the crashed node." },
    ],
    correct: 'c',
    explanation: "That is the main benefit! Keys are redistributed only to the nearest neighbor, leaving the rest of the ring untouched."
  },
  {
    id: 3,
    question: "What problem do 'Virtual Nodes' solve?",
    options: [
      { id: 'a', text: "Uneven data distribution (Hotspots) on the ring." },
      { id: 'b', text: "They make the hashing algorithm faster." },
      { id: 'c', text: "They allow infinite storage capacity." },
    ],
    correct: 'a',
    explanation: "By splitting one physical node into many points on the ring, we statistically average out the gaps between nodes, ensuring even load."
  }
];

const Tab6Quiz: React.FC = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSelect = (optId: string) => {
    if (showResult) return;
    setSelected(optId);
    setShowResult(true);
    if (optId === questions[currentQ].correct) {
      setScore(s => s + 1);
    }
  };

  const next = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
      setCurrentQ(0);
      setScore(0);
      setSelected(null);
      setShowResult(false);
      setFinished(false);
  }

  if (finished) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in zoom-in duration-500">
              <Trophy size={80} className="text-yellow-400 mb-6" />
              <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
              <p className="text-xl mb-8">You scored <span className="text-cyan-400 font-bold">{score}</span> / {questions.length}</p>
              
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-md w-full mb-8">
                  {score === 3 ? "Perfect! You're a System Design Expert." : score > 1 ? "Great job! You understand the core concepts." : "Review the tabs and try again!"}
              </div>

              <button onClick={restart} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all">
                  Restart Quiz
              </button>
          </div>
      )
  }

  const q = questions[currentQ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 max-w-2xl mx-auto">
        <div className="w-full bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-2xl relative overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 h-2 bg-blue-900 w-full">
                <div 
                    className="h-full bg-cyan-500 transition-all duration-300" 
                    style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
            </div>

            <div className="mt-4 mb-8">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Question {currentQ + 1} of {questions.length}</span>
                <h3 className="text-xl font-bold mt-2 text-white">{q.question}</h3>
            </div>

            <div className="space-y-3">
                {q.options.map(opt => {
                    let btnClass = "w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center ";
                    if (showResult) {
                        if (opt.id === q.correct) btnClass += "bg-green-900/30 border-green-500 text-green-100";
                        else if (selected === opt.id) btnClass += "bg-red-900/30 border-red-500 text-red-100";
                        else btnClass += "bg-slate-900 border-slate-700 opacity-50";
                    } else {
                        btnClass += "bg-slate-900 border-slate-700 hover:border-cyan-500 hover:bg-slate-800";
                    }

                    return (
                        <button 
                            key={opt.id} 
                            onClick={() => handleSelect(opt.id)}
                            disabled={showResult}
                            className={btnClass}
                        >
                            <span>{opt.text}</span>
                            {showResult && opt.id === q.correct && <CheckCircle size={20} className="text-green-500" />}
                            {showResult && selected === opt.id && opt.id !== q.correct && <XCircle size={20} className="text-red-500" />}
                        </button>
                    )
                })}
            </div>

            {showResult && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-slate-900/80 rounded-lg border border-slate-600"
                >
                    <p className="text-sm text-slate-300">
                        <span className="font-bold text-slate-100">Explanation:</span> {q.explanation}
                    </p>
                    <div className="flex justify-end mt-4">
                        <button onClick={next} className="bg-white text-slate-900 px-6 py-2 rounded-lg font-bold hover:bg-slate-200">
                            {currentQ === questions.length - 1 ? "Finish" : "Next Question"}
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    </div>
  );
};

export default Tab6Quiz;
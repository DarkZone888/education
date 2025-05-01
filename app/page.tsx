"use client";

import { useReducer, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, RefreshCw, CheckCircle, Info } from "lucide-react";
import quizData from "./quizData";
import results from "./results";
import { languages } from "./language";

type Lang = "en" | "th";

type State = {
  step: number;
  answers: number[];
};

type Action =
  | { type: "SELECT"; index: number }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "RESET" };

const initialState: State = {
  step: -1,
  answers: []
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SELECT": {
      const updated = [...state.answers];
      updated[state.step] = action.index;
      return { ...state, answers: updated };
    }
    case "NEXT":
      return { ...state, step: Math.min(state.step + 1, quizData.length) };
    case "PREV":
      return { ...state, step: Math.max(state.step - 1, 0) };
    case "RESET":
      return { step: -1, answers: [] };
    default:
      return state;
  }
}

type Score = {
  achiever?: number;
  fighter?: number;
  slacker?: number;
};

function getResult(answers: number[]): "achiever" | "fighter" | "slacker" | "unknown" {
  const score = answers.reduce((acc, ans, i) => {
    const points = quizData[i]?.options[ans]?.points;

    if (points) {
      for (const key in points) {
        const typedKey = key as keyof Score;
        acc[typedKey] = (acc[typedKey] || 0) + (points[typedKey] || 0);
      }
    }
    return acc;
  }, {} as Score);

  return Object.keys(score).reduce(
    (max, k) => {
      const currentScore = score[k as keyof Score] || 0;
      const maxScore = score[max as keyof Score] || 0;
      return currentScore > maxScore ? k : max;
    },
    Object.keys(score)[0] || "unknown"
  ) as "achiever" | "fighter" | "slacker" | "unknown";
}

export default function QuizApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [lang, setLang] = useState<Lang>(() => {
    return (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang || "en";
  });
  const t = languages[lang];

  useEffect(() => {
    localStorage.setItem("quizAnswers", JSON.stringify(state.answers));
    localStorage.setItem("quizStep", state.step.toString());
  }, [state]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const resultKey = getResult(state.answers);
  const progress = Math.round(((state.step + 1) / quizData.length) * 100);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 text-gray-900 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-screen-md lg:max-w-2xl xl:max-w-3xl mx-auto px-4">
        {/* Language Selector */}
        <div className="flex justify-center sm:justify-end mb-6">
          <select
            className="px-4 py-2 rounded-full border border-indigo-300 shadow-sm text-sm font-medium bg-white text-indigo-700 hover:bg-indigo-50 transition-all duration-200 w-full sm:w-auto"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
          >
            <option value="en">🌐 English</option>
            <option value="th">🌐 ไทย</option>
          </select>
        </div>

        {/* Progress Bar */}
        {state.step >= 0 && state.step < quizData.length && (
          <div className="w-full h-3 bg-gray-200 rounded-full mb-4 overflow-hidden">
            <motion.div
              className="bg-indigo-500 h-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Start Screen */}
        {state.step === -1 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <img
              src="https://illustrations.popsy.co/amber/digital-nomad.svg"
              alt="Start"
              className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md mb-6"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-indigo-800">{t.startTitle}</h1>
            <p className="text-gray-700 mt-2 text-sm sm:text-base">{t.startSubtitle}</p>
            <div className="flex justify-center">
              <button
                onClick={() => dispatch({ type: "NEXT" })}
                className="mt-6 px-6 py-3 text-base bg-indigo-600 text-white rounded flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" /> {t.startButton}
              </button>
            </div>
          </motion.div>
        )}

        {/* Question Screen */}
        {state.step >= 0 && state.step < quizData.length && (
          <AnimatePresence mode="wait">
            <motion.div key={`question-${state.step}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm text-gray-600">{t.questionOf(state.step + 1, quizData.length)}</p>
                  <Info className="text-blue-500 w-5 h-5" />
                </div>
                <h2 className="text-base sm:text-xl font-semibold text-indigo-900">
                  {quizData[state.step].question[lang]}
                </h2>
                <div className="grid gap-4">
                  {quizData[state.step].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => dispatch({ type: "SELECT", index: i })}
                      className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg transition shadow-sm text-left ${state.answers[state.step] === i ? "bg-blue-100 border border-blue-500" : "bg-white hover:shadow-md"}`}
                      aria-label={opt.text[lang]}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${state.answers[state.step] === i ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                        {state.answers[state.step] === i ? <CheckCircle size={18} /> : i + 1}
                      </div>
                      <span className="text-sm sm:text-base text-gray-800">{opt.text[lang]}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 flex-wrap gap-2">
                  <button className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-200 rounded" disabled={state.step === 0} onClick={() => dispatch({ type: "PREV" })}>
                    {t.back}
                  </button>
                  <button className="w-full sm:w-auto px-4 py-2 text-white bg-indigo-600 rounded" disabled={state.answers[state.step] == null} onClick={() => dispatch({ type: "NEXT" })}>
                    {state.step === quizData.length - 1 ? t.finish : t.next}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Final Results */}
        {state.step === quizData.length && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
            <p className="text-6xl">{results[resultKey]?.icon}</p>
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-800">{results[resultKey]?.title[lang]}</h2>
            <p className="text-gray-700 max-w-2xl mx-auto text-sm sm:text-base">{results[resultKey]?.description[lang]}</p>
            <div className="flex justify-center">
              <button onClick={() => dispatch({ type: "RESET" })} className="mt-6 px-6 py-2 text-white bg-indigo-600 rounded flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" /> {t.retake}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

"use client";

import {
  useReducer,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, RefreshCw, CheckCircle } from "lucide-react";
import quizData from "./quizData";
import results from "./results";
import { languages } from "./language";
import Head from "next/head";

type Lang = "en" | "th";
type State = { step: number; answers: number[] };
type Action =
  | { type: "SELECT"; index: number }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "RESET" }
  | { type: "LOAD"; payload: { step: number; answers: number[] } }
  | { type: "START" };

const initialState: State = { step: -1, answers: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START":
      return { ...state, step: 0 };
    case "SELECT":
      const updated = [...state.answers];
      updated[state.step] = action.index;
      return { ...state, answers: updated };
    case "NEXT":
      if (state.answers[state.step] !== undefined) {
        return { ...state, step: Math.min(state.step + 1, quizData.length) };
      }
      return state;
    case "PREV":
      return { ...state, step: Math.max(state.step - 1, 0) };
    case "RESET":
      return initialState;
    case "LOAD":
      return { step: action.payload.step, answers: action.payload.answers };
    default:
      return state;
  }
}

function getResult(answers: number[]): keyof typeof results | "unknown" {
  const score = answers.reduce((acc, ans, i) => {
    const points = quizData[i]?.options[ans]?.points;
    if (points) {
      for (const key in points) {
        acc[key as keyof typeof acc] =
          (acc[key as keyof typeof acc] || 0) +
          points[key as keyof typeof points]!;
      }
    }
    return acc;
  }, {} as Record<string, number>);

  const keys = Object.keys(score);
  if (keys.length === 0) return "unknown";
  return keys.reduce((max, k) => (score[k] > score[max] ? k : max), keys[0]) as keyof typeof results;
}

const transitionDelay = 500;

export default function QuizApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [lang, setLang] = useState<Lang>("en");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const transitionTimeout = useRef<NodeJS.Timeout | null>(null);
  const t = languages[lang];
  const resultKey = useMemo(() => getResult(state.answers), [state.answers]);
  const progress = Math.round(((state.step + 1) / quizData.length) * 100);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Lang;
    if (savedLang) setLang(savedLang);
    const savedAnswers = localStorage.getItem("quizAnswers");
    const savedStep = localStorage.getItem("quizStep");
    if (savedAnswers && savedStep) {
      dispatch({
        type: "LOAD",
        payload: { step: parseInt(savedStep), answers: JSON.parse(savedAnswers) },
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("quizAnswers", JSON.stringify(state.answers));
    localStorage.setItem("quizStep", state.step.toString());
    localStorage.setItem("lang", lang);
  }, [state, lang]);

  useEffect(() => {
    setIsAnswerSelected(state.answers[state.step] !== undefined);
  }, [state.step, state.answers]);

  useEffect(() => {
    if (state.step !== -1 && state.step < quizData.length) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.step]);

  useEffect(() => {
    return () => {
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, []);

  const handleNext = useCallback(() => {
    if (isTransitioning || state.answers[state.step] == null) return;
    setIsTransitioning(true);
    dispatch({ type: "NEXT" });
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
    }
    transitionTimeout.current = setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDelay);
  }, [state, isTransitioning]);

  const handlePrev = useCallback(() => dispatch({ type: "PREV" }), []);
  const handleReset = useCallback(() => dispatch({ type: "RESET" }), []);
  const handleStart = useCallback(() => {
    if (state.step === -1) {
      dispatch({ type: "START" });
    }
  }, [state.step]);

  const handleAnswerSelect = useCallback((index: number) => {
    setIsAnswerSelected(true);
    dispatch({ type: "SELECT", index });
  }, []);

  return (
    <>
      <Head>
        <title>What kind of student are you</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-white to-pink-100 text-gray-900 px-4 sm:px-6 md:px-8 py-6 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto">
          {/* Language Selector */}
          <div className="absolute top-4 right-4 z-10">
            <select
              className="w-32 px-3 py-2 rounded-full border border-pink-300 bg-pink-50 text-pink-600 text-sm shadow-sm backdrop-blur-sm hover:bg-pink-100 transition"
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
            >
              <option value="en">🌐 English</option>
              <option value="th">🌐 ไทย</option>
            </select>
          </div>

          {/* Progress Bar */}
          {state.step >= 0 && state.step < quizData.length && (
            <div className="w-full h-2 bg-pink-100 rounded-full mb-4 overflow-hidden">
              <motion.div
                className="bg-pink-500 h-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Start Page */}
          {state.step === -1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center px-4"
            >
              <img
                src="/images/home.png"
                alt="Start"
                className="mx-auto w-56 sm:w-64 md:w-72 lg:w-80 h-auto mb-4 object-contain"
              />
              <h1 className="text-base sm:text-lg md:text-xl font-semibold text-pink-800 mb-2">
                {t.startTitle}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                {t.startSubtitle}
              </p>
              <button
                onClick={handleStart}
                className="px-5 py-2 text-sm sm:text-base bg-pink-600 text-white rounded-full flex items-center justify-center gap-2 mx-auto"
              >
                <Play className="w-4 h-4" /> {t.startButton}
              </button>
            </motion.div>
          )}

          {/* Question Page */}
          {state.step >= 0 && state.step < quizData.length && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`question-${state.step}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-5"
              >
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <p className="text-xs text-gray-500 mb-1">
                    {t.questionOf(state.step + 1, quizData.length)}
                  </p>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-pink-900 mb-4">
                    {quizData[state.step].question[lang]}
                  </h2>
                  <div className="grid gap-3">
                    {quizData[state.step].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswerSelect(i)}
                        role="button"
                        aria-pressed={state.answers[state.step] === i}
                        className={`flex items-center gap-3 p-3 rounded-lg transition text-left focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                          state.answers[state.step] === i
                            ? "bg-pink-100 border border-pink-500"
                            : "bg-white hover:shadow-sm"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            state.answers[state.step] === i
                              ? "bg-pink-500 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {state.answers[state.step] === i ? (
                            <CheckCircle size={16} />
                          ) : (
                            i + 1
                          )}
                        </div>
                        <span className="text-sm sm:text-base text-gray-800">
                          {opt.text[lang]}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                    <button
                      className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-200 rounded"
                      disabled={state.step === 0}
                      onClick={handlePrev}
                    >
                      {t.back}
                    </button>
                    <button
                      className="w-full sm:w-auto px-4 py-2 text-white bg-pink-600 hover:bg-pink-700 transition rounded"
                      disabled={!isAnswerSelected || isTransitioning}
                      onClick={handleNext}
                    >
                      {state.step === quizData.length - 1
                        ? t.finish
                        : t.next}
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Result Page */}
          {state.step === quizData.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center px-4"
            >
              <img
                src={results[resultKey]?.image || "/images/unknown.png"}
                alt={results[resultKey]?.title?.[lang] || "Result"}
                className="mx-auto w-48 sm:w-56 md:w-64 lg:w-72 h-auto mb-10 object-contain"
              />
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-pink-800 mb-2">
                {results[resultKey]?.title?.[lang] || "Result Unknown"}
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-4 max-w-xl mx-auto">
                {results[resultKey]?.description?.[lang] ||
                  "We couldn't determine your type based on the answers."}
              </p>
              <button
                onClick={handleReset}
                className="px-5 py-2 text-sm sm:text-base bg-pink-600 text-white rounded-full flex items-center justify-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" /> {t.retake}
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}

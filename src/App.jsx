import { useState } from 'react';
import { questions } from './data/questions';
import { getRecommendations } from './logic/recommender';
import QuizQuestion from './components/QuizQuestion';
import ResultsPage from './components/ResultsPage';

const PHASE = {
  WELCOME: 'welcome',
  QUIZ: 'quiz',
  RESULTS: 'results',
};

export default function App() {
  const [phase, setPhase] = useState(PHASE.WELCOME);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  function handleStart() {
    setPhase(PHASE.QUIZ);
    setCurrentIndex(0);
    setAnswers({});
    setResults(null);
  }

  function handleAnswer(questionId, value) {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const recs = getRecommendations(newAnswers);
      setResults(recs);
      setPhase(PHASE.RESULTS);
    }
  }

  function handleRetake() {
    setPhase(PHASE.WELCOME);
    setCurrentIndex(0);
    setAnswers({});
    setResults(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white font-sans">
      {/* Decorative grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/50">
              <span className="text-base leading-none">⛳</span>
            </div>
            <div>
              <p className="text-xs text-emerald-400 font-semibold tracking-widest uppercase leading-none mb-0.5">
                Finlay&apos;s Pro Shop
              </p>
              <h1 className="text-base sm:text-lg font-bold text-white leading-none tracking-tight">
                Golf Ball Fitting
              </h1>
            </div>
          </div>
          {phase === PHASE.QUIZ && (
            <button
              onClick={handleRetake}
              className="text-xs text-white/40 hover:text-white/70 transition-colors duration-200 cursor-pointer"
            >
              Restart
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {phase === PHASE.WELCOME && (
          <div className="flex flex-col items-center text-center max-w-xl mx-auto animate-fade-in">
            {/* Hero badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-4 py-2 rounded-full tracking-widest uppercase mb-8">
              <span>⚡</span>
              <span>Professional Ball Fitting</span>
            </div>

            {/* Main heading */}
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
              Find Your{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                Perfect Ball
              </span>
            </h2>
            <p className="text-base sm:text-lg text-white/60 leading-relaxed mb-8 max-w-md">
              Answer 10 quick questions and our fitting engine will match you with the ideal
              golf ball from Titleist, TaylorMade, Callaway, Srixon, Bridgestone, Kirkland, Wilson, Vice, Nike, Mizuno, and Seed.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {['10 Questions', 'Pro-Level Logic', '35+ Balls Analysed', 'Personalised Fit'].map((f) => (
                <span
                  key={f}
                  className="text-xs bg-white/5 border border-white/10 text-white/60 px-3 py-1.5 rounded-full font-medium"
                >
                  {f}
                </span>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleStart}
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-base sm:text-lg px-10 py-4 rounded-xl shadow-lg shadow-emerald-900/40 hover:shadow-emerald-700/50 transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              Start Your Fitting →
            </button>

            <p className="mt-4 text-xs text-white/30">Takes about 2 minutes · No account required</p>

            {/* Brand logos */}
            <div className="mt-12 pt-8 border-t border-white/5 w-full">
              <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-4">
                Balls in our database
              </p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/40 font-medium">
                {['Titleist', 'TaylorMade', 'Callaway', 'Srixon', 'Bridgestone', 'Kirkland', 'Wilson', 'Vice', 'Nike', 'Mizuno', 'Seed'].map((b) => (
                  <span key={b}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === PHASE.QUIZ && (
          <QuizQuestion
            question={questions[currentIndex]}
            onAnswer={handleAnswer}
            currentStep={currentIndex + 1}
            totalSteps={questions.length}
          />
        )}

        {phase === PHASE.RESULTS && results && (
          <ResultsPage results={results} onRetake={handleRetake} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-8 py-6 text-center text-xs text-white/20">
        <p>Finlay&apos;s Pro Shop · Golf Ball Fitting Tool · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

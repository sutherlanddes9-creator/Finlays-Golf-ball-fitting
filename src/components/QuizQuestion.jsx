import { useState, useEffect, useRef } from 'react';
import ProgressBar from './ProgressBar';

export default function QuizQuestion({ question, onAnswer, currentStep, totalSteps }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipId = `tooltip-${question.id}`;
  const tooltipRef = useRef(null);

  // Close tooltip on Escape key or outside click
  useEffect(() => {
    if (!showTooltip) return;
    function handleKey(e) {
      if (e.key === 'Escape') setShowTooltip(false);
    }
    function handleOutsideClick(e) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setShowTooltip(false);
      }
    }
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showTooltip]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto animate-fade-in">
      {/* Progress */}
      <ProgressBar current={currentStep} total={totalSteps} />

      {/* Question header */}
      <div className="text-center pt-4">
        <div className="text-5xl mb-3 drop-shadow-lg">{question.icon}</div>
        <div className="flex items-start justify-center gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
            {question.title}
          </h2>
          {question.tooltip && (
            <div className="relative flex-shrink-0 mt-1" ref={tooltipRef}>
              <button
                onClick={() => setShowTooltip((v) => !v)}
                aria-label="Why does this matter?"
                aria-expanded={showTooltip}
                aria-controls={tooltipId}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-emerald-500/30 border border-white/20 hover:border-emerald-400/60 text-white/50 hover:text-emerald-300 text-xs font-bold flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                ?
              </button>
              {showTooltip && (
                <div
                  id={tooltipId}
                  role="tooltip"
                  className="absolute left-1/2 -translate-x-1/2 top-8 z-20 w-72 bg-slate-800 border border-emerald-500/30 rounded-xl shadow-2xl p-4 text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-400 text-sm">💡</span>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Why this matters</span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">{question.tooltip}</p>
                  <button
                    onClick={() => setShowTooltip(false)}
                    className="mt-3 text-xs text-white/40 hover:text-white/70 transition-colors duration-200 cursor-pointer"
                  >
                    Got it ✕
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="mt-2 text-sm sm:text-base text-white/60 max-w-md mx-auto">
          {question.subtitle}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              setShowTooltip(false);
              onAnswer(question.id, option.value);
            }}
            className="group flex items-center gap-4 w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/60 rounded-xl px-5 py-4 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <span className="text-2xl flex-shrink-0 w-10 text-center leading-none">
              {option.icon}
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors duration-200">
                {option.label}
              </span>
              {option.sublabel && (
                <span className="text-xs text-white/50 mt-0.5">{option.sublabel}</span>
              )}
            </div>
            <div className="ml-auto flex-shrink-0">
              <div className="w-5 h-5 rounded-full border-2 border-white/30 group-hover:border-emerald-400 transition-colors duration-200" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

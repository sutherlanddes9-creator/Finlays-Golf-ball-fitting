import ProgressBar from './ProgressBar';

export default function QuizQuestion({ question, onAnswer, currentStep, totalSteps }) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto animate-fade-in">
      {/* Progress */}
      <ProgressBar current={currentStep} total={totalSteps} />

      {/* Question header */}
      <div className="text-center pt-4">
        <div className="text-5xl mb-3 drop-shadow-lg">{question.icon}</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
          {question.title}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-white/60 max-w-md mx-auto">
          {question.subtitle}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(question.id, option.value)}
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

// Score thresholds and colours (kept consistent between ring and bars)
const SCORE_EXCELLENT = 90;
const SCORE_GOOD = 70;
const COLOR_GREEN = '#10b981';
const COLOR_YELLOW = '#f59e0b';
const COLOR_RED = '#ef4444';

function scoreColor(score) {
  return score >= SCORE_EXCELLENT ? COLOR_GREEN : score >= SCORE_GOOD ? COLOR_YELLOW : COLOR_RED;
}

function scoreBarClass(score) {
  return score >= SCORE_EXCELLENT ? 'bg-emerald-500' : score >= SCORE_GOOD ? 'bg-amber-500' : 'bg-red-500';
}

function MatchScoreRing({ score }) {
  const size = 76;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold leading-none" style={{ color }}>{score}%</span>
        <span className="text-[9px] leading-none mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>match</span>
      </div>
    </div>
  );
}

function FitBreakdown({ fitBreakdown }) {
  const bars = [
    { label: 'Distance Fit', value: fitBreakdown.distanceFit },
    { label: 'Spin Fit', value: fitBreakdown.spinFit },
    { label: 'Feel Fit', value: fitBreakdown.feelFit },
  ];

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Why this score?</p>
      <div className="space-y-2.5">
        {bars.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs text-white/50 w-20 flex-shrink-0">{label}</span>
            <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${scoreBarClass(value)} transition-all duration-700`}
                style={{ width: `${value}%` }}
              />
            </div>
            <span className="text-xs text-white/40 w-8 text-right">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BallCard({ result, rank }) {
  const isPrimary = rank === 1;
  const { ball, whySummary, matchScore, fitBreakdown } = result;

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
        isPrimary
          ? 'border-emerald-400/60 bg-gradient-to-br from-emerald-900/40 to-slate-900/60 shadow-lg shadow-emerald-900/30'
          : 'border-white/10 bg-white/5'
      }`}
    >
      {isPrimary && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-600 to-emerald-500 py-1.5 px-4 flex items-center justify-center gap-2">
          <span className="text-white text-xs font-bold tracking-widest uppercase">⭐ Best Match</span>
        </div>
      )}

      <div className={`p-6 ${isPrimary ? 'pt-10' : ''}`}>
        {/* Brand & ball name */}
        <div className="flex items-start gap-4 mb-4">
          <div className="text-3xl flex-shrink-0">{ball.logo}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                {ball.brand}
              </p>
              {/* Price badge */}
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  ball.price === 'premium'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : ball.price === 'mid'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {ball.price === 'premium' ? 'Premium' : ball.price === 'mid' ? 'Mid-Range' : 'Value'}
              </span>
            </div>
            <h3 className={`font-bold leading-tight ${isPrimary ? 'text-2xl text-white' : 'text-xl text-white/90'}`}>
              {ball.name}
            </h3>
          </div>
          {/* Match score ring */}
          {matchScore !== undefined && <MatchScoreRing score={matchScore} />}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Feel', value: ball.feel.charAt(0).toUpperCase() + ball.feel.slice(1) },
            { label: 'Compression', value: ball.compression },
            { label: 'Cover', value: ball.coverType.charAt(0).toUpperCase() + ball.coverType.slice(1) },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 rounded-lg p-2.5 text-center">
              <p className="text-xs text-white/40 mb-0.5">{stat.label}</p>
              <p className="text-sm font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-white/70 leading-relaxed mb-5">{ball.description}</p>

        {/* Why this ball */}
        {isPrimary && whySummary && whySummary.length > 0 && (
          <div className="bg-emerald-900/30 border border-emerald-500/20 rounded-xl p-4 mb-5">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span>🎯</span> Why this ball for you
            </h4>
            <ul className="space-y-2">
              {whySummary.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-emerald-100/80">
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Highlights */}
        <div className="flex flex-wrap gap-2">
          {ball.highlights.map((h, i) => (
            <span
              key={i}
              className="text-xs bg-white/5 border border-white/10 text-white/60 px-2.5 py-1 rounded-full"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Fit breakdown */}
        {fitBreakdown && <FitBreakdown fitBreakdown={fitBreakdown} />}
      </div>
    </div>
  );
}

function AvoidCard({ avoidItem }) {
  const { ball, reason, matchScore, fitBreakdown } = avoidItem;

  return (
    <div className="rounded-2xl border border-red-500/40 bg-red-950/30 overflow-hidden">
      <div className="p-5">
        {/* Brand & ball name */}
        <div className="flex items-start gap-4 mb-3">
          <div className="text-3xl flex-shrink-0">{ball.logo}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                {ball.brand}
              </p>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  ball.price === 'premium'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : ball.price === 'mid'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {ball.price === 'premium' ? 'Premium' : ball.price === 'mid' ? 'Mid-Range' : 'Value'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white/90 leading-tight">{ball.name}</h3>
          </div>
          {/* Match score ring */}
          {matchScore !== undefined && <MatchScoreRing score={matchScore} />}
        </div>

        {/* Avoid reason */}
        <div className="bg-red-900/30 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <span className="text-red-400 flex-shrink-0 text-base leading-snug">⚠️</span>
            <p className="text-sm text-red-200/80 leading-relaxed">{reason}</p>
          </div>
        </div>

        {/* Fit breakdown */}
        {fitBreakdown && <FitBreakdown fitBreakdown={fitBreakdown} />}
      </div>
    </div>
  );
}

export default function ResultsPage({ results, onRetake }) {
  const { primary, alternatives, avoidBalls } = results;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 border border-emerald-400/40 rounded-full mb-4">
          <span className="text-3xl">⛳</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Your Perfect Match</h2>
        <p className="text-white/60 text-sm sm:text-base max-w-sm mx-auto">
          Based on your swing profile, here are your personalised ball recommendations.
        </p>
      </div>

      {/* Primary recommendation */}
      <div className="mb-6">
        <BallCard result={primary} rank={1} />
      </div>

      {/* Alternatives */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="flex-1 h-px bg-white/10" />
          <span>Alternative Options</span>
          <span className="flex-1 h-px bg-white/10" />
        </h3>
        <div className="flex flex-col gap-4">
          {alternatives.map((alt, i) => (
            <BallCard key={alt.ball.id} result={alt} rank={i + 2} />
          ))}
        </div>
      </div>

      {/* Balls to Avoid */}
      {avoidBalls && avoidBalls.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-red-400/70 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="flex-1 h-px bg-red-500/20" />
            <span>⚠️ Balls to Avoid</span>
            <span className="flex-1 h-px bg-red-500/20" />
          </h3>
          <div className="flex flex-col gap-4">
            {avoidBalls.map((avoidItem) => (
              <AvoidCard key={avoidItem.ball.id} avoidItem={avoidItem} />
            ))}
          </div>
        </div>
      )}

      {/* Retake button */}
      <div className="text-center">
        <button
          onClick={onRetake}
          className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-emerald-400/40 text-white/70 hover:text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <span>↺</span>
          <span>Retake the Fitting</span>
        </button>
      </div>
    </div>
  );
}

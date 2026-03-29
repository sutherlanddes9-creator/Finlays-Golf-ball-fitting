import { balls } from '../data/balls';

/**
 * Score a single ball against the user's answers.
 * Returns a numeric score — higher is better.
 */
function scoreBall(ball, answers) {
  let score = 0;

  // ── Budget filter (hard gate) ─────────────────────────────────────────────
  // Only allow balls within the selected budget tier.
  if (answers.budget === 'value' && ball.price !== 'value') {
    // Allow kirkland as "value" even though it's excellent quality
    if (!(ball.brand === 'Kirkland')) {
      score -= 50;
    }
  }
  if (answers.budget === 'mid' && ball.price === 'premium') {
    score -= 20;
  }
  if (answers.budget === 'premium') {
    // No penalty — premium buyers can see all tiers, but premium balls get a boost
    if (ball.price === 'premium') score += 5;
  }

  // ── Experience / Skill Level ──────────────────────────────────────────────
  const skillMap = {
    scratch: { best: ['low'], ok: ['low-mid'] },
    low: { best: ['low', 'low-mid'], ok: ['mid'] },
    mid: { best: ['low-mid', 'mid'], ok: ['low', 'mid-high'] },
    high: { best: ['mid-high', 'high'], ok: ['mid', 'high'] },
    beginner: { best: ['high'], ok: ['mid-high'] },
  };
  const skill = skillMap[answers.experience] || skillMap.mid;
  if (skill.best.includes(ball.bestFor.handicap)) score += 15;
  else if (skill.ok.includes(ball.bestFor.handicap)) score += 7;
  else score -= 5;

  // Premium urethane ball for skilled players bonus
  if ((answers.experience === 'scratch' || answers.experience === 'low') && ball.coverType === 'urethane') {
    score += 10;
  }

  // ── Driver Distance → Swing Speed ────────────────────────────────────────
  const distanceMap = {
    'very-high': { best: ['high'], ok: ['mid-high'] },
    high: { best: ['high', 'mid-high'], ok: ['mid'] },
    mid: { best: ['mid', 'mid-high'], ok: ['low-mid', 'high'] },
    low: { best: ['low-mid', 'mid'], ok: ['low', 'low-mid'] },
    'very-low': { best: ['low'], ok: ['low-mid'] },
  };
  const distMap = distanceMap[answers.driverDistance] || distanceMap.mid;
  if (distMap.best.includes(ball.bestFor.driverDistance)) score += 12;
  else if (distMap.ok.includes(ball.bestFor.driverDistance)) score += 5;
  else score -= 5;

  // High compression ball for slow swing speed = penalty
  if (['very-low', 'low'].includes(answers.driverDistance) && ball.compression > 85) {
    score -= 15;
  }
  // Low compression ball for fast swing speed = penalty
  if (['very-high', 'high'].includes(answers.driverDistance) && ball.compression < 70) {
    score -= 10;
  }

  // ── Iron Distance → Compression fit ──────────────────────────────────────
  const ironMap = {
    high: { best: ['high', 'mid-high'], ok: ['mid'] },
    'mid-high': { best: ['mid-high', 'mid'], ok: ['high'] },
    mid: { best: ['mid', 'low-mid'], ok: ['mid-high'] },
    'low-mid': { best: ['low-mid', 'low'], ok: ['mid'] },
    low: { best: ['low'], ok: ['low-mid'] },
  };
  const ironFit = ironMap[answers.ironDistance] || ironMap.mid;
  if (ironFit.best.includes(ball.bestFor.ironCompression)) score += 10;
  else if (ironFit.ok.includes(ball.bestFor.ironCompression)) score += 4;

  // ── Ball Flight Preference ────────────────────────────────────────────────
  if (answers.ballFlight === 'low') {
    if (ball.flight === 'low') score += 12;
    else if (ball.flight === 'mid') score += 4;
    else score -= 5;
  } else if (answers.ballFlight === 'high') {
    if (ball.flight === 'high') score += 12;
    else if (ball.flight === 'mid') score += 6;
    else score -= 5;
  } else {
    // mid preferred
    if (ball.flight === 'mid') score += 12;
    else score += 4;
  }

  // ── Common Miss ───────────────────────────────────────────────────────────
  if (answers.commonMiss === 'slice') {
    // Slicers benefit from lower spin to reduce slice
    if (ball.spin === 'low') score += 10;
    else if (ball.spin === 'mid') score += 5;
    else score -= 5; // high spin makes slice worse
    // Softer compression helps slicers
    if (ball.compression < 80) score += 5;
  } else if (answers.commonMiss === 'hook') {
    // Hookers need firmer, high-flight to combat hook trajectory
    if (ball.feel === 'firm') score += 5;
    if (ball.flight === 'high') score += 5;
  } else {
    // Straight miss — any ball works
    score += 3;
  }

  // ── Short Game Preference ─────────────────────────────────────────────────
  if (answers.shortGame === 'check') {
    if (ball.shortGame === 'check') score += 15;
    else if (ball.shortGame === 'both') score += 7;
    else score -= 10;
    // Urethane cover is essential for check shots
    if (ball.coverType === 'urethane') score += 10;
    else score -= 5;
  } else if (answers.shortGame === 'run') {
    if (ball.shortGame === 'run') score += 10;
    else if (ball.shortGame === 'both') score += 5;
  } else {
    // both — no preference
    if (ball.shortGame === 'both') score += 8;
    else score += 4;
  }

  // ── Feel Preference ───────────────────────────────────────────────────────
  if (answers.feel === 'soft') {
    if (ball.feel === 'soft') score += 15;
    else if (ball.feel === 'mid') score += 5;
    else score -= 5;
  } else if (answers.feel === 'firm') {
    if (ball.feel === 'firm') score += 15;
    else if (ball.feel === 'mid') score += 5;
    else score -= 5;
  } else {
    // mid feel
    if (ball.feel === 'mid') score += 15;
    else score += 5;
  }

  // ── Wind Performance ──────────────────────────────────────────────────────
  if (answers.windPerformance === 'yes') {
    // Seriously struggles in wind — needs low flight, low spin
    if (ball.windPerformance === 'excellent') score += 20;
    else if (ball.windPerformance === 'good') score += 10;
    else if (ball.windPerformance === 'average') score += 0;
    else score -= 10;
    if (ball.flight === 'low') score += 10;
    else if (ball.flight === 'high') score -= 8;
    if (ball.spin === 'low') score += 5;
  } else if (answers.windPerformance === 'sometimes') {
    if (ball.windPerformance === 'excellent') score += 10;
    else if (ball.windPerformance === 'good') score += 6;
  }
  // 'no' — no wind bonus/penalty

  // ── Current Ball Baseline ────────────────────────────────────────────────
  // If they're already on Pro V1, recommend at that level unless budget says otherwise
  if (answers.currentBall === 'pro-v1' && ball.price === 'premium') score += 5;
  if (answers.currentBall === 'value' && ball.price !== 'premium') score += 5;

  return score;
}

/**
 * Generate a personalised "Why this ball?" explanation.
 */
function generateWhySummary(ball, answers) {
  const reasons = [];

  // Skill match
  if (answers.experience === 'scratch' || answers.experience === 'low') {
    if (ball.coverType === 'urethane') {
      reasons.push('The urethane cover gives you the greenside spin control that low-handicap players demand.');
    }
  } else if (answers.experience === 'high' || answers.experience === 'beginner') {
    if (ball.compression < 75) {
      reasons.push('Its low compression core makes it easy to compress, giving you more distance even with a slower swing speed.');
    }
  }

  // Wind
  if (answers.windPerformance === 'yes') {
    if (ball.flight === 'low' || ball.windPerformance === 'excellent') {
      reasons.push('Its low-spin, penetrating trajectory fights the wind instead of ballooning — exactly what you need.');
    }
  }

  // Slice
  if (answers.commonMiss === 'slice' && ball.spin === 'low') {
    reasons.push('Its lower spin rate helps reduce the side-spin that causes slices, keeping your drives straighter.');
  }

  // Short game
  if (answers.shortGame === 'check' && ball.coverType === 'urethane') {
    reasons.push('The urethane cover grips the grooves for maximum greenside spin — your chips and pitches will check up like you want.');
  } else if (answers.shortGame === 'run' && ball.shortGame === 'run') {
    reasons.push('Lower spin around the greens complements your bump-and-run approach — predictable and easy to judge.');
  }

  // Feel
  if (answers.feel === 'soft' && ball.feel === 'soft') {
    reasons.push('The soft feel you love is built into its core — especially noticeable on full irons and around the greens.');
  } else if (answers.feel === 'firm' && ball.feel === 'firm') {
    reasons.push('That firm, responsive feel at impact gives you the feedback you prefer to dial in your distances.');
  }

  // Distance
  if ((answers.driverDistance === 'very-low' || answers.driverDistance === 'low') && ball.compression < 70) {
    reasons.push('At your swing speed, a lower-compression ball actually produces more ball speed and distance than a firm Tour ball.');
  }

  // Budget value
  if (answers.budget === 'value' && ball.price === 'value' && ball.coverType === 'urethane') {
    reasons.push('Remarkably, this ball packs a urethane cover into a value price point — you get Tour-ball short-game performance without the Tour-ball price tag.');
  }

  // Fallback
  if (reasons.length === 0) {
    reasons.push(`The ${ball.name} matches your swing profile across multiple categories — compression, trajectory, and feel — making it a well-rounded fit for your game.`);
  }

  return reasons;
}

// Tier score ranges for match score display
const SCORE_TIERS = {
  primary: { min: 90, max: 100 },
  alternative: { min: 75, max: 89 },
  avoid: { min: 30, max: 69 },
};

// Kirkland is treated as "value" budget despite being excellent quality
const VALUE_BUDGET_EXEMPT_BRANDS = new Set(['Kirkland']);

/**
 * Compute a 0–100 match score, clamped to the appropriate tier range.
 * tier: 'primary' → 90–100, 'alternative' → 75–89, 'avoid' → 30–69
 */
function computeMatchScore(ball, answers, tier) {
  let penalties = 0;

  // Compression vs swing speed
  if (['very-low', 'low'].includes(answers.driverDistance) && ball.compression > 85) {
    penalties += 20;
  } else if (['very-low', 'low'].includes(answers.driverDistance) && ball.compression > 75) {
    penalties += 10;
  }
  if (['very-high', 'high'].includes(answers.driverDistance) && ball.compression < 70) {
    penalties += 15;
  }

  // Budget mismatch — Kirkland is exempt as it offers Tour-quality at value price
  if (answers.budget === 'value' && ball.price !== 'value' && !VALUE_BUDGET_EXEMPT_BRANDS.has(ball.brand)) {
    penalties += 10;
  }
  if (answers.budget === 'mid' && ball.price === 'premium') {
    penalties += 10;
  }

  // Spin mismatch (slicer + high-spin ball)
  if (answers.commonMiss === 'slice' && ball.spin === 'high') {
    penalties += 12;
  }

  // Feel mismatch
  if (answers.feel === 'soft' && ball.feel === 'firm') {
    penalties += 8;
  } else if (answers.feel === 'firm' && ball.feel === 'soft') {
    penalties += 8;
  }

  // Short game mismatch
  if (answers.shortGame === 'check' && ball.shortGame === 'run') {
    penalties += 12;
  }

  const rawScore = Math.max(0, 100 - penalties);

  const { min, max } = SCORE_TIERS[tier] || { min: 0, max: 100 };
  return Math.min(max, Math.max(min, Math.round(min + (rawScore / 100) * (max - min))));
}

/**
 * Compute 0–100 sub-scores for Distance Fit, Spin Fit, and Feel Fit.
 */
function computeFitBreakdown(ball, answers) {
  // Distance Fit: compression vs swing speed
  let distanceFit = 100;
  if (['very-low', 'low'].includes(answers.driverDistance) && ball.compression > 85) {
    distanceFit -= 45;
  } else if (['very-low', 'low'].includes(answers.driverDistance) && ball.compression > 75) {
    distanceFit -= 20;
  } else if (['very-high', 'high'].includes(answers.driverDistance) && ball.compression < 70) {
    distanceFit -= 35;
  } else if (['very-high', 'high'].includes(answers.driverDistance) && ball.compression < 80) {
    distanceFit -= 12;
  }
  // Ideal compression range [min, max] by driver distance / swing speed
  const idealRanges = {
    'very-high': [90, 110], high: [80, 100], mid: [70, 90], low: [60, 80], 'very-low': [40, 70],
  };
  const [lo, hi] = idealRanges[answers.driverDistance] || [60, 90];
  if (ball.compression >= lo && ball.compression <= hi) distanceFit = Math.min(100, distanceFit + 5);

  // Spin Fit: commonMiss + shortGame vs ball spin / cover
  let spinFit = 100;
  if (answers.commonMiss === 'slice') {
    if (ball.spin === 'high') spinFit -= 40;
    else if (ball.spin === 'mid') spinFit -= 10;
  } else if (answers.commonMiss === 'hook') {
    if (ball.spin === 'low') spinFit -= 10;
  }
  if (answers.shortGame === 'check' && ball.shortGame === 'run') spinFit -= 30;
  else if (answers.shortGame === 'check' && ball.coverType !== 'urethane') spinFit -= 15;
  else if (answers.shortGame === 'run' && ball.shortGame === 'check') spinFit -= 5;

  // Feel Fit: feel preference vs ball feel
  let feelFit = 100;
  if (answers.feel === 'soft' && ball.feel === 'firm') feelFit -= 45;
  else if (answers.feel === 'soft' && ball.feel === 'mid') feelFit -= 15;
  else if (answers.feel === 'firm' && ball.feel === 'soft') feelFit -= 45;
  else if (answers.feel === 'firm' && ball.feel === 'mid') feelFit -= 15;

  return {
    distanceFit: Math.max(20, Math.min(100, distanceFit)),
    spinFit: Math.max(20, Math.min(100, spinFit)),
    feelFit: Math.max(20, Math.min(100, feelFit)),
  };
}

/**
 * Main recommendation function.
 * Returns { primary, alternatives } where each item includes the ball + score + whySummary.
 */
export function getRecommendations(answers) {
  const scored = balls.map((ball) => ({
    ball,
    score: scoreBall(ball, answers),
  }));

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const [first, ...rest] = scored;

  // Pick 2 alternatives: ideally from different brands and different price points
  const alternatives = [];
  const usedBrands = new Set([first.ball.brand]);
  const usedPrices = new Set([first.ball.price]);

  for (const item of rest) {
    if (alternatives.length >= 2) break;
    if (!usedBrands.has(item.ball.brand)) {
      alternatives.push(item);
      usedBrands.add(item.ball.brand);
      usedPrices.add(item.ball.price);
    }
  }

  // If we couldn't get 2 different-brand alternatives, fill with next best
  for (const item of rest) {
    if (alternatives.length >= 2) break;
    if (!alternatives.includes(item)) {
      alternatives.push(item);
    }
  }

  const recommendedIds = new Set([
    first.ball.id,
    ...alternatives.slice(0, 2).map((item) => item.ball.id),
  ]);

  return {
    primary: {
      ...first,
      whySummary: generateWhySummary(first.ball, answers),
      matchScore: computeMatchScore(first.ball, answers, 'primary'),
      fitBreakdown: computeFitBreakdown(first.ball, answers),
    },
    alternatives: alternatives.slice(0, 2).map((item) => ({
      ...item,
      whySummary: generateWhySummary(item.ball, answers),
      matchScore: computeMatchScore(item.ball, answers, 'alternative'),
      fitBreakdown: computeFitBreakdown(item.ball, answers),
    })),
    avoidBalls: getAvoidBalls(answers, recommendedIds),
  };
}

/**
 * Select up to 2 balls the user should NOT play, based on mismatch logic.
 */
function getAvoidBalls(answers, recommendedIds) {
  const avoid = [];

  // 1. Compression Mismatch: slow swing speed + high compression ball
  if (['very-low', 'low'].includes(answers.driverDistance)) {
    const highCompressionBall = balls.find(
      (b) => b.compression > 85 && !recommendedIds.has(b.id)
    );
    if (highCompressionBall) {
      avoid.push({
        ball: highCompressionBall,
        reason:
          "This ball is too firm for your swing speed. You won't be able to compress the core, leading to a loss of distance and a harsh feel.",
        matchScore: computeMatchScore(highCompressionBall, answers, 'avoid'),
        fitBreakdown: computeFitBreakdown(highCompressionBall, answers),
      });
    }
  }

  // 2. Spin Mismatch: slicer + high-spin tour ball
  if (answers.commonMiss === 'slice' && avoid.length < 2) {
    const highSpinTourBall = balls.find(
      (b) =>
        b.spin === 'high' &&
        b.price === 'premium' &&
        !recommendedIds.has(b.id) &&
        !avoid.some((a) => a.ball.id === b.id)
    );
    if (highSpinTourBall) {
      avoid.push({
        ball: highSpinTourBall,
        reason:
          'Because you tend to slice, this high-spin ball will actually exaggerate your side-spin, causing the ball to curve further off-line.',
        matchScore: computeMatchScore(highSpinTourBall, answers, 'avoid'),
        fitBreakdown: computeFitBreakdown(highSpinTourBall, answers),
      });
    }
  }

  // 3. Budget Mismatch: value budget + premium ball
  if (answers.budget === 'value' && avoid.length < 2) {
    const premiumBall = balls.find(
      (b) =>
        b.price === 'premium' &&
        !recommendedIds.has(b.id) &&
        !avoid.some((a) => a.ball.id === b.id)
    );
    if (premiumBall) {
      avoid.push({
        ball: premiumBall,
        reason:
          'While this is a great ball, it is a high-cost option. Based on your preferences, there are better value-for-money options available.',
        matchScore: computeMatchScore(premiumBall, answers, 'avoid'),
        fitBreakdown: computeFitBreakdown(premiumBall, answers),
      });
    }
  }

  return avoid;
}

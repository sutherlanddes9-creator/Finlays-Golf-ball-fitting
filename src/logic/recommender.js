import { balls } from '../data/balls';

// Compression thresholds used throughout the scoring logic
const HIGH_COMPRESSION_THRESHOLD = 85;
const LOW_COMPRESSION_THRESHOLD = 70;
const VERY_LOW_COMPRESSION_THRESHOLD = 65;

/**
 * Score a single ball against the user's answers.
 * Returns a numeric score — higher is better.
 *
 * Question IDs used here:
 *  handicap, shortGame, wedgeSpin, greensideFeel, puttingPreference,
 *  approachHeight, ironDistance, ironConsistency, driverDistance,
 *  spinReduction (conditional), driverLaunch, commonMiss, windConditions,
 *  durability, currentBallHate, budget
 */
function scoreBall(ball, answers) {
  let score = 0;

  // ── Budget filter (hard gate) ──────────────────────────────────────────────
  if (answers.budget === 'value' && ball.price !== 'value') {
    // Kirkland urethane is exceptional value — allow it past the gate
    if (ball.brand !== 'Kirkland') {
      score -= 50;
    }
  }
  if (answers.budget === 'mid' && ball.price === 'premium') {
    score -= 20;
  }
  if (answers.budget === 'premium' && ball.price === 'premium') {
    score += 5;
  }

  // ── Handicap / Skill Level ─────────────────────────────────────────────────
  const handicapMap = {
    scratch: { best: ['low'], ok: ['low-mid'] },
    'mid-low': { best: ['low', 'low-mid'], ok: ['mid'] },
    mid: { best: ['low-mid', 'mid'], ok: ['low', 'mid-high'] },
    high: { best: ['mid-high', 'high'], ok: ['mid', 'high'] },
  };
  const skill = handicapMap[answers.handicap] || handicapMap.mid;
  if (skill.best.includes(ball.bestFor.handicap)) score += 15;
  else if (skill.ok.includes(ball.bestFor.handicap)) score += 7;
  else score -= 5;

  // Urethane bonus for skilled players
  if ((answers.handicap === 'scratch' || answers.handicap === 'mid-low') && ball.coverType === 'urethane') {
    score += 10;
  }

  // ── Short Game Style ───────────────────────────────────────────────────────
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
    if (ball.shortGame === 'both') score += 8;
    else score += 4;
  }

  // ── Wedge Spin Behaviour ───────────────────────────────────────────────────
  if (answers.wedgeSpin === 'releases-too-much') {
    // Needs more spin → urethane + high spin
    if (ball.coverType === 'urethane') score += 12;
    if (ball.spin === 'high') score += 8;
    else if (ball.spin === 'mid-high') score += 4;
  } else if (answers.wedgeSpin === 'spins-back-too-much') {
    // Needs less spin → lower spin, ionomer or mid-compression
    if (ball.spin === 'low') score += 10;
    else if (ball.spin === 'mid') score += 5;
    else if (ball.spin === 'high') score -= 8;
    if (ball.coverType === 'ionomer') score += 5;
  }
  // 'about-right' — no adjustment

  // ── Greenside Feel ─────────────────────────────────────────────────────────
  if (answers.greensideFeel === 'soft') {
    if (ball.feel === 'soft') score += 15;
    else if (ball.feel === 'mid') score += 5;
    else score -= 5;
  } else if (answers.greensideFeel === 'firm') {
    if (ball.feel === 'firm') score += 15;
    else if (ball.feel === 'mid') score += 5;
    else score -= 5;
  } else {
    // neutral — mid feel is ideal
    if (ball.feel === 'mid') score += 12;
    else score += 4;
  }

  // ── Putting Preference ─────────────────────────────────────────────────────
  if (answers.puttingPreference === 'too-fast') {
    // Softer ball gives "deader" feel off the putter — helps with over-hitting
    if (ball.feel === 'soft') score += 6;
    else if (ball.feel === 'firm') score -= 3;
  } else if (answers.puttingPreference === 'too-short') {
    // Firmer ball gives more feedback and energy transfer
    if (ball.feel === 'firm') score += 6;
    else if (ball.feel === 'mid') score += 3;
  }

  // ── Approach Shot Height ───────────────────────────────────────────────────
  if (answers.approachHeight === 'low') {
    if (ball.flight === 'low') score += 12;
    else if (ball.flight === 'mid') score += 4;
    else score -= 5;
  } else if (answers.approachHeight === 'high') {
    if (ball.flight === 'high') score += 12;
    else if (ball.flight === 'mid') score += 6;
    else score -= 5;
  } else {
    if (ball.flight === 'mid') score += 12;
    else score += 4;
  }

  // ── Iron Distance → Compression fit ───────────────────────────────────────
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

  // ── Iron Consistency (Flyers) ──────────────────────────────────────────────
  if (answers.ironConsistency === 'often') {
    // High spin balls reduce flyer effect
    if (ball.spin === 'high') score += 10;
    else if (ball.spin === 'mid-high') score += 5;
    else if (ball.spin === 'low') score -= 5;
    if (ball.coverType === 'urethane') score += 5;
  } else if (answers.ironConsistency === 'sometimes') {
    if (ball.spin === 'high' || ball.spin === 'mid-high') score += 4;
  }

  // ── Driver Distance → Swing Speed / Compression ───────────────────────────
  const driverDistMap = {
    'very-high': { best: ['high'], ok: ['mid-high'] },
    high: { best: ['high', 'mid-high'], ok: ['mid'] },
    mid: { best: ['mid', 'mid-high'], ok: ['low-mid', 'high'] },
    low: { best: ['low-mid', 'mid'], ok: ['low', 'low-mid'] },
    'very-low': { best: ['low'], ok: ['low-mid'] },
  };
  const distFit = driverDistMap[answers.driverDistance] || driverDistMap.mid;
  if (distFit.best.includes(ball.bestFor.driverDistance)) score += 12;
  else if (distFit.ok.includes(ball.bestFor.driverDistance)) score += 5;
  else score -= 5;

  // Hard compression penalties
  if (['very-low', 'low'].includes(answers.driverDistance) && ball.compression > HIGH_COMPRESSION_THRESHOLD) {
    score -= 15;
  }
  if (['very-high', 'high'].includes(answers.driverDistance) && ball.compression < LOW_COMPRESSION_THRESHOLD) {
    score -= 10;
  }

  // ── Spin Reduction (conditional, high-speed swingers only) ────────────────
  if (answers.spinReduction === 'yes') {
    // User confirms ballooning — strongly favour low-spin driver balls
    if (ball.spin === 'low') score += 20;
    else if (ball.spin === 'mid') score += 10;
    else if (ball.spin === 'high') score -= 15;
    if (ball.flight === 'low') score += 10;
    else if (ball.flight === 'high') score -= 8;
  } else if (answers.spinReduction === 'not-sure') {
    // Slight lean toward mid-spin for safety
    if (ball.spin === 'mid' || ball.spin === 'mid-high') score += 5;
  }

  // ── Driver Launch Tendency ─────────────────────────────────────────────────
  if (answers.driverLaunch === 'too-low') {
    // Needs higher launch — high-flight, higher-spin balls help
    if (ball.flight === 'high') score += 12;
    else if (ball.flight === 'mid') score += 5;
    else score -= 5;
  } else if (answers.driverLaunch === 'too-high') {
    // Already too high — needs low flight / low spin
    if (ball.flight === 'low') score += 12;
    else if (ball.flight === 'mid') score += 5;
    else score -= 8;
    if (ball.spin === 'low') score += 8;
    if (ball.windPerformance === 'excellent') score += 5;
  }
  // 'good' — no adjustment

  // ── Common Miss ────────────────────────────────────────────────────────────
  if (answers.commonMiss === 'slice') {
    if (ball.spin === 'low') score += 10;
    else if (ball.spin === 'mid') score += 5;
    else score -= 5;
    if (ball.compression < 80) score += 5;
  } else if (answers.commonMiss === 'hook') {
    if (ball.feel === 'firm') score += 5;
    if (ball.flight === 'high') score += 5;
  } else {
    score += 3;
  }

  // ── Wind Conditions ────────────────────────────────────────────────────────
  if (answers.windConditions === 'often') {
    if (ball.windPerformance === 'excellent') score += 20;
    else if (ball.windPerformance === 'good') score += 10;
    else if (ball.windPerformance === 'average') score += 0;
    else score -= 10;
    if (ball.flight === 'low') score += 10;
    else if (ball.flight === 'high') score -= 8;
    if (ball.spin === 'low') score += 5;
  } else if (answers.windConditions === 'sometimes') {
    if (ball.windPerformance === 'excellent') score += 10;
    else if (ball.windPerformance === 'good') score += 6;
  }
  // 'rarely' — no adjustment

  // ── Durability Priority ────────────────────────────────────────────────────
  if (answers.durability === 'critical') {
    if (ball.durability === 'excellent') score += 15;
    else if (ball.durability === 'good') score += 5;
    else if (ball.durability === 'average') score -= 10;
    else score -= 20;
  } else if (answers.durability === 'matters') {
    if (ball.durability === 'excellent') score += 8;
    else if (ball.durability === 'average') score -= 5;
  }
  // 'not-important' — no adjustment

  // ── What They Hate About Current Ball ─────────────────────────────────────
  if (answers.currentBallHate === 'not-enough-distance') {
    // Favour balls optimised for distance at their swing speed
    if (['very-low', 'low'].includes(answers.driverDistance) && ball.compression < VERY_LOW_COMPRESSION_THRESHOLD) score += 10;
    if (['very-high', 'high'].includes(answers.driverDistance) && ball.compression > HIGH_COMPRESSION_THRESHOLD) score += 8;
    if (ball.flight !== 'low') score += 3;
  } else if (answers.currentBallHate === 'no-greenside-spin') {
    if (ball.coverType === 'urethane') score += 15;
    if (ball.spin === 'high' || ball.spin === 'mid-high') score += 8;
    if (ball.shortGame === 'check') score += 10;
  } else if (answers.currentBallHate === 'too-expensive') {
    // Point toward value/mid options
    if (ball.price === 'value') score += 15;
    else if (ball.price === 'mid') score += 8;
    else if (ball.price === 'premium') score -= 10;
  } else if (answers.currentBallHate === 'poor-feel') {
    // Reinforce feel matching
    if (answers.greensideFeel === 'soft' && ball.feel === 'soft') score += 10;
    if (answers.greensideFeel === 'firm' && ball.feel === 'firm') score += 10;
    if (answers.greensideFeel === 'neutral' && ball.feel === 'mid') score += 8;
  } else if (answers.currentBallHate === 'bad-in-wind') {
    if (ball.windPerformance === 'excellent') score += 20;
    else if (ball.windPerformance === 'good') score += 10;
    else if (ball.windPerformance === 'poor') score -= 15;
    if (ball.flight === 'low') score += 10;
    if (ball.spin === 'low') score += 5;
  }

  return score;
}

/**
 * Generate a personalised "Why this ball?" explanation.
 */
function generateWhySummary(ball, answers) {
  const reasons = [];

  // Handicap / skill match
  if (answers.handicap === 'scratch' || answers.handicap === 'mid-low') {
    if (ball.coverType === 'urethane') {
      reasons.push('The urethane cover gives you the greenside spin control that low-handicap players demand.');
    }
  } else if (answers.handicap === 'high') {
    if (ball.compression < 75) {
      reasons.push('Its low compression core makes it easy to compress, giving you more distance even with a slower swing speed.');
    }
  }

  // Short game
  if (answers.shortGame === 'check' && ball.coverType === 'urethane') {
    reasons.push('The urethane cover grips the grooves for maximum greenside spin — your chips and pitches will check up exactly as you want.');
  } else if (answers.shortGame === 'run' && ball.shortGame === 'run') {
    reasons.push('Lower greenside spin complements your bump-and-run approach — the ball rolls out predictably and is easy to judge.');
  }

  // Wedge spin
  if (answers.wedgeSpin === 'releases-too-much' && ball.coverType === 'urethane' && ball.spin === 'high') {
    reasons.push('The high-spin urethane cover will give you the grip you need to stop wedge shots where you intend — no more chasing the ball past the pin.');
  } else if (answers.wedgeSpin === 'spins-back-too-much' && ball.spin === 'low') {
    reasons.push('Its lower spin rate means your wedge shots will land and check — rather than spinning back off the green.');
  }

  // Wind
  if ((answers.windConditions === 'often' || answers.currentBallHate === 'bad-in-wind') &&
      (ball.flight === 'low' || ball.windPerformance === 'excellent')) {
    reasons.push('Its penetrating, low-spin trajectory fights the wind instead of ballooning — exactly what you need for links or exposed courses.');
  }

  // Spin reduction (high-speed follow-up)
  if (answers.spinReduction === 'yes' && ball.spin === 'low') {
    reasons.push('At your swing speed, its low driver spin rate will eliminate the balloon effect and add serious yards to your carry distance.');
  }

  // Driver launch
  if (answers.driverLaunch === 'too-high' && ball.flight === 'low') {
    reasons.push('Its low-flight design will bring your trajectory back down to earth — turning that ballooning drive into a piercing, distance-maximising flight.');
  } else if (answers.driverLaunch === 'too-low' && ball.flight === 'high') {
    reasons.push('Its higher launch profile helps get the ball airborne more easily, adding the carry distance you have been missing off the tee.');
  }

  // Slice
  if (answers.commonMiss === 'slice' && ball.spin === 'low') {
    reasons.push('Its lower spin rate reduces the side-spin that causes your slice, keeping drives straighter and in play more often.');
  }

  // Greenside feel
  if (answers.greensideFeel === 'soft' && ball.feel === 'soft') {
    reasons.push('The soft feel you love is built into its core — especially noticeable on short irons, chips, and putts.');
  } else if (answers.greensideFeel === 'firm' && ball.feel === 'firm') {
    reasons.push('That firm, responsive click at impact gives you the feedback you prefer to dial in your distances.');
  }

  // Distance for slow swingers
  if ((answers.driverDistance === 'very-low' || answers.driverDistance === 'low') && ball.compression < 70) {
    reasons.push('At your swing speed, a lower-compression ball produces more ball speed and distance than a firm Tour ball — physics working in your favour.');
  }

  // Durability
  if (answers.durability === 'critical' && ball.durability === 'excellent') {
    reasons.push('Its durable ionomer cover means it will stay looking and performing like new round after round — no premature bin trips.');
  }

  // Budget value
  if (answers.budget === 'value' && ball.price === 'value' && ball.coverType === 'urethane') {
    reasons.push('Remarkably, this ball packs a urethane cover into a value price point — Tour-level short-game performance without the Tour-ball price tag.');
  }

  // Flyers
  if (answers.ironConsistency === 'often' && ball.coverType === 'urethane' && ball.spin === 'high') {
    reasons.push('Its high-spin urethane cover helps reduce the flyer effect from the rough, giving you more predictable distances from bad lies.');
  }

  // Fallback
  if (reasons.length === 0) {
    reasons.push(`The ${ball.name} matches your swing profile across multiple key categories — compression, trajectory, feel, and short-game — making it a strong all-round fit.`);
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
 * Returns { primary, alternatives, avoidBalls }.
 */
export function getRecommendations(answers) {
  const scored = balls.map((ball) => ({
    ball,
    score: scoreBall(ball, answers),
  }));

  scored.sort((a, b) => b.score - a.score);

  const [first, ...rest] = scored;

  // Pick 2 alternatives from different brands and ideally different price points
  const alternatives = [];
  const usedBrands = new Set([first.ball.brand]);

  for (const item of rest) {
    if (alternatives.length >= 2) break;
    if (!usedBrands.has(item.ball.brand)) {
      alternatives.push(item);
      usedBrands.add(item.ball.brand);
    }
  }

  // Fill remaining slots if needed
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

  // 1. Compression Mismatch: slow swing + high compression
  if (['very-low', 'low'].includes(answers.driverDistance)) {
    const highCompressionBall = balls.find(
      (b) => b.compression > HIGH_COMPRESSION_THRESHOLD && !recommendedIds.has(b.id)
    );
    if (highCompressionBall) {
      avoid.push({
        ball: highCompressionBall,
        reason:
          "This ball is too firm for your swing speed. You won't compress the core properly, leading to distance loss and a harsh feel.",
          "This ball is too firm for your swing speed. You won't be able to compress the core, leading to a loss of distance and a harsh feel.",
        matchScore: computeMatchScore(highCompressionBall, answers, 'avoid'),
        fitBreakdown: computeFitBreakdown(highCompressionBall, answers),
      });
    }
  }

  // 2. Spin Mismatch: slicer + high-spin Tour ball
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
          'Because you tend to slice, this high-spin ball will exaggerate your side-spin, causing the ball to curve further off-line.',
      });
    }
  }

  // 3. Durability Mismatch: durability-critical player + soft urethane
  if (answers.durability === 'critical' && avoid.length < 2) {
    const softUrethaneBall = balls.find(
      (b) =>
        b.durability === 'average' &&
        b.coverType === 'urethane' &&
        !recommendedIds.has(b.id) &&
        !avoid.some((a) => a.ball.id === b.id)
    );
    if (softUrethaneBall) {
      avoid.push({
        ball: softUrethaneBall,
        reason:
          'Its soft urethane cover is more susceptible to scuffing and cutting on cart paths or mis-hits — not ideal when durability is a priority for you.',
          'Because you tend to slice, this high-spin ball will actually exaggerate your side-spin, causing the ball to curve further off-line.',
        matchScore: computeMatchScore(highSpinTourBall, answers, 'avoid'),
        fitBreakdown: computeFitBreakdown(highSpinTourBall, answers),
      });
    }
  }

  // 4. Budget Mismatch: value budget + premium ball
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
          'While this is a great ball, its cost per dozen is high relative to your ball-loss rate. The money saved on a value option is better spent on lessons or practice.',
          'While this is a great ball, it is a high-cost option. Based on your preferences, there are better value-for-money options available.',
        matchScore: computeMatchScore(premiumBall, answers, 'avoid'),
        fitBreakdown: computeFitBreakdown(premiumBall, answers),
      });
    }
  }

  return avoid;
}

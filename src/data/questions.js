/**
 * 15-question Green-to-Tee fitting engine.
 * Questions flow from short game → mid game → full swing → course conditions → budget.
 *
 * One question (spinReduction) is conditional — it only appears for high-speed swingers.
 * Use `conditionalOn` to filter it in App.jsx.
 */
export const questions = [
  // ── Q1 ───────────────────────────────────────────────────────────────────────
  {
    id: 'handicap',
    title: 'What is your handicap?',
    subtitle: 'Your handicap is the foundation of your fitting — it tells us how consistently you strike the ball.',
    icon: '🏌️',
    tooltip: 'Your handicap determines how much benefit you will get from advanced features like urethane covers and high spin. A low-handicap player can consistently expose greenside spin; a higher-handicap player gets more from forgiveness and distance.',
    type: 'single',
    options: [
      { value: 'scratch', label: '0–5 Handicap', sublabel: 'Scratch to strong club player', icon: '🏆' },
      { value: 'mid-low', label: '6–12 Handicap', sublabel: 'Solid club golfer', icon: '⛳' },
      { value: 'mid', label: '13–20 Handicap', sublabel: 'Regular social golfer', icon: '🎯' },
      { value: 'high', label: '21+ Handicap', sublabel: 'Beginner to casual golfer', icon: '🌱' },
    ],
  },

  // ── Q2 ───────────────────────────────────────────────────────────────────────
  {
    id: 'shortGame',
    title: 'What is your short game style?',
    subtitle: 'Think about your preferred shot around the green when you have options.',
    icon: '🏌️‍♂️',
    tooltip: 'This is the most important question for cover selection. "Check & Stop" players need a soft urethane cover that grips the grooves. "Bump & Run" players do well with firmer ionomer covers that roll out predictably.',
    type: 'single',
    options: [
      { value: 'check', label: 'Check & Stop', sublabel: 'I want the ball to bite, spin and hold the green', icon: '🛑' },
      { value: 'run', label: 'Bump & Run', sublabel: 'I prefer running the ball along the ground', icon: '➡️' },
      { value: 'both', label: 'No Strong Preference', sublabel: 'I play both shots depending on the situation', icon: '↔️' },
    ],
  },

  // ── Q3 ───────────────────────────────────────────────────────────────────────
  {
    id: 'wedgeSpin',
    title: 'How does your current ball behave from wedge distance?',
    subtitle: 'Think about a full or partial wedge shot landing on a firm green.',
    icon: '🌀',
    tooltip: 'Wedge spin behaviour reveals whether you need more or less spin from your ball. If it releases too much you need a urethane cover with high spin. If it spins back too much, a softer ionomer or mid-spin ball may actually improve your proximity to the hole.',
    type: 'single',
    options: [
      { value: 'releases-too-much', label: 'Releases Too Much', sublabel: "The ball doesn't check up — it runs away from the pin", icon: '🏃' },
      { value: 'spins-back-too-much', label: 'Spins Back Too Much', sublabel: 'Ball occasionally spins off the back of the green', icon: '↩️' },
      { value: 'about-right', label: 'About Right', sublabel: "I'm happy with the spin and release", icon: '✅' },
    ],
  },

  // ── Q4 ───────────────────────────────────────────────────────────────────────
  {
    id: 'greensideFeel',
    title: 'What feel do you prefer around the greens?',
    subtitle: 'Focus on chip shots and short pitch shots — the sensation at impact.',
    icon: '🤜',
    tooltip: "Feel preference directly determines cover hardness. Soft/muffled feel comes from urethane or low-compression covers. Firm/clicky feel comes from harder ionomer covers. Neither is objectively better — it's personal and affects confidence.",
    type: 'single',
    options: [
      { value: 'soft', label: 'Soft / Muffled', sublabel: 'Pillowy, quiet feel — like hitting a peach', icon: '☁️' },
      { value: 'firm', label: 'Firm / Clicky', sublabel: 'Crisp, audible click — solid and responsive', icon: '🔩' },
      { value: 'neutral', label: 'No Strong Preference', sublabel: 'Both feel comfortable to me', icon: '⚖️' },
    ],
  },

  // ── Q5 ───────────────────────────────────────────────────────────────────────
  {
    id: 'puttingPreference',
    title: "What is your biggest putting struggle?",
    subtitle: 'Think about your most common three-putt scenario.',
    icon: '⛳',
    tooltip: "Putting feel can be influenced by ball compression and cover hardness. Softer balls feel 'deader' off the putter face, which can help golfers who struggle with too much pace. Firmer balls give more feedback that suits those who under-hit putts.",
    type: 'single',
    options: [
      { value: 'too-fast', label: 'Speed Control — Too Much Pace', sublabel: "I leave long putts past the hole regularly", icon: '🚀' },
      { value: 'too-short', label: 'Leaving It Short', sublabel: "I don't get enough pace — always dying short", icon: '😴' },
      { value: 'neither', label: 'Neither / Not a Concern', sublabel: "Putting feel isn't my main concern", icon: '✅' },
    ],
  },

  // ── Q6 ───────────────────────────────────────────────────────────────────────
  {
    id: 'approachHeight',
    title: 'What is your typical approach shot flight?',
    subtitle: 'Think about a mid-iron (6 or 7-iron) struck well — what does the trajectory look like?',
    icon: '✈️',
    tooltip: 'Ball flight on approach shots determines which spin and compression profile suits you. Low flight players may need a higher-launching ball. High flight players might need a low-spin ball to bring their trajectory under control and improve accuracy.',
    type: 'single',
    options: [
      { value: 'low', label: 'Low', sublabel: 'Piercing, penetrating flight — stays under the wind', icon: '➡️' },
      { value: 'mid', label: 'Mid', sublabel: 'Textbook trajectory — good height and descent angle', icon: '↗️' },
      { value: 'high', label: 'High', sublabel: 'High carry, steep descent — holds greens well', icon: '⬆️' },
    ],
  },

  // ── Q7 ───────────────────────────────────────────────────────────────────────
  {
    id: 'ironDistance',
    title: 'How far do you carry a 7-iron?',
    subtitle: '7-iron carry is the best single indicator of your swing speed and compression needs.',
    icon: '🔩',
    tooltip: '7-iron carry directly tells us whether you can compress a high-compression Tour ball. Players carrying it 175+ yards benefit from firmer Tour balls. Players under 135 yards will actually gain distance by switching to a softer, low-compression ball.',
    type: 'single',
    options: [
      { value: 'high', label: '175+ yards', sublabel: 'High swing speed — can compress any ball', icon: '⚡' },
      { value: 'mid-high', label: '155–174 yards', sublabel: 'Above average iron distance', icon: '💪' },
      { value: 'mid', label: '135–154 yards', sublabel: 'Average amateur iron distance', icon: '👍' },
      { value: 'low-mid', label: '115–134 yards', sublabel: 'Moderate compression speed', icon: '🎯' },
      { value: 'low', label: 'Under 115 yards', sublabel: 'Slower swing — needs low compression', icon: '🌱' },
    ],
  },

  // ── Q8 ───────────────────────────────────────────────────────────────────────
  {
    id: 'ironConsistency',
    title: 'Do you struggle with "flyers" from the rough?',
    subtitle: 'A flyer occurs when grass gets between the club face and ball, killing spin and sending the ball flying much further than expected.',
    icon: '🎱',
    tooltip: 'Flyer susceptibility is closely related to ball spin rate. Low-spin balls are more prone to flyers because there is less backspin to fight the interference. If flyers are a regular problem, a higher-spin urethane ball can help reduce the effect.',
    type: 'single',
    options: [
      { value: 'often', label: 'Yes, Often', sublabel: 'I regularly overshoot greens from the rough', icon: '😤' },
      { value: 'sometimes', label: 'Sometimes', sublabel: 'Occasional issue, usually manageable', icon: '🤔' },
      { value: 'rarely', label: 'Rarely / Never', sublabel: "I play mostly off fairways or it doesn't affect me", icon: '✅' },
    ],
  },

  // ── Q9 ───────────────────────────────────────────────────────────────────────
  {
    id: 'driverDistance',
    title: 'What is your average driver carry distance?',
    subtitle: 'Think about your average carry — not your best shot, not your worst.',
    icon: '💥',
    tooltip: 'Driver distance is the clearest proxy for swing speed — the most important factor in compression matching. Fast swingers (280+ yards / 100mph+) need firmer, higher-compression balls. Slow swingers get more distance from soft, low-compression balls.',
    type: 'single',
    options: [
      { value: 'very-high', label: '280+ yards', sublabel: 'Tour-level distance — approx. 100mph+ swing speed', icon: '🚀' },
      { value: 'high', label: '250–279 yards', sublabel: 'Strong ball striker — approx. 95–100mph swing', icon: '💪' },
      { value: 'mid', label: '220–249 yards', sublabel: 'Solid average distance — approx. 85–95mph swing', icon: '👍' },
      { value: 'low', label: '190–219 yards', sublabel: 'Moderate swing speed — approx. 75–85mph', icon: '⚡' },
      { value: 'very-low', label: 'Under 190 yards', sublabel: 'Slower swing speed — approx. under 75mph', icon: '🌀' },
    ],
  },

  // ── Q9b (CONDITIONAL — only shown for 'very-high' or 'high' driver distance) ─
  {
    id: 'spinReduction',
    title: 'With your swing speed, is driver spin a concern?',
    subtitle: 'Fast swingers can suffer from excessive driver spin, causing the ball to balloon and lose distance.',
    icon: '🌪️',
    tooltip: 'At swing speeds above 95mph, too much driver spin causes the ball to climb too high and stall — losing carry distance. A low-spin ball can keep flight in the optimal window and add 10–20 yards. If your ball looks like a balloon in the air, this is your issue.',
    type: 'single',
    conditionalOn: { id: 'driverDistance', values: ['very-high', 'high'] },
    options: [
      { value: 'yes', label: 'Yes — Ball Balloons & Spins Too Much', sublabel: 'I lose distance because it climbs too high', icon: '🎈' },
      { value: 'no', label: 'No — Spin Feels Right', sublabel: 'My driver trajectory looks good as-is', icon: '✅' },
      { value: 'not-sure', label: "Not Sure", sublabel: "I haven't paid close attention to spin", icon: '🤔' },
    ],
  },

  // ── Q10 ──────────────────────────────────────────────────────────────────────
  {
    id: 'driverLaunch',
    title: 'What is your driver launch tendency?',
    subtitle: 'Do you need help getting the ball up, or is your flight already too high?',
    icon: '🚀',
    tooltip: 'Launch angle dramatically affects distance. Too low means you are losing carry. Too high (ballooning) means you are losing distance in the descent. The right ball can help dial in your natural launch angle without any swing changes.',
    type: 'single',
    options: [
      { value: 'too-low', label: 'Too Low / Needs Height', sublabel: "The ball doesn't get in the air well enough", icon: '⬇️' },
      { value: 'too-high', label: 'Too High / Balloons', sublabel: 'Ball climbs too high and loses distance', icon: '🎈' },
      { value: 'good', label: 'Good Height Already', sublabel: 'My launch is comfortable and consistent', icon: '✅' },
    ],
  },

  // ── Q11 ──────────────────────────────────────────────────────────────────────
  {
    id: 'commonMiss',
    title: 'What is your most common miss?',
    subtitle: 'Be honest — we all have one! Your miss tells us a lot about your spin tendencies.',
    icon: '🎯',
    tooltip: 'Slicers/faders produce excess side-spin. A lower-spin ball reduces the curve and keeps the ball on the fairway. Hookers/drawers are often better served by higher-spin or firmer balls that reduce the over-rotating impact pattern.',
    type: 'single',
    options: [
      { value: 'slice', label: 'Slice / Fade', sublabel: 'Ball curves left-to-right (right-hander)', icon: '↪️' },
      { value: 'hook', label: 'Hook / Draw', sublabel: 'Ball curves right-to-left (right-hander)', icon: '↩️' },
      { value: 'straight', label: 'Straight / Both Ways', sublabel: 'Relatively straight or misses in both directions', icon: '⬅️' },
    ],
  },

  // ── Q12 ──────────────────────────────────────────────────────────────────────
  {
    id: 'windConditions',
    title: 'How often do you play in 15mph+ wind?',
    subtitle: 'This helps us choose the right aerodynamic profile for your home conditions.',
    icon: '💨',
    tooltip: 'Wind performance is determined by a ball\'s dimple pattern and spin rate. Low-spinning balls create a penetrating flight that holds its line in wind. If you play links golf or exposed parkland, the right dimple pattern can save you multiple shots per round.',
    type: 'single',
    options: [
      { value: 'often', label: 'Often / Most Rounds', sublabel: 'I play links or exposed courses regularly', icon: '🌬️' },
      { value: 'sometimes', label: 'Sometimes', sublabel: 'A few times per month in moderate wind', icon: '💨' },
      { value: 'rarely', label: 'Rarely / Never', sublabel: 'I play sheltered courses in calm conditions', icon: '☀️' },
    ],
  },

  // ── Q13 ──────────────────────────────────────────────────────────────────────
  {
    id: 'durability',
    title: 'How important is cover durability to you?',
    subtitle: 'Some premium balls scuff and cut more easily than others.',
    icon: '🛡️',
    tooltip: 'Urethane covers produce maximum greenside spin but can scuff and cut on cart paths or mis-hits — especially soft urethane. Harder ionomer covers are almost indestructible. If you play on abrasive surfaces or are meticulous about your ball condition, durability matters.',
    type: 'single',
    options: [
      { value: 'critical', label: 'Yes — Deal Breaker', sublabel: 'A visibly scuffed ball goes straight in the bin', icon: '🚫' },
      { value: 'matters', label: 'I Notice But Carry On', sublabel: 'Minor scuffs are fine, deep cuts bother me', icon: '🤔' },
      { value: 'not-important', label: "Doesn't Bother Me", sublabel: 'I care more about performance than cosmetics', icon: '✅' },
    ],
  },

  // ── Q14 ──────────────────────────────────────────────────────────────────────
  {
    id: 'currentBallHate',
    title: 'What do you dislike most about your current ball?',
    subtitle: "This is your chance to tell us what's not working in your game.",
    icon: '😤',
    tooltip: "Identifying your biggest frustration helps us zero in on the exact weakness to address. Often a single characteristic (like greenside spin or wind performance) can make a ball feel completely wrong — fixing that one issue can transform your scoring.",
    type: 'single',
    options: [
      { value: 'not-enough-distance', label: 'Not Enough Distance', sublabel: "I'm leaving yards on the table off the tee", icon: '📏' },
      { value: 'no-greenside-spin', label: 'No Greenside Spin / Control', sublabel: "Can't stop the ball where I want it", icon: '🎯' },
      { value: 'too-expensive', label: 'Too Expensive / Losing Too Many', sublabel: 'The cost makes me play scared on tight holes', icon: '💸' },
      { value: 'poor-feel', label: 'Poor Feel at Impact', sublabel: "Doesn't feel right off any club face", icon: '🤜' },
      { value: 'bad-in-wind', label: 'Bad in Wind', sublabel: 'Balloons and loses distance in any breeze', icon: '💨' },
    ],
  },

  // ── Q15 ──────────────────────────────────────────────────────────────────────
  {
    id: 'budget',
    title: 'How many balls do you typically lose per round?',
    subtitle: "This helps us balance performance with practical value — the best ball is one you'll actually use freely.",
    icon: '💳',
    tooltip: "If you lose 4+ balls per round, a £50/dozen premium Tour ball costs more than the improvement it offers. We'll factor in loss rate to recommend the best value-for-money option that won't make you play scared on tight holes or over water.",
    type: 'single',
    options: [
      { value: 'premium', label: '0–1 Ball', sublabel: 'I rarely lose balls — premium is fine (£45+/dozen)', icon: '💎' },
      { value: 'mid', label: '1–3 Balls', sublabel: 'Occasional losses — mid-range makes sense (£25–£45/dozen)', icon: '💳' },
      { value: 'value', label: '4+ Balls', sublabel: 'I lose too many to play premium (Under £25/dozen)', icon: '💰' },
    ],
  },
];

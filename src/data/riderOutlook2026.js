const DEFAULT_INSIGHTS = {
  bio: 'No curated outlook is available yet for this rider.',
  analysis: {
    strengths: ['Baseline race pace is still being evaluated in 2026 sessions.'],
    weaknesses: ['Limited verified data points available for a high-confidence projection.'],
  },
  prediction:
    'Expected to target a points-scoring finish next race, with final outcome depending on qualifying position and race-long tire control.',
  dataBasis: [
    '2025 season standings: no verified final value mapped yet.',
    '2026 form: no complete test/session trend mapped yet.',
  ],
};

function normalizeName(name = '') {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

const RIDER_OUTLOOK_2026 = {
  'francesco bagnaia': {
    bio: 'Francesco Bagnaia closed 2025 fifth on 288 points and remains a front-row reference over race distance. His 2026 tests showed strong one-lap speed and stable long-run management.',
    analysis: {
      strengths: ['Excellent braking phase and corner-exit traction management.', 'Strong tire conservation in late-race phases.', 'Consistent top-tier pace at Buriram in testing and FP1-adjacent sessions.'],
      weaknesses: ['Can lose track position if early sprint laps are compromised.', 'Needs cleaner starts when rivals launch aggressively from row one.', 'Less margin when setup window is narrow on low-grip mornings.'],
    },
    prediction:
      'Next race projection: podium fight with realistic win potential if he starts on the first two rows.',
    dataBasis: ['2025 championship: P5, 288 points.', '2026 Sepang combined: P6.', '2026 Buriram final test day: P4.', '2026 Buriram FP1: P7.'],
  },
  'marc marquez': {
    bio: 'Marc Marquez won the 2025 title with 545 points and continues to set benchmark-level racecraft under pressure. In 2026 testing he stayed near the front despite isolated crashes.',
    analysis: {
      strengths: ['Elite adaptation across grip evolution and tire phases.', 'Strong overtaking commitment without sustained pace drop-off.', 'High ceiling in qualifying simulations and race-intent laps.'],
      weaknesses: ['Testing weekends included avoidable falls when pushing limits.', 'Can over-commit in early attack phases if setup feels good immediately.', 'Needs cleaner low-risk Friday progression to reduce incident exposure.'],
    },
    prediction:
      'Next race projection: primary win contender and likely podium if he avoids early-session incidents.',
    dataBasis: ['2025 championship: P1, 545 points.', '2026 Sepang combined: P4.', '2026 Buriram final test day: P3.', '2026 Buriram FP1: P6.'],
  },
  'jorge martin': {
    bio: 'Jorge Martin finished 2025 on 34 points in an injury-affected campaign but showed clear pace rebound in 2026 Buriram testing and opening sessions.',
    analysis: {
      strengths: ['Fast adaptation to Aprilia front-end confidence windows.', 'Strong time-attack rhythm when track temperature rises.', 'Capable of immediate top-three lap pace at Buriram.'],
      weaknesses: ['Recent interruptions reduced continuity versus title rivals.', 'Needs more full-distance validation in race simulation.', 'Friday crash risk increases when searching for final tenths early.'],
    },
    prediction:
      'Next race projection: top-five pace with podium potential if qualifying execution is clean.',
    dataBasis: ['2025 championship: P21, 34 points.', '2026 Buriram final test day: P8.', '2026 Buriram FP1: P3.'],
  },
  'marco bezzecchi': {
    bio: 'Marco Bezzecchi ended 2025 third with 353 points and carried that momentum into 2026 as one of the sharpest Aprilia references in both tests and FP1.',
    analysis: {
      strengths: ['Very strong Buriram rhythm and immediate lap-time generation.', 'Excellent mid-corner speed with balanced rear grip usage.', 'Confidence in both short runs and longer simulations.'],
      weaknesses: ['Can become vulnerable if trapped behind slower bikes early.', 'Needs qualifying consistency across changing track conditions.', 'Occasional volatility when chasing extra margin on final sectors.'],
    },
    prediction:
      'Next race projection: front-row candidate and top favorite for a podium, with credible win probability.',
    dataBasis: ['2025 championship: P3, 353 points.', '2026 Sepang combined: P2.', '2026 Buriram final test day: P1.', '2026 Buriram FP1: P1.'],
  },
  'pedro acosta': {
    bio: 'Pedro Acosta finished 2025 fourth on 307 points and remains KTM\'s most consistent front-group threat entering 2026.',
    analysis: {
      strengths: ['Aggressive but controlled race entries into braking zones.', 'Strong adaptation to traffic and mixed race phases.', 'Reliable top-six test pace across Sepang and Buriram.'],
      weaknesses: ['KTM ceiling can vary by circuit temperature profile.', 'Late-race tire fade can limit final-lap attacks.', 'Needs cleaner qualifying conversion to maximize Sunday options.'],
    },
    prediction:
      'Next race projection: likely top-six finish with outside podium potential if launch and first laps are strong.',
    dataBasis: ['2025 championship: P4, 307 points.', '2026 Sepang combined: P8.', '2026 Buriram final test day: P6.', '2026 Buriram FP1: P5.'],
  },
  'brad binder': {
    bio: 'Brad Binder closed 2025 eleventh on 155 points and remains a high-value race-day improver, especially in mixed pack battles.',
    analysis: {
      strengths: ['Strong opening laps and decisive overtakes in traffic.', 'Good tire durability management in defensive runs.', 'Consistent mid-grid recovery capability.'],
      weaknesses: ['One-lap qualifying pace still lags front-group benchmarks.', 'KTM performance swings can hurt weekend stability.', 'Needs cleaner exits from slower corners for straight-line defense.'],
    },
    prediction:
      'Next race projection: points-secure race with realistic P7-P10 outcome, improving if qualifying lands inside top 10.',
    dataBasis: ['2025 championship: P11, 155 points.', '2026 Sepang combined: P15.', '2026 Buriram final test day: P12.'],
  },
  'enea bastianini': {
    bio: 'Enea Bastianini finished 2025 fourteenth on 112 points and is still consolidating KTM adaptation in 2026 preseason work.',
    analysis: {
      strengths: ['Good late-race tire exploitation when pace settles.', 'Calm pace building through weekend sessions.', 'Capable of high-value gains in second half of races.'],
      weaknesses: ['Early-session speed sometimes below top KTM benchmark.', 'Qualifying position can limit strategy flexibility.', 'Needs stronger first-lap bite to avoid midfield lock-ins.'],
    },
    prediction:
      'Next race projection: probable points finish in the P9-P13 range unless qualifying unlocks cleaner air.',
    dataBasis: ['2025 championship: P14, 112 points.', '2026 Sepang combined: P11.', '2026 Buriram final test day: P18.'],
  },
  'maverick vinales': {
    bio: 'Maverick Vinales ended 2025 eighteenth on 72 points and showed stronger baseline pace in 2026 Sepang than in opening Buriram sessions.',
    analysis: {
      strengths: ['Strong raw speed when front grip confidence is high.', 'Can deliver clean time attacks in low-traffic windows.', 'Useful setup sensitivity for rapid directional changes.'],
      weaknesses: ['Performance swings between sessions remain noticeable.', 'Starts and first-lap positioning can compromise race plan.', 'Needs steadier adaptation across track-temperature shifts.'],
    },
    prediction:
      'Next race projection: mid-points target around P8-P12 if Friday setup progression is stable.',
    dataBasis: ['2025 championship: P18, 72 points.', '2026 Sepang combined: P9.', '2026 Buriram final test day: P14.', '2026 Buriram FP1: P19.'],
  },
  'fabio di giannantonio': {
    bio: 'Fabio Di Giannantonio finished 2025 sixth on 262 points and entered 2026 as a reliable Ducati reference over both single-lap and race runs.',
    analysis: {
      strengths: ['Strong braking consistency and controlled race cadence.', 'Quick adaptation to session-to-session setup changes.', 'Repeated top-three pace indicators across preseason and FP1.'],
      weaknesses: ['Can lose momentum if qualifying starts from dirty side of grid.', 'Needs cleaner first two laps to protect strategic options.', 'Occasional final-sector instability when pushing edge grip.'],
    },
    prediction:
      'Next race projection: podium contender with high probability of a top-five finish.',
    dataBasis: ['2025 championship: P6, 262 points.', '2026 Sepang combined: P3.', '2026 Buriram final test day: P9.', '2026 Buriram FP1: P2.'],
  },
  'franco morbidelli': {
    bio: 'Franco Morbidelli closed 2025 seventh on 231 points and showed solid 2026 continuity, particularly in race-pace oriented runs.',
    analysis: {
      strengths: ['Stable mid-race rhythm and measured tire use.', 'Good consistency on worn rear compounds.', 'Strong combined test positions relative to key rivals.'],
      weaknesses: ['One-lap explosiveness not always front-row level.', 'Can be exposed in crowded opening sectors.', 'Needs improved qualifying-to-race conversion efficiency.'],
    },
    prediction:
      'Next race projection: top-eight expectation with top-five upside in a tactical race.',
    dataBasis: ['2025 championship: P7, 231 points.', '2026 Sepang combined: P7.', '2026 Buriram final test day: P7.', '2026 Buriram FP1: P8.'],
  },
  'alex marquez': {
    bio: 'Alex Marquez finished 2025 runner-up on 467 points and was one of the clearest 2026 preseason standouts with leading pace at Sepang.',
    analysis: {
      strengths: ['Excellent preseason one-lap execution and confidence.', 'Strong rhythm in medium-length runs.', 'Good stability in corner-entry phase under braking load.'],
      weaknesses: ['Race starts can decide whether he controls or chases.', 'Needs to avoid overusing front tire in early attack phases.', 'Margin to top Ducati can narrow in high-heat late stints.'],
    },
    prediction:
      'Next race projection: front-group lock and serious podium candidate, with win chance if he qualifies on row one.',
    dataBasis: ['2025 championship: P2, 467 points.', '2026 Sepang combined: P1.', '2026 Buriram final test day: P5.', '2026 Buriram FP1: P9.'],
  },
  'fermin aldeguer': {
    bio: 'Fermin Aldeguer finished 2025 eighth on 214 points and remains one of the highest-upside younger riders entering full 2026 competition.',
    analysis: {
      strengths: ['Strong confidence in fast direction-change sections.', 'Good qualifying intent when setup is stable.', 'Aggressive racecraft that can unlock overtakes quickly.'],
      weaknesses: ['Weekend consistency still maturing versus veteran front-runners.', 'Can over-push front tire in recovery phases.', 'Needs cleaner long-run stability to convert raw pace into big points.'],
    },
    prediction:
      'Next race projection: likely points finish with top-10 potential if qualifying lands inside first four rows.',
    dataBasis: ['2025 championship: P8, 214 points.', '2026 preseason: competitive but not consistently top-five in public combined tables.'],
  },
  'fabio quartararo': {
    bio: 'Fabio Quartararo ended 2025 ninth on 201 points and continues to lead Yamaha\'s race-weekend development effort in 2026.',
    analysis: {
      strengths: ['Excellent corner speed preservation and precision lines.', 'Strong defensive riding when protecting points.', 'Clear technical feedback that improves weekend setup direction.'],
      weaknesses: ['Top-speed deficit can complicate overtakes.', 'Needs qualifying advantage to avoid pack battles.', 'Race pace ceiling still depends on Yamaha step changes.'],
    },
    prediction:
      'Next race projection: points finish around P9-P12, with top-eight upside if qualifying execution is strong.',
    dataBasis: ['2025 championship: P9, 201 points.', '2026 Sepang combined: P17.', '2026 Buriram final test day: P17.'],
  },
  'alex rins': {
    bio: 'Alex Rins finished 2025 nineteenth on 68 points and is working through Yamaha\'s 2026 balance changes with gradual improvement.',
    analysis: {
      strengths: ['Smooth race rhythm and low-error long stints.', 'Good adaptation in variable grip conditions.', 'Can deliver strong tactical rides from midfield starts.'],
      weaknesses: ['Single-lap pace remains below front-group benchmark.', 'Limited overtaking options when straight-line speed is constrained.', 'Needs stronger first-sector performance to reduce recovery load.'],
    },
    prediction:
      'Next race projection: likely lower-points result in the P10-P14 window.',
    dataBasis: ['2025 championship: P19, 68 points.', '2026 Sepang combined: P14.', '2026 Buriram FP1: P13.'],
  },
  'miguel oliveira': {
    bio: 'Miguel Oliveira closed 2025 twentieth on 43 points and enters 2026 targeting consistency after interrupted momentum.',
    analysis: {
      strengths: ['Strong tactical awareness in mixed-pace races.', 'Usually controlled tire wear over longer distances.', 'Capable of extracting results from difficult weekends.'],
      weaknesses: ['Limited preseason headline pace versus direct rivals.', 'Qualifying position often forces riskier early-race choices.', 'Needs stronger acceleration phase to defend on exits.'],
    },
    prediction:
      'Next race projection: fringe points target around P11-P15, with upside if attrition is high.',
    dataBasis: ['2025 championship: P20, 43 points.', '2026 preseason: outside top benchmark group in published combined tables.'],
  },
  'jack miller': {
    bio: 'Jack Miller finished 2025 seventeenth on 79 points and remains one of the most adaptable riders in mixed conditions.',
    analysis: {
      strengths: ['Strong race starts and early-lap aggression.', 'Good adaptability to changing grip and weather.', 'Can protect points with tactical race management.'],
      weaknesses: ['One-lap qualifying peak can fluctuate by weekend.', 'Rear-tire management can fade in long hot races.', 'Needs cleaner mid-race consistency to hold top-10 positions.'],
    },
    prediction:
      'Next race projection: points battle in P9-P13 with higher ceiling if start phase is clean.',
    dataBasis: ['2025 championship: P17, 79 points.', '2026 Sepang combined: P18.', '2026 Buriram final test day: P16.'],
  },
  'joan mir': {
    bio: 'Joan Mir finished 2025 fifteenth on 96 points and showed one of Honda\'s strongest preseason signals entering 2026.',
    analysis: {
      strengths: ['Strong braking stability and race-distance consistency.', 'High-value test pace relative to 2025 baseline.', 'Disciplined risk profile across heavy-traffic phases.'],
      weaknesses: ['Qualifying pace still needs another step for front-row starts.', 'Can lose time on exit acceleration against Ducati/KTM.', 'Must convert Friday promise into full weekend results.'],
    },
    prediction:
      'Next race projection: top-10 likelihood with genuine top-six potential if qualifying is clean.',
    dataBasis: ['2025 championship: P15, 96 points.', '2026 Sepang combined: P5.', '2026 Buriram final test day: P10.', '2026 Buriram FP1: P12.'],
  },
  'luca marini': {
    bio: 'Luca Marini closed 2025 thirteenth on 142 points and has started 2026 with steady Honda progression across tests and FP1.',
    analysis: {
      strengths: ['Strong technical consistency session to session.', 'Good race management in the second half of races.', 'Reliable qualifying-to-race conversion when in top 12.'],
      weaknesses: ['Needs sharper first-lap aggression to gain early positions.', 'Limited outright one-lap peak versus leaders.', 'Can struggle to pass when trapped behind similarly paced bikes.'],
    },
    prediction:
      'Next race projection: probable points finish between P8 and P12.',
    dataBasis: ['2025 championship: P13, 142 points.', '2026 Sepang combined: P13.', '2026 Buriram final test day: P13.', '2026 Buriram FP1: P10.'],
  },
  'johann zarco': {
    bio: 'Johann Zarco ended 2025 twelfth on 148 points and remains an experienced reference for Honda\'s race direction in 2026.',
    analysis: {
      strengths: ['Efficient tire usage and clean race rhythm.', 'Strong feedback loop for setup direction.', 'Often converts midfield starts into stable points.'],
      weaknesses: ['Top-end one-lap speed still below podium benchmark.', 'Needs cleaner first-sector exits to defend position.', 'Can lose ground if trapped in long traffic trains.'],
    },
    prediction:
      'Next race projection: consistent points target around P8-P12.',
    dataBasis: ['2025 championship: P12, 148 points.', '2026 Sepang combined: P16.', '2026 Buriram final test day: P15.'],
  },
  'somkiat chantra': {
    bio: 'Somkiat Chantra enters 2026 as a MotoGP rookie stepping into the premier class with home-event pressure and a steep adaptation curve.',
    analysis: {
      strengths: ['Motivated development trajectory and local-track familiarity at Buriram.', 'Strong willingness to adapt riding style quickly.', 'Can gain pace rapidly across a race weekend.'],
      weaknesses: ['No full-season MotoGP benchmark yet.', 'Needs time to build consistency over race distance.', 'Qualifying pace in premier class remains an open variable.'],
    },
    prediction:
      'Next race projection: development-focused outing, targeting race completion and experience-led pace gains.',
    dataBasis: ['2025 MotoGP championship: not a full-time entry.', '2026 status: rookie season baseline.'],
  },
  'raul fernandez': {
    bio: 'Raul Fernandez finished 2025 tenth on 172 points and carried positive Aprilia form into 2026 testing.',
    analysis: {
      strengths: ['Strong confidence under braking on flowing sections.', 'Improved preseason consistency versus prior year baseline.', 'Solid track-position defense once rhythm is established.'],
      weaknesses: ['Needs stronger qualifying peak for cleaner race starts.', 'Can lose rhythm in dense midfield traffic.', 'Final-lap attack pace sometimes plateaus without clean air.'],
    },
    prediction:
      'Next race projection: points finish likely, with top-eight upside if he starts inside top 10.',
    dataBasis: ['2025 championship: P10, 172 points.', '2026 Sepang combined: P10.', '2026 Buriram final test day: P11.', '2026 Buriram FP1: P11.'],
  },
  'ai ogura': {
    bio: 'Ai Ogura finished 2025 sixteenth on 89 points and has opened 2026 as one of Aprilia\'s strongest Buriram performers.',
    analysis: {
      strengths: ['Excellent Buriram confidence and repeatable lap pace.', 'Composed racecraft under pressure from faster bikes behind.', 'Strong adaptation to Aprilia race setup windows.'],
      weaknesses: ['Needs sustained consistency across full race calendar.', 'Qualifying conversion remains critical to avoid traffic losses.', 'Experience gap versus title leaders in strategic race phases.'],
    },
    prediction:
      'Next race projection: strong top-eight probability, with podium outside chance if early laps stay clean.',
    dataBasis: ['2025 championship: P16, 89 points.', '2026 Sepang combined: P12.', '2026 Buriram final test day: P2.', '2026 Buriram FP1: P4.'],
  },
};

const NAME_ALIASES = {
  'maverick vinales': 'maverick vinales',
  'fabio di giannantonio': 'fabio di giannantonio',
  'alex marquez': 'alex marquez',
  'marc marquez': 'marc marquez',
  'jorge martin': 'jorge martin',
};

export function getRiderOutlook(rider) {
  const normalized = normalizeName(rider?.name || '');
  const key = NAME_ALIASES[normalized] || normalized;

  const selected = RIDER_OUTLOOK_2026[key];
  if (selected) return selected;

  return {
    ...DEFAULT_INSIGHTS,
    bio: `${rider?.name || 'This rider'} does not have a fully curated outlook yet.`,
  };
}

export { RIDER_OUTLOOK_2026, normalizeName };

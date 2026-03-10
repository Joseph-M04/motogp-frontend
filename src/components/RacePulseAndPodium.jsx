import React, { useMemo } from 'react';
import '../styles/RacePulseAndPodium.css';

const TEAM_COLORS = {
  'Ducati Lenovo Team':               '#CC0000',
  'BK8 Gresini Racing MotoGP':        '#6BA3E5',
  'Aprilia Racing':                    '#551A8B',
  'Red Bull KTM Factory Racing':       '#FF6600',
  'Red Bull KTM Tech3':                '#FF6600',
  'Monster Energy Yamaha MotoGP':      '#003B8E',
  'Pertamina Enduro VR46 Racing Team': '#DAA520',
  'Prima Pramac Yamaha':               '#004C97',
  'Trackhouse MotoGP Team':            '#00B4D8',
  'Honda HRC Castrol':                 '#CC0000',
  'Castrol Honda LCR':                 '#FFFFFF',
};

function byNumberMap(riders) {
  const map = new Map();
  riders.forEach((rider) => map.set(rider.number, rider));
  return map;
}

function getSessionPositionMap(numbers) {
  const map = new Map();
  numbers.forEach((num, idx) => map.set(num, idx + 1));
  return map;
}

function normalRank(pos, max) {
  if (!pos) return 0;
  return (max - pos + 1) / max;
}

function buildPodiumPrediction(riders) {
  const practicePos = getSessionPositionMap(PRACTICE_RESULTS);
  const fp1Pos = getSessionPositionMap(FP1_RESULTS);
  const maxPoints = Math.max(...riders.map((r) => r.season_2026_points || 0), 1);
  const maxPos = PRACTICE_RESULTS.length;

  return [...riders]
    .map((rider) => {
      const pointsScore = (rider.season_2026_points || 0) / maxPoints;
      const practiceScore = normalRank(practicePos.get(rider.number), maxPos);
      const fp1Score = normalRank(fp1Pos.get(rider.number), maxPos);
      const score = pointsScore * 0.45 + practiceScore * 0.4 + fp1Score * 0.15;
      return { rider, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
      confidence: `${Math.max(58, Math.round(entry.score * 100))}%`,
    }));
}

function getNumberStyle(team) {
  const teamColor = TEAM_COLORS[team] || '#9ba8bb';
  const isLight = teamColor === '#e8e8e8';
  return {
    color: isLight ? '#c8c8c8' : teamColor,
    borderColor: isLight ? 'rgba(255,255,255,0.2)' : `${teamColor}66`,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  };
}

function getPedestalMeta(rider) {
  const fp1Pos = rider.fp1Pos ?? null;
  const practicePos = rider.practicePos ?? null;
  const fp1 = fp1Pos >= 0 ? fp1Pos + 1 : null;
  const pr = practicePos >= 0 ? practicePos + 1 : null;
  const delta = fp1 && pr ? fp1 - pr : null;
  return {
    points: rider.season_2026_points || 0,
    practice: pr ? `P${pr}` : 'N/A',
    trend:
      delta === null || delta === 0 ? '—' : delta > 0 ? `+${delta}` : `${delta}`,
  };
}

function RacePulseAndPodium({ riders, onRiderSelect }) {
  const orderedRiders = useMemo(
    () => [...riders].sort((a, b) => (b.season_2026_points || 0) - (a.season_2026_points || 0) || (a.number - b.number)),
    [riders]
  );
  const riderMap = useMemo(() => byNumberMap(orderedRiders), [orderedRiders]);

  // Use current standings as placeholder session order until live session timing is available
  const practiceOrder = useMemo(() => orderedRiders.map((r) => r.number), [orderedRiders]);
  const fp1Order = practiceOrder;
  const practicePosMap = useMemo(() => getSessionPositionMap(practiceOrder), [practiceOrder]);
  const fp1PosMap = useMemo(() => getSessionPositionMap(fp1Order), [fp1Order]);

  const pulse = useMemo(() => {
    let bestDelta = { rider: null, delta: 0 };
    practiceOrder.forEach((num) => {
      const before = fp1PosMap.get(num);
      const after = practicePosMap.get(num);
      if (before && after) {
        const delta = before - after;
        if (delta > bestDelta.delta) {
          bestDelta = { rider: riderMap.get(num) || null, delta };
        }
      }
    });

    const leader = riderMap.get(practiceOrder[0]) || null;
    const hotLap = '1:28.526';
    return {
      leader,
      hotLap,
      gain: bestDelta,
      weather: '34C air / high humidity / dry track',
      next: 'Q1-Q2 tomorrow - 10:50 local',
    };
  }, [practiceOrder, fp1PosMap, practicePosMap, riderMap]);

  const podium = useMemo(() => buildPodiumPrediction(riders), [riders]);
  const displayPodium = useMemo(() => {
    const byRank = new Map(podium.map((entry) => [entry.rank, entry]));
    return [byRank.get(2), byRank.get(1), byRank.get(3)]
      .filter(Boolean)
      .map((entry) => ({
        ...entry,
        rider: {
          ...entry.rider,
          practicePos: practicePosMap.get(entry.rider.number) ?? null,
          fp1Pos: fp1PosMap.get(entry.rider.number) ?? null,
        },
      }));
  }, [podium, practicePosMap, fp1PosMap]);

  return (
    <section className="race-pulse-section">
      <div className="section-heading">
        <h2 className="section-title">Race Weekend Pulse</h2>
        <span className="section-subtitle">Live performance snapshot</span>
      </div>

      <div className="pulse-grid">
        <article className="pulse-card">
          <h3>Current benchmark</h3>
          <p className="pulse-main">{pulse.leader ? pulse.leader.name : 'TBA'}</p>
          <p className="pulse-meta">Practice P1 - {pulse.hotLap}</p>
        </article>

        <article className="pulse-card">
          <h3>Biggest gain</h3>
          <p className="pulse-main">{pulse.gain.rider ? pulse.gain.rider.name : 'TBA'}</p>
          <p className="pulse-meta">+{pulse.gain.delta} places (FP1 to Practice)</p>
        </article>

        <article className="pulse-card">
          <h3>Conditions</h3>
          <p className="pulse-main">Dry setup window</p>
          <p className="pulse-meta">{pulse.weather}</p>
        </article>

        <article className="pulse-card">
          <h3>Next session</h3>
          <p className="pulse-main">Qualifying</p>
          <p className="pulse-meta">{pulse.next}</p>
        </article>
      </div>

      <div className="section-heading pulse-subheading">
        <h2 className="section-title">Predictive Podium</h2>
        <span className="section-subtitle">Blended from points + Friday pace</span>
      </div>

      <div className="podium-grid">
        {displayPodium.map(({ rider, rank }) => {
          const meta = getPedestalMeta(rider);
          return (
          <article
            key={rider.id}
            className={`podium-card podium-card--p${rank} ${rank === 1 ? 'podium-card--winner' : ''}`}
            onClick={() => onRiderSelect?.(rider)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onRiderSelect?.(rider);
            }}
          >
            <div className={`podium-pedestal podium-pedestal--p${rank}`}>
              <div className="podium-pedestal-top">
                <span className="podium-pedestal-number" style={{ color: getNumberStyle(rider.team).color }}>
                  {rider.number}
                </span>
                <p className="podium-name">{rider.name}</p>
              </div>
              <div className="podium-pedestal-data">
                <span className="podium-pedestal-stat">PTS {meta.points}</span>
                <span className="podium-pedestal-stat">PR {meta.practice}</span>
                <span className="podium-pedestal-stat">TREND {meta.trend}</span>
              </div>
              <span className="podium-pedestal-rank">P{rank}</span>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}

export default RacePulseAndPodium;

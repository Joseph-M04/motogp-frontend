import React, { useState, useEffect, useMemo } from 'react';
import '../styles/Sidebar.css';
import { apiUrl } from '../api';

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

function getTeamColor(team) { return TEAM_COLORS[team] || '#888'; }

function getConstructor(teamName = '') {
  const n = teamName.toLowerCase();
  if (n.includes('ducati') || n.includes('gresini') || n.includes('vr46')) return 'Ducati';
  if (n.includes('aprilia') || n.includes('trackhouse')) return 'Aprilia';
  if (n.includes('ktm') || n.includes('tech3')) return 'KTM';
  if (n.includes('yamaha') || n.includes('pramac')) return 'Yamaha';
  if (n.includes('honda') || n.includes('lcr') || n.includes('castrol')) return 'Honda';
  return 'Other';
}

const CONSTRUCTOR_COLORS = {
  Ducati: '#CC0000', Aprilia: '#551A8B', KTM: '#FF6600',
  Yamaha: '#003B8E', Honda: '#CC0000',  Other: '#7b879a',
};

function pad2(n) { return String(n).padStart(2, '0'); }

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    if (!targetDate) return;
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft(null);
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function Sidebar({ riders, onRoundSelect }) {
  const [nextRace, setNextRace] = useState(null);
  const [lastRace, setLastRace] = useState(null);
  const [lastResults, setLastResults] = useState([]);
  const [allRaces, setAllRaces] = useState([]);

  // Fetch next race
  useEffect(() => {
    fetch(apiUrl('/api/races/next'))
      .then(r => r.json())
      .then(data => setNextRace(data))
      .catch(() => {});
  }, []);

  // Fetch last completed race
  useEffect(() => {
    fetch(apiUrl('/api/races/last'))
      .then(r => r.json())
      .then(data => {
        setLastRace(data);
        if (data?.id) {
          // Fetch Q2/qualifying results for timing tower
          fetch(apiUrl(`/api/races/${data.id}/results?session=sprint`))
            .then(r => r.json())
            .then(results => setLastResults(results.slice(0, 5)))
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  const [podiums, setPodiums] = useState({});

  // Fetch full calendar
  useEffect(() => {
    fetch(apiUrl('/api/races?season=2026'))
      .then(r => r.json())
      .then(data => {
        setAllRaces(data);
        // Fetch podiums for completed races
        const completed = data.filter(r => r.status === 'completed');
        Promise.all(
          completed.map(r =>
            fetch(apiUrl(`/api/races/${r.id}/results?session=race`))
              .then(res => res.json())
              .then(results => ({ round: r.round, results: results.slice(0, 3) }))
              .catch(() => ({ round: r.round, results: [] }))
          )
        ).then(all => {
          const map = {};
          all.forEach(({ round, results }) => { map[round] = results; });
          setPodiums(map);
        });
      })
      .catch(() => {});
  }, []);

  const fridayDate = nextRace?.race_date
    ? (() => { const d = new Date(nextRace.race_date); d.setDate(d.getDate() - 2); return d.toISOString(); })()
    : null;
  const timeLeft = useCountdown(fridayDate);
  const isLive = nextRace && !timeLeft;

  const constructors = useMemo(() => {
    const map = new Map();
    riders.forEach(r => {
      const name = getConstructor(r.team);
      const cur = map.get(name) || { name, points: 0, color: CONSTRUCTOR_COLORS[name] || '#888' };
      cur.points += r.season_2026_points || 0;
      map.set(name, cur);
    });
    return [...map.values()].sort((a, b) => b.points - a.points);
  }, [riders]);

  const maxPts = Math.max(...constructors.map(c => c.points), 1);

  // Derive next round number for calendar highlighting
  const nextRound = nextRace?.round || 1;

  return (
    <div className="sidebar-panel">

      {/* ── Countdown ── */}
      <div className="sb-section sb-section--next">
        <div className="sb-label">Next Race</div>
        {nextRace ? (
          <>
            <div className="sb-next__header">
              <span className="sb-next__flag">{nextRace.flag}</span>
              <div>
                <div className="sb-next__name">{nextRace.name.replace('Grand Prix of ','').replace('Grand Prix','GP').replace('Gran Premio','GP')}</div>
                <div className="sb-next__meta">{nextRace.city}</div>
              </div>
            </div>
            {isLive ? (
              <div className="sb-live">
                <span className="sb-live__dot" />
                <span>Live Now</span>
              </div>
            ) : timeLeft ? (
              <div className="sb-countdown">
                {[['D', timeLeft.d], ['H', timeLeft.h], ['M', timeLeft.m], ['S', timeLeft.s]].map(([lbl, val]) => (
                  <div key={lbl} className="sb-countdown__unit">
                    <span className="sb-countdown__val">{pad2(val)}</span>
                    <span className="sb-countdown__sep">{lbl}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className="sb-next__name">Loading...</div>
        )}
      </div>

      {/* ── Mini Timing Tower ── */}
      <div className="sb-section">
        <div className="sb-label">
          {lastRace ? `Sprint · ${lastRace.flag || ''} Round ${lastRace.round}` : 'Last Session'}
        </div>
        <div className="sb-timing">
          {lastResults.length > 0 ? lastResults.map(r => {
            const color = getTeamColor(r.team);
            return (
              <div key={r.id} className="sb-timing__row">
                <span className="sb-timing__pos">{r.finish_position}</span>
                <span
                  className="sb-timing__num"
                  style={{
                    color: color === '#FFFFFF' ? 'rgba(255,255,255,0.8)' : color,
                    borderColor: color === '#FFFFFF' ? 'rgba(255,255,255,0.15)' : `${color}44`,
                  }}
                >
                  {r.number}
                </span>
                <span className="sb-timing__name">{r.rider_name.split(' ').pop()}</span>
                <span className={`sb-timing__time ${r.finish_position === 1 ? 'sb-timing__time--leader' : ''}`}>
                  {r.finish_position === 1 ? 'P1' : r.gap_to_leader || '—'}
                </span>
              </div>
            );
          }) : (
            <div className="sb-timing__empty">No results yet</div>
          )}
        </div>
      </div>

      {/* ── Round Navigator ── */}
      <div className="sb-section">
        <div className="sb-label">2026 Calendar</div>
        <div className="sb-rounds">
          {allRaces.map(r => {
            const isPast = r.status === 'completed';
            const isCurrent = r.round === nextRound;
            const podium = podiums[r.round] || [];
            return (
              <div
                key={r.round}
                className={`sb-round ${isPast ? 'sb-round--past' : ''} ${isCurrent ? 'sb-round--current' : ''}`}
                onClick={() => onRoundSelect(r)}
              >
                <div className="sb-round__top">
                  <span className="sb-round__num">{String(r.round).padStart(2, '0')}</span>
                  <span className="sb-round__flag">{r.flag_url}</span>
                  <span className="sb-round__name">{r.name.replace('Grand Prix of ', '').replace('Grand Prix', 'GP').replace('Gran Premio', 'GP').replace('Gran Premi', 'GP').replace('Grande Prémio de ', '').replace('Motorrad ', '').replace('Red Bull ', '').replace('PT ', '')}</span>
                  <span className="sb-round__date">{formatDate(r.race_date)}</span>
                </div>
                {isPast && podium.length > 0 && (
                  <div className="sb-round__podium">
                    {podium.map((p, i) => {
                      const medals = ['🥇','🥈','🥉'];
                      const color = TEAM_COLORS[p.team] || '#888';
                      const safeColor = color === '#FFFFFF' ? 'rgba(255,255,255,0.7)' : color;
                      const surname = (p.rider_name || p.name || '').split(' ').slice(-1)[0];
                      return (
                        <div key={i} className="sb-podium-row">
                          <span className="sb-podium-row__medal">{medals[i]}</span>
                          <span className="sb-podium-row__name" style={{ color: safeColor }}>{surname}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Constructors ── */}
      <div className="sb-section">
        <div className="sb-label">Constructors</div>
        <div className="sb-constructors">
          {constructors.map((c, i) => (
            <div key={c.name} className="sb-constructor">
              <div className="sb-constructor__head">
                <span className="sb-constructor__pos">{i + 1}</span>
                <span
                  className="sb-constructor__dot"
                  style={{ background: c.color === '#FFFFFF' ? 'rgba(255,255,255,0.5)' : c.color }}
                />
                <span className="sb-constructor__name">{c.name}</span>
                <span className="sb-constructor__pts">{c.points > 0 ? c.points : '—'}</span>
              </div>
              <div className="sb-constructor__track">
                <div
                  className="sb-constructor__fill"
                  style={{
                    width: `${(c.points / maxPts) * 100}%`,
                    background: c.color === '#FFFFFF' ? 'rgba(255,255,255,0.4)' : c.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
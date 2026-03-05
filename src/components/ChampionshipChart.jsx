import { apiUrl } from '../api'; // eslint-disable-line no-unused-vars
import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/ChampionshipChart.css';
import RiderStats from './RiderStats';

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

function getTeamColor(team) {
  return TEAM_COLORS[team] || '#555';
}

const FLAGS = {
  'Spanish': '🇪🇸', 'Italian': '🇮🇹', 'French': '🇫🇷', 'Portuguese': '🇵🇹',
  'Australian': '🇦🇺', 'South African': '🇿🇦', 'Japanese': '🇯🇵',
  'German': '🇩🇪', 'British': '🇬🇧', 'American': '🇺🇸', 'Thai': '🇹🇭',
  'Argentine': '🇦🇷', 'Brazilian': '🇧🇷', 'Malaysian': '🇲🇾',
  'Indonesian': '🇮🇩', 'Turkish': '🇹🇷', 'Swiss': '🇨🇭',
};

export default function ChampionshipChart({ riders, onRiderSelect }) {
  const [showAll, setShowAll]             = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [compareRider, setCompareRider]   = useState(null);
  const [dragOver, setDragOver]           = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const [rendered, setRendered]           = useState(false);
  const dragRiderRef = useRef(null);
  const listRef = useRef(null);
  const [wrapperHeight, setWrapperHeight] = useState('auto');

  useEffect(() => {
    const t = setTimeout(() => setRendered(true), 60);
    return () => clearTimeout(t);
  }, []);

  const sorted = [...riders].sort((a, b) => (b.season_2026_points || 0) - (a.season_2026_points || 0));
  const leaderPts = sorted[0]?.season_2026_points || 0;
  const displayed = sorted;

  // Smooth height animation for list wrapper
  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;
    const rows = Array.from(listEl.querySelectorAll('.standings-row'));
    if (!rows.length) return;

    const calcCollapsed = () => {
      // If a rider is opened (inline stats) keep full height so details aren't clipped
      if (selectedRider) return listEl.scrollHeight;
      if (isMobile) return listEl.scrollHeight; // mobile: prefer showing full list height even in top-10 mode
      const firstTen = rows.slice(0, 10);
      return firstTen.reduce((sum, row) => sum + row.offsetHeight + 2, 0);
    };

    requestAnimationFrame(() => {
      const target = showAll ? listEl.scrollHeight : calcCollapsed();
      setWrapperHeight(`${target}px`);
    });
  }, [showAll, riders.length, isMobile, selectedRider]);

  const handleRowClick = (rider) => {
    if (selectedRider?.id === rider.id) {
      setSelectedRider(null);
      setCompareRider(null);
    } else {
      setSelectedRider(rider);
      setCompareRider(null);
    }
  };

  const onDragStart = useCallback((e, rider) => {
    dragRiderRef.current = rider;
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  const onDropCompare = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const rider = dragRiderRef.current;
    if (!rider || rider.id === selectedRider?.id) return;
    setCompareRider(rider);
  }, [selectedRider]);

  const clearCompare = () => setCompareRider(null);

  const statRows = [
    { label: '2026 Points', fn: r => r.season_2026_points || 0,  higher: true  },
    { label: 'World Titles', fn: r => r.world_titles || 0,        higher: true  },
    { label: 'Bike',         fn: r => r.bike || '—',              text: true    },
    { label: 'Nationality',  fn: r => r.nationality || r.country || '—', text: true },
    { label: 'Number',       fn: r => r.number,                   text: true    },
  ];

  return (
    <div className={`champ-chart ${rendered ? 'champ-chart--rendered' : ''}`}>

      <div className="champ-chart__head">
        <div>
          <h2 className="champ-chart__title">Championship Standings</h2>
          <p className="champ-chart__subtitle">2026 MotoGP World Championship · Round 5</p>
        </div>
        <button
          className={`champ-chart__toggle ${showAll ? 'champ-chart__toggle--active' : ''}`}
          onClick={() => setShowAll(s => !s)}
        >
          {showAll ? '↑ Top 10' : '↓ All Riders'}
        </button>
      </div>

      <div
        className="champ-chart__list-wrapper"
        style={{ height: wrapperHeight }}
      >
      <div className="standings-list" ref={listRef}>
        {displayed.map((rider, idx) => {
          const pts     = rider.season_2026_points || 0;
          const gap     = leaderPts - pts;
          const barPct  = leaderPts > 0 ? (pts / leaderPts) * 100 : 0;
          const color   = getTeamColor(rider.team);
          const flag    = FLAGS[rider.nationality] || FLAGS[rider.country] || '🏁';
          const isSelected = selectedRider?.id === rider.id;
          const isCompare  = compareRider?.id === rider.id;
          const safeColor  = color === '#FFFFFF' ? 'rgba(255,255,255,0.8)' : color;

          return (
          <React.Fragment key={rider.id}>
            <div
              className={`standings-row ${isSelected ? 'standings-row--selected' : ''} ${isCompare ? 'standings-row--compare' : ''} ${(!showAll && idx >= 10) ? 'standings-row--extra' : ''} ${showAll && idx >= 10 ? 'standings-row--extra-visible' : ''}`}
              onClick={() => handleRowClick(rider)}
              draggable={!!selectedRider && selectedRider.id !== rider.id}
              onDragStart={(e) => onDragStart(e, rider)}
              title={selectedRider && selectedRider.id !== rider.id ? 'Drag to compare' : ''}
              style={idx >= 10 && showAll ? { transitionDelay: `${(idx - 10) * 40}ms` } : {}}
            >
              <span className="standings-row__rank" style={{ color: idx === 0 ? '#FFD700' : 'rgba(255,255,255,0.3)' }}>
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="standings-row__num" style={{ color: safeColor, borderColor: `${safeColor}44` }}>
                {rider.number}
              </span>
              <span className="standings-row__flag">{flag}</span>
              <span className="standings-row__name">
                {`${rider.name.split(' ')[0][0]}. ${rider.name.split(' ').slice(1).join(' ')}`}
              </span>
                <span className="standings-row__pts">{pts}</span>
                <span className="standings-row__gap">
                  {idx === 0
                    ? <span className="standings-row__leader">LEADER</span>
                    : `−${gap}`}
                </span>
                <div className="standings-row__bar-wrap">
                  <div className="standings-row__bar" style={{ width: `${barPct}%`, background: safeColor }} />
                </div>
              </div>
            {isMobile && isSelected && !compareRider && (
              <div className="standings-row__mobile-card">
                <RiderStats rider={rider} />
              </div>
            )}
          </React.Fragment>
          );
        })}
      </div>
      </div>

      {!isMobile && (
        <div className={`stats-panel ${selectedRider ? 'stats-panel--open' : ''}`}>
          {!selectedRider ? (
            <div className="stats-panel__empty">
              <span className="stats-panel__empty-icon">↑</span>
              <p>Click a rider to view their stats</p>
            </div>
          ) : compareRider ? (
            <div className="compare-panel">
              <div className="compare-panel__header">
                <button className="compare-panel__close" onClick={clearCompare}>✕ Close comparison</button>
              </div>
              <div className="compare-panel__cols">
                {[selectedRider, compareRider].map((rider, side) => {
                  const color = getTeamColor(rider.team);
                  const safeColor = color === '#FFFFFF' ? 'rgba(255,255,255,0.8)' : color;
                  return (
                    <div key={rider.id} className="compare-col">
                      <div className="compare-col__header" style={{ borderColor: safeColor }}>
                        <span className="compare-col__num" style={{ color: safeColor }}>{rider.number}</span>
                        <div>
                          <div className="compare-col__name">{rider.name}</div>
                          <div className="compare-col__team" style={{ color: safeColor }}>{rider.team}</div>
                        </div>
                      </div>
                      {statRows.map(row => {
                        const valA = row.fn(selectedRider);
                        const valB = row.fn(compareRider);
                        const val   = side === 0 ? valA : valB;
                        const other = side === 0 ? valB : valA;
                        const isWinner = !row.text && (row.higher ? val > other : val < other);
                        const isLoser  = !row.text && (row.higher ? val < other : val > other);
                        return (
                          <div key={row.label} className={`compare-stat ${isWinner ? 'compare-stat--win' : ''} ${isLoser ? 'compare-stat--lose' : ''}`}>
                            <span className="compare-stat__label">{row.label}</span>
                            <span className="compare-stat__val">{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              className={`single-stats ${dragOver ? 'single-stats--dragover' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDropCompare}
            >
              <div className="single-stats__drop-hint">
                {dragOver ? '⚡ Drop to compare' : 'Drag another rider here to compare'}
              </div>
              <RiderStats rider={selectedRider} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

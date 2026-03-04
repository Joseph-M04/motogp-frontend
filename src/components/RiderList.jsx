import React, { useMemo, useState } from 'react';
import '../styles/RiderList.css';

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

function getConstructor(teamName = '') {
  const name = teamName.toLowerCase();
  if (name.includes('ducati') || name.includes('gresini') || name.includes('vr46')) return 'Ducati';
  if (name.includes('aprilia') || name.includes('trackhouse')) return 'Aprilia';
  if (name.includes('ktm') || name.includes('tech3')) return 'KTM';
  if (name.includes('yamaha') || name.includes('pramac')) return 'Yamaha';
  if (name.includes('honda') || name.includes('lcr') || name.includes('castrol')) return 'Honda';
  return 'Other';
}

function getConstructorColor(name) {
  const colors = {
    Ducati:  '#CC0000',
    Aprilia: '#551A8B',
    KTM:     '#FF6600',
    Yamaha:  '#003B8E',
    Honda:   '#CC0000',
    Other:   '#7b879a',
  };
  return colors[name] || colors.Other;
}

function formatName(fullName) {
  const parts = fullName.split(' ');
  if (parts.length > 1) return `${parts[0][0]}. ${parts[parts.length - 1]}`;
  return fullName;
}

function RiderList({ riders, selectedRider, onRiderSelect }) {
  const [tab, setTab] = useState('riders');

  const sortedRiders = useMemo(() => {
    return [...riders].sort((a, b) => (b.season_2026_points || 0) - (a.season_2026_points || 0));
  }, [riders]);

  const teams = useMemo(() => {
    const map = new Map();
    riders.forEach((rider) => {
      const team = rider.team || 'Unknown Team';
      const current = map.get(team) || { name: team, points: 0, color: getTeamColor(team) };
      current.points += rider.season_2026_points || 0;
      map.set(team, current);
    });
    return [...map.values()].sort((a, b) => b.points - a.points);
  }, [riders]);

  const constructors = useMemo(() => {
    const map = new Map();
    riders.forEach((rider) => {
      const name = getConstructor(rider.team);
      const current = map.get(name) || { name, points: 0, color: getConstructorColor(name) };
      current.points += rider.season_2026_points || 0;
      map.set(name, current);
    });
    return [...map.values()].sort((a, b) => b.points - a.points);
  }, [riders]);

  const baseRows = tab === 'riders'
    ? sortedRiders.map((rider) => ({
        id: rider.id,
        name: formatName(rider.name),
        points: rider.season_2026_points || 0,
        number: rider.number,
        color: getTeamColor(rider.team),
        clickable: true,
        rider,
      }))
    : (tab === 'teams' ? teams : constructors).map((item) => ({
        id: item.name,
        name: item.name,
        points: item.points,
        color: item.color,
        clickable: false,
      }));

  const maxPoints = Math.max(...baseRows.map((r) => r.points || 0), 1);
  const leaderPoints = baseRows[0]?.points || 0;

  return (
    <div className="rider-list">
      <div className="rider-list__header">
        <span className="rider-list__title">Championship</span>
        <span className="rider-list__season">2026</span>
      </div>

      <div className="rider-list__tabs">
        <button
          className={`rider-list__tab ${tab === 'riders' ? 'rider-list__tab--active' : ''}`}
          onClick={() => setTab('riders')}
        >
          Riders
        </button>
        <button
          className={`rider-list__tab ${tab === 'teams' ? 'rider-list__tab--active' : ''}`}
          onClick={() => setTab('teams')}
        >
          Teams
        </button>
        <button
          className={`rider-list__tab ${tab === 'constructors' ? 'rider-list__tab--active' : ''}`}
          onClick={() => setTab('constructors')}
        >
          Constructors
        </button>
      </div>

      <div className="rider-list__rows">
        {baseRows.map((row, index) => {
          const barPct = maxPoints > 0 ? (row.points / maxPoints) * 100 : 0;
          const gap = leaderPoints - row.points;
          const isActiveRider = row.clickable && selectedRider?.id === row.rider?.id;

          return (
            <div
              key={row.id}
              className={`rl-row ${isActiveRider ? 'rl-row--active' : ''} ${row.clickable ? 'rl-row--clickable' : 'rl-row--static'}`}
              onClick={row.clickable ? () => onRiderSelect(row.rider) : undefined}
            >
              <span className="rl-pos">{index + 1}</span>

              {row.clickable ? (
                <span
                  className="rl-num"
                  style={{
                    color: row.color === '#FFFFFF' ? 'rgba(255,255,255,0.85)' : row.color,
                    borderColor: row.color === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : `${row.color}55`,
                    background: 'transparent',
                  }}
                >
                  {row.number}
                </span>
              ) : (
                <span className="rl-dot" style={{ background: row.color }} />
              )}

              <div className="rl-info">
                <span className="rl-name">{row.name}</span>
                <div className="rl-bar-track">
                  <div
                    className="rl-bar-fill"
                    style={{ width: `${barPct}%`, background: row.color }}
                  />
                </div>
              </div>

              <span className="rl-pts">
                {row.points > 0
                  ? gap === 0
                    ? <span className="rl-pts--leader">{row.points}</span>
                    : <span className="rl-pts--gap">−{gap}</span>
                  : <span className="rl-pts--zero">—</span>
                }
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RiderList;
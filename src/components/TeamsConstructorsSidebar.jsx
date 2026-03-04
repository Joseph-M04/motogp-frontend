import React, { useMemo } from 'react';
import '../styles/TeamsConstructorsSidebar.css';

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
  return TEAM_COLORS[team] || '#7b879a';
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
    Ducati: '#CC0000',
    Aprilia: '#551A8B',
    KTM: '#FF6600',
    Yamaha: '#003B8E',
    Honda: '#e8e8e8',
    Other: '#7b879a',
  };
  return colors[name] || colors.Other;
}

function buildStandings(items) {
  const max = Math.max(...items.map((item) => item.points), 1);
  return items.map((item, index) => ({
    ...item,
    pos: index + 1,
    barPct: (item.points / max) * 100,
  }));
}

function TeamsConstructorsSidebar({ riders }) {
  const teams = useMemo(() => {
    const map = new Map();
    riders.forEach((rider) => {
      const team = rider.team || 'Unknown Team';
      const current = map.get(team) || { name: team, points: 0, color: getTeamColor(team) };
      current.points += rider.season_2026_points || 0;
      map.set(team, current);
    });

    return buildStandings([...map.values()].sort((a, b) => b.points - a.points));
  }, [riders]);

  const constructors = useMemo(() => {
    const map = new Map();
    riders.forEach((rider) => {
      const name = getConstructor(rider.team);
      const current = map.get(name) || { name, points: 0, color: getConstructorColor(name) };
      current.points += rider.season_2026_points || 0;
      map.set(name, current);
    });

    return buildStandings([...map.values()].sort((a, b) => b.points - a.points));
  }, [riders]);

  return (
    <div className="tc-sidebar">
      <div className="tc-block">
        <div className="tc-header">
          <span className="tc-title">Teams</span>
          <span className="tc-season">2026</span>
        </div>
        <div className="tc-rows">
          {teams.map((team) => (
            <div key={team.name} className="tc-row">
              <span className="tc-pos">{team.pos}</span>
              <div className="tc-main">
                <span className="tc-name">{team.name}</span>
                <div className="tc-bar-track">
                  <div className="tc-bar-fill" style={{ width: `${team.barPct}%`, background: team.color }} />
                </div>
              </div>
              <span className="tc-pts">{team.points}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="tc-block">
        <div className="tc-header">
          <span className="tc-title">Constructors</span>
          <span className="tc-season">2026</span>
        </div>
        <div className="tc-rows">
          {constructors.map((constructor) => (
            <div key={constructor.name} className="tc-row">
              <span className="tc-pos">{constructor.pos}</span>
              <div className="tc-main">
                <span className="tc-name">{constructor.name}</span>
                <div className="tc-bar-track">
                  <div className="tc-bar-fill" style={{ width: `${constructor.barPct}%`, background: constructor.color }} />
                </div>
              </div>
              <span className="tc-pts">{constructor.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeamsConstructorsSidebar;

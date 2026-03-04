import React, { useState, useEffect } from 'react';
import '../styles/RiderStats.css';
import { apiUrl } from '../api';
import { fetchOfficialCareerStats } from '../data/officialCareerStats';

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

function getNumberStyle(team) {
  const teamColor = TEAM_COLORS[team] || '#555';
  const isLight = teamColor === '#e8e8e8';
  return {
    color: isLight ? '#c8c8c8' : teamColor,
    borderColor: isLight ? 'rgba(255,255,255,0.2)' : `${teamColor}66`,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  };
}

function RiderStats({ rider }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classBreakdown, setClassBreakdown] = useState(null);

  useEffect(() => {
    if (!rider) {
      setStats(null);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      try {
        const [response, official] = await Promise.all([
          fetch(apiUrl(`/api/riders/${rider.id}`)),
          fetchOfficialCareerStats(rider.name).catch(() => null),
        ]);

        const data = await response.json();
        if (official?.careerStats) {
          data.careerStats = {
            ...data.careerStats,
            ...official.careerStats,
          };
          setClassBreakdown(official.classBreakdown || null);
        } else {
          setClassBreakdown(null);
        }

        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setClassBreakdown(null);
        setLoading(false);
      }
    };

    fetchStats();
  }, [rider]);

  if (!stats || loading) {
    return (
      <div className="stats-container loading">
        <div className="skeleton skeleton--header" />
        <div className="stats-grid">
          <div className="stats-section">
            <div className="skeleton skeleton--title" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line" />
          </div>
          <div className="stats-section">
            <div className="skeleton skeleton--title" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line" />
          </div>
        </div>
      </div>
    );
  }

  const seasonStats = stats.seasonStats;
  const careerStats = stats.careerStats;

  return (
    <div className="stats-container">
      <div className="rider-header">
        <div className="rider-number-badge" style={getNumberStyle(stats.team)}>
          {stats.number}
        </div>
        <div className="rider-details">
          <h1>{stats.name}</h1>
          <div className="rider-team">{stats.team}</div>
          <div className="rider-country">{stats.country}</div>
        </div>
      </div>

      <div className="stats-grid">
        {seasonStats && (
          <div className="stats-section">
            <h2>2026 Season Stats</h2>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Points</span>
                <span className="stat-value">{seasonStats.total_points || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Wins</span>
                <span className="stat-value">{seasonStats.wins || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Pole Positions</span>
                <span className="stat-value">{seasonStats.poles || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Podiums</span>
                <span className="stat-value">{seasonStats.podiums || 0}</span>
              </div>
            </div>
          </div>
        )}

        {careerStats && (
          <div className="stats-section">
            <h2>Career Statistics</h2>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Wins</span>
                <span className="stat-value">{careerStats.wins || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Pole Positions</span>
                <span className="stat-value">{careerStats.poles || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Podiums</span>
                <span className="stat-value">{careerStats.podiums || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Fastest Laps</span>
                <span className="stat-value">{careerStats.fastest_laps || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Races Completed</span>
                <span className="stat-value">{careerStats.races_completed || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">World Titles</span>
                <span className="stat-value">{careerStats.titles || 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {classBreakdown && (
        <div className="stats-section stats-section--full">
          <h2>Career Breakdown By Class</h2>
          <div className="class-breakdown-grid">
            {[
              ['motogp', 'MotoGP'],
              ['moto2', 'Moto2'],
              ['moto3', 'Moto3 / 125cc'],
            ].map(([key, label]) => {
              const c = classBreakdown[key];
              return (
                <div key={key} className="class-card">
                  <div className="class-card__title">{label}</div>
                  <div className="class-card__row"><span>Wins</span><strong>{c?.wins || 0}</strong></div>
                  <div className="class-card__row"><span>Podiums</span><strong>{c?.podiums || 0}</strong></div>
                  <div className="class-card__row"><span>Poles</span><strong>{c?.poles || 0}</strong></div>
                  <div className="class-card__row"><span>Fastest Laps</span><strong>{c?.fastest_laps || 0}</strong></div>
                  <div className="class-card__row"><span>Races</span><strong>{c?.races || 0}</strong></div>
                  <div className="class-card__row"><span>Titles</span><strong>{c?.titles || 0}</strong></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default RiderStats;

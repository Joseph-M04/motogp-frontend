import React, { useState, useEffect } from 'react';
import '../styles/RiderStats.css';

function RiderStats({ rider }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rider) {
      setStats(null);
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/riders/${rider.id}`);
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setLoading(false);
      }
    };

    fetchStats();
  }, [rider]);

  if (!stats || loading) {
    return <div className="stats-container loading">Loading stats</div>;
  }

  const seasonStats = stats.seasonStats;
  const careerStats = stats.careerStats;

  const teamColors = {
    'Ducati Lenovo': '#CE161E',
    'Gresini Racing': '#6BA3E5',
    'Aprilia Racing': '#551A8B',
    'Red Bull KTM Factory': '#FF6600',
    'Red Bull KTM Tech3': '#FF6600',
    'Monster Energy Yamaha': '#004B93',
    'Pertamina Enduro VR46': '#DAFE05',
    'Prima Pramac Racing': '#663399',
    'Trackhouse Racing': '#0077C8',
    'Castrol Honda Racing': '#CC0000',
    'LCR Honda': '#FF0000',
    'LCR Honda Idemitsu': '#FF0000',
  };

  return (
    <div className="stats-container">
      <div className="rider-header">
        <div 
          className="rider-number-badge"
          style={{
            backgroundColor: teamColors[stats.team] || '#daa520',
            color: ['#FFFF00', '#00AA00', '#DAFE05'].includes(teamColors[stats.team]) ? '#000000' : '#FFFFFF',
          }}
        >
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
    </div>
  );
}

export default RiderStats;
import React, { useState, useEffect } from 'react';
import '../styles/RiderStats.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function RiderStats({ rider }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/riders/${rider.id}`);
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setLoading(false);
      }
    };

    fetchStats();
  }, [rider.id]);

  if (loading) return <div className="stats-container loading">Loading stats...</div>;
  if (!stats) return <div className="stats-container error">Failed to load stats</div>;

  const { careerStats, seasonStats } = stats;

  return (
    <div className="stats-container">
      <div className="rider-header">
        <div className="rider-number-large">{rider.number}</div>
        <div className="rider-details">
          <h1>{rider.name}</h1>
          <p className="rider-team">{rider.team}</p>
          <p className="rider-country">{rider.country}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stats-section">
          <h2>2024 Season Stats</h2>
          {seasonStats ? (
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
                <span className="stat-label">Podiums</span>
                <span className="stat-value">{seasonStats.podiums || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Pole Positions</span>
                <span className="stat-value">{seasonStats.poles || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Fastest Laps</span>
                <span className="stat-value">{seasonStats.fastest_laps || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Races Completed</span>
                <span className="stat-value">{seasonStats.races_completed || 0}</span>
              </div>
            </div>
          ) : (
            <p>No season stats available</p>
          )}
        </div>

        <div className="stats-section">
          <h2>Career Stats</h2>
          {careerStats ? (
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Total Points</span>
                <span className="stat-value">{careerStats.total_points || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Wins</span>
                <span className="stat-value">{careerStats.wins || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Podiums</span>
                <span className="stat-value">{careerStats.podiums || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Pole Positions</span>
                <span className="stat-value">{careerStats.poles || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Fastest Laps</span>
                <span className="stat-value">{careerStats.fastest_laps || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Races Completed</span>
                <span className="stat-value">{careerStats.races_completed || 0}</span>
              </div>
            </div>
          ) : (
            <p>No career stats available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RiderStats;

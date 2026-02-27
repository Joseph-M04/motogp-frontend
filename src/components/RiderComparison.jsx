import React, { useState, useEffect } from 'react';
import '../styles/RiderComparison.css';

function RiderComparison({ rider1, rider2, onClearComparison }) {
  const [stats1, setStats1] = useState(null);
  const [stats2, setStats2] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch(`http://localhost:3001/api/riders/${rider1.id}`),
          fetch(`http://localhost:3001/api/riders/${rider2.id}`)
        ]);
        const data1 = await res1.json();
        const data2 = await res2.json();
        setStats1(data1);
        setStats2(data2);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching comparison stats:', err);
        setLoading(false);
      }
    };

    fetchStats();
  }, [rider1, rider2]);

  if (!stats1 || !stats2 || loading) {
    return <div className="comparison-container loading">Loading comparison...</div>;
  }

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

  const getWinner = (val1, val2) => {
    if (val1 > val2) return 1;
    if (val2 > val1) return 2;
    return 0;
  };

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <h2>Rider Comparison</h2>
        <button className="close-btn" onClick={onClearComparison}>×</button>
      </div>

      <div className="comparison-riders">
        <div className="rider-col">
          <div className="rider-card">
            <div className="rider-number" style={{
              backgroundColor: teamColors[stats1.team] || '#daa520',
              color: ['#FFFF00', '#00AA00', '#DAFE05'].includes(teamColors[stats1.team]) ? '#000000' : '#FFFFFF',
            }}>
              {stats1.number}
            </div>
            <h3>{stats1.name}</h3>
            <p className="team">{stats1.team}</p>
          </div>
        </div>

        <div className="vs">VS</div>

        <div className="rider-col">
          <div className="rider-card">
            <div className="rider-number" style={{
              backgroundColor: teamColors[stats2.team] || '#daa520',
              color: ['#FFFF00', '#00AA00', '#DAFE05'].includes(teamColors[stats2.team]) ? '#000000' : '#FFFFFF',
            }}>
              {stats2.number}
            </div>
            <h3>{stats2.name}</h3>
            <p className="team">{stats2.team}</p>
          </div>
        </div>
      </div>

      <div className="comparison-stats">
        <div className="stat-row">
          <div className="stat-value">{stats1.seasonStats?.total_points || 0}</div>
          <div className="stat-label">Season Points</div>
          <div className="stat-value">{stats2.seasonStats?.total_points || 0}</div>
        </div>

        <div className="stat-row">
          <div className={`stat-value ${getWinner(stats1.careerStats?.wins || 0, stats2.careerStats?.wins || 0) === 1 ? 'winner' : ''}`}>
            {stats1.careerStats?.wins || 0}
          </div>
          <div className="stat-label">Career Wins</div>
          <div className={`stat-value ${getWinner(stats1.careerStats?.wins || 0, stats2.careerStats?.wins || 0) === 2 ? 'winner' : ''}`}>
            {stats2.careerStats?.wins || 0}
          </div>
        </div>

        <div className="stat-row">
          <div className={`stat-value ${getWinner(stats1.careerStats?.poles || 0, stats2.careerStats?.poles || 0) === 1 ? 'winner' : ''}`}>
            {stats1.careerStats?.poles || 0}
          </div>
          <div className="stat-label">Pole Positions</div>
          <div className={`stat-value ${getWinner(stats1.careerStats?.poles || 0, stats2.careerStats?.poles || 0) === 2 ? 'winner' : ''}`}>
            {stats2.careerStats?.poles || 0}
          </div>
        </div>

        <div className="stat-row">
          <div className={`stat-value ${getWinner(stats1.careerStats?.podiums || 0, stats2.careerStats?.podiums || 0) === 1 ? 'winner' : ''}`}>
            {stats1.careerStats?.podiums || 0}
          </div>
          <div className="stat-label">Podiums</div>
          <div className={`stat-value ${getWinner(stats1.careerStats?.podiums || 0, stats2.careerStats?.podiums || 0) === 2 ? 'winner' : ''}`}>
            {stats2.careerStats?.podiums || 0}
          </div>
        </div>

        <div className="stat-row">
          <div className={`stat-value ${getWinner(stats1.careerStats?.titles || 0, stats2.careerStats?.titles || 0) === 1 ? 'winner' : ''}`}>
            {stats1.careerStats?.titles || 0}
          </div>
          <div className="stat-label">World Titles</div>
          <div className={`stat-value ${getWinner(stats1.careerStats?.titles || 0, stats2.careerStats?.titles || 0) === 2 ? 'winner' : ''}`}>
            {stats2.careerStats?.titles || 0}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiderComparison;
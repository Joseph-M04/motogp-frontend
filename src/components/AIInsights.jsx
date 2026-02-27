import React, { useState, useEffect } from 'react';
import '../styles/AIInsights.css';

function AIInsights({ rider }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!rider) {
      setInsights(null);
      setLoading(false);
      return;
    }

    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First fetch full rider stats
        const statsResponse = await fetch(`http://localhost:3001/api/riders/${rider.id}`);
        const fullRider = await statsResponse.json();

        const response = await fetch('http://localhost:3001/api/ai-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            riderId: rider.id,
            riderName: rider.name,
            riderNumber: rider.number,
            team: rider.team,
            country: rider.country,
            totalPoints: fullRider.careerStats?.total_points || rider.total_points || 0,
            wins: fullRider.careerStats?.wins || 0,
            poles: fullRider.careerStats?.poles || 0,
            podiums: fullRider.careerStats?.podiums || 0,
          })
        });

        if (!response.ok) throw new Error('Failed to fetch insights');
        
        const data = await response.json();
        setInsights(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [rider]);

  if (!rider) return null;

  return (
    <div className="ai-insights-container">
      <h2>AI Insights</h2>
      
      {loading && <div className="loading">Loading insights...</div>}
      {error && <div className="error">Error: {error}</div>}
      
      {insights && (
        <>
          <div className="insight-section bio">
            <h3>Bio</h3>
            <p>{insights.bio}</p>
          </div>

          <div className="insight-section analysis">
            <h3>Performance Analysis</h3>
            <div className="strengths">
              <h4>Strengths</h4>
              <ul>
                {insights.analysis.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="weaknesses">
              <h4>Areas to Improve</h4>
              <ul>
                {insights.analysis.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="insight-section prediction">
            <h3>Next Race Prediction</h3>
            <p className="prediction-text">{insights.prediction}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default AIInsights;
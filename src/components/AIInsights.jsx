import React, { useMemo } from 'react';
import '../styles/AIInsights.css';
import { getRiderOutlook } from '../data/riderOutlook2026';

function AIInsights({ rider }) {
  const insights = useMemo(() => getRiderOutlook(rider), [rider]);

  if (!rider) return null;

  return (
    <div className="ai-insights-container">
      <h2>Race Outlook</h2>

      <div className="insight-section bio">
        <h3>Season Context</h3>
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
          <h4>Risk Factors</h4>
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

      <div className="insight-section basis">
        <h3>Data Basis</h3>
        <ul className="basis-list">
          {insights.dataBasis.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AIInsights;

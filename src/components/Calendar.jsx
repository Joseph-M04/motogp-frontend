import React, { useState } from 'react';
import '../styles/Calendar.css';

function Calendar({ races, selectedRider }) {
  const [expandedRace, setExpandedRace] = useState(null);

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRaceStatus = (raceDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const race = new Date(raceDate);
    race.setHours(0, 0, 0, 0);

    if (race < today) return 'completed';
    if (race.getTime() === today.getTime()) return 'current';
    return 'upcoming';
  };

  return (
    <div className="calendar">
      <div className="races-container">
        {races.map((race) => {
          const status = getRaceStatus(race.race_date);
          const isExpanded = expandedRace === race.id;

          return (
            <div
              key={race.id}
              className={`race-card ${status} ${isExpanded ? 'expanded' : ''}`}
              onClick={() => setExpandedRace(isExpanded ? null : race.id)}
              onMouseEnter={() => !isExpanded && setExpandedRace(null)}
            >
              <div className="race-header">
                <span className="race-round">Round {race.round}</span>
                <span className="race-name">{race.name}</span>
                <span className="race-date">{formatDate(race.race_date)}</span>
              </div>

              {isExpanded && (
                <div className="race-details">
                  <div className="circuit-info">
                    <p><strong>Circuit:</strong> {race.circuit_name}, {race.circuit_country}</p>
                    <p><strong>Length:</strong> {race.circuit_length} km</p>
                  </div>

                  {status === 'completed' ? (
                    <div className="race-results">
                      <h4>Results</h4>
                      <p>Click on race for detailed results</p>
                    </div>
                  ) : (
                    <div className="circuit-history">
                      <h4>Circuit History (Last 3 Years)</h4>
                      <p>Historical data about past races at this circuit</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;

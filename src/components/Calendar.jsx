import React, { useState, useEffect } from 'react';
import '../styles/Calendar.css';

function Calendar() {
  const [races, setRaces] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [racesRes, circuitsRes] = await Promise.all([
          fetch('http://localhost:3001/api/races'),
          fetch('http://localhost:3001/api/circuits')
        ]);
        const racesData = await racesRes.json();
        const circuitsData = await circuitsRes.json();
        setRaces(racesData);
        setCircuits(circuitsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="calendar-loading">Loading calendar...</div>;
  }

  return (
    <div className="calendar-container">
      <h2>2026 Calendar</h2>
      <div className="races-grid">
        {races.map((race) => {
          const circuit = circuits.find(c => c.id === race.circuit_id);
          return (
            <div 
              key={race.id} 
              className="race-card"
              onClick={() => setSelectedRace(race)}
            >
              <div className="race-card-header">
                <h3>{race.name}</h3>
                <p className="race-date">{new Date(race.race_date).toLocaleDateString()}</p>
              </div>
              {circuit && (
                <div className="race-card-info">
                  <p className="circuit-name">{circuit.city}, {circuit.country}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedRace && (
        <div className="race-modal-overlay" onClick={() => setSelectedRace(null)}>
          <div className="race-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedRace(null)}>×</button>
            <h2>{selectedRace.name}</h2>
            <p>{new Date(selectedRace.race_date).toLocaleDateString()}</p>
            {circuits.find(c => c.id === selectedRace.circuit_id) && (
              <div className="modal-content">
                <p><strong>Circuit:</strong> {circuits.find(c => c.id === selectedRace.circuit_id).name}</p>
                <p><strong>Track Length:</strong> {circuits.find(c => c.id === selectedRace.circuit_id).track_length_km} km</p>
                <p><strong>Turns:</strong> {circuits.find(c => c.id === selectedRace.circuit_id).turns}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
import React, { useState, useEffect } from 'react';
import RiderList from './components/RiderList';
import RiderStats from './components/RiderStats';
import Calendar from './components/Calendar';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [riders, setRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/riders`);
        const data = await response.json();
        setRiders(data);
      } catch (err) {
        console.error('Error fetching riders:', err);
      }
    };

    fetchRiders();
  }, []);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await fetch(`${API_URL}/api/races?season=2024`);
        const data = await response.json();
        setRaces(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching races:', err);
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  const handleRiderClick = (rider) => {
    setSelectedRider(rider);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>MotoGP Hub</h1>
      </header>

      <div className="app-container">
        <div className="sidebar">
          <RiderList 
            riders={riders}
            selectedRider={selectedRider}
            onRiderSelect={handleRiderClick}
          />
        </div>

        <div className="main-content">
          {selectedRider ? (
            <RiderStats rider={selectedRider} />
          ) : (
            <div className="placeholder">
              <p>Select a rider to view stats</p>
            </div>
          )}
        </div>
      </div>

      <div className="calendar-section">
        <h2>2024 Calendar</h2>
        {loading ? (
          <p>Loading calendar...</p>
        ) : (
          <Calendar races={races} selectedRider={selectedRider} />
        )}
      </div>
    </div>
  );
}

export default App;

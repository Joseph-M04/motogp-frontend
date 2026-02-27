import React, { useState, useEffect } from 'react';
import './App.css';
import RiderList from './components/RiderList';
import RiderStats from './components/RiderStats';
import AIInsights from './components/AIInsights';
import ChampionshipStandings from './components/ChampionshipStandings';

function App() {
  const [riders, setRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/riders')
      .then(res => res.json())
      .then(data => setRiders(data))
      .catch(err => console.error('Error fetching riders:', err));
  }, []);

  const handleRiderClick = (rider) => {
    setSelectedRider(null);
    setTimeout(() => setSelectedRider(rider), 50);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 onClick={() => setSelectedRider(null)}>Grid Report</h1>
      </header>
      <div className="app-container">
        <aside className="sidebar">
          <RiderList riders={riders} selectedRider={selectedRider} onRiderSelect={handleRiderClick} />
        </aside>
        <main className="main-content">
          {selectedRider ? (
            <div className="content-wrapper">
              <div className="stats-column">
                <RiderStats key={selectedRider.id} rider={selectedRider} />
              </div>
              <div className="insights-column">
                <AIInsights key={selectedRider.id} rider={selectedRider} />
              </div>
            </div>
          ) : (
            <ChampionshipStandings riders={riders} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
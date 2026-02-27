import React, { useState, useEffect } from "react";
import "./App.css";
import RiderList from "./components/RiderList";
import RiderStats from "./components/RiderStats";
import AIInsights from "./components/AIInsights";
import RiderComparison from "./components/RiderComparison";
import Calendar from "./components/Calendar";

function App() {
  const [riders, setRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);
  const [comparisonRider, setComparisonRider] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/riders")
      .then((res) => res.json())
      .then((data) => setRiders(data))
      .catch((err) => console.error("Error fetching riders:", err));
  }, []);

  const handleRiderClick = (rider) => {
    setSelectedRider(null);
    setTimeout(() => setSelectedRider(rider), 50);
  };

  const handleComparisonRiderClick = (rider) => {
    setComparisonRider(null);
    setTimeout(() => setComparisonRider(rider), 50);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1
          onClick={() => {
            setSelectedRider(null);
            setComparisonRider(null);
          }}
        >
          Grid Report
        </h1>
      </header>
      <div className="app-container">
        <aside className="sidebar">
          <RiderList
            riders={riders}
            selectedRider={selectedRider}
            onRiderSelect={handleRiderClick}
          />
        </aside>
        <main className="main-content">
          {selectedRider ? (
            <div className="main-scroll">
              <div className="content-wrapper">
                <div className="stats-column">
                  <RiderStats key={selectedRider.id} rider={selectedRider} />
                </div>
                <div className="insights-column">
                  {comparisonRider ? (
                    <RiderComparison
                      rider1={selectedRider}
                      rider2={comparisonRider}
                      onClearComparison={() => setComparisonRider(null)}
                    />
                  ) : (
                    <div className="empty-comparison">
                      <div className="empty-message">
                        <p>Click to view a rider or drag 2 riders to compare</p>
                      </div>
                      <RiderList
                        riders={riders}
                        selectedRider={comparisonRider}
                        onRiderSelect={handleComparisonRiderClick}
                        isComparisonMode={true}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="main-scroll">
              <Calendar />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import '../styles/RiderList.css';

function RiderList({ riders, selectedRider, onRiderSelect }) {
  const [hoveredRider, setHoveredRider] = useState(null);

  return (
    <div className="rider-list">
      <h2>Riders</h2>
      <div className="riders-container">
        {riders.map((rider) => (
          <div
            key={rider.id}
            className={`rider-item ${selectedRider?.id === rider.id ? 'active' : ''}`}
            onClick={() => onRiderSelect(rider)}
            onMouseEnter={() => setHoveredRider(rider.id)}
            onMouseLeave={() => setHoveredRider(null)}
          >
            <div className="rider-info">
              <span className="rider-number">{rider.number}</span>
              <span className="rider-name">{rider.name}</span>
            </div>

            {hoveredRider === rider.id && (
              <div className="rider-image-popup">
                {rider.image_url ? (
                  <img src={rider.image_url} alt={rider.name} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RiderList;

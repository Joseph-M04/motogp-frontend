import React, { useState } from 'react';
import '../styles/RiderList.css';

function RiderList({ riders, selectedRider, onRiderSelect }) {
  const maxPoints = Math.max(...riders.map(r => r.season_2025_points || 0), 1);
  const leaderPoints = riders[0]?.season_2025_points || 0;

  const formatName = (fullName) => {
    const parts = fullName.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}. ${parts[parts.length - 1]}`;
    }
    return fullName;
  };

  return (
    <div className="rider-list">
      <h2>Riders</h2>
      <div className="riders-leaderboard">
        {riders.map((rider, index) => {
          const points = rider.season_2025_points || 0;
          const percentage = (points / maxPoints) * 100;
          const pointsBack = leaderPoints - points;
          const barWidth = Math.max(percentage, index >= 9 ? 40 : percentage);
          
          return (
            <div
              key={rider.id}
              className={`leaderboard-row ${selectedRider?.id === rider.id ? 'active' : ''}`}
              onClick={() => onRiderSelect(rider)}
            >
              <div className="position">{index + 1}</div>
              <div className="rider-info">
                <div className="number-badge" style={{
                  backgroundColor: rider.team === 'Ducati Lenovo' ? '#CE161E' :
                                 rider.team === 'Gresini Racing' ? '#6BA3E5' :
                                 rider.team === 'Aprilia Racing' ? '#551A8B' :
                                 rider.team === 'Red Bull KTM Factory' ? '#FF6600' :
                                 rider.team === 'Red Bull KTM Tech3' ? '#FF6600' :
                                 rider.team === 'Monster Energy Yamaha' ? '#004B93' :
                                 rider.team === 'Pertamina Enduro VR46' ? '#DAFE05' :
                                 rider.team === 'Prima Pramac Racing' ? '#663399' :
                                 rider.team === 'Trackhouse Racing' ? '#0077C8' :
                                 rider.team === 'Castrol Honda Racing' ? '#CC0000' :
                                 rider.team === 'LCR Honda' ? '#FF0000' :
                                 rider.team === 'LCR Honda Idemitsu' ? '#FF0000' : '#daa520',
                  color: ['#FFFF00', '#00AA00', '#DAFE05'].includes(
                    rider.team === 'Ducati Lenovo' ? '#CE161E' :
                    rider.team === 'Gresini Racing' ? '#6BA3E5' :
                    rider.team === 'Aprilia Racing' ? '#551A8B' :
                    rider.team === 'Red Bull KTM Factory' ? '#FF6600' :
                    rider.team === 'Red Bull KTM Tech3' ? '#FF6600' :
                    rider.team === 'Monster Energy Yamaha' ? '#004B93' :
                    rider.team === 'Pertamina Enduro VR46' ? '#DAFE05' :
                    rider.team === 'Prima Pramac Racing' ? '#663399' :
                    rider.team === 'Trackhouse Racing' ? '#0077C8' :
                    rider.team === 'Castrol Honda Racing' ? '#CC0000' :
                    rider.team === 'LCR Honda' ? '#FF0000' :
                    rider.team === 'LCR Honda Idemitsu' ? '#FF0000' : '#daa520'
                  ) ? '#000000' : '#FFFFFF'
                }}>
                  {rider.number}
                </div>
                <span className="name" title={rider.name}>{formatName(rider.name)}</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar" 
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: rider.team === 'Ducati Lenovo' ? '#CE161E' :
                                    rider.team === 'Gresini Racing' ? '#6BA3E5' :
                                    rider.team === 'Aprilia Racing' ? '#551A8B' :
                                    rider.team === 'Red Bull KTM Factory' ? '#FF6600' :
                                    rider.team === 'Red Bull KTM Tech3' ? '#FF6600' :
                                    rider.team === 'Monster Energy Yamaha' ? '#004B93' :
                                    rider.team === 'Pertamina Enduro VR46' ? '#DAFE05' :
                                    rider.team === 'Prima Pramac Racing' ? '#663399' :
                                    rider.team === 'Trackhouse Racing' ? '#0077C8' :
                                    rider.team === 'Castrol Honda Racing' ? '#CC0000' :
                                    rider.team === 'LCR Honda' ? '#FF0000' :
                                    rider.team === 'LCR Honda Idemitsu' ? '#FF0000' : '#daa520'
                  }}
                >
                  <span className="gap-text">{pointsBack > 0 ? `-${pointsBack}` : `${leaderPoints}`}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RiderList;
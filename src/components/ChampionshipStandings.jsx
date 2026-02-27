import React, { useState, useEffect } from 'react';
import '../styles/ChampionshipStandings.css';

function ChampionshipStandings({ riders }) {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    if (riders && riders.length > 0) {
      const sorted = [...riders].sort((a, b) => (b.season_2025_points || 0) - (a.season_2025_points || 0));
      setStandings(sorted);
    }
  }, [riders]);

  return (
    <div className="championship-standings">
      <h2>2025 Championship Standings</h2>
      <div className="standings-table">
        <div className="standings-header">
          <div className="col-position">POS</div>
          <div className="col-number">NO.</div>
          <div className="col-rider">RIDER</div>
          <div className="col-points">POINTS</div>
        </div>
        {standings.map((rider, index) => (
          <div key={rider.id} className="standings-row">
            <div className="col-position">{index + 1}</div>
            <div className="col-number" style={{
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
            <div className="col-rider">{rider.name}</div>
            <div className="col-points">{rider.season_2025_points || 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChampionshipStandings;
import React, { useState, useEffect } from 'react';
import '../styles/Calendar.css';

const FLAGS = {
  'Thailand': '🇹🇭', 'Brazil': '🇧🇷', 'USA': '🇺🇸', 'Qatar': '🇶🇦',
  'Spain': '🇪🇸', 'France': '🇫🇷', 'Italy': '🇮🇹', 'Hungary': '🇭🇺',
  'Czech Republic': '🇨🇿', 'Netherlands': '🇳🇱', 'Germany': '🇩🇪',
  'UK': '🇬🇧', 'San Marino': '🇸🇲', 'Austria': '🇦🇹', 'Japan': '🇯🇵',
  'Indonesia': '🇮🇩', 'Australia': '🇦🇺', 'Malaysia': '🇲🇾', 'Portugal': '🇵🇹',
};

// ⚠️ YOUR CUSTOM PHOTOS — DO NOT OVERWRITE
const CIRCUIT_PHOTOS = {
  'Chang International Circuit':                 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80',
  'Autodromo Internacional de Goiania':          'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Circuit of the Americas':                     'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=600&q=80',
  'Lusail International Circuit':                'https://images.unsplash.com/photo-1669815007479-494b3b51c2c3?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Circuito de Jerez':                           'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80',
  'Circuit Bugatti':                             'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
  'Circuit de Barcelona-Catalunya':              'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80',
  'Autodromo Internazionale del Mugello':        'https://images.unsplash.com/photo-1528114039593-4366cc08227d?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Balaton Park Circuit':                        'https://images.unsplash.com/photo-1551867633-194f125bddfa?w=600&q=80',
  'Automotodrom Brno':                           'https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=600&q=80',
  'TT Circuit Assen':                            'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=600&q=80',
  'Sachsenring':                                 'https://images.unsplash.com/photo-1641823026503-2f35526d623d?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Silverstone Circuit':                         'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=600&q=80',
  'MotorLand Aragon':                            'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80',
  'Misano World Circuit Marco Simoncelli':       'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=600&q=80',
  'Red Bull Ring':                               'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80',
  'Mobility Resort Motegi':                      'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Mandalika International Street Circuit':      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
  'Phillip Island Grand Prix Circuit':           'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80',
  'Sepang International Circuit':                'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80',
  'Autodromo Internacional do Algarve':          'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80',
  'Circuit Ricardo Tormo':                       'https://plus.unsplash.com/premium_photo-1697729423504-70c4c9d87033?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

// ⚠️ YOUR CUSTOM HERO PHOTOS — DO NOT OVERWRITE
const HERO_PHOTOS = {
  'Chang International Circuit':                 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1400&q=90',
  'Autodromo Internacional de Goiania':          'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg/800px-Christ_the_Redeemer_-_Cristo_Redentor.jpg',
  'Circuit of the Americas':                     'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=1400&q=90',
  'Lusail International Circuit':                'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Doha_Qatar_Jan_2020.jpg/1280px-Doha_Qatar_Jan_2020.jpg',
  'Circuito de Jerez':                           'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1400&q=90',
  'Circuit Bugatti':                             'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&q=90',
  'Circuit de Barcelona-Catalunya':              'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1400&q=90',
  'Autodromo Internazionale del Mugello':        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Firenze_-_Basilica_di_Santa_Maria_del_Fiore_%28Duomo%29.jpg/1280px-Firenze_-_Basilica_di_Santa_Maria_del_Fiore_%28Duomo%29.jpg',
  'Balaton Park Circuit':                        'https://images.unsplash.com/photo-1551867633-194f125bddfa?w=1400&q=90',
  'Automotodrom Brno':                           'https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=1400&q=90',
  'TT Circuit Assen':                            'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1400&q=90',
  'Sachsenring':                                 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Schloss_Neuschwanstein_2013.jpg/1280px-Schloss_Neuschwanstein_2013.jpg',
  'Silverstone Circuit':                         'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=1400&q=90',
  'MotorLand Aragon':                            'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1400&q=90',
  'Misano World Circuit Marco Simoncelli':       'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=1400&q=90',
  'Red Bull Ring':                               'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1400&q=90',
  'Mobility Resort Motegi':                      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&q=90',
  'Mandalika International Street Circuit':      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1400&q=90',
  'Phillip Island Grand Prix Circuit':           'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1400&q=90',
  'Sepang International Circuit':                'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1400&q=90',
  'Autodromo Internacional do Algarve':          'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1400&q=90',
  'Circuit Ricardo Tormo':                       'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ciudad_de_las_Artes_y_las_Ciencias_%28Valencia%29.jpg/1280px-Ciudad_de_las_Artes_y_las_Ciencias_%28Valencia%29.jpg',
};

const SESSIONS = ['FP1', 'Practice', 'Q1', 'Q2', 'Sprint', 'GP'];

const ALL_RIDERS = [
  { number: 5,  name: 'Johann Zarco',          short: 'ZAR', team: 'LCR Honda',                  teamColor: '#CC0000' },
  { number: 7,  name: 'Toprak Razgatlioglu',   short: 'TOP', team: 'Prima Pramac Racing',         teamColor: '#CC0000' },
  { number: 10, name: 'Luca Marini',            short: 'MAR', team: 'Castrol Honda Racing',        teamColor: '#CC0000' },
  { number: 11, name: 'Diogo Moreira',          short: 'MOR', team: 'LCR Honda Idemitsu',          teamColor: '#CC0000' },
  { number: 12, name: 'Maverick Viñales',       short: 'VIN', team: 'Red Bull KTM Tech3',          teamColor: '#FF6600' },
  { number: 20, name: 'Fabio Quartararo',       short: 'QUA', team: 'Monster Energy Yamaha',       teamColor: '#0057A8' },
  { number: 21, name: 'Franco Morbidelli',      short: 'MOR', team: 'Pertamina Enduro VR46',       teamColor: '#FFD700' },
  { number: 23, name: 'Enea Bastianini',        short: 'BAS', team: 'Red Bull KTM Tech3',          teamColor: '#FF6600' },
  { number: 25, name: 'Raul Fernandez',         short: 'RFE', team: 'Trackhouse Racing',           teamColor: '#006EFF' },
  { number: 33, name: 'Brad Binder',            short: 'BIN', team: 'Red Bull KTM Factory',        teamColor: '#FF6600' },
  { number: 36, name: 'Joan Mir',               short: 'MIR', team: 'Castrol Honda Racing',        teamColor: '#CC0000' },
  { number: 37, name: 'Pedro Acosta',           short: 'ACO', team: 'Red Bull KTM Factory',        teamColor: '#FF6600' },
  { number: 42, name: 'Alex Rins',              short: 'RIN', team: 'Monster Energy Yamaha',       teamColor: '#0057A8' },
  { number: 43, name: 'Jack Miller',            short: 'MIL', team: 'Prima Pramac Racing',         teamColor: '#CC0000' },
  { number: 49, name: 'Fabio Di Giannantonio',  short: 'DIG', team: 'Pertamina Enduro VR46',       teamColor: '#FFD700' },
  { number: 54, name: 'Fermin Aldeguer',        short: 'ALD', team: 'Gresini Racing',              teamColor: '#CC0000' },
  { number: 63, name: 'Francesco Bagnaia',      short: 'BAG', team: 'Ducati Lenovo',               teamColor: '#CC0000' },
  { number: 72, name: 'Marco Bezzecchi',        short: 'BEZ', team: 'Aprilia Racing',              teamColor: '#006EFF' },
  { number: 73, name: 'Alex Márquez',           short: 'AMQ', team: 'Gresini Racing',              teamColor: '#CC0000' },
  { number: 79, name: 'Ai Ogura',               short: 'OGU', team: 'Trackhouse Racing',           teamColor: '#006EFF' },
  { number: 89, name: 'Jorge Martín',           short: 'JMA', team: 'Aprilia Racing',              teamColor: '#006EFF' },
];

const RACE_WEEKEND_DATA = {
  'Chang International Circuit': {
    city: 'Buriram',
    trackFacts: [
      { label: 'Length',        value: '4.554 km' },
      { label: 'Turns',         value: '12' },
      { label: 'Lap Record',    value: '1:30.452' },
      { label: 'Record Holder', value: 'F. Bagnaia' },
      { label: 'Record Year',   value: '2023' },
      { label: 'Capacity',      value: '120,000' },
    ],
    trackCharacter: 'A technical circuit in northeast Thailand with long straights and fast, flowing corners. Heat and humidity make tyre management critical. Corner 3 and the final chicane are the key overtaking spots.',
    // sessionResults: keyed by session name, array of { riderNumber, time, gap }
    // Populate as sessions complete e.g:
    // FP1: [{ riderNumber: 93, time: '1:30.123', gap: null }, ...]
    sessionResults: {},
    previousWinners: [
      { year: 2024, rider: 'Jorge Martin',      team: 'Pramac Ducati', time: '41:23.456' },
      { year: 2023, rider: 'Francesco Bagnaia', team: 'Ducati Lenovo', time: '41:18.234' },
      { year: 2019, rider: 'Marc Marquez',      team: 'Repsol Honda',  time: '41:03.456' },
      { year: 2018, rider: 'Marc Marquez',      team: 'Repsol Honda',  time: '40:58.123' },
    ],
    ridersToWatch: [
      { name: 'Marc Marquez',      number: 93, team: 'Gresini Ducati', teamColor: '#CC0000', reason: '4-time winner at Buriram. Aggressive, physical riding style perfectly suits this circuit\'s demanding layout.' },
      { name: 'Francesco Bagnaia', number: 1,  team: 'Ducati Lenovo',  teamColor: '#CC0000', reason: '2023 race winner and reigning champion. Deep circuit knowledge and the fastest Ducati package on the grid.' },
      { name: 'Pedro Acosta',      number: 31, team: 'Red Bull KTM',   teamColor: '#FF6600', reason: 'Fastest rookie in years. Smooth, flowing style suits the technical Thai layout — expect a strong qualifying.' },
      { name: 'Fabio Quartararo',  number: 20, team: 'Monster Yamaha', teamColor: '#0057A8', reason: 'New Yamaha package showed real promise in testing. Buriram\'s flowing nature could unlock El Diablo\'s full potential.' },
    ],
    fastestLaps: [
      { rider: 'F. Bagnaia',   time: '1:30.452', year: 2023, session: 'Race' },
      { rider: 'J. Martin',    time: '1:30.891', year: 2024, session: 'Race' },
      { rider: 'M. Marquez',   time: '1:31.012', year: 2019, session: 'Race' },
      { rider: 'A. Espargaro', time: '1:31.234', year: 2023, session: 'Qualifying' },
    ],
    schedule: [
      { day: 'Friday',   date: 'Feb 28', sessions: ['FP1 — 10:00 local', 'Practice — 14:15 local'] },
      { day: 'Saturday', date: 'Mar 1',  sessions: ['Q1/Q2 — 10:50 local', 'Sprint Race — 15:00 local'] },
      { day: 'Sunday',   date: 'Mar 2',  sessions: ['Warm Up — 09:40 local', 'RACE — 14:00 local'] },
    ],
  },
};

function findFeaturedRace(races) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const current = races.find(r => {
    const raceDay = new Date(r.race_date);
    const weekendStart = new Date(raceDay);
    weekendStart.setDate(raceDay.getDate() - 3);
    return today >= weekendStart && today <= raceDay;
  });
  if (current) return { race: current, status: 'live' };
  const next = races.find(r => new Date(r.race_date) >= today);
  if (next) return { race: next, status: 'next' };
  return { race: races[races.length - 1], status: 'last' };
}

function getDaysUntil(dateStr) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const race = new Date(dateStr);
  const diff = Math.ceil((race - today) / (1000 * 60 * 60 * 24));
  if (diff <= 0 && diff >= -3) return '🔴 LIVE THIS WEEKEND';
  if (diff < 0) return 'Completed';
  if (diff === 1) return '1 day away';
  return `${diff} days away`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const friday = new Date(d);
  friday.setDate(d.getDate() - 2);
  const fri = friday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const sun = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fri} – ${sun}`;
}

function formatFullDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── Timing Tower ─────────────────────────────────────────────────
function TimingTower({ sessionResults }) {
  const [activeSession, setActiveSession] = useState('FP1');
  const [prevSession, setPrevSession] = useState(null);
  const [animating, setAnimating] = useState(false);

  const switchSession = (session) => {
    if (session === activeSession) return;
    setPrevSession(activeSession);
    setAnimating(true);
    setTimeout(() => {
      setActiveSession(session);
      setAnimating(false);
    }, 180);
  };

  const results = sessionResults?.[activeSession] || [];
  const hasData = results.length > 0;

  // Build display rows — real data or TBD placeholders
  const rows = hasData
    ? results.map((r, i) => {
        const rider = ALL_RIDERS.find(rd => rd.number === r.riderNumber) || {};
        return { pos: i + 1, rider, time: r.time, gap: r.gap };
      })
    : ALL_RIDERS.map((rider, i) => ({ pos: i + 1, rider, time: null, gap: null }));

  return (
    <div className="timing-tower">
      {/* Session selector bar */}
      <div className="timing-tower__bar">
        {SESSIONS.map(session => (
          <button
            key={session}
            className={`timing-tower__tab ${activeSession === session ? 'timing-tower__tab--active' : ''} ${session === 'GP' ? 'timing-tower__tab--gp' : ''} ${session === 'Sprint' ? 'timing-tower__tab--sprint' : ''}`}
            onClick={() => switchSession(session)}
          >
            {session}
          </button>
        ))}
      </div>

      {/* Tower */}
      <div className={`timing-tower__table ${animating ? 'timing-tower__table--exit' : 'timing-tower__table--enter'}`}>
        {/* Header */}
        <div className="timing-tower__header">
          <span className="tt-col tt-col--pos">P</span>
          <span className="tt-col tt-col--num">#</span>
          <span className="tt-col tt-col--name">Rider</span>
          <span className="tt-col tt-col--team">Team</span>
          <span className="tt-col tt-col--time">Time</span>
          <span className="tt-col tt-col--gap">Gap</span>
        </div>

        {/* Rows */}
        {rows.map(({ pos, rider, time, gap }) => (
          <div
            key={rider.number}
            className={`timing-tower__row ${pos === 1 ? 'timing-tower__row--p1' : ''} ${pos <= 3 ? 'timing-tower__row--podium' : ''}`}
            style={{ '--team-color': rider.teamColor || '#666' }}
          >
            <span className="tt-col tt-col--pos">
              <span className={`tt-pos ${pos === 1 ? 'tt-pos--gold' : pos === 2 ? 'tt-pos--silver' : pos === 3 ? 'tt-pos--bronze' : ''}`}>
                {pos}
              </span>
            </span>
            <span className="tt-col tt-col--num">
              <span className="tt-num" style={{ color: rider.teamColor, borderColor: rider.teamColor }}>
                {rider.number}
              </span>
            </span>
            <span className="tt-col tt-col--name">
              <span className="tt-team-bar" style={{ background: rider.teamColor }} />
              <span className="tt-name">{rider.name}</span>
            </span>
            <span className="tt-col tt-col--team">
              <span className="tt-team">{rider.team}</span>
            </span>
            <span className="tt-col tt-col--time">
              {time
                ? <span className={`tt-time ${pos === 1 ? 'tt-time--leader' : ''}`}>{time}</span>
                : <span className="tt-tbd">TBD</span>
              }
            </span>
            <span className="tt-col tt-col--gap">
              {gap
                ? <span className="tt-gap">{gap}</span>
                : pos === 1
                  ? <span className="tt-gap-leader">—</span>
                  : <span className="tt-tbd">TBD</span>
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Race Weekend Hub ─────────────────────────────────────────────
function RaceWeekendHub({ race, status }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const circuitName = race.circuit_name;
  const data = RACE_WEEKEND_DATA[circuitName];
  const flag = FLAGS[race.circuit_country] || '🏁';
  const photo = HERO_PHOTOS[circuitName];
  const daysUntil = getDaysUntil(race.race_date);
  const statusLabel = { live: '🔴 RACE WEEKEND', next: 'NEXT RACE', last: 'FINAL ROUND' }[status];

  return (
    <div className="hub">
      <div
        className={`hub__hero ${hovered ? 'hub__hero--hovered' : ''} ${expanded ? 'hub__hero--expanded' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setExpanded(e => !e)}
      >
        {photo && (
          <img
            src={photo}
            alt={circuitName}
            className={`hub__hero-photo ${imgLoaded ? 'hub__hero-photo--loaded' : ''}`}
            onLoad={() => setImgLoaded(true)}
          />
        )}
        <div className="hub__hero-overlay" />

        <div className="hub__hero-content">
          <div className="hub__hero-top">
            <span className="hub__status-badge">{statusLabel}</span>
            <span className="hub__countdown">{daysUntil}</span>
          </div>
          <div className="hub__hero-main">
            <p className="hub__round-label">Round {race.round} · 2026 MotoGP World Championship</p>
            <h1 className="hub__race-name">{race.name}</h1>
            <p className="hub__location">{flag} {data?.city || ''}, {race.circuit_country}</p>
            <p className="hub__date">{formatFullDate(race.race_date)}</p>
          </div>
        </div>

        <div className={`hub__click-prompt ${expanded ? 'hub__click-prompt--open' : ''}`}>
          <div className="hub__click-prompt-inner">
            <span className="hub__click-prompt-icon">{expanded ? '▲' : '▼'}</span>
            <span className="hub__click-prompt-text">
              {expanded ? 'Collapse circuit info' : 'Circuit info · Previous winners · Fastest laps'}
            </span>
            <span className="hub__click-prompt-icon">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>

        <div className={`hub__hover-peek ${hovered && !expanded ? 'hub__hover-peek--visible' : ''}`}>
          {(data?.trackFacts || []).slice(0, 4).map((f, i) => (
            <div key={i} className="hub__peek-stat">
              <span className="hub__peek-val">{f.value}</span>
              <span className="hub__peek-lbl">{f.label}</span>
            </div>
          ))}
        </div>

        <div className={`hub__expanded-panel ${expanded ? 'hub__expanded-panel--open' : ''}`}>
          <div className="hub__expanded-inner">
            <div className="hub__expanded-facts">
              <p className="hub__expanded-label">Circuit Data</p>
              <div className="hub__facts-grid">
                {(data?.trackFacts || [
                  { label: 'Length', value: `${race.circuit_length} km` },
                  { label: 'Country', value: race.circuit_country },
                ]).map((f, i) => (
                  <div key={i} className="hub__fact">
                    <span className="hub__fact-value">{f.value}</span>
                    <span className="hub__fact-label">{f.label}</span>
                  </div>
                ))}
              </div>
              {data?.trackCharacter && (
                <p className="hub__track-character">{data.trackCharacter}</p>
              )}
            </div>

            {data?.schedule && (
              <div className="hub__expanded-schedule">
                <p className="hub__expanded-label">Weekend Schedule</p>
                {data.schedule.map((day, i) => (
                  <div key={i} className="hub__schedule-day">
                    <div className="hub__schedule-day-header">
                      <span className="hub__schedule-dayname">{day.day}</span>
                      <span className="hub__schedule-daydate">{day.date}</span>
                    </div>
                    {day.sessions.map((s, j) => (
                      <div key={j} className="hub__schedule-session">{s}</div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {data?.previousWinners && (
              <div className="hub__expanded-winners">
                <p className="hub__expanded-label">Previous Winners</p>
                <div className="hub__winners">
                  {data.previousWinners.map((w, i) => (
                    <div key={i} className="hub__winner">
                      <span className="hub__winner-year">{w.year}</span>
                      <div className="hub__winner-info">
                        <span className="hub__winner-rider">{w.rider}</span>
                        <span className="hub__winner-team">{w.team}</span>
                      </div>
                      <span className="hub__winner-time">{w.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data?.fastestLaps && (
              <div className="hub__expanded-laps">
                <p className="hub__expanded-label">Fastest Lap History</p>
                <div className="hub__laps">
                  {data.fastestLaps.map((l, i) => (
                    <div key={i} className="hub__lap">
                      <span className="hub__lap-time">{l.time}</span>
                      <span className="hub__lap-rider">{l.rider}</span>
                      <span className="hub__lap-meta">{l.session} · {l.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timing Tower */}
      <div className="hub__body">
        <div className="hub__card hub__card--timing">
          <h3 className="hub__card-title">Session Results</h3>
          <TimingTower sessionResults={data?.sessionResults || {}} />
        </div>
      </div>

      {/* Riders to Watch */}
      {data?.ridersToWatch && (
        <div className="hub__body hub__body--riders">
          <div className="hub__card hub__card--riders">
            <h3 className="hub__card-title">Riders to Watch</h3>
            <div className="hub__riders">
              {data.ridersToWatch.map((r, i) => (
                <div key={i} className="hub__rider">
                  <div className="hub__rider-number" style={{ borderColor: r.teamColor, color: r.teamColor }}>
                    {r.number}
                  </div>
                  <div className="hub__rider-info">
                    <p className="hub__rider-name">{r.name}</p>
                    <p className="hub__rider-team">{r.team}</p>
                    <p className="hub__rider-reason">{r.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Schedule Card ────────────────────────────────────────────────
function ScheduleCard({ race, isFeatured }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const flag = FLAGS[race.circuit_country] || '🏁';
  const isPast = new Date(race.race_date) < new Date();
  const photo = CIRCUIT_PHOTOS[race.circuit_name];

  return (
    <div className={`schedule-card ${isPast ? 'schedule-card--past' : ''} ${isFeatured ? 'schedule-card--featured' : ''}`}>
      {photo && (
        <img
          src={photo}
          alt={race.circuit_name}
          className={`schedule-card__photo ${imgLoaded ? 'schedule-card__photo--loaded' : ''}`}
          onLoad={() => setImgLoaded(true)}
        />
      )}
      <div className="schedule-card__overlay" />
      {isFeatured && <div className="schedule-card__dot" />}
      <div className="schedule-card__content">
        <div className="schedule-card__round">RD {String(race.round).padStart(2, '0')}</div>
        <div className="schedule-card__flag">{flag}</div>
        <div className="schedule-card__name">{race.name}</div>
        <div className="schedule-card__date">{formatDate(race.race_date)}</div>
      </div>
    </div>
  );
}

// ─── Main Calendar ────────────────────────────────────────────────
function Calendar() {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/races')
      .then(r => r.json())
      .then(data => { setRaces(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="calendar-loading">
        <div className="calendar-loading__spinner" />
        <p>Loading calendar...</p>
      </div>
    );
  }

  const { race: featuredRace, status } = findFeaturedRace(races);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2 className="calendar-title">2026 Season</h2>
        <p className="calendar-subtitle">{races.length} Rounds</p>
      </div>

      {featuredRace && <RaceWeekendHub race={featuredRace} status={status} />}

      <div className="calendar-section-label">All Rounds</div>

      <div className="races-grid">
        {races.map(race => (
          <ScheduleCard
            key={race.id}
            race={race}
            isFeatured={race.id === featuredRace?.id}
          />
        ))}
      </div>
    </div>
  );
}

export default Calendar;
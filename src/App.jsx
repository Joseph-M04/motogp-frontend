import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Calendar from './components/Calendar';
import ChampionshipChart from './components/ChampionshipChart';
import { apiUrl } from './api';

function App() {
  const [riders, setRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null); // eslint-disable-line no-unused-vars
  const [selectedCalendarRace, setSelectedCalendarRace] = useState(null);
  const [activeSection, setActiveSection] = useState('chart');

  const chartRef = useRef(null);
  const calendarRef = useRef(null);
  const nextRaceRef = useRef(null);
  const allRoundsRef = useRef(null);
  const calendarImperativeRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch(apiUrl('/api/riders'))
      .then(res => res.json())
      .then(data => setRiders(data))
      .catch(err => console.error('Error fetching riders:', err));
  }, []);

  // Preload all hi-res circuit photos on app load
  useEffect(() => {
    fetch(apiUrl('/api/races?season=2026'))
      .then(res => res.json())
      .then(races => {
        races.forEach(race => {
          if (!race.photo_url) return;
          const url = new URL(race.photo_url);
          url.searchParams.set('w', '2400');
          url.searchParams.set('q', '100');
          url.searchParams.set('auto', 'format');
          url.searchParams.set('fit', 'crop');
          url.searchParams.set('sharp', '15');
          const img = new Image();
          img.src = url.toString();
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    const handleScroll = () => {
      const sections = [
        { id: 'chart',      ref: chartRef },
        { id: 'calendar',   ref: calendarRef },
        { id: 'nextrace',   ref: nextRaceRef },
        { id: 'allrounds',  ref: allRoundsRef },
      ];
      const scrollTop = scrollEl.scrollTop + 80;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].ref.current;
        if (el && el.offsetTop <= scrollTop) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    scrollEl.addEventListener('scroll', handleScroll);
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (ref, id, offset = 0) => {
    setActiveSection(id);
    const target = ref.current;
    const scroller = scrollRef.current;
    if (!target || !scroller) return;
    scroller.scrollTo({ top: Math.max(0, target.offsetTop - offset), behavior: 'smooth' });
  };

  const handleNavClick = (id, ref) => {
    scrollTo(ref, id);
  };

  const handleRiderClick = (rider) => {
    setSelectedRider(null);
    setTimeout(() => {
      setSelectedRider(rider);
    }, 50);
  };

  const handleLogoClick = () => {
    scrollTo(chartRef, 'chart');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-logo" onClick={handleLogoClick}>
            <span className="app-logo__word">Grid</span>
            <span className="app-logo__word app-logo__word--accent">Report</span>
          </div>
          <nav className="app-nav">
            {[
              { id: 'chart',      label: 'Standings',   ref: chartRef },
              { id: 'nextrace',   label: 'Next Race',   ref: nextRaceRef },
              { id: 'calendar',   label: 'Calendar',    ref: allRoundsRef },
            ].map(({ id, label, ref }) => (
              <button
                key={id}
                className={`app-nav__btn ${activeSection === id ? 'app-nav__btn--active' : ''}`}
                onClick={() => handleNavClick(id, ref)}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="app-container">
        <aside className="sidebar">
          <Sidebar riders={riders} onRoundSelect={(race) => { setSelectedCalendarRace(race); scrollTo(allRoundsRef, 'calendar'); }} />
        </aside>

        <main className="main-content">
          <div className="main-scroll" ref={scrollRef}>

            <section ref={chartRef} className="page-section page-section--hero">
              <ChampionshipChart riders={riders} onRiderSelect={handleRiderClick} />
            </section>

            <section ref={calendarRef} className="page-section">
              <Calendar ref={calendarImperativeRef} nextRaceRef={nextRaceRef} allRoundsRef={allRoundsRef} selectedCalendarRace={selectedCalendarRace} onCalendarRaceHandled={() => setSelectedCalendarRace(null)} />
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
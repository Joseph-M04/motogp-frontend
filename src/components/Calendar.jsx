import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import '../styles/Calendar.css';
import { apiUrl } from '../api';

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

const SESSIONS = ['FP1', 'Practice', 'FP2', 'Q1', 'Q2', 'Sprint', 'GP'];

// ⚠️ ACCURATE 2026 RIDER ROSTER — synced from DB
const ALL_RIDERS = [
  { number: 93, name: 'Marc Marquez',          short: 'MM',  team: 'Ducati Lenovo Team',          teamColor: '#CC0000' },
  { number: 63, name: 'Francesco Bagnaia',     short: 'BAG', team: 'Ducati Lenovo Team',          teamColor: '#CC0000' },
  { number: 73, name: 'Alex Márquez',          short: 'AMQ', team: 'BK8 Gresini Racing',          teamColor: '#6BA3E5' },
  { number: 54, name: 'Fermin Aldeguer',       short: 'ALD', team: 'BK8 Gresini Racing',          teamColor: '#6BA3E5' },
  { number: 89, name: 'Jorge Martín',          short: 'JMA', team: 'Aprilia Racing',              teamColor: '#551A8B' },
  { number: 72, name: 'Marco Bezzecchi',       short: 'BEZ', team: 'Aprilia Racing',              teamColor: '#551A8B' },
  { number: 37, name: 'Pedro Acosta',          short: 'ACO', team: 'Red Bull KTM Factory Racing', teamColor: '#FF6600' },
  { number: 33, name: 'Brad Binder',           short: 'BIN', team: 'Red Bull KTM Factory Racing', teamColor: '#FF6600' },
  { number: 12, name: 'Maverick Viñales',      short: 'VIN', team: 'Red Bull KTM Tech3',          teamColor: '#FF6600' },
  { number: 23, name: 'Enea Bastianini',       short: 'BAS', team: 'Red Bull KTM Tech3',          teamColor: '#FF6600' },
  { number: 20, name: 'Fabio Quartararo',      short: 'QUA', team: 'Monster Energy Yamaha',       teamColor: '#003B8E' },
  { number: 42, name: 'Alex Rins',             short: 'RIN', team: 'Monster Energy Yamaha',       teamColor: '#003B8E' },
  { number: 7,  name: 'Toprak Razgatlioglu',   short: 'TOP', team: 'Prima Pramac Yamaha',         teamColor: '#004C97' },
  { number: 43, name: 'Jack Miller',           short: 'MIL', team: 'Prima Pramac Yamaha',         teamColor: '#004C97' },
  { number: 49, name: 'Fabio Di Giannantonio', short: 'DIG', team: 'Pertamina Enduro VR46',       teamColor: '#DAA520' },
  { number: 21, name: 'Franco Morbidelli',     short: 'MRB', team: 'Pertamina Enduro VR46',       teamColor: '#DAA520' },
  { number: 25, name: 'Raul Fernandez',        short: 'RFE', team: 'Trackhouse MotoGP',           teamColor: '#00B4D8' },
  { number: 79, name: 'Ai Ogura',              short: 'OGU', team: 'Trackhouse MotoGP',           teamColor: '#00B4D8' },
  { number: 10, name: 'Luca Marini',           short: 'LMR', team: 'Honda HRC Castrol',           teamColor: '#CC0000' },
  { number: 36, name: 'Joan Mir',              short: 'MIR', team: 'Honda HRC Castrol',           teamColor: '#CC0000' },
  { number: 5,  name: 'Johann Zarco',          short: 'ZAR', team: 'Castrol Honda LCR',           teamColor: '#FFFFFF' },
  { number: 11, name: 'Diogo Moreira',         short: 'MOR', team: 'LCR Honda',                   teamColor: '#FFFFFF' },
  { number: 51, name: 'Michele Pirro',         short: 'PIR', team: 'BK8 Gresini Racing',          teamColor: '#6BA3E5' },
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
    sessionResults: {
      FP1: [
        { riderNumber: 72, time: '1:29.346', gap: null },
        { riderNumber: 49, time: '1:29.456', gap: '+0.110' },
        { riderNumber: 89, time: '1:29.551', gap: '+0.205' },
        { riderNumber: 79, time: '1:29.655', gap: '+0.309' },
        { riderNumber: 37, time: '1:29.678', gap: '+0.332' },
        { riderNumber: 93, time: '1:29.772', gap: '+0.426' },
        { riderNumber: 63, time: '1:29.791', gap: '+0.445' },
        { riderNumber: 21, time: '1:29.934', gap: '+0.588' },
        { riderNumber: 73, time: '1:30.012', gap: '+0.666' },
        { riderNumber: 10, time: '1:30.068', gap: '+0.722' },
        { riderNumber: 25, time: '1:30.072', gap: '+0.726' },
        { riderNumber: 36, time: '1:30.082', gap: '+0.736' },
        { riderNumber: 42, time: '1:30.268', gap: '+0.922' },
        { riderNumber: 5,  time: '1:30.347', gap: '+1.001' },
        { riderNumber: 23, time: '1:30.347', gap: '+1.001' },
        { riderNumber: 11, time: '1:30.375', gap: '+1.029' },
        { riderNumber: 33, time: '1:30.391', gap: '+1.045' },
        { riderNumber: 20, time: '1:30.470', gap: '+1.124' },
        { riderNumber: 12, time: '1:30.490', gap: '+1.144' },
        { riderNumber: 43, time: '1:30.839', gap: '+1.493' },
        { riderNumber: 7,  time: '1:31.109', gap: '+1.763' },
        { riderNumber: 51, time: '1:31.808', gap: '+2.462' },
      ],
      Practice: [
        { riderNumber: 72, time: '1:28.526', gap: null },
        { riderNumber: 93, time: '1:28.947', gap: '+0.421' },
        { riderNumber: 49, time: '1:29.010', gap: '+0.484' },
        { riderNumber: 37, time: '1:29.185', gap: '+0.659' },
        { riderNumber: 89, time: '1:29.229', gap: '+0.703' },
        { riderNumber: 73, time: '1:29.376', gap: '+0.850' },
        { riderNumber: 36, time: '1:29.517', gap: '+0.991' },
        { riderNumber: 33, time: '1:29.532', gap: '+1.006' },
        { riderNumber: 79, time: '1:29.579', gap: '+1.053' },
        { riderNumber: 5,  time: '1:29.590', gap: '+1.064' },
        { riderNumber: 10, time: '1:29.614', gap: '+1.088' },
        { riderNumber: 12, time: '1:29.623', gap: '+1.097' },
        { riderNumber: 21, time: '1:29.642', gap: '+1.116' },
        { riderNumber: 25, time: '1:29.666', gap: '+1.140' },
        { riderNumber: 63, time: '1:29.824', gap: '+1.298' },
        { riderNumber: 20, time: '1:29.884', gap: '+1.358' },
        { riderNumber: 23, time: '1:30.030', gap: '+1.504' },
        { riderNumber: 11, time: '1:30.101', gap: '+1.575' },
        { riderNumber: 43, time: '1:30.134', gap: '+1.608' },
        { riderNumber: 42, time: '1:30.302', gap: '+1.776' },
        { riderNumber: 7,  time: '1:30.365', gap: '+1.839' },
        { riderNumber: 51, time: '1:31.437', gap: '+2.911' },
      ],
      FP2: [
  { riderNumber: 72, time: '1:29.654', gap: null },
  { riderNumber: 37, time: '1:29.725', gap: '+0.071' },
  { riderNumber: 73, time: '1:29.828', gap: '+0.174' },
  { riderNumber: 79, time: '1:29.841', gap: '+0.187' },
  { riderNumber: 21, time: '1:29.972', gap: '+0.318' },
  { riderNumber: 93, time: '1:30.008', gap: '+0.354' },
  { riderNumber: 25, time: '1:30.032', gap: '+0.378' },
  { riderNumber: 89, time: '1:30.133', gap: '+0.479' },
  { riderNumber: 63, time: '1:30.142', gap: '+0.488' },
  { riderNumber: 49, time: '1:30.219', gap: '+0.565' },
  { riderNumber: 10, time: '1:30.367', gap: '+0.713' },
  { riderNumber: 5,  time: '1:30.386', gap: '+0.732' },
  { riderNumber: 33, time: '1:30.435', gap: '+0.781' },
  { riderNumber: 11, time: '1:30.489', gap: '+0.835' },
  { riderNumber: 36, time: '1:30.537', gap: '+0.883' },
  { riderNumber: 12, time: '1:30.637', gap: '+0.983' },
  { riderNumber: 23, time: '1:30.687', gap: '+1.033' },
  { riderNumber: 20, time: '1:30.793', gap: '+1.139' },
  { riderNumber: 7,  time: '1:31.107', gap: '+1.453' },
  { riderNumber: 43, time: '1:31.130', gap: '+1.476' },
  { riderNumber: 42, time: '1:31.282', gap: '+1.628' },
  { riderNumber: 51, time: '1:31.775', gap: '+2.121' },
],
      Q1: [
        { riderNumber: 25, time: '1:28.784', gap: null },
        { riderNumber: 21, time: '1:29.090', gap: '+0.306' },
        { riderNumber: 63, time: '1:29.348', gap: '+0.564' },
        { riderNumber: 10, time: '1:29.446', gap: '+0.662' },
        { riderNumber: 11, time: '1:29.489', gap: '+0.705' },
        { riderNumber: 20, time: '1:29.683', gap: '+0.899' },
        { riderNumber: 12, time: '1:29.774', gap: '+0.990' },
        { riderNumber: 43, time: '1:29.834', gap: '+1.050' },
        { riderNumber: 42, time: '1:30.067', gap: '+1.283' },
        { riderNumber: 23, time: '1:30.078', gap: '+1.294' },
        { riderNumber: 7,  time: '1:30.165', gap: '+1.381' },
        { riderNumber: 51, time: '1:31.361', gap: '+2.577' },
      ],
      Q2: [
        { riderNumber: 72, time: '1:28.652', gap: null },
        { riderNumber: 93, time: '1:28.687', gap: '+0.035' },
        { riderNumber: 25, time: '1:28.876', gap: '+0.224' },
        { riderNumber: 49, time: '1:28.918', gap: '+0.266' },
        { riderNumber: 89, time: '1:29.001', gap: '+0.349' },
        { riderNumber: 37, time: '1:29.061', gap: '+0.409' },
        { riderNumber: 73, time: '1:29.077', gap: '+0.425' },
        { riderNumber: 79, time: '1:29.211', gap: '+0.559' },
        { riderNumber: 21, time: '1:29.322', gap: '+0.669' },
        { riderNumber: 36, time: '1:29.386', gap: '+0.733' },
        { riderNumber: 33, time: '1:29.403', gap: '+0.750' },
        { riderNumber: 5,  time: '1:29.450', gap: '+0.798' },
      ],
      Sprint: [],
      GP: [],
    },
    previousWinners: [
      { year: 2024, rider: 'Jorge Martin',      team: 'Pramac Ducati', time: '41:23.456' },
      { year: 2023, rider: 'Francesco Bagnaia', team: 'Ducati Lenovo', time: '41:18.234' },
      { year: 2019, rider: 'Marc Marquez',      team: 'Repsol Honda',  time: '41:03.456' },
      { year: 2018, rider: 'Marc Marquez',      team: 'Repsol Honda',  time: '40:58.123' },
    ],
    ridersToWatch: [
      { name: 'Marc Marquez',        number: 93, team: 'Ducati Lenovo Team',          teamColor: '#CC0000', reason: '4-time Buriram winner. Now on factory Ducati — the most dangerous combination on the grid.' },
      { name: 'Jorge Martín',        number: 89, team: 'Aprilia Racing',              teamColor: '#551A8B', reason: 'Reigning world champion. New Aprilia package suits his smooth style perfectly.' },
      { name: 'Pedro Acosta',        number: 37, team: 'Red Bull KTM Factory Racing', teamColor: '#FF6600', reason: 'Sophomore season, no fear. Smooth flowing style suits Thailand\'s technical layout.' },
      { name: 'Toprak Razgatlioglu', number: 7,  team: 'Prima Pramac Yamaha',         teamColor: '#004C97', reason: 'World Superbike champion making his MotoGP debut. Raw speed makes him dangerous anywhere.' },
    ],
    fastestLaps: [
      { rider: 'F. Bagnaia',   time: '1:30.452', year: 2023, session: 'Race' },
      { rider: 'J. Martin',    time: '1:30.891', year: 2024, session: 'Race' },
      { rider: 'M. Marquez',   time: '1:31.012', year: 2019, session: 'Race' },
      { rider: 'A. Espargaro', time: '1:31.234', year: 2023, session: 'Qualifying' },
    ],
    schedule: [
      { day: 'Friday',   date: 'Feb 28', sessions: ['FP1 — 10:00 local', 'Practice — 14:15 local'] },
      { day: 'Saturday', date: 'Mar 1',  sessions: ['FP2 — 09:00 local', 'Q1/Q2 — 10:50 local', 'Sprint Race — 15:00 local'] },
      { day: 'Sunday',   date: 'Mar 2',  sessions: ['Warm Up — 09:40 local', 'RACE — 14:00 local'] },
    ],
  },
};

function findFeaturedRace(races) {
  const current = races.find((r) => getRaceStatus(r) === 'live');
  if (current) return { race: current, status: 'live' };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const next = races.find(r => new Date(r.race_date) >= today);
  if (next) return { race: next, status: 'next' };
  return { race: races[races.length - 1], status: 'last' };
}

function getRaceStatus(race) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const raceDay = new Date(race.race_date);
  raceDay.setHours(0, 0, 0, 0);
  const weekendStart = new Date(raceDay);
  weekendStart.setDate(raceDay.getDate() - 2);
  if (today >= weekendStart && today <= raceDay) return 'live';
  if (today < raceDay) return 'next';
  return 'last';
}

function getDaysUntil(dateStr) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const race = new Date(dateStr);
  race.setHours(0, 0, 0, 0);
  const diff = Math.ceil((race - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Completed';
  if (diff === 0) return 'Race day';
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

const CIRCUIT_TIMEZONES = {
  Thailand: 'Asia/Bangkok',
  Brazil: 'America/Sao_Paulo',
  USA: 'America/Chicago',
  Qatar: 'Asia/Qatar',
  Spain: 'Europe/Madrid',
  France: 'Europe/Paris',
  Italy: 'Europe/Rome',
  Hungary: 'Europe/Budapest',
  'Czech Republic': 'Europe/Prague',
  Netherlands: 'Europe/Amsterdam',
  Germany: 'Europe/Berlin',
  UK: 'Europe/London',
  'San Marino': 'Europe/San_Marino',
  Austria: 'Europe/Vienna',
  Japan: 'Asia/Tokyo',
  Indonesia: 'Asia/Jakarta',
  Australia: 'Australia/Melbourne',
  Malaysia: 'Asia/Kuala_Lumpur',
  Portugal: 'Europe/Lisbon',
};

function getTimeZoneOffsetMs(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(date);
  const value = {};
  parts.forEach((p) => { if (p.type !== 'literal') value[p.type] = p.value; });
  const asUTC = Date.UTC(
    Number(value.year), Number(value.month) - 1, Number(value.day),
    Number(value.hour), Number(value.minute), Number(value.second),
  );
  return asUTC - date.getTime();
}

function zonedDateTimeToUtc({ year, month, day, hour, minute }, timeZone) {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const offset1 = getTimeZoneOffsetMs(new Date(utcGuess), timeZone);
  const adjusted = utcGuess - offset1;
  const offset2 = getTimeZoneOffsetMs(new Date(adjusted), timeZone);
  return new Date(utcGuess - offset2);
}

function raceWeekendDateByDay(raceDate, dayLabel) {
  const dayOffsets = { Friday: -2, Saturday: -1, Sunday: 0 };
  const d = new Date(raceDate);
  d.setDate(d.getDate() + (dayOffsets[dayLabel] ?? 0));
  return d;
}

function formatSessionToViewerLocal(sessionLabel, raceDate, dayLabel, circuitCountry) {
  const match = sessionLabel.match(/^(.*?)\s*[—-]\s*(\d{1,2}):(\d{2})\s*local$/i);
  if (!match) return sessionLabel;
  const sourceTimeZone = CIRCUIT_TIMEZONES[circuitCountry] || 'UTC';
  const [, name, h, m] = match;
  const dayDate = raceWeekendDateByDay(raceDate, dayLabel);
  const utcDate = zonedDateTimeToUtc({
    year: dayDate.getFullYear(), month: dayDate.getMonth() + 1,
    day: dayDate.getDate(), hour: Number(h), minute: Number(m),
  }, sourceTimeZone);
  const localDay = utcDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const localTime = utcDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${name.trim()} - ${localDay}, ${localTime}`;
}

function buildViewerLocalSchedule(race, schedule) {
  if (!schedule?.length) return [];
  return schedule.map((dayBlock) => ({
    ...dayBlock,
    sessions: (dayBlock.sessions || []).map((session) =>
      formatSessionToViewerLocal(session, race.race_date, dayBlock.day, race.circuit_country),
    ),
  }));
}

function getLightboxTargetRect() {
  const width = Math.min(window.innerWidth * 0.9, 1320);
  const height = Math.min(window.innerHeight * 0.82, 820);
  return {
    width, height,
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
  };
}

function getEnhancedCircuitPhoto(url) {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('unsplash.com')) {
      parsed.searchParams.set('w', '2400');
      parsed.searchParams.set('q', '100');
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', 'crop');
      parsed.searchParams.set('sharp', '15');
      parsed.searchParams.set('sat', '10');
      parsed.searchParams.delete('ixlib');
      parsed.searchParams.delete('ixid');
      return parsed.toString();
    }
    return url;
  } catch { return url; }
}

// ─── Timing Tower ─────────────────────────────────────────────────
function TimingTower({ sessionResults }) {
  const [activeSession, setActiveSession] = useState('FP1');
  const [animating, setAnimating] = useState(false);

  const switchSession = (session) => {
    if (session === activeSession) return;
    setAnimating(true);
    setTimeout(() => { setActiveSession(session); setAnimating(false); }, 180);
  };

  const results = sessionResults?.[activeSession] || [];
  const hasData = results.length > 0;

  const rows = hasData
    ? results.map((r, i) => {
        const rider = ALL_RIDERS.find(rd => rd.number === r.riderNumber) || {
          number: r.riderNumber,
          name: r.riderName || `#${r.riderNumber}`,
          team: r.team || 'Guest Entry',
          teamColor: r.teamColor || '#7f8794',
        };
        return { pos: i + 1, rider, time: r.time, gap: r.gap };
      })
    : ALL_RIDERS.filter(r => r.number !== 51).map((rider, i) => ({ pos: i + 1, rider, time: null, gap: null }));

  return (
    <div className="timing-tower">
      <div className="timing-tower__bar">
        {SESSIONS.map(session => (
          <button
            key={session}
            className={[
              'timing-tower__tab',
              activeSession === session ? 'timing-tower__tab--active' : '',
              session === 'GP' ? 'timing-tower__tab--gp' : '',
              session === 'Sprint' ? 'timing-tower__tab--sprint' : '',
              session === 'Q1' ? 'timing-tower__tab--q1' : '',
              session === 'Q2' ? 'timing-tower__tab--q2' : '',
              sessionResults?.[session]?.length ? 'timing-tower__tab--complete' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => switchSession(session)}
          >
            {session}
          </button>
        ))}
      </div>

      <div className={`timing-tower__table ${animating ? 'timing-tower__table--exit' : 'timing-tower__table--enter'}`}>
        <div className="timing-tower__header">
          <span className="tt-col tt-col--pos">P</span>
          <span className="tt-col tt-col--num">#</span>
          <span className="tt-col tt-col--name">Rider</span>
          <span className="tt-col tt-col--team">Team</span>
          <span className="tt-col tt-col--time">Time</span>
          <span className="tt-col tt-col--gap">Gap</span>
        </div>

        {rows.map(({ pos, rider, time, gap }) => (
          <div
            key={rider.number}
            className={`timing-tower__row ${pos === 1 ? 'timing-tower__row--p1' : ''}`}
            style={{ '--team-color': rider.teamColor || '#666' }}
          >
            <span className="tt-col tt-col--pos">
              <span className={`tt-pos ${pos === 1 ? 'tt-pos--gold' : pos === 2 ? 'tt-pos--silver' : pos === 3 ? 'tt-pos--bronze' : ''}`}>
                {pos}
              </span>
            </span>
            <span className="tt-col tt-col--num">
              <span className="tt-num" style={{
                color: rider.teamColor === '#FFFFFF' ? 'rgba(255,255,255,0.85)' : rider.teamColor,
                borderColor: rider.teamColor === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : `${rider.teamColor}55`,
                background: 'transparent',
              }}>
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
                : <span className="tt-tbd">—</span>
              }
            </span>
            <span className="tt-col tt-col--gap">
              {gap
                ? <span className="tt-gap">{gap}</span>
                : pos === 1
                  ? <span className="tt-gap-leader">—</span>
                  : <span className="tt-tbd">—</span>
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Race Weekend Hub ─────────────────────────────────────────────
function RaceWeekendHub({ race, status, zoomToken = 0, showTrackInfo = false }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [zooming, setZooming] = useState(false);
  const circuitName = race.circuit_name;
  const data = RACE_WEEKEND_DATA[circuitName];
  const flag = FLAGS[race.circuit_country] || '🏁';
  const photo = race.photo_url;
  const daysUntil = status === 'live' ? 'LIVE NOW' : getDaysUntil(race.race_date);
  const statusLabel = { live: 'Race weekend', next: 'Next race', last: 'Final round' }[status];

  useEffect(() => {
    if (!zoomToken) return;
    setExpanded(false);
    setZooming(true);
    const timer = setTimeout(() => setZooming(false), 420);
    return () => clearTimeout(timer);
  }, [zoomToken, race.id]);

  return (
    <div className="hub">
      <div
        className={`hub__hero ${hovered ? 'hub__hero--hovered' : ''} ${expanded ? 'hub__hero--expanded' : ''} ${zooming ? 'hub__hero--zoom' : ''}`}
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
        <div className="hub__photo-label">
          <span className="hub__photo-track">{race.circuit_name}</span>
          <span className="hub__photo-divider" aria-hidden="true" />
          <span className="hub__photo-place">{data?.city || race.circuit_name}, {race.circuit_country}</span>
        </div>

        <div className="hub__hero-content">
          <div className="hub__hero-top">
            <span className={`hub__status-badge hub__status-badge--${status}`}>{statusLabel}</span>
            <span className={`hub__countdown hub__countdown--${status}`}>{daysUntil}</span>
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
            <span className="hub__click-prompt-icon">{expanded ? '↑' : '↓'}</span>
            <span className="hub__click-prompt-text">
              {expanded ? 'Collapse' : 'Circuit info · Previous winners · Fastest laps'}
            </span>
            <span className="hub__click-prompt-icon">{expanded ? '↑' : '↓'}</span>
          </div>
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

      <div className="hub__body">
        <div className="hub__card hub__card--timing">
          <h3 className="hub__card-title">Session Results</h3>
          <TimingTower sessionResults={data?.sessionResults || {}} />
        </div>
      </div>

      {data?.ridersToWatch && (
        <div className="hub__body hub__body--riders">
          <div className="hub__card hub__card--riders">
            <h3 className="hub__card-title">Riders to Watch</h3>
            <div className="hub__riders">
              {data.ridersToWatch.map((r, i) => (
                <div key={i} className="hub__rider">
                  <div className="hub__rider-number" style={{
                    borderColor: r.teamColor === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : r.teamColor,
                    color: r.teamColor === '#FFFFFF' ? 'rgba(255,255,255,0.85)' : r.teamColor,
                  }}>
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
function ScheduleCard({ race, isFeatured, onSelect }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const flag = FLAGS[race.circuit_country] || '🏁';
  const isPast = new Date(race.race_date) < new Date();
  const photo = race.photo_url;

  return (
    <div
      className={`schedule-card ${isPast ? 'schedule-card--past' : ''} ${isFeatured ? 'schedule-card--featured' : ''} schedule-card--interactive`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(race)}
      onMouseEnter={() => {
        if (race.photo_url) {
          const preload = new Image();
          preload.src = getEnhancedCircuitPhoto(race.photo_url);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(race); }
      }}
      aria-label={`Open track details for ${race.name}`}
    >
      {photo && (
        <img
          src={photo}
          alt={race.circuit_name}
          className={`schedule-card__photo ${imgLoaded ? 'schedule-card__photo--loaded' : ''}`}
          onLoad={() => setImgLoaded(true)}
          onMouseEnter={() => {
            const hires = getEnhancedCircuitPhoto(race.photo_url);
            if (hires && hires !== photo) {
              const preload = new Image();
              preload.src = hires;
            }
          }}
          onClick={(e) => { e.stopPropagation(); onSelect?.(race, e); }}
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
const Calendar = forwardRef(function Calendar({ nextRaceRef, allRoundsRef: externalAllRoundsRef, selectedCalendarRace, onCalendarRaceHandled }, ref) {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRaceId, setSelectedRaceId] = useState(null);
  const [hubRace, setHubRace] = useState(null);
  const [zoomToken, setZoomToken] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const hubRef = useRef(null);
  const allRoundsRef = useRef(null);
  const lightboxOriginRef = useRef(null);
  const closeTimerRef = useRef(null);
  const contentTimerRef = useRef(null);

  useEffect(() => {
    fetch(apiUrl('/api/races'))
      .then(r => r.json())
      .then(data => { setRaces(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  useEffect(() => {
    const handleScrollToRounds = () => {
      allRoundsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    window.addEventListener('calendar:scroll-to-rounds', handleScrollToRounds);
    return () => window.removeEventListener('calendar:scroll-to-rounds', handleScrollToRounds);
  }, []);

  useEffect(() => {
    if (!lightbox) { document.body.style.overflow = ''; return; }
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  useEffect(() => () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    if (contentTimerRef.current) window.clearTimeout(contentTimerRef.current);
  }, []);

  // Open race from sidebar click - highlight in grid only, don't touch hub
  useEffect(() => {
    if (!selectedCalendarRace || !races.length) return;
    const match = races.find(r => r.id === selectedCalendarRace.id);
    if (!match) return;
    setSelectedRaceId(match.id);
    onCalendarRaceHandled?.();
  }, [selectedCalendarRace, races]);

  useEffect(() => {
    if (!lightbox?.active) return undefined;
    const handleResize = () => {
      setLightbox((prev) => prev?.active ? { ...prev, style: getLightboxTargetRect() } : prev);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [lightbox?.active]);

  const handleRaceSelect = useCallback((race, clickEvent) => {
    if (clickEvent?.target?.classList?.contains('schedule-card__photo')) {
      const photo = getEnhancedCircuitPhoto(race.photo_url);
      if (!photo) return;
      const rect = clickEvent.target.getBoundingClientRect();
      lightboxOriginRef.current = rect;
      setLightbox({ race, photo, active: false, contentVisible: false, closing: false,
        style: { top: rect.top, left: rect.left, width: rect.width, height: rect.height } });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLightbox((prev) => prev ? { ...prev, active: true, style: getLightboxTargetRect() } : prev);
          if (contentTimerRef.current) window.clearTimeout(contentTimerRef.current);
          contentTimerRef.current = window.setTimeout(() => {
            setLightbox((prev) => prev ? { ...prev, contentVisible: true } : prev);
          }, 360);
        });
      });
      return;
    }
    if (!race) return;
    setSelectedRaceId(race.id);
    setZoomToken((prev) => prev + 1);
    const scrollContainer = hubRef.current?.closest('.main-scroll');
    if (scrollContainer && hubRef.current) {
      scrollContainer.scrollTo({ top: Math.max(hubRef.current.offsetTop - 12, 0), behavior: 'smooth' });
      return;
    }
    hubRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useImperativeHandle(ref, () => ({
    openRace: (race) => {
      if (!race) return;
      handleRaceSelect(race);
    }
  }), [handleRaceSelect]);

  if (loading) {
    return (
      <div className="calendar-loading">
        <div className="skeleton skeleton--hero" />
        <div className="calendar-loading__grid">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton skeleton--tile" />)}
        </div>
      </div>
    );
  }

  const { race: autoRace, status: autoStatus } = findFeaturedRace(races);
  const featuredRace = hubRace || autoRace;
  const status = hubRace ? getRaceStatus(hubRace) : autoStatus;
  const lightboxData = lightbox ? RACE_WEEKEND_DATA[lightbox.race.circuit_name] : null;
  const localSchedule = lightbox ? buildViewerLocalSchedule(lightbox.race, lightboxData?.schedule) : [];
  const viewerTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local Time';

  const closeLightbox = () => {
    const origin = lightboxOriginRef.current;
    if (!origin || !lightbox || lightbox.closing) { setLightbox(null); return; }
    setLightbox((prev) => prev ? { ...prev, closing: true, contentVisible: false, active: false,
      style: { top: origin.top, left: origin.left, width: origin.width, height: origin.height } } : prev);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setLightbox(null), 760);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2 className="calendar-title">2026 Season</h2>
      </div>

      {featuredRace && (
        <div ref={el => { hubRef.current = el; if (nextRaceRef) nextRaceRef.current = el; }}>
          <RaceWeekendHub
            race={featuredRace}
            status={status}
            zoomToken={zoomToken}
            showTrackInfo={Boolean(selectedRaceId)}
          />
        </div>
      )}

      <div className="calendar-section-label" ref={el => { allRoundsRef.current = el; if (externalAllRoundsRef) externalAllRoundsRef.current = el; }}>All Rounds</div>

      <div className="races-grid">
        {races.map(race => (
          <ScheduleCard
            key={race.id}
            race={race}
            isFeatured={race.id === featuredRace?.id || race.id === selectedRaceId}
            onSelect={handleRaceSelect}
          />
        ))}
      </div>

      {lightbox && (
        <div className={`race-lightbox ${lightbox.active ? 'race-lightbox--active' : ''} ${lightbox.contentVisible ? 'race-lightbox--content-visible' : ''}`}>
          <div className="race-lightbox__backdrop" onClick={closeLightbox} />
          <div className="race-lightbox__frame" style={lightbox.style}>
            <img src={lightbox.photo} alt={lightbox.race.circuit_name} className="race-lightbox__image" onClick={closeLightbox} />
            <button className="race-lightbox__close" onClick={closeLightbox} aria-label="Close race image">Back</button>
            <div className="race-lightbox__info" onClick={(e) => e.stopPropagation()}>
              <div className="race-lightbox__head">
                <div>
                  <h3 className="race-lightbox__title">{lightbox.race.name}</h3>
                  <p className="race-lightbox__subtitle">{lightbox.race.circuit_name} - {lightbox.race.circuit_country}</p>
                </div>
                <p className="race-lightbox__timezone">Times shown in {viewerTimeZone}</p>
              </div>
              <div className="race-lightbox__facts">
                {(lightboxData?.trackFacts || [
                  { label: 'Length', value: `${lightbox.race.circuit_length} km` },
                  { label: 'Race Date', value: formatFullDate(lightbox.race.race_date) },
                ]).slice(0, 6).map((fact, idx) => (
                  <div key={idx} className="race-lightbox__fact">
                    <span>{fact.value}</span>
                    <small>{fact.label}</small>
                  </div>
                ))}
              </div>
              {lightboxData?.trackCharacter && (
                <p className="race-lightbox__character">{lightboxData.trackCharacter}</p>
              )}
              <div className="race-lightbox__grid">
                <section className="race-lightbox__panel">
                  <h4>Previous Winners</h4>
                  {(lightboxData?.previousWinners || []).slice(0, 4).map((winner, idx) => (
                    <div key={idx} className="race-lightbox__row">
                      <span className="race-lightbox__row-year">{winner.year}</span>
                      <span className="race-lightbox__row-main">{winner.rider}</span>
                      <span className="race-lightbox__row-meta">{winner.time}</span>
                    </div>
                  ))}
                  {!lightboxData?.previousWinners?.length && <p className="race-lightbox__empty">No winner history available.</p>}
                </section>
                <section className="race-lightbox__panel">
                  <h4>Fastest Times</h4>
                  {(lightboxData?.fastestLaps || []).slice(0, 4).map((lap, idx) => (
                    <div key={idx} className="race-lightbox__row">
                      <span className="race-lightbox__row-year">{lap.year}</span>
                      <span className="race-lightbox__row-main">{lap.rider}</span>
                      <span className="race-lightbox__row-meta">{lap.time} · {lap.session}</span>
                    </div>
                  ))}
                  {!lightboxData?.fastestLaps?.length && <p className="race-lightbox__empty">No fastest-lap data available.</p>}
                </section>
              </div>
              <section className="race-lightbox__panel race-lightbox__panel--schedule">
                <h4>Weekend Schedule (Your Local Time)</h4>
                {localSchedule.length > 0 ? (
                  <div className="race-lightbox__schedule">
                    {localSchedule.map((day, idx) => (
                      <div key={idx} className="race-lightbox__schedule-day">
                        <strong>{day.day}</strong>
                        {(day.sessions || []).map((session, i) => <p key={i}>{session}</p>)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="race-lightbox__empty">No session schedule available for this round.</p>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Calendar;
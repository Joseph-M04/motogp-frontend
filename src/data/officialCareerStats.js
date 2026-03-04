const OFFICIAL_LEGACY_IDS = {
  'Francesco Bagnaia': 8273,
  'Marc Marquez': 7444,
  'Jorge Martin': 8146,
  'Marco Bezzecchi': 8688,
  'Pedro Acosta': 8658,
  'Brad Binder': 7646,
  'Enea Bastianini': 8295,
  'Maverick Vinales': 7409,
  'Fabio di Giannantonio': 8539,
  'Franco Morbidelli': 7741,
  'Alex Marquez': 8173,
  'Fermin Aldeguer': 9867,
  'Fabio Quartararo': 8520,
  'Alex Rins': 8150,
  'Miguel Oliveira': 7199,
  'Jack Miller': 8049,
  'Joan Mir': 8141,
  'Luca Marini': 8431,
  'Johann Zarco': 7236,
  'Raul Fernandez': 8269,
  'Ai Ogura': 8680,
};

const API_BASE = 'https://api.pulselive.motogp.com/motogp/v1';
const cache = new Map();

function countByCategory(metric, regex) {
  if (!metric || !Array.isArray(metric.categories)) return 0;
  return metric.categories
    .filter((item) => regex.test(item?.category?.name || ''))
    .reduce((sum, item) => sum + (item?.count || 0), 0);
}

function buildClassBreakdown(raw) {
  return {
    motogp: {
      wins: countByCategory(raw.grand_prix_victories, /MotoGP/i),
      poles: countByCategory(raw.poles, /MotoGP/i),
      podiums: countByCategory(raw.podiums, /MotoGP/i),
      fastest_laps: countByCategory(raw.race_fastest_laps, /MotoGP/i),
      races: countByCategory(raw.all_races, /MotoGP/i),
      titles: countByCategory(raw.world_championship_wins, /MotoGP/i),
    },
    moto2: {
      wins: countByCategory(raw.grand_prix_victories, /Moto2|250cc/i),
      poles: countByCategory(raw.poles, /Moto2|250cc/i),
      podiums: countByCategory(raw.podiums, /Moto2|250cc/i),
      fastest_laps: countByCategory(raw.race_fastest_laps, /Moto2|250cc/i),
      races: countByCategory(raw.all_races, /Moto2|250cc/i),
      titles: countByCategory(raw.world_championship_wins, /Moto2|250cc/i),
    },
    moto3: {
      wins: countByCategory(raw.grand_prix_victories, /Moto3|125cc/i),
      poles: countByCategory(raw.poles, /Moto3|125cc/i),
      podiums: countByCategory(raw.podiums, /Moto3|125cc/i),
      fastest_laps: countByCategory(raw.race_fastest_laps, /Moto3|125cc/i),
      races: countByCategory(raw.all_races, /Moto3|125cc/i),
      titles: countByCategory(raw.world_championship_wins, /Moto3|125cc/i),
    },
  };
}

export async function fetchOfficialCareerStats(riderName) {
  const legacyId = OFFICIAL_LEGACY_IDS[riderName];
  if (!legacyId) return null;

  if (cache.has(legacyId)) {
    return cache.get(legacyId);
  }

  const response = await fetch(`${API_BASE}/riders/${legacyId}/stats`);
  if (!response.ok) {
    throw new Error(`Official stats fetch failed for ${riderName}`);
  }

  const raw = await response.json();
  const result = {
    careerStats: {
      wins: raw?.grand_prix_victories?.total || 0,
      poles: raw?.poles?.total || 0,
      podiums: raw?.podiums?.total || 0,
      fastest_laps: raw?.race_fastest_laps?.total || 0,
      races_completed: raw?.all_races?.total || 0,
      titles: raw?.world_championship_wins?.total || 0,
    },
    classBreakdown: buildClassBreakdown(raw),
  };

  cache.set(legacyId, result);
  return result;
}

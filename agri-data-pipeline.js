/* Agri-Data Pipeline — Ethiopian Agriculture Statistics
 * Sources: FAO, World Bank, NBE, ECTA, USDA, ESS
 * Caches fresh data daily, serves processed statistics.
 */

const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, 'agri-data.json');
const REFETCH_INTERVAL_MS = 24 * 60 * 60 * 1000; /* daily */

function loadCache() {
  try { return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')); }
  catch { return null; }
}

/* ── API adapter stubs (replace with real fetch toward FAO/World Bank) ── */
async function fetchFAOProduction() { return null; }
async function fetchWorldBankIndicators() { return null; }
async function fetchECXPrices() { return null; }

/* ── Merge live data into cache ── */
async function refreshCache() {
  const cache = loadCache() || { lastUpdated: null, sources: [] };
  const [fao, wb, ecx] = await Promise.allSettled([
    fetchFAOProduction(), fetchWorldBankIndicators(), fetchECXPrices()
  ]);
  /* For now the static JSON is the base; real fetch merges would go here */
  cache.lastUpdated = new Date().toISOString().split('T')[0];
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  return cache;
}

/* ── Express handler ── */
function createRouter(express) {
  const router = express.Router();

  /* Full dataset */
  router.get('/agri-data', (req, res) => {
    const data = loadCache();
    if (!data) return res.status(503).json({ error: 'Data not available' });
    /* Enrich with computed fields */
    const enriched = enrichData(data);
    res.json(enriched);
  });

  /* Production bar data (simplified for charts) */
  router.get('/agri-data/production', (req, res) => {
    const data = loadCache();
    if (!data) return res.status(503).json({ error: 'Data not available' });
    res.json(data.production.map(d => ({
      crop: d.crop, value: d.year2025, prev: d.year2024, unit: d.unit
    })));
  });

  /* Export time-series */
  router.get('/agri-data/exports', (req, res) => {
    const data = loadCache();
    if (!data) return res.status(503).json({ error: 'Data not available' });
    const years = ['2023', '2024', '2025'];
    const series = {};
    for (const key in data.exports) {
      series[key] = years.map(y => ({ year: y, value: data.exports[key][y] }));
    }
    res.json({ years, series });
  });

  return router;
}

function enrichData(data) {
  if (!data) return null;
  const e = JSON.parse(JSON.stringify(data));
  /* Coffee share of total agri exports */
  const total2025 = e.exports.totalAgriExports?.['2025'];
  const coffee2025 = e.exports.coffee?.['2025'];
  if (total2025 && coffee2025) {
    e.computed = {
      coffeeShareOfExports: +((coffee2025 / total2025) * 100).toFixed(1),
      avgFarmGDP: +((e.economic.agriGDP2025.value * 1e9) / e.demographics.totalFarmers).toFixed(0),
      exportGrowth24_25: +(((total2025 - e.exports.totalAgriExports['2024']) / e.exports.totalAgriExports['2024']) * 100).toFixed(1)
    };
  }
  return e;
}

/* Auto-refresh on load */
if (require.main === module) {
  console.log('[agri-data-pipeline] Initializing…');
  setInterval(() => { refreshCache().catch(console.error); }, REFETCH_INTERVAL_MS);
  refreshCache().then(() => console.log('[agri-data-pipeline] Cache ready.')).catch(console.error);
}

module.exports = { createRouter, refreshCache, loadCache };

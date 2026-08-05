const https = require('https');
const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, 'fx-cache.json');
const DEFAULT_RATE = 159.98;
const REFRESH_INTERVAL_MS = 30 * 60 * 1000;
const MAX_AGE_HOURS = 12;
const FETCH_TIMEOUT_MS = 8000;

var state = {
  rate: DEFAULT_RATE,
  source: 'cache',
  updatedAt: null,
  refreshedAt: null,
  prevRate: null,
  change24h: 0,
  fetchCount: 0,
  errorCount: 0,
  lastError: null
};

function fetchUrl(url) {
  return new Promise(function(resolve, reject) {
    var req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Accept': 'text/html,application/json,*/*' },
      timeout: FETCH_TIMEOUT_MS
    }, function(res) {
      var data = '';
      res.on('data', function(c) { data += c; });
      res.on('end', function() { resolve(data); });
    });
    req.on('error', reject);
    req.on('timeout', function() { req.destroy(); reject(new Error('Timeout')); });
  });
}

function parseNBERate(html) {
  var patterns = [
    /"cashBuying":"(\d{2,3}\.\d+)/,
    /USD.*?(\d{3}\.\d{1,4})/,
    /US DOLLAR[\s\S]{0,200}?(\d{3}\.\d{1,4})/,
    /USD\/ETB[^<>]*>(\d{3}\.\d{1,4})/,
    /(\d{3}\.\d{3})[\s]*ETB/
  ];
  for (var i = 0; i < patterns.length; i++) {
    var m = html.match(patterns[i]);
    if (m) {
      var val = parseFloat(m[1]);
      if (val >= 50 && val <= 300) return val;
    }
  }
  return null;
}

function tryFetchAddisfortune() {
  return fetchUrl('https://exchange.addisfortune.news/bank/national-bank-of-ethiopia')
    .then(function(html) {
      var rate = parseNBERate(html);
      if (rate) return { rate: rate, source: 'addisfortune.news' };
      throw new Error('Rate not found in addisfortune response');
    });
}

function tryFetchNBE() {
  return fetchUrl('https://nbe.gov.et/exchange/')
    .then(function(html) {
      var rate = parseNBERate(html);
      if (rate) return { rate: rate, source: 'nbe.gov.et' };
      throw new Error('Rate not found in NBE page');
    });
}

function tryFetchFexant() {
  return fetchUrl('https://www.fexant.com/bank/NBE')
    .then(function(html) {
      var m = html.match(/USD([\s\S]{0,300})?(\d{2,3}\.\d{1,4})/);
      if (m) {
        var rate = parseFloat(m[2]);
        if (rate >= 50 && rate <= 300) return { rate: rate, source: 'fexant.com' };
      }
      throw new Error('Rate not found in fexant response');
    });
}

function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      var cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      if (cached && cached.rate > 0) {
        state.rate = cached.rate;
        state.source = cached.source || 'cache';
        state.updatedAt = cached.updatedAt || null;
        state.prevRate = cached.prevRate || null;
      }
    }
  } catch (e) {}
}

function saveCache() {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify({
      rate: state.rate,
      source: state.source,
      updatedAt: state.updatedAt,
      prevRate: state.prevRate,
      savedAt: new Date().toISOString()
    }, null, 2));
  } catch (e) {}
}

function refreshRate() {
  var prevRate = state.rate;

  return tryFetchAddisfortune()
    .catch(function() { return tryFetchNBE(); })
    .catch(function() { return tryFetchFexant(); })
    .catch(function() {
      return { rate: null, source: 'fallback' };
    })
    .then(function(result) {
      state.fetchCount++;
      if (result.rate && result.rate > 0) {
        state.prevRate = prevRate;
        state.rate = result.rate;
        state.source = result.source;
        state.updatedAt = new Date().toISOString();
        state.change24h = prevRate ? +((result.rate - prevRate) / prevRate * 100).toFixed(2) : 0;
        state.lastError = null;
        saveCache();
      } else {
        state.errorCount++;
        state.lastError = 'All fetchers failed at ' + new Date().toISOString();
        if (state.rate <= 0) state.rate = DEFAULT_RATE;
      }
      state.refreshedAt = new Date().toISOString();
    });
}

function getState() {
  return {
    rate: +state.rate.toFixed(4),
    source: state.source,
    updatedAt: state.updatedAt,
    refreshedAt: state.refreshedAt,
    prevRate: state.prevRate ? +state.prevRate.toFixed(4) : null,
    change24h: state.change24h,
    fetchCount: state.fetchCount,
    errorCount: state.errorCount,
    lastError: state.lastError,
    nextRefreshIn: REFRESH_INTERVAL_MS
  };
}

var intervalId = null;

function start(immediate) {
  loadCache();
  if (immediate !== false) refreshRate();
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(refreshRate, REFRESH_INTERVAL_MS);
  return state;
}

function stop() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function getRate() {
  return state.rate;
}

module.exports = { start, stop, getRate, getState, refreshRate, fetchUrl };

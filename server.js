const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'agrospace2026';
const ADMIN_SESSION_TTL_MS = 24 * 60 * 60 * 1000;
let adminSessions = {};

app.use(express.static(__dirname, { setHeaders: function(res, p) { if (p.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); } }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { setHeaders: function(res, p) { if (p.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); } }));
app.use(express.json());

app.get('/', (req, res) => res.redirect('/preview-final.html'));

/* ── Admin auth ── */
function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const session = adminSessions[token];
  if (!session || session.expiresAt < Date.now()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.admin = { id: session.id };
  next();
}

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body || {};
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  adminSessions[token] = { id: token, createdAt: Date.now(), expiresAt: Date.now() + ADMIN_SESSION_TTL_MS };
  res.json({ success: true, token, expiresIn: ADMIN_SESSION_TTL_MS });
});

app.get('/api/auth/check', requireAdmin, (req, res) => res.json({ success: true }));

/* Serve admin dashboard (built React app) */
const ADMIN_DIST = path.join(__dirname, 'admin-dist');
if (fs.existsSync(ADMIN_DIST)) {
  app.use('/admin', express.static(ADMIN_DIST));
  app.get('/admin', (req, res) => res.redirect('/admin/'));
  app.get('/admin/*', (req, res) => res.sendFile(path.join(ADMIN_DIST, 'index.html')));
} else {
  app.get('/admin', (req, res) => res.status(503).send('Admin build not found. Run `npm run build:admin`.'));
}

/* ── Agri-Data Pipeline */
const agriDataPipeline = require('./agri-data-pipeline');
app.use('/api', agriDataPipeline.createRouter(express));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function(req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});

const upload = multer({ storage });

function flattenArticles(data) {
  const articles = [];
  if (!data || typeof data !== 'object') return articles;
  for (const key of Object.keys(data)) {
    const item = data[key];
    if (key === 'videos') continue;
    if (item && typeof item === 'object') {
      if (item.articles) {
        item.articles.forEach(a => articles.push(a));
      }
      if (item.children) {
        articles.push(...flattenArticles(item.children));
      }
    }
  }
  return articles;
}

app.get('/api/stats', (req, res) => {
  res.set('Content-Type', 'application/json');
  try {
    const articlesPath = path.join(__dirname, 'articles.json');
    let articlesData = {};
    try {
      const data = fs.readFileSync(articlesPath, 'utf8');
      articlesData = JSON.parse(data);
    } catch (e) {
      articlesData = {};
    }

    const allArticles = flattenArticles(articlesData);
    const totalArticles = allArticles.length;
    const totalClicks = allArticles.reduce((sum, a) => sum + (a.clickCount || 0), 0);
    const articlesWithClicks = allArticles
      .map(a => ({ title: a.title, clicks: a.clickCount || 0, date: a.date, category: a.category }))
      .sort((a, b) => b.clicks - a.clicks);
    const top5 = articlesWithClicks.slice(0, 5);

    res.json({
      totalArticles,
      totalClicks,
      articlesWithClicks,
      top5
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Category tree for the admin UI (how articles are organised in articles.json) */
function getCategoryTree() {
  const data = loadArticlesData();
  const tree = [];
  for (const key of Object.keys(data)) {
    const item = data[key];
    if (key === 'videos') continue;
    if (!item || typeof item !== 'object') continue;
    const node = { key, label: item.label || key, children: [] };
    if (item.children) {
      for (const subKey of Object.keys(item.children)) {
        const sub = item.children[subKey];
        if (!sub) continue;
        const subNode = { key: subKey, label: sub.label || subKey, count: (sub.articles || []).length };
        if (sub.articles) subNode.articles = sub.articles;
        node.children.push(subNode);
      }
    }
    tree.push(node);
  }
  return tree;
}

function loadArticlesData() {
  const articlesPath = path.join(__dirname, 'articles.json');
  try { return JSON.parse(fs.readFileSync(articlesPath, 'utf8')); }
  catch (e) { return {}; }
}

function saveArticlesData(data) {
  fs.writeFileSync(path.join(__dirname, 'articles.json'), JSON.stringify(data, null, 2));
}

function findArticleRef(data, id) {
  for (const catKey of Object.keys(data)) {
    const cat = data[catKey];
    if (!cat || typeof cat !== 'object' || !cat.children) continue;
    for (const subKey of Object.keys(cat.children)) {
      const sub = cat.children[subKey];
      if (!sub || !Array.isArray(sub.articles)) continue;
      for (let i = 0; i < sub.articles.length; i++) {
        if (String(sub.articles[i].id) === String(id)) {
          return { parent: sub, index: i };
        }
      }
    }
  }
  return null;
}

function nextArticleId(data) {
  let max = 0;
  const all = flattenArticles(data);
  for (const a of all) if (Number(a.id) > max) max = Number(a.id);
  return max + 1;
}

function normalizeArticle(input, existing) {
  const prev = existing || {};
  const title = (input.title !== undefined ? input.title : prev.title) || 'Untitled';
  const body = (input.body !== undefined ? input.body : prev.body) || '';
  return {
    id: input.id !== undefined ? input.id : prev.id,
    title,
    date: input.date !== undefined ? input.date : (prev.date || new Date().toISOString().split('T')[0]),
    category: input.category !== undefined ? input.category : prev.category,
    description: input.description !== undefined ? input.description : (prev.description || (body ? body.split('\n')[0].slice(0, 180) : '')),
    author: input.author !== undefined ? input.author : (prev.author || 'AgroSpace Ethiopia'),
    readingTime: input.readingTime !== undefined ? input.readingTime : (prev.readingTime || Math.max(1, Math.ceil(String(body).split(' ').length / 200)) + ' min read'),
    body,
    image: input.image !== undefined ? input.image : prev.image,
    tags: input.tags !== undefined ? input.tags : (prev.tags || []),
    clickCount: prev.clickCount || 0,
    featured: input.featured !== undefined ? input.featured : (prev.featured || false)
  };
}

app.get('/api/articles', (req, res) => {
  res.set('Content-Type', 'application/json');
  try {
    const allArticles = flattenArticles(loadArticlesData());
    res.json({ articles: allArticles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Articles in the exact shape the site preview expects (desc + time aliases) */
app.get('/api/articles/site', (req, res) => {
  res.set('Content-Type', 'application/json');
  try {
    const allArticles = flattenArticles(loadArticlesData()).map(a => ({
      id: a.id,
      title: a.title,
      date: a.date,
      category: a.category,
      desc: a.description || a.desc || '',
      time: a.readingTime || a.time || '',
      body: a.body || '',
      image: a.image || '',
      featured: !!a.featured
    }));
    res.json({ articles: allArticles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Category tree (public, drives the admin menu + site organisation) */
app.get('/api/articles/tree', (req, res) => {
  res.set('Content-Type', 'application/json');
  try {
    res.json({ tree: getCategoryTree() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Create article (admin auth) — places it in the validated category/subcategory */
app.post('/api/articles', requireAdmin, upload.single('image'), (req, res) => {
  res.set('Content-Type', 'application/json');
  try {
    const { title, body, category, subcategory, description, author, tags, featured } = req.body;
    const imageFile = req.file;
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    const now = new Date().toISOString().split('T')[0];
    const article = insertArticleRecord({
      title,
      body,
      category,
      subcategory,
      description,
      author,
      tags: tags ? (Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean)) : [],
      featured: featured === 'true' || featured === true,
      image: imageFile ? '/uploads/' + imageFile.filename : ''
    });
    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Update article by id (admin auth) */
app.put('/api/articles/:id', requireAdmin, upload.single('image'), (req, res) => {
  res.set('Content-Type', 'application/json');
  try {
    const data = loadArticlesData();
    const ref = findArticleRef(data, req.params.id);
    if (!ref) return res.status(404).json({ error: 'Article not found' });

    const imageFile = req.file;
    const patch = { ...req.body };
    if (imageFile) patch.image = '/uploads/' + imageFile.filename;

    const updated = normalizeArticle(patch, ref.parent.articles[ref.index]);
    ref.parent.articles[ref.index] = updated;
    saveArticlesData(data);
    res.json({ success: true, article: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Delete article by id (admin auth) */
app.delete('/api/articles/:id', requireAdmin, (req, res) => {
  res.set('Content-Type', 'application/json');
  try {
    const data = loadArticlesData();
    const ref = findArticleRef(data, req.params.id);
    if (!ref) return res.status(404).json({ error: 'Article not found' });
    ref.parent.articles.splice(ref.index, 1);
    saveArticlesData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function loadIdentifySubmissions() {
  const path = require('path');
  const submissionsPath = path.join(__dirname, 'identify-submissions.json');
  try {
    const data = fs.readFileSync(submissionsPath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveIdentifySubmissions(submissions) {
  const path = require('path');
  const submissionsPath = path.join(__dirname, 'identify-submissions.json');
  fs.writeFileSync(submissionsPath, JSON.stringify(submissions, null, 2));
}

app.post('/api/identify-submit', express.json(), (req, res) => {
  res.set('Content-Type', 'application/json');
  try {
    const submission = {
      id: Date.now() + '-' + Math.round(Math.random() * 1E9),
      type: req.body.type || '',
      name: req.body.name || '',
      email: req.body.email || '',
      phone: req.body.phone || '',
      company: req.body.company || '',
      data: req.body.data || {},
      submittedAt: new Date().toISOString()
    };
    const submissions = loadIdentifySubmissions();
    submissions.push(submission);
    saveIdentifySubmissions(submissions);
    res.json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/identify-stats', (req, res) => {
  res.set('Content-Type', 'application/json');
  try {
    const submissions = loadIdentifySubmissions();
    const stats = {
      total: submissions.length,
      byType: {},
      byDate: {}
    };
    submissions.forEach(s => {
      stats.byType[s.type] = (stats.byType[s.type] || 0) + 1;
      const date = s.submittedAt ? s.submittedAt.split('T')[0] : 'unknown';
      stats.byDate[date] = (stats.byDate[date] || 0) + 1;
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/identify-submissions', (req, res) => {
  res.set('Content-Type', 'application/json');
  try {
    const submissions = loadIdentifySubmissions();
    const result = submissions.map(s => ({
      id: s.id,
      type: s.type,
      name: s.name,
      email: s.email,
      phone: s.phone,
      company: s.company,
      submittedAt: s.submittedAt,
      data: s.data
    }));
    res.json({ submissions: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ── Data Room tools (admin auth) ── */
const UPLOADS_DIR = path.join(__dirname, 'uploads');

function listUploads() {
  if (!fs.existsSync(UPLOADS_DIR)) return [];
  return fs.readdirSync(UPLOADS_DIR)
    .filter(f => !f.startsWith('.'))
    .map(f => {
      const st = fs.statSync(path.join(UPLOADS_DIR, f));
      return {
        name: f,
        size: st.size,
        modified: st.mtime.toISOString(),
        url: '/uploads/' + f
      };
    })
    .sort((a, b) => b.modified.localeCompare(a.modified));
}

app.get('/api/uploads', requireAdmin, (req, res) => {
  res.set('Content-Type', 'application/json');
  try {
    res.json({ files: listUploads() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/uploads/:name', requireAdmin, (req, res) => {
  res.set('Content-Type', 'application/json');
  try {
    const name = path.basename(req.params.name);
    if (!name || name === '.' || name === '..') return res.status(400).json({ error: 'Invalid file name' });
    const target = path.join(UPLOADS_DIR, name);
    if (!fs.existsSync(target)) return res.status(404).json({ error: 'File not found' });
    fs.unlinkSync(target);
    res.json({ success: true, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/data/export/:which', requireAdmin, (req, res) => {
  try {
    const which = String(req.params.which || '').replace(/[^a-z0-9-]/gi, '');
    const filename = which === 'agri-data' ? 'agri-data.json' : 'articles.json';
    const target = path.join(__dirname, filename);
    if (!fs.existsSync(target)) return res.status(404).json({ error: 'Data file not found' });
    res.set('Content-Type', 'application/json');
    res.set('Content-Disposition', 'attachment; filename="' + filename + '"');
    fs.createReadStream(target).pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ── Agri-Rédacteur → Admin review pipeline ── */
const { exec } = require('child_process');

const AGRI_INDEX = '/Users/abe/agrospace-ethiopia/agri-redacteur-software/articles/index.json';
const AGRI_PENDING = path.join(__dirname, 'agri-pending.json');
const THEME_TO_CATEGORY = {
  'coffee & tea': 'COFFEE',
  'cereals & wheat': 'TEFF AND CEREALS',
  'fertilizer & inputs': 'SUPPLY CHAIN',
  'livestock & dairy': 'SUPPLY CHAIN',
  'agri-finance & credit': 'INVESTMENT',
  'exports & trade': 'SUPPLY CHAIN',
  'policy & regulation': 'QUALITY AND STANDARDS',
  'irrigation & water': 'SUPPLY CHAIN',
  'oilseeds & pulses': 'SESAME AND OILSEEDS',
  'agritech & innovation': 'DIGITALIZATION AND TRACEABILITY'
};

function loadPending() {
  try { return JSON.parse(fs.readFileSync(AGRI_PENDING, 'utf8')); }
  catch (e) { return []; }
}

function savePending(list) {
  fs.writeFileSync(AGRI_PENDING, JSON.stringify(list, null, 2));
}

function desktopNotify(title, message) {
  const safeTitle = String(title).replace(/"/g, "'");
  const safeMsg = String(message).replace(/"/g, "'").slice(0, 200);
  exec('osascript -e \'display notification "' + safeMsg + '" with title "' + safeTitle + '" sound name "Funk"\'', (err) => {
    if (err) exec('osascript -e \'display notification "' + safeMsg + '" with title "' + safeTitle + '"\'');
  });
}

function scanAgriArticles() {
  let index;
  try {
    index = JSON.parse(fs.readFileSync(AGRI_INDEX, 'utf8'));
  } catch (e) {
    return { added: 0, error: 'agent index not found' };
  }
  const pending = loadPending();
  const knownFiles = new Set(pending.map((p) => p.file));
  const existingTitles = flattenArticles(loadArticlesData()).map((a) => (a.title || '').toLowerCase());

  let added = 0;
  (index.articles || []).forEach((art) => {
    if (!art.file || knownFiles.has(art.file)) return;
    if (existingTitles.includes(String(art.title || '').toLowerCase())) return;

    let body = '';
    try { body = fs.readFileSync(art.file, 'utf8'); } catch (e) { /* skip unreadable */ }
    if (!body) return;

    pending.push({
      id: 'agri-' + Date.now() + '-' + added + '-' + Math.round(Math.random() * 1e6),
      title: art.title || '',
      meta: art.meta || '',
      body: body.replace(/^.*\n={3,}\n/, '').trim(),
      source_url: art.source_url || '',
      date: art.date || new Date().toISOString().split('T')[0],
      tone: art.tone || '',
      angle: art.angle || '',
      word_count: art.word_count || 0,
      qa_passed: !!art.qa_passed,
      file: art.file,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    added++;
  });

  if (added > 0) {
    savePending(pending);
    const first = pending[pending.length - 1];
    desktopNotify('AgriRédacteur — Nouvel article', '« ' + first.title + ' » attend ta validation dans l\'admin.');
  }
  return { added, pending: pending.length };
}

function insertArticleRecord({ title, body, category, subcategory, description, author, tags, featured, image }) {
  const data = loadArticlesData();
  const catKey = (category || 'general').toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const subKey = (subcategory || 'general').toLowerCase().replace(/[^a-z0-9-]/g, '-');
  if (!data[catKey]) data[catKey] = { label: category || catKey, children: {} };
  if (!data[catKey].children[subKey]) {
    data[catKey].children[subKey] = { label: subcategory || subKey, articles: [] };
  }
  const article = normalizeArticle({
    id: nextArticleId(data),
    title,
    body,
    date: new Date().toISOString().split('T')[0],
    category,
    description,
    author,
    readingTime: Math.max(1, Math.ceil(body.split(' ').length / 200)) + ' min read',
    image,
    tags: tags ? (Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim()).filter(Boolean)) : [],
    featured: featured === 'true' || featured === true
  });
  data[catKey].children[subKey].articles.push(article);
  saveArticlesData(data);
  return article;
}

app.get('/api/agri/pending', requireAdmin, (req, res) => {
  res.set('Content-Type', 'application/json');
  const pending = loadPending().filter((p) => p.status === 'pending');
  res.json({ pending });
});

app.post('/api/agri/scan', requireAdmin, (req, res) => {
  res.set('Content-Type', 'application/json');
  try {
    res.json(scanAgriArticles());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/agri/approve', requireAdmin, (req, res) => {
  res.set('Content-Type', 'application/json');
  try {
    const { id, category, subcategory, image } = req.body || {};
    const pending = loadPending();
    const item = pending.find((p) => p.id === id && p.status === 'pending');
    if (!item) return res.status(404).json({ error: 'Pending article not found' });
    if (!category) return res.status(400).json({ error: 'Category is required' });

    const desc = (item.meta || item.body.split('\n')[0] || '').slice(0, 180);
    const article = insertArticleRecord({
      title: item.title,
      body: item.body,
      category,
      subcategory: subcategory || 'general',
      description: desc,
      author: 'AgriRédacteur',
      tags: [],
      featured: false,
      image: image || ''
    });

    item.status = 'approved';
    item.approvedAt = new Date().toISOString();
    item.articleId = article.id;
    savePending(pending);
    desktopNotify('AgriRédacteur — Publié', '« ' + item.title + ' » est en ligne sur le site.');
    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/agri/reject', requireAdmin, (req, res) => {
  res.set('Content-Type', 'application/json');
  try {
    const { id } = req.body || {};
    const pending = loadPending();
    const item = pending.find((p) => p.id === id && p.status === 'pending');
    if (!item) return res.status(404).json({ error: 'Pending article not found' });
    item.status = 'rejected';
    item.rejectedAt = new Date().toISOString();
    savePending(pending);
    desktopNotify('AgriRédacteur — Refusé', '« ' + item.title + ' » ne sera pas publié.');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ── Price Engine ── */
const PRICE_HISTORY = {};

function initPriceHistory() {
  const agri = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname,'agri-data.json'),'utf8')); } catch(e) { return null; } })();
  if (!agri || !agri.prices) return;
  const now = Date.now();
  agri.prices.forEach(p => {
    const base26 = p.price2026 || 1;
    const base25 = p.price2025 || base26 * 0.9;
    const slug = p.commodity.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
    const arr = [];
    for (let d = 90; d >= 0; d--) {
      const t = now - d * 86400000;
      const progress = d / 90;
      const base = base25 + (base26 - base25) * progress;
      const noise = (Math.random() - 0.5) * base * 0.12;
      arr.push({ t, p: +(base + noise).toFixed(2), v: Math.round(50000 + Math.random() * 200000) });
    }
    PRICE_HISTORY[slug] = arr;
  });
}

function getLatestPrices() {
  const agri = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname,'agri-data.json'),'utf8')); } catch(e) { return null; } })();
  if (!agri || !agri.prices) return [];
  return agri.prices.map(p => {
    const slug = p.commodity.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
    const hist = PRICE_HISTORY[slug];
    const last = hist && hist.length ? hist[hist.length-1] : null;
    const prev = hist && hist.length > 1 ? hist[hist.length-2] : null;
    const currPrice = last ? last.p : (p.price2026 || 1);
    const prevPrice = prev ? prev.p : (p.price2025 || currPrice * 0.95);
    const change = +(currPrice - prevPrice).toFixed(2);
    const changePct = prevPrice ? +((change / prevPrice) * 100).toFixed(2) : 0;
    const spread = +(currPrice * (0.005 + Math.random() * 0.015)).toFixed(3);
    const volume = last ? last.v : Math.round(50000 + Math.random() * 200000);
    const high24 = +(currPrice * (1 + Math.random() * 0.04)).toFixed(2);
    const low24 = +(currPrice * (1 - Math.random() * 0.04)).toFixed(2);
    const category = p.commodity.toLowerCase().includes('coffee') ? 'Softs' :
      p.commodity.toLowerCase().includes('sesame') ? 'Oilseeds' :
      p.commodity.toLowerCase().includes('teff') || p.commodity.toLowerCase().includes('maize') || p.commodity.toLowerCase().includes('wheat') || p.commodity.toLowerCase().includes('soybean') ? 'Grains' :
      p.commodity.toLowerCase().includes('avocado') || p.commodity.toLowerCase().includes('honey') ? 'Specialty' : 'Others';
    return {
      slug, commodity: p.commodity, price: currPrice, unit: p.unit || 'USD/kg',
      change, changePct, bid: +(currPrice - spread/2).toFixed(3),
      ask: +(currPrice + spread/2).toFixed(3), spread, volume,
      high24, low24, category, source: p.source || 'ECX',
      lastUpdate: last ? new Date(last.t).toISOString() : new Date().toISOString()
    };
  });
}

function getPriceHistory(slug, days = 90) {
  const hist = PRICE_HISTORY[slug];
  if (!hist) return [];
  const cut = Date.now() - days * 86400000;
  return hist.filter(h => h.t >= cut).map(h => ({ t: h.t, p: h.p, v: h.v }));
}

initPriceHistory();

/* ── FX Rate Pipeline (NBE live) ── */
const fxPipeline = require('./fx-pipeline');
fxPipeline.start(true);

app.get('/api/prices', (req, res) => {
  res.set('Content-Type', 'application/json');
  const fx = fxPipeline.getRate();
  const fxState = fxPipeline.getState();
  const prices = getLatestPrices().map(function(p){
    p.priceETB = +(p.price * fx).toFixed(2);
    return p;
  });
  res.json({
    prices,
    fx: +fx.toFixed(4),
    fxSource: fxState.source,
    fxUpdatedAt: fxState.updatedAt,
    fxChange24h: fxState.change24h,
    updatedAt: new Date().toISOString()
  });
});

app.get('/api/fx', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.json(fxPipeline.getState());
});

app.get('/api/prices/history', (req, res) => {
  res.set('Content-Type', 'application/json');
  const slug = req.query.slug || '';
  const days = parseInt(req.query.days) || 90;
  res.json({ slug, history: getPriceHistory(slug, days) });
});

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});

/* Auto-scan agent output every 5 min so a desktop notification fires on new articles */
const AGRI_AUTO_SCAN_MS = 5 * 60 * 1000;
setInterval(() => {
  try {
    const res = scanAgriArticles();
    if (res.added > 0) console.log('Agri auto-scan: %d new article(s) awaiting review', res.added);
  } catch (e) {
    console.error('Agri auto-scan error:', e.message);
  }
}, AGRI_AUTO_SCAN_MS);

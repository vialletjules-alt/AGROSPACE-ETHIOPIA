import React, { useEffect, useState, useCallback, useMemo } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || '';
const CATEGORIES = [
  'COFFEE',
  'SESAME AND OILSEEDS',
  'FRUITS AND VEGETABLES',
  'TEFF AND CEREALS',
  'SPICES AND AROMATICS',
  'HONEY',
  'QUALITY AND STANDARDS',
  'SUPPLY CHAIN',
  'DIGITALIZATION AND TRACEABILITY',
  'INVESTMENT'
];

const ILLUSTRATIONS = [
  { label: 'Coffee', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=60' },
  { label: 'Sesame', url: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?auto=format&fit=crop&w=800&q=60' },
  { label: 'Teff / Cereals', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=60' },
  { label: 'Honey', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=60' },
  { label: 'Spices', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=60' },
  { label: 'Fruit / Vegetables', url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=60' },
  { label: 'Supply chain', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=60' },
  { label: 'Investment', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=60' }
];

function getToken() {
  return localStorage.getItem('agrospace_admin_token') || '';
}

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: 'Bearer ' + t } : {};
}

async function api(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) }
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(API_BASE + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Login failed');
      localStorage.setItem('agrospace_admin_token', data.token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <div className="login-logo">AGROSPACE</div>
        <h1>Ethiopia — Admin</h1>
        <p className="login-sub">Password required to manage articles.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
        />
        {error && <div className="error">{error}</div>}
        <button className="btn primary block" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

function CategoryPicker({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select a category…</option>
      {CATEGORIES.map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  );
}

function ArticleForm({ article, categories, onSave, onCancel, busy }) {
  const [form, setForm] = useState({
    title: article?.title || '',
    body: article?.body || article?.content || '',
    description: article?.description || '',
    category: article?.category || '',
    subcategory: '',
    author: article?.author || '',
    readingTime: article?.readingTime || '',
    tags: (article?.tags || []).join(', '),
    featured: !!article?.featured
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(article?.image || '');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const categoryLabels = CATEGORIES.map((c) => c.toLowerCase()).reduce((acc, c) => {
    acc[c] = c;
    return acc;
  }, {});

  const normalizedCategory = CATEGORIES.find(
    (c) => c.toLowerCase() === String(form.category || '').toLowerCase()
  );

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!normalizedCategory) {
      setError('Please select a valid category from the list.');
      return;
    }
    const payload = {
      title: form.title,
      body: form.body,
      description: form.description || form.body.split('\n')[0].slice(0, 180),
      category: normalizedCategory,
      author: form.author || 'AgroSpace Ethiopia',
      readingTime: form.readingTime || undefined,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      featured: form.featured
    };
    const fd = new FormData();
    Object.keys(payload).forEach((k) => {
      if (payload[k] !== undefined && payload[k] !== null) fd.append(k, payload[k]);
    });
    if (image) fd.append('image', image);

    try {
      const data = await api(
        article ? '/api/articles/' + article.id : '/api/articles',
        { method: article ? 'PUT' : 'POST', body: fd }
      );
      onSave(data.article);
    } catch (err) {
      setError(err.message);
    }
  };

  const togglePreview = () => setPreview(!preview);

  return (
    <form className="form" onSubmit={submit}>
      {preview ? (
        <div className="preview-box">
          <h2>{form.title || 'Untitled'}</h2>
          <div className="preview-meta">
            {normalizedCategory && <span className="pill">{normalizedCategory}</span>}
            {form.readingTime && <span>{form.readingTime}</span>}
          </div>
          {imagePreview && <img src={imagePreview} alt="" className="preview-img" />}
          <p className="preview-desc">{form.description || form.body.split('\n')[0].slice(0, 180)}</p>
          <p className="preview-body">{form.body}</p>
        </div>
      ) : (
        <>
          <div className="form-row">
            <label>
              Title *
              <input value={form.title} onChange={set('title')} placeholder="Article title" required />
            </label>
          </div>
          <div className="form-row grid2">
            <label>
              Category *
              <CategoryPicker value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
              <small>{normalizedCategory ? 'Valid category' : 'Must match one of the site categories'}</small>
            </label>
            <label>
              Reading time
              <input value={form.readingTime} onChange={set('readingTime')} placeholder="5 min read" />
            </label>
          </div>
          <div className="form-row grid2">
            <label>
              Author
              <input value={form.author} onChange={set('author')} placeholder="AgroSpace Ethiopia" />
            </label>
            <label>
              Tags (comma separated)
              <input value={form.tags} onChange={set('tags')} placeholder="coffee, export, quality" />
            </label>
          </div>
          <div className="form-row">
            <label>
              Short description
              <textarea value={form.description} onChange={set('description')} rows={2} placeholder="One-line summary shown in preview" />
            </label>
          </div>
          <div className="form-row">
            <label>
              Body *
              <textarea value={form.body} onChange={set('body')} rows={10} placeholder="Full article text…" required />
            </label>
          </div>
          <div className="form-row">
            <label>
              Image
              <input type="file" accept="image/*" onChange={(e) => {
                const f = e.target.files[0];
                if (f) {
                  setImage(f);
                  setImagePreview(URL.createObjectURL(f));
                }
              }} />
            </label>
            {imagePreview && (
              <div className="img-preview">
                <img src={imagePreview} alt="preview" />
                <button type="button" className="btn ghost" onClick={() => { setImage(null); setImagePreview(''); }}>Remove</button>
              </div>
            )}
          </div>
          <label className="check">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured (appears in hero)
          </label>
        </>
      )}

      {error && <div className="error">{error}</div>}
      <div className="form-actions">
        <button type="button" className="btn ghost" onClick={togglePreview}>{preview ? 'Edit' : 'Preview'}</button>
        <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Saving…' : article ? 'Update article' : 'Publish article'}
        </button>
      </div>
    </form>
  );
}

function ArticleList({ articles, onEdit, onDelete, onNew }) {
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('');
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(0);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (category && String(a.category || '').toLowerCase() !== category.toLowerCase()) return false;
      if (filter && !(a.title || '').toLowerCase().includes(filter.toLowerCase())) return false;
      return true;
    });
  }, [articles, category, filter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === 'title' || sortKey === 'category') {
        va = String(va || '').toLowerCase();
        vb = String(vb || '').toLowerCase();
        return va.localeCompare(vb) * dir;
      }
      va = String(va || '');
      vb = String(vb || '');
      return va.localeCompare(vb) * dir;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const rows = sorted.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE);

  useEffect(() => { setPage(0); }, [filter, category, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'title' || key === 'category' ? 'asc' : 'desc');
    }
  };

  const sortArrow = (key) => (sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '');

  return (
    <div className="list">
      <div className="list-toolbar">
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search title…" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="btn primary" onClick={onNew}>+ New article</button>
      </div>
      <div className="list-header">
        <button type="button" className="sortable" onClick={() => toggleSort('title')}>Title{sortArrow('title')}</button>
        <button type="button" className="sortable" onClick={() => toggleSort('category')}>Category{sortArrow('category')}</button>
        <button type="button" className="sortable" onClick={() => toggleSort('date')}>Date{sortArrow('date')}</button>
        <span>Actions</span>
      </div>
      {rows.map((a) => (
        <div className="list-row" key={a.id}>
          <span className="cell-title">
            {a.image && <img src={a.image} alt="" className="thumb" />}
            <span>
              <strong>{a.title}</strong>
              {a.featured && <em className="feat">★ featured</em>}
            </span>
          </span>
          <span><span className="pill">{a.category}</span></span>
          <span className="cell-date">{a.date}</span>
          <span className="cell-actions">
            <button className="btn ghost" onClick={() => onEdit(a)}>Edit</button>
            <button className="btn danger" onClick={() => onDelete(a)}>Delete</button>
          </span>
        </div>
      ))}
      {filtered.length === 0 && <div className="empty">No articles found.</div>}
      <div className="list-footer">
        <span>{sorted.length} article{sorted.length === 1 ? '' : 's'}</span>
        <div className="pager">
          <button className="btn ghost" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>‹ Prev</button>
          <span className="page-info">{safePage + 1} / {totalPages}</span>
          <button className="btn ghost" disabled={safePage >= totalPages - 1} onClick={() => setPage(safePage + 1)}>Next ›</button>
        </div>
      </div>
    </div>
  );
}

function DataRoom({ articles, onToast }) {
  const [stats, setStats] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const [s, u, sub] = await Promise.all([
        api('/api/stats'),
        api('/api/uploads'),
        api('/api/identify-submissions')
      ]);
      setStats(s || {});
      setUploads(u.files || []);
      setSubmissions(sub.submissions || []);
    } catch (err) {
      onToast('Data room: ' + err.message);
    } finally {
      setBusy(false);
    }
  }, [onToast]);

  useEffect(() => { load(); }, [load]);

  const audit = useMemo(() => {
    const problems = [];
    const seen = new Map();
    articles.forEach((a) => {
      if (seen.has(a.id)) {
        problems.push('Duplicate id #' + a.id + ' ("' + a.title + '")');
      }
      seen.set(a.id, true);
      if (!a.title || !String(a.title).trim()) problems.push('Article #' + a.id + ' has no title');
      if (!a.category) problems.push('Article #' + a.id + ' ("' + a.title + '") has no category');
      if (!a.date) problems.push('Article #' + a.id + ' ("' + a.title + '") has no date');
      if (!a.description && !a.desc && !a.body) problems.push('Article #' + a.id + ' ("' + a.title + '") is empty');
    });
    return problems;
  }, [articles]);

  const fmtSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const handleDeleteUpload = async (f) => {
    if (!window.confirm('Delete upload "' + f.name + '"?')) return;
    try {
      await api('/api/uploads/' + encodeURIComponent(f.name), { method: 'DELETE' });
      setUploads(uploads.filter((x) => x.name !== f.name));
      onToast('Upload deleted.');
    } catch (err) {
      onToast(err.message);
    }
  };

  const handleExport = async (which) => {
    const token = getToken();
    try {
      const res = await fetch('/api/data/export/' + which, {
        headers: { Authorization: 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = which === 'agri-data' ? 'agri-data.json' : 'articles.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      onToast('Export downloaded.');
    } catch (err) {
      onToast(err.message);
    }
  };

  return (
    <div className="dataroom">
      <div className="dr-section">
        <div className="dr-headline">
          <h3>Overview</h3>
          <button className="btn ghost" onClick={load} disabled={busy}>{busy ? 'Refreshing…' : 'Refresh'}</button>
        </div>
        <div className="dr-cards">
          <div className="dr-card"><span className="dr-num">{stats ? stats.totalArticles : '…'}</span><span className="dr-label">Articles</span></div>
          <div className="dr-card"><span className="dr-num">{stats ? stats.totalClicks : '…'}</span><span className="dr-label">Total clicks</span></div>
          <div className="dr-card"><span className="dr-num">{uploads.length}</span><span className="dr-label">Uploads</span></div>
          <div className="dr-card"><span className="dr-num">{submissions.length}</span><span className="dr-label">Lead submissions</span></div>
          <div className="dr-card"><span className="dr-num">{articles.length}</span><span className="dr-label">In DB</span></div>
        </div>
        {stats && stats.top5 && stats.top5.length > 0 && (
          <div className="dr-top">
            <strong>Top 5 most clicked</strong>
            <ol>
              {stats.top5.map((t) => (
                <li key={t.title}>{t.title} <span className="dr-muted">· {t.clicks} clicks</span></li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div className="dr-section">
        <h3>Data audit</h3>
        {audit.length === 0 ? (
          <div className="dr-ok">No problems detected.</div>
        ) : (
          <ul className="dr-issues">
            {audit.slice(0, 20).map((p, i) => <li key={i}>{p}</li>)}
            {audit.length > 20 && <li>… and {audit.length - 20} more</li>}
          </ul>
        )}
      </div>

      <div className="dr-section">
        <h3>Uploads <span className="dr-muted">({uploads.length})</span></h3>
        {uploads.length === 0 ? (
          <div className="dr-ok">No uploads yet.</div>
        ) : (
          <div className="dr-table">
            <div className="dr-row dr-head"><span>File</span><span>Size</span><span>Modified</span><span>Actions</span></div>
            {uploads.map((f) => (
              <div className="dr-row" key={f.name}>
                <span className="dr-file">{f.name}</span>
                <span>{fmtSize(f.size)}</span>
                <span className="dr-muted">{new Date(f.modified).toLocaleDateString()}</span>
                <span className="cell-actions">
                  <a className="btn ghost" href={f.url} target="_blank" rel="noreferrer">Open</a>
                  <button className="btn danger" onClick={() => handleDeleteUpload(f)}>Delete</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dr-section">
        <h3>Export data <span className="dr-muted">(backup)</span></h3>
        <div className="cell-actions">
          <button className="btn ghost" onClick={() => handleExport('articles')}>Download articles.json</button>
          <button className="btn ghost" onClick={() => handleExport('agri-data')}>Download agri-data.json</button>
        </div>
      </div>

      <div className="dr-section">
        <h3>Lead submissions <span className="dr-muted">({submissions.length})</span></h3>
        {submissions.length === 0 ? (
          <div className="dr-ok">No submissions yet.</div>
        ) : (
          <div className="dr-table">
            <div className="dr-row dr-head"><span>Name</span><span>Email</span><span>Company</span><span>Date</span></div>
            {submissions.map((s) => (
              <div className="dr-row" key={s.id}>
                <span className="dr-file">{s.name || s.type || '—'}</span>
                <span>{s.email || '—'}</span>
                <span>{s.company || '—'}</span>
                <span className="dr-muted">{s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {busy && <div className="dr-busy">Refreshing…</div>}
    </div>
  );
}

function ReviewModal({ pending, onApprove, onReject, busy }) {
  const [selectedImage, setSelectedImage] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [category, setCategory] = useState('');
  const [showArticle, setShowArticle] = useState(false);

  useEffect(() => {
    setSelectedImage('');
    setCustomUrl('');
    setCategory('');
    setShowArticle(false);
  }, [pending && pending.id]);

  if (!pending) return null;

  const imageChoice = customUrl.trim() || selectedImage;
  const canApprove = category && imageChoice;

  const effAuthor = pending.author || 'AgriRédacteur';
  const effReading = pending.readingTime || Math.max(1, Math.ceil((pending.body || '').split(' ').length / 200)) + ' min read';

  return (
    <div className="review-overlay">
      <div className="review-modal">
        <div className="review-badge">
          <span className="review-dot" /> Article generated by AgriRédacteur — awaiting your validation
        </div>

        <div className="review-head">
          <h2>{pending.title}</h2>
          <div className="review-meta">
            <span className="pill">{pending.source_url ? 'Source: ' + new URL(pending.source_url).hostname : 'Source unknown'}</span>
            <span>{pending.date}</span>
            <span>{pending.word_count} words</span>
            <span className={pending.qa_passed ? 'qa ok' : 'qa'}>QA {pending.qa_passed ? 'passed' : 'not run'}</span>
          </div>
          {pending.meta && <p className="review-desc">{pending.meta}</p>}
        </div>

        <div className="review-actions">
          <button className="btn ghost" onClick={() => setShowArticle(!showArticle)}>
            {showArticle ? 'Hide full article' : 'Read full article'}
          </button>
        </div>

        {showArticle && (
          <div className="review-body">
            <p>{pending.body}</p>
          </div>
        )}

        <div className="review-section">
          <h3>Illustration</h3>
          <div className="review-imgs">
            {ILLUSTRATIONS.map((img) => (
              <button
                key={img.url}
                type="button"
                className={'review-img' + (selectedImage === img.url ? ' sel' : '')}
                onClick={() => { setSelectedImage(img.url); setCustomUrl(''); }}
              >
                <img src={img.url} alt={img.label} />
                <span>{img.label}</span>
              </button>
            ))}
          </div>
          <label className="review-url">
            Or paste an image URL:
            <input value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} placeholder="https://…/image.jpg" />
          </label>
          {imageChoice && (
            <div className="review-chosen">
              <img src={imageChoice} alt="chosen" />
              <span>Selected</span>
            </div>
          )}
        </div>

        <div className="review-section">
          <h3>Category</h3>
          <CategoryPicker value={category} onChange={setCategory} />
        </div>

        {busy && <div className="empty">Working…</div>}

        <div className="review-footer">
          <button className="btn danger" onClick={() => onReject(pending)} disabled={busy}>Reject</button>
          <span className="review-hint">You can only dismiss this by approving or rejecting.</span>
          <button
            className="btn primary"
            onClick={() => onApprove(pending, { category, image: imageChoice })}
            disabled={busy || !canApprove}
            title={canApprove ? '' : 'Choose an image and a category to approve'}
          >
            Approve &amp; publish
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(!!getToken());
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const [tab, setTab] = useState('articles');
  const [pending, setPending] = useState(null);
  const [pendingList, setPendingList] = useState([]);
  const [reviewBusy, setReviewBusy] = useState(false);
  const [lastScan, setLastScan] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api('/api/articles');
      setArticles(data.articles || []);
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        localStorage.removeItem('agrospace_admin_token');
        setAuthed(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  const pollPending = useCallback(async (opts) => {
    try {
      const data = await api('/api/agri/pending');
      const list = data.pending || [];
      setPendingList(list);
      setPending((prev) => {
        if (!list.length) return null;
        if (prev && list.some((p) => p.id === prev.id)) return prev;
        return list[0];
      });
      if (opts && opts.notify && list.length) {
        showToast('Nouvel article AgriRédacteur en attente de validation.');
      }
    } catch (err) {
      // Poll silently; UNAUTHORIZED handled by next article load.
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    pollPending();
    const iv = setInterval(() => pollPending(), 10000);
    return () => clearInterval(iv);
  }, [authed, pollPending]);

  const handleScan = async () => {
    try {
      const res = await api('/api/agri/scan', { method: 'POST' });
      setLastScan(res);
      if (res.added > 0) {
        showToast(res.added + ' article(s) imported from AgriRédacteur.');
        pollPending();
      } else {
        showToast(res.error || 'No new articles found.');
      }
    } catch (err) {
      showToast('Scan: ' + err.message);
    }
  };

  const handleApprove = async (item, opts) => {
    setReviewBusy(true);
    try {
      await api('/api/agri/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, category: opts.category, image: opts.image })
      });
      showToast('« ' + item.title + ' » publié.');
      await Promise.all([load(), pollPending()]);
    } catch (err) {
      showToast('Approve: ' + err.message);
    } finally {
      setReviewBusy(false);
    }
  };

  const handleReject = async (item) => {
    if (!window.confirm('Refuser « ' + item.title + ' » ? Cette action est définitive.')) return;
    setReviewBusy(true);
    try {
      await api('/api/agri/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id })
      });
      showToast('« ' + item.title + ' » refusé.');
      await pollPending();
    } catch (err) {
      showToast('Reject: ' + err.message);
    } finally {
      setReviewBusy(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSave = (saved) => {
    setBusy(true);
    setCreating(false);
    setEditing(null);
    load().then(() => {
      setBusy(false);
      showToast(saved.title + ' saved.');
    });
  };

  const handleDelete = async (a) => {
    if (!window.confirm('Delete "' + a.title + '"?')) return;
    setBusy(true);
    try {
      await api('/api/articles/' + a.id, { method: 'DELETE' });
      await load();
      showToast(a.title + ' deleted.');
    } catch (err) {
      showToast(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!authed) return <Login onLogin={() => { setAuthed(true); }} />;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">AGROSPACE <span>ADMIN</span></div>
        <button className="btn ghost" onClick={() => { localStorage.removeItem('agrospace_admin_token'); setAuthed(false); }}>Log out</button>
      </header>

      <main className="main">
        <div className="tabs">
          <button type="button" className={'tab' + (tab === 'articles' ? ' active' : '')} onClick={() => setTab('articles')}>Articles</button>
          <button type="button" className={'tab' + (tab === 'dataroom' ? ' active' : '')} onClick={() => setTab('dataroom')}>Data Room</button>
        </div>

        {creating || editing ? (
          <>
            <div className="page-head">
              <h2>{editing ? 'Edit article' : 'New article'}</h2>
              <button className="btn ghost" onClick={() => { setCreating(false); setEditing(null); }}>← Back to list</button>
            </div>
            <ArticleForm
              article={editing}
              onSave={handleSave}
              onCancel={() => { setCreating(false); setEditing(null); }}
              busy={busy}
            />
          </>
        ) : tab === 'dataroom' ? (
          <>
            <div className="page-head">
              <h2>Data Room</h2>
              <div className="cell-actions">
                <button className="btn ghost" onClick={handleScan}>Scan AgriRédacteur</button>
                <a className="link" href="/preview-final.html" target="_blank" rel="noreferrer">Open preview ↗</a>
              </div>
            </div>
            {lastScan && (
              <div className="scan-result">
                {lastScan.error
                  ? lastScan.error
                  : lastScan.added > 0
                    ? lastScan.added + ' article(s) added, ' + lastScan.pending + ' waiting for review.'
                    : 'No new articles. ' + lastScan.pending + ' still waiting for review.'}
              </div>
            )}
            <DataRoom articles={articles} onToast={showToast} />
          </>
        ) : (
          <>
            <div className="page-head">
              <h2>Articles <span className="count">{articles.length}</span></h2>
              <a className="link" href="/preview-final.html" target="_blank" rel="noreferrer">Open preview ↗</a>
            </div>
            {loading ? <div className="empty">Loading…</div> : (
              <ArticleList
                articles={articles}
                onEdit={(a) => { setEditing(a); setCreating(false); }}
                onDelete={handleDelete}
                onNew={() => { setCreating(true); setEditing(null); }}
              />
            )}
          </>
        )}
      </main>

      {toast && <div className="toast">{toast}</div>}

      {pending && (
        <ReviewModal
          pending={pending}
          onApprove={handleApprove}
          onReject={handleReject}
          busy={reviewBusy}
        />
      )}
      {!pending && pendingList.length > 0 && (
        <div className="review-minibar">
          <span className="review-dot" /> {pendingList.length} article(s) AgriRédacteur awaiting review
          <button className="btn ghost" onClick={() => setPending(pendingList[0])}>Review now</button>
        </div>
      )}
    </div>
  );
}

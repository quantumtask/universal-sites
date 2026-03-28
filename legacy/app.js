'use strict';

// ─── State ───────────────────────────────────────────────────────────────────
let deals = [];
let stats = {};
let callers = [];
let activeTab = 'pipeline';
let editingId = null;

// Filter state
let filterStatus = '';
let filterCaller = '';
let filterQ = '';

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([loadCallers(), loadDeals(), loadStats()]);
  render();
  bindNav();
  bindFilters();
  bindNewDeal();
});

// ─── API ──────────────────────────────────────────────────────────────────────
async function api(path, opts = {}) {
  const res = await fetch('/api' + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
}

async function loadCallers() {
  callers = await api('/callers');
}

async function loadDeals() {
  const params = new URLSearchParams();
  if (filterStatus) params.set('status', filterStatus);
  if (filterCaller) params.set('caller', filterCaller);
  if (filterQ) params.set('q', filterQ);
  deals = await api('/deals?' + params.toString());
}

async function loadStats() {
  stats = await api('/deals/stats');
}

async function refresh() {
  await Promise.all([loadDeals(), loadStats()]);
  render();
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function bindNav() {
  document.querySelectorAll('nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPanels();
    });
  });
}

function bindFilters() {
  document.getElementById('filter-status').addEventListener('change', e => {
    filterStatus = e.target.value;
    refresh();
  });
  document.getElementById('filter-caller').addEventListener('change', e => {
    filterCaller = e.target.value;
    refresh();
  });

  let searchTimer;
  document.getElementById('filter-q').addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      filterQ = e.target.value;
      refresh();
    }, 250);
  });
}

function bindNewDeal() {
  document.getElementById('btn-new').addEventListener('click', () => openModal(null));
}

// ─── Render ───────────────────────────────────────────────────────────────────
function render() {
  renderStats();
  renderCallerOptions();
  renderPanels();
}

function renderStats() {
  const fmt = n => 'R ' + Number(n).toLocaleString('en-ZA');
  const s = stats;

  document.getElementById('stat-total').textContent = s.totalDeals ?? 0;
  document.getElementById('stat-won').textContent = s.byStatus?.closed_won ?? 0;
  document.getElementById('stat-revenue').textContent = fmt(s.totalRevenue ?? 0);
  document.getElementById('stat-margin').textContent = fmt(s.totalMargin ?? 0);
  document.getElementById('stat-margin-pct').textContent = (s.avgMarginPct ?? 0) + '%';
  document.getElementById('stat-pipeline').textContent =
    (s.byStatus?.quoted ?? 0) + (s.byStatus?.interested ?? 0);
}

function renderCallerOptions() {
  const sel = document.getElementById('filter-caller');
  const current = sel.value;
  sel.innerHTML = '<option value="">All callers</option>' +
    callers.map(c => `<option value="${c}"${c === current ? ' selected' : ''}>${c}</option>`).join('');
}

function renderPanels() {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + activeTab)?.classList.add('active');

  if (activeTab === 'pipeline') renderTable();
  if (activeTab === 'leaderboard') renderLeaderboard();
}

// ─── Table ────────────────────────────────────────────────────────────────────
function renderTable() {
  const tbody = document.getElementById('deals-tbody');

  if (!deals.length) {
    tbody.innerHTML = '<tr><td colspan="9" class="empty">No deals found</td></tr>';
    return;
  }

  tbody.innerHTML = deals.map(d => {
    const marginClass = d.margin > 0 ? 'margin-positive' : d.margin < 0 ? 'margin-negative' : 'margin-zero';
    const fmt = n => n > 0 ? 'R ' + Number(n).toLocaleString('en-ZA') : '—';
    const marginPct = d.quotedPrice > 0 ? Math.round((d.margin / d.quotedPrice) * 100) : 0;

    return `<tr data-id="${d.id}">
      <td><strong>${esc(d.businessName)}</strong><br><small class="mono" style="color:var(--muted)">${esc(d.contactName)}</small></td>
      <td class="mono">${esc(d.phone)}</td>
      <td>${esc(d.callerName)}</td>
      <td><span class="badge badge-${d.status}">${d.status.replace('_', ' ')}</span></td>
      <td class="mono">${fmt(d.quotedPrice)}</td>
      <td class="mono">${fmt(d.costPrice)}</td>
      <td class="mono ${marginClass}">${d.quotedPrice > 0 ? fmt(d.margin) + ` <small>(${marginPct}%)</small>` : '—'}</td>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--muted);font-size:0.8rem">${esc(d.notes)}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="openModal('${d.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteDeal('${d.id}')">✕</button>
      </td>
    </tr>`;
  }).join('');

  // Row click → open modal (except action buttons)
  document.querySelectorAll('#deals-tbody tr').forEach(row => {
    row.addEventListener('click', e => {
      if (e.target.tagName === 'BUTTON') return;
      openModal(row.dataset.id);
    });
  });
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────
function renderLeaderboard() {
  const container = document.getElementById('leaderboard-list');
  const byMargin = stats.byCallerRevenue ?? {};
  const maxVal = Math.max(...Object.values(byMargin), 1);

  const sorted = Object.entries(byMargin)
    .sort(([, a], [, b]) => b - a)
    .map(([name, margin], i) => ({ name, margin, rank: i + 1 }));

  if (!sorted.length) {
    container.innerHTML = '<p class="empty">No data yet</p>';
    return;
  }

  const fmt = n => 'R ' + Number(n).toLocaleString('en-ZA');

  container.innerHTML = sorted.map(({ name, margin, rank }) => `
    <div class="lb-row">
      <div class="lb-rank ${rank <= 3 ? 'top' : ''}">${rank}</div>
      <div class="lb-name">${esc(name)}</div>
      <div class="lb-bar-wrap">
        <div class="lb-bar" style="width:${Math.round((margin / maxVal) * 100)}%"></div>
      </div>
      <div class="lb-value">${fmt(margin)}</div>
    </div>
  `).join('');
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function openModal(id) {
  editingId = id;
  const deal = id ? deals.find(d => d.id === id) : null;

  const callerOptions = callers.map(c =>
    `<option value="${c}"${deal?.callerName === c ? ' selected' : ''}>${c}</option>`
  ).join('');

  const statusOptions = [
    ['new','New'],['contacted','Contacted'],['interested','Interested'],
    ['quoted','Quoted'],['closed_won','Closed Won'],['closed_lost','Closed Lost']
  ].map(([v,l]) =>
    `<option value="${v}"${(deal?.status ?? 'new') === v ? ' selected' : ''}>${l}</option>`
  ).join('');

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div class="modal-title">${deal ? 'Edit Deal' : 'New Deal'}</div>
        <button class="modal-close" id="modal-close-btn">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label>Business Name *</label>
            <input id="f-business" value="${esc(deal?.businessName ?? '')}" placeholder="Sunrise Plumbing" />
          </div>
          <div class="form-group">
            <label>Contact Name *</label>
            <input id="f-contact" value="${esc(deal?.contactName ?? '')}" placeholder="Dave Rossouw" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Phone *</label>
            <input id="f-phone" value="${esc(deal?.phone ?? '')}" placeholder="082 111 2233" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input id="f-email" type="email" value="${esc(deal?.email ?? '')}" placeholder="dave@example.com" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Their Current Website</label>
            <input id="f-website" value="${esc(deal?.website ?? '')}" placeholder="https://..." />
          </div>
          <div class="form-group">
            <label>Caller *</label>
            <select id="f-caller">${callerOptions}</select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Status</label>
            <select id="f-status">${statusOptions}</select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Quote Price (R)</label>
            <input id="f-quoted" type="number" min="0" value="${deal?.quotedPrice ?? ''}" placeholder="15000" />
          </div>
          <div class="form-group">
            <label>Cost Price (R)</label>
            <input id="f-cost" type="number" min="0" value="${deal?.costPrice ?? ''}" placeholder="3500" />
          </div>
        </div>
        <div id="margin-preview" style="font-family:'DM Mono',monospace;font-size:0.8rem;color:var(--accent);min-height:1.2rem"></div>
        <div class="form-group">
          <label>Notes</label>
          <textarea id="f-notes" placeholder="Any context from the call...">${esc(deal?.notes ?? '')}</textarea>
        </div>
      </div>
      <div class="modal-footer">
        ${deal ? `<button class="btn btn-danger" id="btn-delete-deal">Delete</button>` : ''}
        <button class="btn btn-ghost" id="modal-cancel-btn">Cancel</button>
        <button class="btn btn-primary" id="modal-save-btn">${deal ? 'Save Changes' : 'Create Deal'}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Live margin preview
  const updateMarginPreview = () => {
    const q = parseFloat(document.getElementById('f-quoted').value) || 0;
    const c = parseFloat(document.getElementById('f-cost').value) || 0;
    const m = q - c;
    const pct = q > 0 ? Math.round((m / q) * 100) : 0;
    const el = document.getElementById('margin-preview');
    if (q > 0) {
      el.textContent = `Margin: R ${m.toLocaleString('en-ZA')} (${pct}%)`;
      el.style.color = m > 0 ? 'var(--accent)' : 'var(--accent2)';
    } else {
      el.textContent = '';
    }
  };

  document.getElementById('f-quoted').addEventListener('input', updateMarginPreview);
  document.getElementById('f-cost').addEventListener('input', updateMarginPreview);
  updateMarginPreview();

  const closeModal = () => modal.remove();

  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);

  document.getElementById('modal-save-btn').addEventListener('click', async () => {
    const body = {
      businessName: document.getElementById('f-business').value.trim(),
      contactName: document.getElementById('f-contact').value.trim(),
      phone: document.getElementById('f-phone').value.trim(),
      email: document.getElementById('f-email').value.trim(),
      website: document.getElementById('f-website').value.trim(),
      callerName: document.getElementById('f-caller').value,
      status: document.getElementById('f-status').value,
      quotedPrice: parseFloat(document.getElementById('f-quoted').value) || 0,
      costPrice: parseFloat(document.getElementById('f-cost').value) || 0,
      notes: document.getElementById('f-notes').value.trim(),
    };

    try {
      if (editingId) {
        await api('/deals/' + editingId, { method: 'PATCH', body: JSON.stringify(body) });
        toast('Deal updated');
      } else {
        await api('/deals', { method: 'POST', body: JSON.stringify(body) });
        toast('Deal created');
      }
      closeModal();
      await refresh();
    } catch (err) {
      toast(err.message, true);
    }
  });

  if (deal) {
    document.getElementById('btn-delete-deal').addEventListener('click', async () => {
      if (!confirm(`Delete deal for ${deal.businessName}?`)) return;
      await deleteDeal(deal.id);
      closeModal();
    });
  }

  // Focus first input
  setTimeout(() => document.getElementById('f-business').focus(), 50);
}

async function deleteDeal(id) {
  try {
    await api('/deals/' + id, { method: 'DELETE' });
    toast('Deal deleted');
    await refresh();
  } catch (err) {
    toast(err.message, true);
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function toast(msg, isError = false) {
  const el = document.createElement('div');
  el.className = 'toast' + (isError ? ' error' : '');
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

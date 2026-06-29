import { ZONES, getZone, MUNICIPALITY } from './data.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const ICONS = {
  craft: '🔧', food: '🍴', travel: '📷', learn: '🎓',
  market: '🛍', service: '🏛', chat: '💬'
};
const MASCOTS = {
  craft:   'assets/bc-mascot.webp',
  food:    'assets/bc-mascot.webp',
  travel:  'assets/bc-mascot.webp',
  learn:   'assets/bc-mascot.webp',
  market:  'assets/bc-mascot.webp',
  service: 'assets/bc-mascot.webp',
  chat:    'assets/bc-mascot.webp',
};
const SUBTITLES = {
  craft:   'ช่าง 7 หมวด · ครบทุกงาน',
  food:    'ร้านอร่อยในพื้นที่',
  travel:  'สถานที่แนะนำ',
  learn:   'หลักสูตรและคู่มือ',
  market:  'ของดีท้องถิ่น',
  service: 'แจ้งเรื่อง · ข่าว · กิจกรรม',
  chat:    'ทุกช่องทางติดต่อ',
};
const CATEGORY_ORDER = ['craft', 'food', 'travel', 'learn', 'market', 'service', 'chat'];

// ── Element cache ─────────────────────────────────────────────────────────────
const els = {
  navToggle:         $('#navToggle'),
  mainNav:           $('#mainNav'),
  searchForm:        $('#searchForm'),
  globalSearch:      $('#globalSearch'),
  categorySelect:    $('#categorySelect'),
  searchResults:     $('#searchResults'),
  categoryGrid:      $('#categoryGrid'),
  drawer:            $('#serviceDrawer'),
  backdrop:          $('#drawerBackdrop'),
  drawerIcon:        $('#drawerIcon'),
  drawerTitle:       $('#drawerTitle'),
  drawerDescription: $('#drawerDescription'),
  drawerList:        $('#drawerList'),
  drawerSource:      $('#drawerSource'),
  memberDialog:      $('#memberDialog'),
  toast:             $('#toast'),
  offlineBadge:      $('#offlineBadge'),
};

// ── Render category grid + select ─────────────────────────────────────────────
function renderCategories() {
  const selFrag  = document.createDocumentFragment();
  const gridFrag = document.createDocumentFragment();

  CATEGORY_ORDER.forEach((id) => {
    const cat = getZone(id);
    if (!cat) return;

    const opt = document.createElement('option');
    opt.value = id; opt.textContent = cat.label;
    selFrag.append(opt);

    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'category-card';
    btn.dataset.category = id;
    btn.setAttribute('aria-label', `เปิดหมวด${cat.label}`);
    btn.innerHTML = `
      <img class="card-mascot" src="${MASCOTS[id] || ''}" alt="" loading="lazy">
      <b>${cat.label}</b>
      <small>${SUBTITLES[id] || ''}</small>`;
    btn.addEventListener('click', () => openDrawer(id));
    gridFrag.append(btn);
  });

  els.categorySelect.append(selFrag);
  els.categoryGrid.append(gridFrag);
}

// ── Drawer ────────────────────────────────────────────────────────────────────
function buildDrawerItem(item) {
  const a = document.createElement('a');
  a.className = 'drawer-item' + (item.primary ? ' drawer-item-primary' : '');
  a.href = item.href;
  if (item.href.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  a.innerHTML = `
    <span aria-hidden="true">${item.icon}</span>
    <div><b>${item.title}</b><small>${item.detail}</small></div>
    <i>${item.action} ›</i>`;
  return a;
}

function buildDrawerGroup(group) {
  const section = document.createElement('div');
  section.className = 'drawer-group';

  const heading = document.createElement('div');
  heading.className = 'drawer-group-label';
  heading.textContent = group.label;
  section.append(heading);

  group.items.forEach((item) => section.append(buildDrawerItem(item)));
  return section;
}

function openDrawer(id) {
  const cat = getZone(id);
  if (!cat) return;
  els.drawerIcon.textContent        = ICONS[id] || '✦';
  els.drawerTitle.textContent       = cat.label;
  els.drawerDescription.textContent = cat.description;
  els.drawerSource.textContent      = cat.source;

  els.drawerList.replaceChildren();

  if (cat.groups) {
    // Grouped view (บ้านช่าง)
    cat.groups.forEach((g) => els.drawerList.append(buildDrawerGroup(g)));
  } else {
    // Flat view (other categories)
    cat.items.forEach((item) => els.drawerList.append(buildDrawerItem(item)));
  }

  els.backdrop.hidden = false;
  requestAnimationFrame(() => els.drawer.classList.add('open'));
  els.drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open');
  els.searchResults.hidden = true;
}

function closeDrawer() {
  els.drawer.classList.remove('open');
  els.drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('drawer-open');
  window.setTimeout(() => { els.backdrop.hidden = true; }, 350);
}

// ── Search index (flat — works for grouped too via getter) ────────────────────
function buildSearchIndex() {
  return ZONES.flatMap((cat) => [
    {
      type: 'category', categoryId: cat.id,
      title: cat.label, detail: cat.description,
      icon: ICONS[cat.id] || '✦',
      keywords: `${cat.label} ${cat.short || ''} ${cat.description}`,
    },
    ...cat.items.map((item) => ({
      type: 'item', categoryId: cat.id,
      title: item.title, detail: item.detail,
      icon: item.icon, href: item.href,
      keywords: `${item.title} ${item.detail} ${item.tag || ''} ${cat.label} ${cat.short || ''}`,
    })),
  ]);
}
const SEARCH_INDEX = buildSearchIndex();

function performSearch() {
  const q   = els.globalSearch.value.trim().toLocaleLowerCase('th');
  const sel = els.categorySelect.value;
  let rows  = SEARCH_INDEX.filter((r) => sel === 'all' || r.categoryId === sel);
  if (q) rows = rows.filter((r) => r.keywords.toLocaleLowerCase('th').includes(q));
  renderSearchResults(rows.slice(0, 15), q);
}

function renderSearchResults(rows, query) {
  els.searchResults.replaceChildren();
  if (!rows.length) {
    const empty = document.createElement('div');
    empty.className = 'search-empty';
    empty.textContent = query
      ? `ยังไม่พบ "${query}" — ลองคำสั้น ๆ เช่น ช่าง, ไฟ, ประปา, แอร์, อาหาร`
      : 'เลือกหมวดหมู่หรือพิมพ์คำค้นหา';
    els.searchResults.append(empty);
  } else {
    rows.forEach((row) => {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'search-result';
      btn.innerHTML = `
        <span aria-hidden="true">${row.icon}</span>
        <span><b>${row.title}</b><small>${row.detail}</small></span>
        <i>เปิด ›</i>`;
      btn.addEventListener('click', () => {
        if (row.type === 'category') openDrawer(row.categoryId);
        else if (row.href?.startsWith('tel:')) location.href = row.href;
        else if (row.href) window.open(row.href, '_blank', 'noopener,noreferrer');
        els.searchResults.hidden = true;
      });
      els.searchResults.append(btn);
    });
  }
  els.searchResults.hidden = false;
}

// ── Registration dialog ───────────────────────────────────────────────────────
function showMemberDialog() {
  if (typeof els.memberDialog.showModal === 'function') els.memberDialog.showModal();
  else els.memberDialog.setAttribute('open', '');
}

function closeRegisterDialog() {
  if (els.memberDialog.close) els.memberDialog.close();
  else els.memberDialog.removeAttribute('open');
  setTimeout(() => {
    $('#registerStep1').hidden = false;
    $('#registerStep2').hidden = true;
    ['reg-name','reg-phone','reg-contact','reg-social','reg-area','reg-desc']
      .forEach((id) => { const el = document.getElementById(id); if (el) el.value = ''; });
    const cat = document.getElementById('reg-category'); if (cat) cat.value = '';
    const cb  = document.getElementById('reg-consent');  if (cb) cb.checked = false;
    const err = $('#registerError'); if (err) { err.hidden = true; err.textContent = ''; }
    const lbl = $('#regBtnLabel');   if (lbl) lbl.textContent = '📨 ส่งข้อมูลสมัคร';
    const btn = $('#regSubmitBtn');  if (btn) btn.disabled = false;
  }, 300);
}

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzv5WMeM5cSxl7Ot6QCjbqkxGaxPMAfsvc6lDj2rQe4UYKIjwnZMxa-Sxq6VtN9b51Q/exec';

async function submitRegistration() {
  const name     = document.getElementById('reg-name')?.value.trim();
  const category = document.getElementById('reg-category')?.value;
  const phone    = document.getElementById('reg-phone')?.value.trim();
  const line     = document.getElementById('reg-contact')?.value.trim();
  const social   = document.getElementById('reg-social')?.value.trim();
  const area     = document.getElementById('reg-area')?.value.trim();
  const desc     = document.getElementById('reg-desc')?.value.trim();
  const consent  = document.getElementById('reg-consent')?.checked;
  const errEl    = $('#registerError');

  const showErr = (msg) => {
    errEl.textContent = msg; errEl.hidden = false;
    errEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  if (!name)     return showErr('⚠️ กรุณากรอกชื่อร้าน / ชื่อช่าง / กลุ่มอาชีพ');
  if (!category) return showErr('⚠️ กรุณาเลือกประเภทบริการ');
  if (!phone)    return showErr('⚠️ กรุณากรอกเบอร์โทรศัพท์');
  if (!/^[0-9\-\+\s]{8,20}$/.test(phone)) return showErr('⚠️ รูปแบบเบอร์โทรไม่ถูกต้อง เช่น 081-234-5678');
  if (!area)     return showErr('⚠️ กรุณากรอกที่อยู่ / ชุมชน');
  if (!consent)  return showErr('⚠️ กรุณายอมรับข้อตกลงก่อนส่งข้อมูล');
  errEl.hidden = true;

  const btn = $('#regSubmitBtn'); const lbl = $('#regBtnLabel');
  btn.disabled = true; lbl.textContent = '⏳ กำลังส่งข้อมูล...';
  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, phone, line, contact: social, area, desc,
        timestamp: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }) }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    document.getElementById('successName').textContent = `"${name}" — ${category}`;
    $('#registerStep1').hidden = true;
    $('#registerStep2').hidden = false;
  } catch (err) {
    showErr('❌ ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่ หรือโทร 02-193-4512-3');
    console.error(err);
    btn.disabled = false; lbl.textContent = '📨 ส่งข้อมูลสมัคร';
  }
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => els.toast.classList.remove('show'), 2400);
}

// ── Navigation ────────────────────────────────────────────────────────────────
function setupNavigation() {
  els.navToggle.addEventListener('click', () => {
    const open = els.mainNav.classList.toggle('open');
    els.navToggle.setAttribute('aria-expanded', String(open));
  });
  $$('.main-nav a').forEach((l) => l.addEventListener('click', () => {
    els.mainNav.classList.remove('open');
    els.navToggle.setAttribute('aria-expanded', 'false');
  }));
  const sections = ['top','search','categories','news','about']
    .map((id) => document.getElementById(id)).filter(Boolean);
  const navLinks = $$('.main-nav a');
  new IntersectionObserver((entries) => {
    const hit = entries.filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!hit) return;
    navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${hit.target.id}`));
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0,.2,.6] }).observe
    ? sections.forEach((s) => new IntersectionObserver((entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (!hit) return;
        navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${hit.target.id}`));
      }, { rootMargin: '-20% 0px -65% 0px', threshold: .2 }).observe(s))
    : null;
}

// ── Events ────────────────────────────────────────────────────────────────────
function bindEvents() {
  els.searchForm.addEventListener('submit', (e) => { e.preventDefault(); performSearch(); });
  els.globalSearch.addEventListener('input', () => {
    if (els.globalSearch.value.trim().length >= 2) performSearch();
    else els.searchResults.hidden = true;
  });
  els.categorySelect.addEventListener('change', () => {
    performSearch();
    const val = els.categorySelect.value;
    if (val !== 'all') { const cat = getZone(val); if (cat) showToast(`กรอง: ${cat.label}`); }
  });
  $$('.popular button').forEach((btn) => btn.addEventListener('click', () => {
    els.globalSearch.value = btn.dataset.query;
    performSearch();
    els.globalSearch.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }));
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-section')) els.searchResults.hidden = true;
  });

  $('#drawerClose').addEventListener('click', closeDrawer);
  els.backdrop.addEventListener('click', closeDrawer);

  $('#allCategories').addEventListener('click', () => {
    $('#search').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => { els.globalSearch.value = ''; els.categorySelect.value = 'all'; performSearch(); els.globalSearch.focus(); }, 420);
  });
  $('#allRecommended').addEventListener('click', () => {
    const row = $('#recommendRow');
    if (row) { row.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); row.scrollLeft = 0; }
    showToast('เลื่อนซ้าย–ขวาเพื่อดูรายการแนะนำ 👉');
  });

  const actBtn = $('#activityDrawerBtn');
  if (actBtn) actBtn.addEventListener('click', () => openDrawer('service'));

  // Parade mascot buttons → open drawer
  $$('.parade-item[data-category]').forEach((btn) => {
    btn.addEventListener('click', () => openDrawer(btn.dataset.category));
  });

  const joinBtn = $('#joinButton');  if (joinBtn) joinBtn.addEventListener('click', showMemberDialog);
  const loginBtn = $('#loginButton'); if (loginBtn) loginBtn.addEventListener('click', showMemberDialog);
  $('#dialogClose').addEventListener('click', closeRegisterDialog);
  $('#regDoneBtn').addEventListener('click', closeRegisterDialog);
  els.memberDialog.addEventListener('click', (e) => { if (e.target === els.memberDialog) closeRegisterDialog(); });
  $('#regSubmitBtn').addEventListener('click', submitRegistration);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeDrawer(); if (els.memberDialog.open) closeRegisterDialog(); }
    if (e.key === '/' && document.activeElement !== els.globalSearch && !els.memberDialog.open) {
      e.preventDefault();
      $('#search').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => els.globalSearch.focus(), 400);
    }
  });
  window.addEventListener('online',  syncOnlineStatus);
  window.addEventListener('offline', syncOnlineStatus);
}

function syncOnlineStatus() { els.offlineBadge.hidden = navigator.onLine; }

async function registerServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    try { await navigator.serviceWorker.register('./sw.js'); }
    catch (e) { console.warn('SW unavailable', e); }
  }
}

renderCategories();
setupNavigation();
bindEvents();
syncOnlineStatus();
registerServiceWorker();

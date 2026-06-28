import { ZONES, getZone, MUNICIPALITY } from './data.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Icons per category
const ICONS = {
  craft: '🔧', food: '🍴', travel: '📷', learn: '🎓',
  market: '🛍', service: '🏛', chat: '💬'
};
// Mascot images per category
const MASCOTS = {
  craft:   'assets/mascot_chang.png',
  food:    'assets/mascot_food.png',
  travel:  'assets/mascot_travel.png',
  learn:   'assets/mascot_career.png',
  market:  'assets/mascot_product.png',
  service: 'assets/mascot_service.png',
  chat:    'assets/mascot_chat.png',
};
// Subtitle shown under each category card
const SUBTITLES = {
  craft:   'หาช่างใกล้บ้าน',
  food:    'ร้านอร่อยในพื้นที่',
  travel:  'สถานที่แนะนำ',
  learn:   'หลักสูตรและคู่มือ',
  market:  'ของดีท้องถิ่น',
  service: 'แจ้งเรื่อง · ข่าว · กิจกรรม',
  chat:    'ทุกช่องทางติดต่อ',
};

// Display order — 7 categories, fits neatly in one row on desktop
const CATEGORY_ORDER = ['craft', 'food', 'travel', 'learn', 'market', 'service', 'chat'];

// ── Element cache ─────────────────────────────────────────────────────────────
const els = {
  navToggle:        $('#navToggle'),
  mainNav:          $('#mainNav'),
  searchForm:       $('#searchForm'),
  globalSearch:     $('#globalSearch'),
  categorySelect:   $('#categorySelect'),
  searchResults:    $('#searchResults'),
  categoryGrid:     $('#categoryGrid'),
  drawer:           $('#serviceDrawer'),
  backdrop:         $('#drawerBackdrop'),
  drawerIcon:       $('#drawerIcon'),
  drawerTitle:      $('#drawerTitle'),
  drawerDescription:$('#drawerDescription'),
  drawerList:       $('#drawerList'),
  drawerSource:     $('#drawerSource'),
  memberDialog:     $('#memberDialog'),
  toast:            $('#toast'),
  offlineBadge:     $('#offlineBadge'),
};

// ── Render category grid + select ─────────────────────────────────────────────
function renderCategories() {
  const selectFrag = document.createDocumentFragment();
  const gridFrag   = document.createDocumentFragment();

  CATEGORY_ORDER.forEach((id) => {
    const cat = getZone(id);
    if (!cat) return;

    // <option> for search filter select
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = cat.label;
    selectFrag.append(opt);

    // category card button
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'category-card';
    btn.dataset.category = id;
    btn.setAttribute('aria-label', `เปิดหมวด${cat.label}`);
    btn.innerHTML = `
      <img class="card-mascot" src="${MASCOTS[id] || ''}" alt="" loading="lazy">
      <b>${cat.label}</b>
      <small>${SUBTITLES[id] || ''}</small>`;
    btn.addEventListener('click', () => openDrawer(id));
    gridFrag.append(btn);
  });

  els.categorySelect.append(selectFrag);
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

function openDrawer(id) {
  const cat = getZone(id);
  if (!cat) return;
  els.drawerIcon.textContent        = ICONS[id] || '✦';
  els.drawerTitle.textContent       = cat.label;
  els.drawerDescription.textContent = cat.description;
  els.drawerSource.textContent      = cat.source;
  els.drawerList.replaceChildren(...cat.items.map(buildDrawerItem));
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

// ── Search ────────────────────────────────────────────────────────────────────
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
  renderSearchResults(rows.slice(0, 12), q);
}

function renderSearchResults(rows, query) {
  els.searchResults.replaceChildren();

  if (!rows.length) {
    const empty = document.createElement('div');
    empty.className = 'search-empty';
    empty.textContent = query
      ? `ยังไม่พบ "${query}" — ลองคำสั้น ๆ เช่น ช่าง, อาหาร, ข่าว`
      : 'เลือกหมวดหมู่หรือพิมพ์คำค้นหา';
    els.searchResults.append(empty);
  } else {
    rows.forEach((row) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'search-result';
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
    const cat     = document.getElementById('reg-category'); if (cat) cat.value = '';
    const consent = document.getElementById('reg-consent');  if (consent) consent.checked = false;
    const err     = $('#registerError'); if (err) { err.hidden = true; err.textContent = ''; }
    const label   = $('#regBtnLabel');   if (label) label.textContent = '📨 ส่งข้อมูลสมัคร';
    const btn     = $('#regSubmitBtn');  if (btn) btn.disabled = false;
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
    errEl.textContent = msg;
    errEl.hidden = false;
    errEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  if (!name)     return showErr('⚠️ กรุณากรอกชื่อร้าน / ชื่อช่าง / กลุ่มอาชีพ');
  if (!category) return showErr('⚠️ กรุณาเลือกประเภทบริการ');
  if (!phone)    return showErr('⚠️ กรุณากรอกเบอร์โทรศัพท์');
  if (!/^[0-9\-\+\s]{8,20}$/.test(phone)) return showErr('⚠️ รูปแบบเบอร์โทรไม่ถูกต้อง เช่น 081-234-5678');
  if (!area)     return showErr('⚠️ กรุณากรอกที่อยู่ / ชุมชน');
  if (!consent)  return showErr('⚠️ กรุณายอมรับข้อตกลงก่อนส่งข้อมูล');
  errEl.hidden = true;

  const btn   = $('#regSubmitBtn');
  const label = $('#regBtnLabel');
  btn.disabled = true;
  label.textContent = '⏳ กำลังส่งข้อมูล...';

  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, category, phone, line, contact: social, area, desc,
        timestamp: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    document.getElementById('successName').textContent = `"${name}" — ${category}`;
    $('#registerStep1').hidden = true;
    $('#registerStep2').hidden = false;
  } catch (err) {
    showErr('❌ ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่ หรือโทร 02-193-4512-3');
    console.error('Register error:', err);
    btn.disabled = false;
    label.textContent = '📨 ส่งข้อมูลสมัคร';
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
  $$('.main-nav a').forEach((link) => link.addEventListener('click', () => {
    els.mainNav.classList.remove('open');
    els.navToggle.setAttribute('aria-expanded', 'false');
  }));

  // Active link via IntersectionObserver
  const sections = ['top','search','categories','news','activities','about']
    .map((id) => document.getElementById(id)).filter(Boolean);
  const navLinks = $$('.main-nav a');
  const io = new IntersectionObserver((entries) => {
    const hit = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!hit) return;
    navLinks.forEach((l) =>
      l.classList.toggle('active', l.getAttribute('href') === `#${hit.target.id}`)
    );
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .2, .6] });
  sections.forEach((s) => io.observe(s));
}

// ── Event bindings ────────────────────────────────────────────────────────────
function bindEvents() {
  // Search form
  els.searchForm.addEventListener('submit', (e) => { e.preventDefault(); performSearch(); });
  els.globalSearch.addEventListener('input', () => {
    if (els.globalSearch.value.trim().length >= 2) performSearch();
    else els.searchResults.hidden = true;
  });
  els.categorySelect.addEventListener('change', () => {
    performSearch();
    const val = els.categorySelect.value;
    if (val !== 'all') {
      const cat = getZone(val);
      if (cat) showToast(`กรอง: ${cat.label}`);
    }
  });

  // Popular quick-search chips
  $$('.popular button').forEach((btn) => {
    btn.addEventListener('click', () => {
      els.globalSearch.value = btn.dataset.query;
      performSearch();
      els.globalSearch.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  // Close search results on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-section')) els.searchResults.hidden = true;
  });

  // Drawer controls
  $('#drawerClose').addEventListener('click', closeDrawer);
  els.backdrop.addEventListener('click', closeDrawer);

  // "ดูทั้งหมด" → scroll to search + focus
  $('#allCategories').addEventListener('click', () => {
    $('#search').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      els.globalSearch.value = '';
      els.categorySelect.value = 'all';
      performSearch();
      els.globalSearch.focus();
    }, 420);
  });

  // "ดูทั้งหมด" ในส่วนแนะนำ → open service drawer (ครบที่สุด)
  $('#allRecommended').addEventListener('click', () => {
    const row = $('#recommendRow');
    if (row) { row.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); row.scrollLeft = 0; }
    showToast('เลื่อนซ้าย–ขวาเพื่อดูรายการแนะนำทั้งหมด 👉');
  });

  // Activity banner CTA → open service drawer (กิจกรรมอยู่ใน service)
  const activityBtn = $('#activityDrawerBtn');
  if (activityBtn) activityBtn.addEventListener('click', () => openDrawer('service'));

  // Registration
  const joinBtn = $('#joinButton');
  if (joinBtn) joinBtn.addEventListener('click', showMemberDialog);
  const loginBtn = $('#loginButton');
  if (loginBtn) loginBtn.addEventListener('click', showMemberDialog);

  $('#dialogClose').addEventListener('click', closeRegisterDialog);
  $('#regDoneBtn').addEventListener('click', closeRegisterDialog);
  els.memberDialog.addEventListener('click', (e) => {
    if (e.target === els.memberDialog) closeRegisterDialog();
  });
  $('#regSubmitBtn').addEventListener('click', submitRegistration);

  // Keyboard shortcuts
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

// ── Boot ──────────────────────────────────────────────────────────────────────
renderCategories();
setupNavigation();
bindEvents();
syncOnlineStatus();
registerServiceWorker();

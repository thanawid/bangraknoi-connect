import { ZONES, getZone } from './data.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const TRAVEL = {
  id: 'travel', label: 'เที่ยวบางรักน้อย', short: 'ท่องเที่ยว', icon: '📷',
  description: 'วัด วิถีริมคลอง และสถานที่สำคัญในบางรักน้อย', source: 'เส้นทางเปิดด้วย Google Maps บนอุปกรณ์ของคุณ',
  items: [
    { icon: '🛕', title: 'วัดบางรักน้อย', detail: 'ชมวัดและบรรยากาศชุมชนริมคลอง', tag: 'สถานที่', action: 'เปิดแผนที่', href: 'https://www.google.com/maps/search/?api=1&query=วัดบางรักน้อย+นนทบุรี', primary: true },
    { icon: '🙏', title: 'พระใหญ่บางรักน้อย', detail: 'จุดหมายสำคัญและสัญลักษณ์ของชุมชน', tag: 'แลนด์มาร์ก', action: 'ค้นหาเส้นทาง', href: 'https://www.google.com/maps/search/?api=1&query=พระใหญ่+บางรักน้อย+นนทบุรี' },
    { icon: '🏛️', title: 'เทศบาลเมืองบางรักน้อย', detail: 'อาคารบริการประชาชนและจุดติดต่อชุมชน', tag: 'สถานที่สำคัญ', action: 'เปิดแผนที่', href: 'https://www.google.com/maps/search/?api=1&query=เทศบาลเมืองบางรักน้อย' },
    { icon: '🌊', title: 'วิถีคลองอ้อมนนท์', detail: 'ค้นหาจุดเที่ยวและร้านริมน้ำใกล้คลองอ้อมนนท์', tag: 'ริมคลอง', action: 'สำรวจรอบคลอง', href: 'https://www.google.com/maps/search/?api=1&query=คลองอ้อมนนท์+นนทบุรี' }
  ]
};

const ICONS = { craft: '🔧', food: '🍴', travel: '📷', learn: '🎓', news: '📣', event: '▣', market: '🛍', chat: '💬', service: '🏛' };
const MASCOTS = {
  craft:   'assets/mascot_chang.png',
  food:    'assets/mascot_food.png',
  travel:  'assets/mascot_hero.png',
  learn:   'assets/mascot_career.png',
  news:    'assets/mascot_news.png',
  event:   'assets/mascot_event.png',
  market:  'assets/mascot_product.png',
  chat:    'assets/mascot_chat.png',
  service: 'assets/mascot_service.png',
};
const SUBTITLES = {
  craft: 'ค้นหาบนแผนที่', food: 'ร้านใกล้บ้าน', travel: 'สถานที่แนะนำ', learn: 'หลักสูตรและคู่มือ',
  news: 'ประกาศทางการ', event: 'ปฏิทินชุมชน', market: 'ของดีท้องถิ่น', chat: '4 ช่องทาง'
};
const CATEGORY_ORDER = ['craft', 'food', 'travel', 'learn', 'news', 'event', 'market', 'chat'];
const categoryById = (id) => id === 'travel' ? TRAVEL : getZone(id);

const els = {
  navToggle: $('#navToggle'), mainNav: $('#mainNav'), searchForm: $('#searchForm'), globalSearch: $('#globalSearch'),
  categorySelect: $('#categorySelect'), searchResults: $('#searchResults'), categoryGrid: $('#categoryGrid'),
  drawer: $('#serviceDrawer'), backdrop: $('#drawerBackdrop'), drawerIcon: $('#drawerIcon'), drawerTitle: $('#drawerTitle'),
  drawerDescription: $('#drawerDescription'), drawerList: $('#drawerList'), drawerSource: $('#drawerSource'),
  memberDialog: $('#memberDialog'), toast: $('#toast'), offlineBadge: $('#offlineBadge')
};

function renderCategories() {
  const selectFragment = document.createDocumentFragment();
  const gridFragment = document.createDocumentFragment();

  CATEGORY_ORDER.forEach((id) => {
    const category = categoryById(id);
    const option = document.createElement('option');
    option.value = id; option.textContent = category.label;
    selectFragment.append(option);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'category-card';
    button.dataset.category = id;
    button.setAttribute('aria-label', `เปิดหมวด${category.label}`);
    const mascotSrc = MASCOTS[id];
    button.innerHTML = mascotSrc
      ? `<div class="card-mascot-wrap"><img class="card-mascot" src="${mascotSrc}" alt="" loading="lazy"><div class="card-mascot-shadow"></div></div><b>${category.label}</b><small>${SUBTITLES[id]}</small>`
      : `<span class="category-icon" aria-hidden="true">${ICONS[id]}</span><b>${category.label}</b><small>${SUBTITLES[id]}</small>`;
    button.addEventListener('click', () => openDrawer(id));
    gridFragment.append(button);
  });
  els.categorySelect.append(selectFragment);
  els.categoryGrid.append(gridFragment);
}

function buildDrawerItem(item) {
  const link = document.createElement('a');
  link.className = 'drawer-item';
  link.href = item.href;
  if (item.href.startsWith('http')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  link.innerHTML = `<span aria-hidden="true">${item.icon}</span><div><b>${item.title}</b><small>${item.detail}</small></div><i>${item.action} ›</i>`;
  return link;
}

function openDrawer(id) {
  const category = categoryById(id);
  if (!category) return;
  els.drawerIcon.textContent = ICONS[id] || category.icon;
  els.drawerTitle.textContent = category.label;
  els.drawerDescription.textContent = category.description;
  els.drawerSource.textContent = category.source;
  els.drawerList.replaceChildren(...category.items.map(buildDrawerItem));
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

function getSearchRows() {
  const categories = [...ZONES, TRAVEL];
  return categories.flatMap((category) => [
    { type: 'category', categoryId: category.id, title: category.label, detail: category.description, icon: ICONS[category.id] || category.icon, keywords: `${category.label} ${category.short || ''} ${category.description}` },
    ...category.items.map((item) => ({ type: 'item', categoryId: category.id, title: item.title, detail: item.detail, icon: item.icon, href: item.href, keywords: `${item.title} ${item.detail} ${item.tag} ${category.label}` }))
  ]);
}

const SEARCH_ROWS = getSearchRows();

function performSearch() {
  const query = els.globalSearch.value.trim().toLocaleLowerCase('th');
  const selected = els.categorySelect.value;
  let rows = SEARCH_ROWS.filter((row) => selected === 'all' || row.categoryId === selected);
  if (query) rows = rows.filter((row) => row.keywords.toLocaleLowerCase('th').includes(query));
  rows = rows.slice(0, 12);
  renderSearchResults(rows, query);
}

function renderSearchResults(rows, query) {
  els.searchResults.replaceChildren();
  if (!rows.length) {
    const empty = document.createElement('div');
    empty.className = 'search-empty';
    empty.textContent = `ยังไม่พบ “${query}” ลองค้นหาด้วยคำสั้น ๆ เช่น ช่าง อาหาร ข่าว หรือกิจกรรม`;
    els.searchResults.append(empty);
  } else {
    rows.forEach((row) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'search-result';
      button.innerHTML = `<span aria-hidden="true">${row.icon}</span><span><b>${row.title}</b><small>${row.detail}</small></span><i>เปิด ›</i>`;
      button.addEventListener('click', () => {
        if (row.type === 'category') openDrawer(row.categoryId);
        else if (row.href.startsWith('tel:')) location.href = row.href;
        else window.open(row.href, '_blank', 'noopener,noreferrer');
        els.searchResults.hidden = true;
      });
      els.searchResults.append(button);
    });
  }
  els.searchResults.hidden = false;
}

function showMemberDialog() {
  if (typeof els.memberDialog.showModal === 'function') els.memberDialog.showModal();
  else els.memberDialog.setAttribute('open', '');
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove('show'), 2200);
}

function syncOnlineStatus() { els.offlineBadge.hidden = navigator.onLine; }

function setupNavigation() {
  els.navToggle.addEventListener('click', () => {
    const open = els.mainNav.classList.toggle('open');
    els.navToggle.setAttribute('aria-expanded', String(open));
  });
  $$('.main-nav a').forEach((link) => link.addEventListener('click', () => {
    els.mainNav.classList.remove('open');
    els.navToggle.setAttribute('aria-expanded', 'false');
  }));

  const sections = ['top','search','categories','news','activities','about'].map((id) => document.getElementById(id)).filter(Boolean);
  const links = $$('.main-nav a');
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0,.2,.6] });
  sections.forEach((section) => observer.observe(section));
}

function bindEvents() {
  els.searchForm.addEventListener('submit', (event) => { event.preventDefault(); performSearch(); });
  els.globalSearch.addEventListener('input', () => { if (els.globalSearch.value.trim().length >= 2) performSearch(); else els.searchResults.hidden = true; });
  els.categorySelect.addEventListener('change', performSearch);
  $$('.popular button').forEach((button) => button.addEventListener('click', () => { els.globalSearch.value = button.dataset.query; performSearch(); }));
  document.addEventListener('click', (event) => { if (!event.target.closest('.search-section')) els.searchResults.hidden = true; });

  $('#drawerClose').addEventListener('click', closeDrawer);
  els.backdrop.addEventListener('click', closeDrawer);
  $('#allCategories').addEventListener('click', () => { els.globalSearch.value = ''; els.categorySelect.value = 'all'; performSearch(); $('#search').scrollIntoView({ behavior: 'smooth' }); });
  $('#allRecommended').addEventListener('click', () => { $('#recommendRow').scrollIntoView({ behavior: 'smooth', block: 'center' }); showToast('เลื่อนดูรายการแนะนำได้ทางซ้าย–ขวา'); });

  $('#joinButton').addEventListener('click', showMemberDialog);
  $('#loginButton').addEventListener('click', showMemberDialog);
  $('#dialogClose').addEventListener('click', () => closeRegisterDialog());
  $('#regDoneBtn').addEventListener('click', () => closeRegisterDialog());
  els.memberDialog.addEventListener('click', (event) => { if (event.target === els.memberDialog) closeRegisterDialog(); });
  $('#regSubmitBtn').addEventListener('click', () => submitRegistration());
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDrawer();
    if (event.key === '/' && document.activeElement !== els.globalSearch) { event.preventDefault(); $('#search').scrollIntoView(); els.globalSearch.focus(); }
  });
  window.addEventListener('online', syncOnlineStatus);
  window.addEventListener('offline', syncOnlineStatus);
}

async function registerServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    try { await navigator.serviceWorker.register('./sw.js'); }
    catch (error) { console.warn('Offline mode unavailable', error); }
  }
}

// ============================================================
// REGISTRATION — Google Sheet + Email Notification
// ============================================================
// 🔧 ใส่ URL ของ Google Apps Script Web App ที่นี่
// (ดูคำแนะนำใน README.md ส่วน "ตั้งค่า Google Sheet")
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzv5WMeM5cSxl7Ot6QCjbqkxGaxPMAfsvc6lDj2rQe4UYKIjwnZMxa-Sxq6VtN9b51Q/exec';

function closeRegisterDialog() {
  els.memberDialog.close();
  // Reset form back to step 1 after close
  setTimeout(() => {
    $('#registerStep1').hidden = false;
    $('#registerStep2').hidden = true;
    ['reg-name','reg-phone','reg-contact','reg-social','reg-area','reg-desc'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const cat = document.getElementById('reg-category'); if (cat) cat.value = '';
    const consent = document.getElementById('reg-consent'); if (consent) consent.checked = false;
    const err = $('#registerError'); if (err) { err.hidden = true; err.textContent = ''; }
    const btn = $('#regBtnLabel'); if (btn) btn.textContent = '📨 ส่งข้อมูลสมัคร';
    $('#regSubmitBtn').disabled = false;
  }, 300);
}

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

  const showErr = (msg) => { errEl.textContent = msg; errEl.hidden = false; };

  if (!name)     return showErr('⚠️ กรุณากรอกชื่อร้าน / ชื่อช่าง / กลุ่มอาชีพ');
  if (!category) return showErr('⚠️ กรุณาเลือกประเภทบริการ');
  if (!phone)    return showErr('⚠️ กรุณากรอกเบอร์โทรศัพท์ติดต่อ');
  if (!area)     return showErr('⚠️ กรุณากรอกที่อยู่ / ชุมชน');
  if (!consent)  return showErr('⚠️ กรุณายอมรับข้อตกลงและเงื่อนไขก่อนส่งข้อมูล');
  errEl.hidden = true;

  const btn = $('#regSubmitBtn');
  const label = $('#regBtnLabel');
  btn.disabled = true;
  label.textContent = '⏳ กำลังส่งข้อมูล...';

  const payload = {
    name, category, phone,
    line,       // คอลัมน์ F ใน Sheet
    contact: social,  // คอลัมน์ I ใน Sheet (FB/เว็บ)
    area, desc,
    timestamp: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
  };

  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    document.getElementById('successName').textContent = `"${name}" — ${category}`;
    $('#registerStep1').hidden = true;
    $('#registerStep2').hidden = false;
  } catch (err) {
    showErr('❌ ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือติดต่อเทศบาลโดยตรง โทร 02-193-4512-3');
    console.error('Register error:', err);
    btn.disabled = false;
    label.textContent = '📨 ส่งข้อมูลสมัคร';
  }
}

renderCategories();
setupNavigation();
bindEvents();
syncOnlineStatus();
registerServiceWorker();

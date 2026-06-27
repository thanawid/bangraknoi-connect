const SHEET_URL = 'PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
const CATEGORIES = [
  ['ช่างในชุมชน','หาช่าง ซ่อมบ้าน ไฟฟ้า ประปา แอร์','assets/mascot_chang.png'],
  ['ร้านอาหาร / เครื่องดื่ม','ร้านอร่อย คาเฟ่ ของกินใกล้บ้าน','assets/mascot_food.png'],
  ['ฝึกอาชีพ / สมัครกิจกรรม','อบรม งานกิจกรรม กลุ่มอาชีพ','assets/mascot_career.png'],
  ['ข่าวสารชุมชน','ประกาศ ข่าว และเรื่องควรรู้','assets/mascot_news.png'],
  ['บริการชุมชน','บริการช่วยเหลือและประสานงาน','assets/mascot_service.png'],
  ['สินค้า / บริการท้องถิ่น','ของดี ของฝาก ผลิตภัณฑ์ชุมชน','assets/mascot_product.png'],
  ['กิจกรรมชุมชน','งานชุมชน ตลาด นัดพบ เวิร์กช็อป','assets/mascot_event.png'],
  ['พูดคุย แลกเปลี่ยน','พื้นที่ถามตอบและชวนกันพัฒนา','assets/mascot_chat.png']
];
let items = [
  {name:'ช่างสมชาย ไฟฟ้า-ประปา',category:'ช่างในชุมชน',description:'รับซ่อมไฟฟ้า ประปา งานบ้านทั่วไปในพื้นที่บางรักน้อย',phone:'08X-XXX-1111',area:'หมู่ 1',hours:'08.00-18.00',status:'อนุมัติ'},
  {name:'ครัวบ้านสวนริมคลอง',category:'ร้านอาหาร / เครื่องดื่ม',description:'อาหารไทย เครื่องดื่ม และเมนูชุมชน เหมาะสำหรับครอบครัว',phone:'08X-XXX-2222',area:'หมู่ 3',hours:'10.00-20.00',status:'อนุมัติ'},
  {name:'กลุ่มขนมไทยบางรักน้อย',category:'สินค้า / บริการท้องถิ่น',description:'ขนมไทย ของฝาก และรับจัดชุดเบรกสำหรับงานชุมชน',phone:'08X-XXX-3333',area:'หมู่ 5',hours:'รับออเดอร์ล่วงหน้า',status:'อนุมัติ'}
];
const $ = s => document.querySelector(s);
const grid = $('#listingGrid');
function init(){
  renderCategories(); fillSelects(); bind(); loadItems();
}
function renderCategories(){
  const box=$('#categoryGrid'); box.innerHTML='';
  CATEGORIES.forEach((c,i)=>{ const b=document.createElement('button'); b.className='cat'; b.dataset.cat=c[0]; b.innerHTML=`<img src="${c[2]}" alt=""><b>${c[0]}</b><small>${c[1]}</small>`; b.onclick=()=>{document.querySelectorAll('.cat').forEach(x=>x.classList.remove('active')); b.classList.add('active'); $('#categoryFilter').value=c[0]; renderItems();}; box.appendChild(b); });
}
function fillSelects(){
  const filter=$('#categoryFilter'); const formSel=document.querySelector('[name=category]');
  CATEGORIES.forEach(c=>{ filter.insertAdjacentHTML('beforeend',`<option>${c[0]}</option>`); formSel.insertAdjacentHTML('beforeend',`<option>${c[0]}</option>`); });
}
function bind(){ $('#searchInput').addEventListener('input',renderItems); $('#categoryFilter').addEventListener('change',renderItems); $('#joinForm').addEventListener('submit',submitForm); }
async function loadItems(){
  if(!SHEET_URL || SHEET_URL.includes('PASTE_')) return renderItems();
  try{ const r=await fetch(SHEET_URL+'?action=public'); const data=await r.json(); if(data.items?.length) items=data.items; }catch(e){ console.warn(e); }
  renderItems();
}
function renderItems(){
  const q=$('#searchInput').value.trim().toLowerCase(); const cat=$('#categoryFilter').value;
  const data=items.filter(x=>(!x.status||x.status==='อนุมัติ'||x.status==='approved')).filter(x=>(cat==='all'||x.category===cat)).filter(x=>!q || [x.name,x.category,x.description,x.area].join(' ').toLowerCase().includes(q));
  $('#resultCount').textContent=data.length+' รายการ'; grid.innerHTML='';
  if(!data.length){ grid.innerHTML='<div class="card"><h3>ยังไม่พบข้อมูล</h3><p>ลองเปลี่ยนคำค้นหรือเลือกหมวดอื่น</p></div>'; return; }
  data.forEach(x=>{ const el=document.createElement('article'); el.className='card'; el.innerHTML=`<span class="tag">${esc(x.category||'ข้อมูลชุมชน')}</span><h3>${esc(x.name)}</h3><p>${esc(x.description||'')}</p><div class="meta"><span>📍 ${esc(x.area||'-')}</span><span>🕒 ${esc(x.hours||'-')}</span><span>☎️ ${esc(x.phone||'-')}</span>${x.social?`<span>💬 ${esc(x.social)}</span>`:''}${x.map?`<a href="${esc(x.map)}" target="_blank">🗺️ เปิดแผนที่</a>`:''}</div>`; grid.appendChild(el); });
}
async function submitForm(e){
  e.preventDefault(); const form=e.currentTarget; const note=$('#formNote');
  const payload=Object.fromEntries(new FormData(form).entries()); payload.status='รอตรวจสอบ'; payload.createdAt=new Date().toISOString();
  if(!SHEET_URL || SHEET_URL.includes('PASTE_')){ note.textContent='โหมดเดโม: ยังไม่ได้เชื่อม Google Sheet แต่ฟอร์มพร้อมใช้งานแล้ว'; form.reset(); return; }
  note.textContent='กำลังส่งข้อมูล...';
  try{ await fetch(SHEET_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'submit',data:payload})}); note.textContent='ส่งข้อมูลเรียบร้อย รอตรวจสอบก่อนเผยแพร่'; form.reset(); }
  catch(err){ note.textContent='ส่งไม่สำเร็จ: '+err.message; }
}
function esc(s){return String(s||'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
document.addEventListener('DOMContentLoaded',init);

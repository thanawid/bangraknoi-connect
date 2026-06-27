const cats=[
 {id:'builder',no:1,name:'หาช่าง',img:'assets/cat-builder.png',hint:'ช่างไฟ ช่างประปา ช่างแอร์ ซ่อมบ้าน'},
 {id:'food',no:2,name:'ร้านอาหาร',img:'assets/cat-food.png',hint:'ร้านอาหาร คาเฟ่ ของกินใกล้บ้าน'},
 {id:'training',no:3,name:'ฝึกอาชีพ',img:'assets/cat-training.png',hint:'อบรมอาชีพ สมัครกิจกรรม'},
 {id:'news',no:4,name:'ประกาศข่าวสาร',img:'assets/cat-news.png',hint:'ประกาศ กิจกรรม แจ้งเตือน'},
 {id:'service',no:5,name:'บริการชุมชน',img:'assets/cat-service.png',hint:'บริการเทศบาลและชุมชน'},
 {id:'products',no:6,name:'สินค้า/บริการท้องถิ่น',img:'assets/cat-products.png',hint:'ของดีชุมชน วิสาหกิจ ร้านท้องถิ่น'},
 {id:'activity',no:7,name:'กิจกรรมชุมชน',img:'assets/cat-activity.png',hint:'กิจกรรม งานประชุม งานชุมชน'},
 {id:'chat',no:8,name:'พูดคุย แลกเปลี่ยน',img:'assets/cat-chat.png',hint:'พื้นที่เสนอแนะ แจ้งแก้ไขข้อมูล'}
];
const seed=[
 {id:1,name:'ช่างไฟบางรักน้อยทีม',cat:'builder',area:'หมู่ที่ 1',contact:'โทร 08x-xxx-1111',desc:'รับงานไฟฟ้าภายในบ้าน ตรวจเช็กเบรกเกอร์ ปลั๊ก ไฟส่องสว่าง บริการในพื้นที่บางรักน้อย',status:'approved'},
 {id:2,name:'ครัวริมคลอง',cat:'food',area:'หมู่ที่ 3',contact:'LINE: @demo-food',desc:'อาหารไทย ข้าวแกง และเมนูพื้นบ้าน เหมาะสำหรับค้นหาร้านใกล้บ้าน',status:'approved'},
 {id:3,name:'อบรมอาชีพทำขนม',cat:'training',area:'เทศบาลเมืองบางรักน้อย',contact:'งานพัฒนาชุมชน',desc:'ตัวอย่างข้อมูลการอบรมอาชีพ เปิดรับสมัครผ่านระบบได้ในอนาคต',status:'approved'},
 {id:4,name:'แจ้งข่าวเทศบาล',cat:'news',area:'ทุกพื้นที่',contact:'งานประชาสัมพันธ์',desc:'รวมประกาศสำคัญ ข่าวบริการ และแจ้งเตือนประชาชนไว้ในที่เดียว',status:'approved'},
 {id:5,name:'บริการรับแจ้งไฟสาธารณะ',cat:'service',area:'ทุกพื้นที่',contact:'เทศบาลเมืองบางรักน้อย',desc:'ตัวอย่างบริการชุมชนสำหรับแจ้งข้อมูลเบื้องต้นและติดตามงาน',status:'approved'},
 {id:6,name:'ตะกร้าของดีชุมชน',cat:'products',area:'หมู่ที่ 6',contact:'Facebook: demo-local',desc:'ตัวอย่างสินค้า/บริการท้องถิ่น เพิ่มการมองเห็นให้ผู้ประกอบการรายย่อย',status:'approved'},
 {id:7,name:'กิจกรรมริมคลองสุขใจ',cat:'activity',area:'หมู่ที่ 2',contact:'ผู้ประสานงานชุมชน',desc:'ตัวอย่างกิจกรรมชุมชน ประชาสัมพันธ์และรับสมัครได้สะดวกขึ้น',status:'approved'},
 {id:8,name:'กล่องเสนอแนะ BC',cat:'chat',area:'ออนไลน์',contact:'แบบฟอร์มแจ้งแก้ไข',desc:'พื้นที่ให้ประชาชนแจ้งข้อมูลผิด เสนอร้านหรือบริการ และพูดคุยแลกเปลี่ยน',status:'approved'}
];
let currentCat='all';
const $=s=>document.querySelector(s);
function getItems(){return JSON.parse(localStorage.getItem('brn_items')||'null')||seed}
function saveItems(items){localStorage.setItem('brn_items',JSON.stringify(items))}
function init(){ if(!localStorage.getItem('brn_items'))saveItems(seed); renderCats(); fillForms(); renderArea(); renderCards(); renderAdmin(); setScene(); setGreeting(); $('#menuBtn').onclick=()=>$('.topnav').classList.toggle('open'); $('#searchInput').oninput=renderCards; $('#areaFilter').onchange=renderCards; $('#resetFilter').onclick=()=>{currentCat='all';renderCats();renderCards()}; $('#joinForm').onsubmit=submitForm; }
function renderCats(){const g=$('#categoryGrid');g.innerHTML=cats.map(c=>`<button class="cat-card ${currentCat===c.id?'active':''}" data-id="${c.id}"><img src="${c.img}" alt="${c.name}"><b>${c.no}. ${c.name}</b><small>${c.hint}</small></button>`).join('');g.querySelectorAll('button').forEach(b=>b.onclick=()=>{currentCat=b.dataset.id;renderCats();renderCards();zoomMap(currentCat);bcSay(`นี่คือหมวด ${cats.find(c=>c.id===currentCat).name} ครับ`)})}
function fillForms(){const sel=$('#joinForm select[name=category]');sel.innerHTML=cats.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}
function renderArea(){const areas=[...new Set(getItems().map(i=>i.area))];$('#areaFilter').innerHTML='<option value="all">ทุกหมู่/ทุกพื้นที่</option>'+areas.map(a=>`<option>${a}</option>`).join('')}
function renderCards(){const q=$('#searchInput').value.trim().toLowerCase(),area=$('#areaFilter').value;let items=getItems().filter(i=>i.status==='approved');if(currentCat!=='all')items=items.filter(i=>i.cat===currentCat);if(area!=='all')items=items.filter(i=>i.area===area);if(q)items=items.filter(i=>(i.name+i.desc+i.area+catName(i.cat)).toLowerCase().includes(q));$('#statItems').textContent=getItems().filter(i=>i.status==='approved').length;$('#cards').innerHTML=items.map(i=>`<article class="item-card"><div class="item-top"><span class="badge">${catName(i.cat)}</span><span class="badge">${i.area}</span></div><h3>${i.name}</h3><p>${i.desc}</p><div class="item-actions"><button class="btn secondary" onclick="openDetail(${i.id})">ดูข้อมูล</button><button class="btn ghost" onclick="reportItem(${i.id})">แจ้งแก้ไข</button></div></article>`).join('')||'<div class="item-card"><h3>ยังไม่พบข้อมูล</h3><p>ลองเปลี่ยนคำค้น หรือเพิ่มข้อมูลใหม่เพื่อรอตรวจสอบได้เลยครับ</p></div>'}
function catName(id){return (cats.find(c=>c.id===id)||{}).name||id}
function openDetail(id){const i=getItems().find(x=>x.id===id);$('#detailBody').innerHTML=`<h2>${i.name}</h2><p><b>หมวด:</b> ${catName(i.cat)}</p><p><b>พื้นที่:</b> ${i.area}</p><p><b>ติดต่อ:</b> ${i.contact}</p><p>${i.desc}</p><hr><small>หมายเหตุ: ข้อมูลผ่านการตรวจสอบเบื้องต้น การติดต่อว่าจ้างเป็นความรับผิดชอบระหว่างประชาชนกับผู้ให้บริการโดยตรง</small>`;detailDialog.showModal()}
function reportItem(id){const i=getItems().find(x=>x.id===id);bcSay(`รับเรื่องแจ้งแก้ไขของ ${i.name} แล้วครับ`);alert('บันทึกตัวอย่างการแจ้งแก้ไขแล้ว: '+i.name)}
function submitForm(e){e.preventDefault();const fd=new FormData(e.target);const items=getItems();items.push({id:Date.now(),name:fd.get('name'),cat:fd.get('category'),area:fd.get('area'),contact:fd.get('contact'),desc:fd.get('desc'),status:'pending'});saveItems(items);e.target.reset();$('#formNote').textContent='ส่งข้อมูลแล้ว อยู่ในสถานะรอตรวจสอบ';renderAdmin();renderArea();bcSay('ข้อมูลเข้าหลังบ้านแล้วครับ รอเจ้าหน้าที่ตรวจสอบ')}
function renderAdmin(){const items=getItems();const row=i=>`<div class="admin-row"><b>${i.name}</b><br><small>${catName(i.cat)} • ${i.area}</small><p>${i.desc}</p>${i.status==='pending'?`<button class="btn primary" onclick="setStatus(${i.id},'approved')">อนุมัติ</button>`:''}<button class="btn ghost" onclick="removeItem(${i.id})">ถอดข้อมูล</button></div>`;$('#pendingList').innerHTML=items.filter(i=>i.status==='pending').map(row).join('')||'<p>ไม่มีข้อมูลรอตรวจสอบ</p>';$('#approvedList').innerHTML=items.filter(i=>i.status==='approved').map(row).join('')||'<p>ยังไม่มีข้อมูลเผยแพร่</p>'}
function setStatus(id,status){let items=getItems();items=items.map(i=>i.id===id?{...i,status}:i);saveItems(items);renderCards();renderAdmin();renderArea()}
function removeItem(id){saveItems(getItems().filter(i=>i.id!==id));renderCards();renderAdmin();renderArea()}
function zoomMap(id){const pos={builder:'20% 55%',food:'76% 58%',training:'42% 58%',news:'50% 45%',service:'52% 50%',products:'68% 64%',activity:'35% 70%',chat:'58% 75%'};$('#miniMap').style.backgroundPosition=pos[id]||'center';$('#miniMap').style.backgroundSize='190%'}
function setScene(){const h=new Date().getHours()+new Date().getMinutes()/60,scene=$('#scene'),pill=$('#timePill');if(h>=18.5||h<5.5){scene.classList.add('night');pill.textContent='โหมดกลางคืน: ไฟเมืองเปิดเอง'}else if(h>=17){scene.classList.add('evening');pill.textContent='โหมดแสงเย็น: เมืองนุ่มลง'}else if(h>=11&&h<15){pill.textContent='โหมดกลางวัน: แดดสดใส'}else{pill.textContent='โหมดเช้า: บางรักน้อยเริ่มขยับ'}if(new Date().getMinutes()%7===0)scene.classList.add('is-raining')}
function setGreeting(){let n=+(localStorage.getItem('brn_visit')||0)+1;localStorage.setItem('brn_visit',n);bcSay(n===1?'สวัสดีครับ 😊 ผม BC ไกด์เมืองบางรักน้อย':`กลับมาอีกแล้ว ครั้งที่ ${n} ยินดีต้อนรับครับ`)}
function bcSay(t){$('#bcSpeech').textContent=t}
window.addEventListener('DOMContentLoaded',init);

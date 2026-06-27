const SHEET_URL = 'PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
const ADMIN_KEY = 'CHANGE_ME_1234';
let rows=[];
function statusClass(s){return s==='อนุมัติ'||s==='approved'?'ok':s==='ไม่อนุมัติ'||s==='rejected'?'no':'wait'}
function esc(s){return String(s||'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
async function loadAdmin(){
 const key=document.getElementById('adminKey').value.trim();
 if(key!==ADMIN_KEY){alert('รหัสผู้ดูแลไม่ถูกต้อง');return}
 const tb=document.getElementById('adminRows'); tb.innerHTML='<tr><td colspan="7">กำลังโหลด...</td></tr>';
 if(!SHEET_URL || SHEET_URL.includes('PASTE_')){ rows=[{row:2,status:'รอตรวจสอบ',name:'ตัวอย่างร้านชุมชน',category:'ร้านอาหาร / เครื่องดื่ม',description:'ข้อมูลตัวอย่างสำหรับทดสอบหลังบ้าน',phone:'08X-XXX-0000',contact:'ทีมงาน',area:'หมู่ 1'}]; return render(); }
 const r=await fetch(SHEET_URL+'?action=admin&key='+encodeURIComponent(key)); const d=await r.json(); rows=d.items||[]; render();
}
function render(){
 const tb=document.getElementById('adminRows'); tb.innerHTML='';
 if(!rows.length){tb.innerHTML='<tr><td colspan="7">ไม่มีข้อมูล</td></tr>';return}
 rows.forEach(x=>{tb.insertAdjacentHTML('beforeend',`<tr><td><span class="pill ${statusClass(x.status)}">${esc(x.status||'รอตรวจสอบ')}</span></td><td><b>${esc(x.name)}</b><br><small>${esc(x.createdAt||'')}</small></td><td>${esc(x.category)}</td><td>${esc(x.description)}</td><td>${esc(x.contact)}<br>${esc(x.phone)}<br>${esc(x.social||'')}</td><td>${esc(x.area)}</td><td><button class="mini okb" onclick="setStatus(${x.row},'อนุมัติ')">อนุมัติ</button> <button class="mini nob" onclick="setStatus(${x.row},'ไม่อนุมัติ')">ไม่อนุมัติ</button></td></tr>`)});
}
async function setStatus(row,status){
 const key=document.getElementById('adminKey').value.trim();
 if(!SHEET_URL || SHEET_URL.includes('PASTE_')){ rows=rows.map(x=>x.row===row?{...x,status}:x); render(); return; }
 await fetch(SHEET_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'status',key,row,status})});
 setTimeout(loadAdmin,600);
}

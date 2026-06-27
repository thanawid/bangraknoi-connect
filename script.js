var SID='1-t3GIdtxAzbfPeQlIDfQb-9poVqjiD8m8XRyf73NQDM';
var CACHE={};
var ICONS={ช่าง:'ti-tool',ร้านอาหาร:'ti-bowl',สินค้า:'ti-shopping-bag',บริการชุมชน:'ti-home-heart',อาชีพ:'ti-school',กิจกรรม:'ti-calendar-event',ข่าว:'ti-speakerphone',พูดคุย:'ti-message-circle'};
var TITLES={ช่าง:'ช่างในชุมชน',ร้านอาหาร:'ร้านอาหาร/ของดี',สินค้า:'สินค้าท้องถิ่น',บริการชุมชน:'บริการชุมชน',อาชีพ:'ฝึกอาชีพ/หลักสูตร',กิจกรรม:'กิจกรรมชุมชน',ข่าว:'ข่าวสารเทศบาล',พูดคุย:'พูดคุย แลกเปลี่ยน'};
var IMAP={'ช่างไฟ':'ti-plug','ช่างประปา':'ti-droplet','ช่างแอร์':'ti-air-conditioning','ช่างยาง':'ti-car','อาหารตามสั่ง':'ti-bowl','คาเฟ่':'ti-coffee','อาหารไทย':'ti-fish','วัด':'ti-building-church','ตลาด':'ti-shopping-cart','สวนสาธารณะ':'ti-trees','อบรม':'ti-school','กิจกรรม':'ti-calendar-event','ประกาศ':'ti-speakerphone'};
var TMAP={'ช่างไฟ':'t-p','ช่างประปา':'t-b','ช่างแอร์':'t-g','ช่างยาง':'t-o','อาหารตามสั่ง':'t-o','คาเฟ่':'t-g','อาหารไทย':'t-b','วัด':'t-o','ตลาด':'t-o','สวนสาธารณะ':'t-g','อบรม':'t-p','กิจกรรม':'t-b','ประกาศ':'t-p'};
var AIR={'หาช่างไฟฟ้าใกล้บ้าน':'⚡ พบช่างไฟในระบบ<br><br><b>ช่างไฟ สมชาย</b> — หมู่ 3<br>โทร <span style="color:#5B21B6">089-123-4567</span> | ✅ ตรวจสอบแล้ว','ร้านอาหารเปิดเย็น':'🍜 ร้านที่เปิดช่วงเย็น<br><br><b>คาเฟ่บางรักน้อย</b> เปิดถึง 20.00 น.<br><b>ต้มยำป้าเพิ่ม</b> เปิดถึง 21.00 น.','จุดเช็คอินบางรักน้อย':'📍 จุดยอดนิยม<br><br>1. วัดบางรักน้อย<br>2. ตลาดน้ำท่าอิฐ<br>3. สวนสาธารณะเทศบาล','อบรมอาชีพฟรี':'🎓 หลักสูตรเปิดรับ<br><br>✅ ตัดเย็บเสื้อผ้า<br>✅ เกษตรอินทรีย์<br>✅ ทักษะดิจิทัล','ข่าวสารล่าสุด':'📢 ข่าวล่าสุด<br><br>⚠️ ปิดถนนซ่อมบำรุงหมู่ 2<br>🎉 งานลอยกระทง 20 พ.ย.<br>💊 ตรวจสุขภาพฟรีผู้สูงอายุ'};

// FETCH SHEETS
async function fetchSheet(cat){
  if(CACHE[cat])return CACHE[cat];
  var url='https://docs.google.com/spreadsheets/d/'+SID+'/gviz/tq?tqx=out:json&sheet='+encodeURIComponent(cat);
  try{
    var res=await fetch(url),text=await res.text();
    var m=text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\)/);
    if(!m)return[];
    var rows=JSON.parse(m[1]).table.rows||[];
    var data=rows.map(function(r){
      var c=r.c||[],v=function(i){return(c[i]&&c[i].v)?String(c[i].v):''};
      var ct=v(1);
      return{title:v(0),cat:ct,desc:v(2),phone:v(3),area:v(4),social:v(5),status:v(6),
        icon:IMAP[ct]||'ti-star',thumb:TMAP[ct]||'t-p',
        ok:v(6)===''||v(6).indexOf('อนุมัติ')>=0};
    }).filter(function(r){return r.title&&r.title!=='ชื่อ';});
    CACHE[cat]=data;return data;
  }catch(e){return[];}
}

// RENDER CARDS
async function renderCards(cat){
  var cl=document.getElementById('cardList');
  document.getElementById('listTitle').textContent=TITLES[cat]||cat;
  document.getElementById('listIcon').className='ti '+(ICONS[cat]||'ti-list');
  cl.innerHTML='<div class="loading-state"><i class="ti ti-loader"></i><p>กำลังโหลดข้อมูล...</p></div>';
  var items=await fetchSheet(cat);
  if(!items.length){
    cl.innerHTML='<div class="empty-state"><i class="ti ti-database-off"></i><p>ยังไม่มีข้อมูลในหมวดนี้<br><small>เจ้าหน้าที่กำลังรวบรวมข้อมูลครับ</small></p></div>';
    return;
  }
  cl.innerHTML=items.map(function(d,i){
    return'<div class="card" style="animation-delay:'+(i*0.07)+'s">'+
      '<div class="card-top">'+
        '<div class="card-thumb '+d.thumb+'"><i class="ti '+d.icon+'"></i></div>'+
        '<div class="card-info"><h3>'+d.title+'</h3><p>'+d.desc+'</p></div>'+
      '</div>'+
      '<div class="card-meta">'+
        '<span class="badge b-p">'+d.cat+'</span>'+
        (d.ok?'<span class="verified"><i class="ti ti-circle-check" style="font-size:9px"></i> ตรวจสอบแล้ว</span>':'')+
        (d.area?'<span class="badge b-gr"><i class="ti ti-map-pin" style="font-size:9px"></i> '+d.area+'</span>':'')+
        (d.phone?'<a class="phone-link" href="tel:'+d.phone+'"><i class="ti ti-phone" style="font-size:10px"></i> '+d.phone+'</a>':'')+
      '</div></div>';
  }).join('');
}

// SWITCH CAT
function switchCat(el,cat){
  document.querySelectorAll('.cat-card').forEach(function(c){c.classList.remove('active');});
  el.classList.add('active');
  renderCards(cat);
  document.querySelector('.cards-section').scrollIntoView({behavior:'smooth',block:'start'});
}

// AI
function openAI(){var p=document.getElementById('aiPanel');p.classList.add('show');document.getElementById('aiInput').focus();}
function closeAI(){document.getElementById('aiPanel').classList.remove('show');}
function setQ(q){document.getElementById('aiInput').value=q;askAI();}
function doSearch(){var q=document.getElementById('mainSearch').value.trim();if(q){document.getElementById('aiInput').value=q;openAI();askAI();}}
function askAI(){
  var q=document.getElementById('aiInput').value.trim();if(!q)return;
  var el=document.getElementById('aiResult');
  el.innerHTML=AIR[q]||('🔍 ค้นหา <b>'+q+'</b>...<br><br>ไม่พบข้อมูลตรงกัน ลองคำอื่นได้เลยครับ');
  el.classList.add('show');
}
document.getElementById('mainSearch').addEventListener('keyup',function(e){if(e.key==='Enter')doSearch();});
document.getElementById('aiInput').addEventListener('keyup',function(e){if(e.key==='Enter')askAI();});

// MODAL
function openRegModal(){
  var m=document.getElementById('regModal');m.classList.add('show');
  document.getElementById('regForm').style.display='block';
  document.getElementById('successBox').style.display='none';
  setTimeout(function(){m.scrollIntoView({behavior:'smooth',block:'start'});},50);
}
function closeReg(){document.getElementById('regModal').classList.remove('show');}
document.getElementById('regModal').addEventListener('click',function(e){if(e.target===this)closeReg();});

function checkConsent(){
  var ok=document.getElementById('c1').checked&&document.getElementById('c2').checked&&document.getElementById('c3').checked;
  document.getElementById('submitBtn').disabled=!ok;
}
async function submitForm(){
  var type=document.getElementById('regType').value,name=document.getElementById('regName').value.trim(),
    contact=document.getElementById('regContact').value.trim(),phone=document.getElementById('regPhone').value.trim(),
    area=document.getElementById('regArea').value.trim(),social=document.getElementById('regSocial').value.trim(),
    desc=document.getElementById('regDesc').value.trim();
  if(!type||!name||!contact||!phone||!area||!desc){alert('กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วนครับ');return;}
  var btn=document.getElementById('submitBtn');btn.textContent='กำลังส่ง...';btn.disabled=true;
  try{
    var res=await fetch('https://formspree.io/f/mlgyjlyo',{method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({'_subject':'[BC] สมัครใหม่: '+name,'ประเภท':type,'ชื่อ':name,
        'ผู้ประสานงาน':contact,'เบอร์':phone,'ที่อยู่':area,'LINE':social||'-','รายละเอียด':desc})});
    if(res.ok){
      document.getElementById('regForm').style.display='none';
      document.getElementById('successBox').style.display='block';
      launchConfetti();
    }else{alert('เกิดข้อผิดพลาด ลองใหม่ครับ');btn.textContent='ส่งข้อมูล';btn.disabled=false;}
  }catch(e){alert('ไม่สามารถส่งได้ ตรวจสอบอินเทอร์เน็ตครับ');btn.textContent='ส่งข้อมูล';btn.disabled=false;}
}

// CONFETTI
function launchConfetti(){
  var box=document.getElementById('confettiBox');
  box.innerHTML='';box.classList.add('show');
  var colors=['#5B21B6','#F59E0B','#111','#fff','#7C3AED','#FCD34D'];
  for(var i=0;i<80;i++){
    var p=document.createElement('div');p.className='cp';
    var s=Math.random()*10+5;
    p.style.cssText='left:'+Math.random()*100+'%;width:'+s+'px;height:'+s+'px;'+
      'background:'+colors[Math.floor(Math.random()*colors.length)]+';'+
      'border-radius:'+Math.random()*50+'%;'+
      'animation-duration:'+(Math.random()*2+1.5)+'s;animation-delay:'+(Math.random()*0.8)+'s';
    box.appendChild(p);
  }
  setTimeout(function(){box.classList.remove('show');box.innerHTML='';},4000);
}

// NAV
function navTo(page,el){
  document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.remove('active');});
  el.classList.add('active');
  if(page==='home')window.scrollTo({top:0,behavior:'smooth'});
  else if(page==='search')openAI();
  else if(page==='map')document.querySelector('.map-section').scrollIntoView({behavior:'smooth'});
  else if(page==='reg')openRegModal();
}

// REVEAL
var rObs=new IntersectionObserver(function(e){
  e.forEach(function(x){if(x.isIntersecting){x.target.classList.add('visible');rObs.unobserve(x.target);}});
},{threshold:0.08});
document.querySelectorAll('.reveal').forEach(function(el){rObs.observe(el);});

// COUNTER
var cDone=false;
var cObs=new IntersectionObserver(function(e){
  if(e[0].isIntersecting&&!cDone){cDone=true;
    function cnt(id,n){
      var el=document.getElementById(id),s=0,step=n/60,t=setInterval(function(){
        s+=step;if(s>=n){s=n;clearInterval(t);}el.textContent=Math.floor(s);
      },16);
    }
    cnt('n1',24);cnt('n2',38);cnt('n3',12);
  }
},{threshold:0.3});
var sb=document.querySelector('.stats-bar');if(sb)cObs.observe(sb);

// INIT
renderCards('ช่าง');

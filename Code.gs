// ═══════════════════════════════════════════════════════════════════
//  บางรักน้อย Connect — Google Apps Script v6
//  Sheet ID: 1-t3GIdtxAzbfPeQlIDfQb-9poVqjiD8m8XRyf73NQDM
//
//  ฟีเจอร์:
//  1. รับข้อมูลสมัครจากฟอร์มเว็บ (doPost)
//  2. ดึงข่าวจาก Facebook Page อัตโนมัติ (fetchFBNews)
//     - รันผ่าน Time-based Trigger ทุก 6 ชั่วโมง
//  3. เว็บดึงข่าวผ่าน doGet?action=news
//
//  ════ วิธีติดตั้ง ════
//  1. เปิด Google Sheet → Extensions > Apps Script
//  2. วางโค้ดทั้งหมดนี้ แทนที่โค้ดเดิม
//  3. แก้ FB_PAGE_ID และ FB_ACCESS_TOKEN ด้านล่าง
//  4. Deploy > New deployment > Web app
//     Execute as: Me | Who has access: Anyone
//  5. ตั้ง Trigger: ฟังก์ชัน fetchFBNews → Time-driven → Every 6 hours
//
//  ════ วิธีหา Facebook Access Token ════
//  ก. ไป https://developers.facebook.com/tools/explorer/
//  ข. เลือก App ของตัวเอง (หรือสร้างใหม่ฟรี)
//  ค. Generate Token → ติ๊ก pages_read_engagement + pages_show_list
//  ง. คัดลอก Token มาวางใน FB_ACCESS_TOKEN
//  (Token ธรรมดาหมดอายุ 60 วัน ใช้ Long-lived Token แทนได้)
// ═══════════════════════════════════════════════════════════════════

var SHEET_ID      = '1-t3GIdtxAzbfPeQlIDfQb-9poVqjiD8m8XRyf73NQDM';
var SHEET_FORM    = 'ชีต1';          // sheet รับสมัคร (มีอยู่แล้ว)
var SHEET_NEWS    = 'ข่าวสาร';       // sheet เก็บข่าว FB (สร้างอัตโนมัติ)

// ── แก้ค่านี้ ──────────────────────────────────────────────────────
var FB_PAGE_ID      = 'BangraknoimunicipalityNonthaburi'; // ชื่อหรือ ID เพจ FB
var FB_ACCESS_TOKEN = 'PASTE_YOUR_FACEBOOK_TOKEN_HERE';   // Token จาก FB Developer
var NEWS_LIMIT      = 10;  // แสดงกี่ข่าวบนเว็บ
var FETCH_LIMIT     = 20;  // ดึงจาก FB กี่โพสต์ต่อรอบ
// ───────────────────────────────────────────────────────────────────

var NEWS_HEADERS = ['id','วันที่','หัวข้อ','เนื้อหา','ลิงก์','รูปภาพ','ประเภท'];

// ══════════════════════════════════════════════════════════════════
//  1. รับฟอร์มสมัครจากเว็บ (POST)
// ══════════════════════════════════════════════════════════════════
function doPost(e) {
  try {
    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_FORM) || ss.getActiveSheet();
    var data  = JSON.parse(e.postData.contents);

    if (sheet.getLastRow() === 0) {
      var h = sheet.appendRow(['ชื่อ','ประเภท','รายละเอียด','เบอร์โทร','ที่อยู่','LINE','สถานะ','ผู้ประสานงาน','เวลาบริการ','แผนที่','วันที่สมัคร']);
      styleHeader_(sheet, 1, 11);
    }
    sheet.appendRow([
      data.name||'', data.type||'', data.desc||'', data.phone||'',
      data.address||'', data.social||'', data.status||'รอตรวจสอบ',
      data.contact||'', data.hours||'', data.maplink||'',
      data.timestamp||new Date().toLocaleString('th-TH')
    ]);
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow,7).setBackground('#FEF3C7').setFontColor('#92400E');
    sheet.autoResizeColumns(1,11);

    return json_({result:'success', row:lastRow});
  } catch(err) {
    return json_({result:'error', message:err.toString()});
  }
}

// ══════════════════════════════════════════════════════════════════
//  2. ดึงข่าวจาก Facebook Graph API → บันทึกลง Sheet
//     ตั้ง Trigger: fetchFBNews → Time-driven → Every 6 hours
// ══════════════════════════════════════════════════════════════════
function fetchFBNews() {
  if (FB_ACCESS_TOKEN === 'PASTE_YOUR_FACEBOOK_TOKEN_HERE') {
    Logger.log('⚠️ กรุณาใส่ FB_ACCESS_TOKEN ก่อน');
    return;
  }

  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = getOrCreateNewsSheet_(ss);

  // เรียก Graph API
  var url = 'https://graph.facebook.com/v21.0/' + FB_PAGE_ID +
    '/posts?fields=id,message,story,full_picture,permalink_url,created_time,attachments{title,description,type}' +
    '&limit=' + FETCH_LIMIT + '&access_token=' + FB_ACCESS_TOKEN;

  var res;
  try {
    res = UrlFetchApp.fetch(url, {muteHttpExceptions:true});
  } catch(err) {
    Logger.log('Fetch error: ' + err.toString());
    return;
  }

  var json = JSON.parse(res.getContentText());
  if (json.error) {
    Logger.log('FB API Error: ' + JSON.stringify(json.error));
    return;
  }

  var posts  = json.data || [];
  var saved  = 0;

  // อ่าน ID ที่บันทึกไปแล้ว
  var existing = {};
  var lastRow  = sheet.getLastRow();
  if (lastRow > 1) {
    var ids = sheet.getRange(2, 1, lastRow-1, 1).getValues();
    ids.forEach(function(r){ if(r[0]) existing[r[0]] = true; });
  }

  posts.forEach(function(p) {
    if (existing[p.id]) return; // ข้ามถ้ามีอยู่แล้ว

    var att    = p.attachments && p.attachments.data && p.attachments.data[0];
    var title  = (att && att.title) || extractTitle_(p.message || p.story || '') || '(ไม่มีหัวข้อ)';
    var body   = p.message || p.story || '';
    var type   = (att && att.type) || 'status';
    var img    = p.full_picture || '';
    var link   = p.permalink_url || ('https://facebook.com/' + p.id);
    var date   = formatThaiDate_(p.created_time);

    sheet.appendRow([p.id, date, title, body, link, img, type]);
    saved++;
  });

  if (saved > 0) {
    Logger.log('บันทึกข่าวใหม่ ' + saved + ' รายการ');
    // เรียงตามวันที่ใหม่ไปเก่า
    if (sheet.getLastRow() > 2) {
      sheet.getRange(2, 1, sheet.getLastRow()-1, 7)
        .sort({column:2, ascending:false});
    }
  }
}

// ══════════════════════════════════════════════════════════════════
//  3. เว็บเรียกดึงข่าว (GET ?action=news)
//     เว็บดึงด้วย fetch(SHEET_URL + '?action=news')
// ══════════════════════════════════════════════════════════════════
function doGet(e) {
  var action = e && e.parameter && e.parameter.action;

  if (action === 'news') {
    try {
      var ss    = SpreadsheetApp.openById(SHEET_ID);
      var sheet = ss.getSheetByName(SHEET_NEWS);
      if (!sheet || sheet.getLastRow() < 2) {
        return json_({news:[], total:0, updated:'ยังไม่มีข่าว'});
      }
      var rows  = sheet.getRange(2, 1, Math.min(sheet.getLastRow()-1, NEWS_LIMIT), 7).getValues();
      var news  = rows
        .filter(function(r){ return r[0]; })
        .map(function(r){
          return {
            id:      r[0],
            date:    r[1],
            title:   r[2],
            content: r[3].toString().substring(0,200) + (r[3].toString().length>200?'...':''),
            link:    r[4],
            image:   r[5],
            type:    r[6]
          };
        });
      return json_({news:news, total:news.length, updated:new Date().toLocaleString('th-TH')});
    } catch(err) {
      return json_({news:[], error:err.toString()});
    }
  }

  // health check
  return json_({status:'ok', app:'บางรักน้อย Connect v6'});
}

// ══════════════════════════════════════════════════════════════════
//  ตั้ง Trigger อัตโนมัติ (รันครั้งเดียว แล้วจะ trigger เองทุก 6 ชั่วโมง)
// ══════════════════════════════════════════════════════════════════
function setupTrigger() {
  // ลบ trigger เก่าที่ซ้ำ
  ScriptApp.getProjectTriggers().forEach(function(t){
    if (t.getHandlerFunction() === 'fetchFBNews') ScriptApp.deleteTrigger(t);
  });
  // สร้างใหม่ทุก 6 ชั่วโมง
  ScriptApp.newTrigger('fetchFBNews')
    .timeBased()
    .everyHours(6)
    .create();
  Logger.log('✅ Trigger ตั้งเรียบร้อย — fetchFBNews จะรันทุก 6 ชั่วโมง');
  // รันทันที 1 รอบ
  fetchFBNews();
}

// ══════════════════════════════════════════════════════════════════
//  Helper functions
// ══════════════════════════════════════════════════════════════════
function getOrCreateNewsSheet_(ss) {
  var sheet = ss.getSheetByName(SHEET_NEWS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NEWS);
    sheet.appendRow(NEWS_HEADERS);
    styleHeader_(sheet, 1, 7);
    sheet.setColumnWidth(1,160);
    sheet.setColumnWidth(3,200);
    sheet.setColumnWidth(4,300);
    sheet.setColumnWidth(5,200);
    sheet.setColumnWidth(6,200);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(NEWS_HEADERS);
    styleHeader_(sheet, 1, 7);
  }
  return sheet;
}

function styleHeader_(sheet, row, cols) {
  var r = sheet.getRange(row, 1, 1, cols);
  r.setBackground('#6B35C9').setFontColor('#FFFFFF').setFontWeight('bold');
  sheet.setFrozenRows(row);
}

function extractTitle_(text) {
  if (!text) return '';
  var first = text.split('\n')[0].trim();
  return first.length > 80 ? first.substring(0,80)+'...' : first;
}

function formatThaiDate_(isoStr) {
  if (!isoStr) return '';
  var d = new Date(isoStr);
  return Utilities.formatDate(d, 'Asia/Bangkok', 'dd/MM/yyyy HH:mm');
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Bangraknoi Connect — Google Sheet Receiver
 * ใช้กับฟอร์มสมัครในหน้าเว็บ GitHub Pages
 * วิธีใช้แบบง่าย:
 * 1) เปิด Google Sheet ใหม่
 * 2) Extensions > Apps Script
 * 3) วางโค้ดนี้ แล้วกด Save
 * 4) Deploy > New deployment > Web app
 *    Execute as: Me
 *    Who has access: Anyone
 * 5) Copy Web App URL ไปใส่ในไฟล์ index.html แทน PUT_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE
 */

const SHEET_NAME = 'สมัครเข้าร่วม';

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet_(ss);
    const data = JSON.parse(e.postData && e.postData.contents ? e.postData.contents : '{}');

    sheet.appendRow([
      new Date(),
      data.timestamp || '',
      data.name || '',
      data.category || '',
      data.phone || '',
      data.line || '',
      data.contact || '',
      data.area || '',
      data.desc || '',
      data.consent || '',
      data.source || '',
      'รอตรวจสอบ'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Bangraknoi Connect Google Sheet Receiver is running')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'เวลารับข้อมูล',
      'เวลาจากหน้าเว็บ',
      'ชื่อร้าน/ช่าง/กลุ่มอาชีพ',
      'ประเภทบริการ',
      'เบอร์โทร',
      'LINE ID',
      'Facebook/เว็บไซต์',
      'ที่อยู่/ชุมชน',
      'รายละเอียด',
      'การยินยอม',
      'แหล่งที่มา',
      'สถานะ'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 12).setFontWeight('bold');
    sheet.autoResizeColumns(1, 12);
  }

  return sheet;
}

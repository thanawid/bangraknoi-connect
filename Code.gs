// ═══════════════════════════════════════════════════════════════
//  บางรักน้อย Connect — Google Apps Script
//  Sheet ID: 1-t3GIdtxAzbfPeQlIDfQb-9poVqjiD8m8XRyf73NQDM
//
//  วิธีติดตั้ง:
//  1. เปิด Google Sheets นี้ → Extensions > Apps Script
//  2. ลบโค้ดเดิมทั้งหมด แล้ววางโค้ดไฟล์นี้ทั้งหมด
//  3. กด Deploy > New deployment
//     - Type: Web app
//     - Execute as: Me
//     - Who has access: Anyone
//  4. คัดลอก Web app URL ไปวางใน index.html บรรทัด SHEET_URL
// ═══════════════════════════════════════════════════════════════

var SHEET_ID = '1-t3GIdtxAzbfPeQlIDfQb-9poVqjiD8m8XRyf73NQDM';
var SHEET_NAME = 'ชีต1';

// Header columns matching the existing sheet
var HEADERS = ['ชื่อ', 'ประเภท', 'รายละเอียด', 'เบอร์โทร', 'ที่อยู่', 'LINE', 'สถานะ',
               'ผู้ประสานงาน', 'เวลาบริการ', 'แผนที่', 'วันที่สมัคร'];

function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
    
    var data = JSON.parse(e.postData.contents);
    
    // Write headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      // Style header row
      var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setBackground('#6B35C9');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Map incoming JSON to sheet columns
    // Columns: ชื่อ | ประเภท | รายละเอียด | เบอร์โทร | ที่อยู่ | LINE | สถานะ | ผู้ประสานงาน | เวลาบริการ | แผนที่ | วันที่สมัคร
    var row = [
      data.name    || '',
      data.type    || '',
      data.desc    || '',
      data.phone   || '',
      data.address || '',
      data.social  || '',
      data.status  || 'รอตรวจสอบ',
      data.contact || '',
      data.hours   || '',
      data.maplink || '',
      data.timestamp || new Date().toLocaleString('th-TH')
    ];
    
    sheet.appendRow(row);
    
    // Color-code status cell
    var lastRow = sheet.getLastRow();
    var statusCell = sheet.getRange(lastRow, 7); // Column G = สถานะ
    statusCell.setBackground('#FEF3C7');
    statusCell.setFontColor('#92400E');

    // Auto-resize columns
    sheet.autoResizeColumns(1, HEADERS.length);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Allow GET for health-check / CORS preflight
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', app: 'บางรักน้อย Connect' }))
    .setMimeType(ContentService.MimeType.JSON);
}

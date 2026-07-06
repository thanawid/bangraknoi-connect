/**
 * Bangraknoi Connect — Google Sheet Receiver + Email Notify
 *
 * เชื่อม Google Sheet:
 * https://docs.google.com/spreadsheets/d/1-t3GIdtxAzbfPeQlIDfQb-9poVqjiD8m8XRyf73NQDM/edit
 *
 * วิธีใช้:
 * 1) เปิด Google Sheet > Extensions > Apps Script
 * 2) วางโค้ดนี้แทนของเดิม
 * 3) กด Save
 * 4) Deploy > Manage deployments > Edit หรือ New deployment > Web app
 *    Execute as: Me
 *    Who has access: Anyone
 * 5) กด Deploy แล้วอนุญาตสิทธิ์ MailApp / SpreadsheetApp
 * 6) Copy Web App URL ไปใส่ใน index.html ถ้า URL เปลี่ยน
 */

const SPREADSHEET_ID = '1-t3GIdtxAzbfPeQlIDfQb-9poVqjiD8m8XRyf73NQDM';
const SHEET_NAME = 'สมัครเข้าร่วม';
const NOTIFY_EMAIL = 'Bangraknoi2022@gmail.com';

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss);
    const data = JSON.parse(e.postData && e.postData.contents ? e.postData.contents : '{}');

    const receivedAt = new Date();
    const row = [
      receivedAt,
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
    ];

    sheet.appendRow(row);
    const lastRow = sheet.getLastRow();

    sendNotifyEmail_(data, receivedAt, lastRow);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    try {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: '[บางรักน้อย Connect] ระบบรับสมัครมีข้อผิดพลาด',
        body: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล:\n\n' + String(err)
      });
    } catch (mailErr) {}

    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Bangraknoi Connect Google Sheet Receiver + Email Notify is running')
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

function sendNotifyEmail_(data, receivedAt, rowNumber) {
  if (!NOTIFY_EMAIL) return;

  const tz = 'Asia/Bangkok';
  const timeText = Utilities.formatDate(receivedAt, tz, 'dd/MM/yyyy HH:mm:ss');
  const subject = `[บางรักน้อย Connect] มีผู้สมัครใหม่: ${data.name || 'ไม่ระบุชื่อ'}`;

  const sheetUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=0&range=A${rowNumber}`;

  const htmlBody = `
    <div style="font-family:Arial,'Noto Sans Thai',sans-serif;font-size:14px;line-height:1.7;color:#111827">
      <h2 style="color:#5b21b6;margin:0 0 8px">มีผู้สมัครใหม่จากบางรักน้อย Connect</h2>
      <p style="margin:0 0 14px;color:#6b7280">เวลารับข้อมูล: ${escapeHtml_(timeText)}</p>

      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px">
        ${rowHtml_('ชื่อร้าน / ช่าง / กลุ่มอาชีพ', data.name)}
        ${rowHtml_('ประเภทบริการ', data.category)}
        ${rowHtml_('เบอร์โทร', data.phone)}
        ${rowHtml_('LINE ID', data.line)}
        ${rowHtml_('Facebook / เว็บไซต์', data.contact)}
        ${rowHtml_('ที่อยู่ / ชุมชน', data.area)}
        ${rowHtml_('รายละเอียด', data.desc)}
        ${rowHtml_('การยินยอม', data.consent)}
        ${rowHtml_('แหล่งที่มา', data.source)}
      </table>

      <p style="margin-top:18px">
        <a href="${sheetUrl}" style="display:inline-block;background:#5b21b6;color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none;font-weight:bold">
          เปิดแถวข้อมูลใน Google Sheet
        </a>
      </p>

      <p style="font-size:12px;color:#6b7280;margin-top:18px">
        หมายเหตุ: ข้อมูลนี้มีสถานะเริ่มต้น “รอตรวจสอบ” ก่อนเผยแพร่บนหน้าเว็บ
      </p>
    </div>
  `;

  const plainBody =
`มีผู้สมัครใหม่จากบางรักน้อย Connect

เวลารับข้อมูล: ${timeText}
ชื่อ: ${data.name || ''}
ประเภท: ${data.category || ''}
เบอร์โทร: ${data.phone || ''}
LINE ID: ${data.line || ''}
Facebook/เว็บไซต์: ${data.contact || ''}
ที่อยู่/ชุมชน: ${data.area || ''}
รายละเอียด: ${data.desc || ''}
การยินยอม: ${data.consent || ''}
แหล่งที่มา: ${data.source || ''}

เปิด Google Sheet:
${sheetUrl}
`;

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject,
    body: plainBody,
    htmlBody
  });
}

function rowHtml_(label, value) {
  return `
    <tr>
      <td style="border:1px solid #e5e7eb;background:#f9fafb;font-weight:bold;width:220px;vertical-align:top">${escapeHtml_(label)}</td>
      <td style="border:1px solid #e5e7eb;vertical-align:top">${escapeHtml_(value || '-')}</td>
    </tr>
  `;
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

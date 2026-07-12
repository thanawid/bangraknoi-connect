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

// V8.4: แหล่งข่าวจริงจากเว็บไซต์เทศบาลเมืองบางรักน้อย
const BRN_ACTIVITY_URL = 'https://www.brn.go.th/news-atv?id=1';
const BRN_ANNOUNCE_URL = 'https://www.brn.go.th/news-obt?id=2';
const BRN_NEWS_CACHE_KEY = 'brn_news_mix_v842';
const BRN_NEWS_CACHE_SECONDS = 15 * 60;

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

function doGet(e) {
  const action = e && e.parameter && e.parameter.action ? String(e.parameter.action) : '';
  if (action === 'news') return handleNewsRequest_(e);

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


// ── V8.4 REAL NEWS PROXY ─────────────────────────────────────────────────────
function handleNewsRequest_(e) {
  const payload = {
    ok: true,
    source: {
      activity: BRN_ACTIVITY_URL,
      announcement: BRN_ANNOUNCE_URL
    },
    mode: 'activity2_announcement1',
    fetchedAt: Utilities.formatDate(new Date(), 'Asia/Bangkok', "yyyy-MM-dd'T'HH:mm:ssXXX"),
    items: getBrnNewsItems_()
  };

  const json = JSON.stringify(payload);
  const cb = e && e.parameter && e.parameter.callback ? String(e.parameter.callback) : '';

  // JSONP สำหรับเรียกจาก GitHub Pages ได้ โดยไม่ติด CORS
  if (/^[A-Za-z_$][0-9A-Za-z_$\.]*$/.test(cb)) {
    return ContentService
      .createTextOutput(cb + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function getBrnNewsItems_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(BRN_NEWS_CACHE_KEY);
  if (cached) {
    try { return JSON.parse(cached); } catch (err) {}
  }

  const activities = fetchBrnItemsFrom_(BRN_ACTIVITY_URL, {
    cat: 'กิจกรรม',
    icon: '🎉',
    limit: 2,
    pageKeyword: 'ข่าวกิจกรรม',
    fallbackImage: ''
  });

  const announcements = fetchBrnItemsFrom_(BRN_ANNOUNCE_URL, {
    cat: 'ข่าวสาร',
    icon: '📢',
    limit: 1,
    pageKeyword: 'ข่าวประชาสัมพันธ์',
    fallbackImage: ''
  });

  const mixed = buildNewsMix_(activities, announcements);

  if (mixed && mixed.length) {
    cache.put(BRN_NEWS_CACHE_KEY, JSON.stringify(mixed), BRN_NEWS_CACHE_SECONDS);
    return mixed;
  }

  return getBrnNewsFallback_();
}

function buildNewsMix_(activities, announcements) {
  const out = [];
  uniqueNews_(activities || []).slice(0, 2).forEach(item => out.push(item));
  uniqueNews_(announcements || []).slice(0, 1).forEach(item => out.push(item));

  // เติม fallback ตามตำแหน่งให้ครบ 2 กิจกรรม + 1 ข่าวสาร หากหน้าเว็บต้นทางโหลดได้ไม่ครบ
  const fallback = getBrnNewsFallback_();
  let i = 0;
  while (out.length < 3 && i < fallback.length) {
    const item = fallback[i++];
    if (!out.some(x => cleanText_(x.title) === cleanText_(item.title))) out.push(item);
  }

  return out.slice(0, 3);
}

function uniqueNews_(items) {
  const seen = {};
  const out = [];
  (items || []).forEach(item => {
    const key = cleanText_(item.title) + '|' + cleanText_(item.date);
    if (!item.title || seen[key]) return;
    seen[key] = true;
    out.push(item);
  });
  return out;
}

function fetchBrnItemsFrom_(url, options) {
  try {
    const res = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: {
        'User-Agent': 'Mozilla/5.0 BangraknoiConnect/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    const code = res.getResponseCode();
    if (code < 200 || code >= 400) return [];

    const html = res.getContentText('UTF-8');
    const listHtml = sliceNewsList_(html, options.pageKeyword);
    const items = parseBrnNewsHtml_(listHtml || html, url, options);
    return items.slice(0, options.limit || 3);
  } catch (err) {
    return [];
  }
}

function sliceNewsList_(html, pageKeyword) {
  let start = html.indexOf('หมวด   หัวข้อข่าว');
  if (start < 0) start = html.indexOf('หัวข้อข่าว');
  if (start < 0) start = html.indexOf('หมวดข่าว');
  if (start < 0 && pageKeyword) start = html.indexOf(pageKeyword);
  if (start < 0) start = 0;

  let end = html.indexOf('หน้าสุดท้าย', start);
  if (end < 0) end = html.indexOf('Previous', start);
  if (end < 0) end = html.indexOf('เทศบาลเมืองบางรักน้อย', start + 800);
  if (end < 0) end = Math.min(html.length, start + 90000);
  return html.substring(start, end);
}

function parseBrnNewsHtml_(html, sourceUrl, options) {
  const items = [];
  const seen = {};
  const anchorRe = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;

  while ((m = anchorRe.exec(html)) !== null && items.length < 20) {
    const href = decodeHtml_(m[1] || '').trim();
    const title = cleanText_(m[2]);
    if (!isValidNewsTitle_(title, href)) continue;

    const aroundHtml = html.substring(Math.max(0, m.index - 1800), Math.min(html.length, anchorRe.lastIndex + 1200));
    const aroundText = cleanText_(aroundHtml);
    const info = extractDateViews_(aroundText);
    if (!info.date) continue;

    const image = extractNearestImage_(html.substring(Math.max(0, m.index - 1800), m.index));
    const key = title + '|' + info.date;
    if (seen[key]) continue;
    seen[key] = true;

    items.push({
      cat: options.cat || 'ข่าวสาร',
      title: title,
      date: info.date,
      views: info.views,
      icon: options.icon || '📢',
      image: image || options.fallbackImage || '',
      href: absoluteBrnUrl_(href || sourceUrl)
    });
  }

  // Fallback จาก text หากโครง HTML เปลี่ยนจนจับลิงก์ไม่ได้
  if (!items.length) return parseBrnNewsTextFallback_(html, sourceUrl, options);
  return items.slice(0, options.limit || 3);
}

function parseBrnNewsTextFallback_(html, sourceUrl, options) {
  const text = cleanText_(html);
  const out = [];

  if ((options.cat || '') === 'กิจกรรม') {
    const re = /(.+?)\s*\[\s*(\d{1,2}\s+[ก-๙\.]+\s+\d{4})\s*\]\s*อ่าน:\s*(\d{1,5})/g;
    let m;
    while ((m = re.exec(text)) !== null && out.length < (options.limit || 3)) {
      const title = cleanText_(m[1]).replace(/^ข่าวกิจกรรม\s*/,'').trim();
      if (!isValidNewsTitle_(title, '')) continue;
      out.push({
        cat: 'กิจกรรม',
        title: title,
        date: cleanText_(m[2]),
        views: cleanText_(m[3]),
        icon: '🎉',
        image: '',
        href: sourceUrl
      });
    }
  } else {
    const re = /ข่าวประชาสัมพันธ์\s+(.+?)\s+(\d{1,2}\s+[ก-๙\.]+\s+\d{4})\s+(\d{1,5})/g;
    let m;
    while ((m = re.exec(text)) !== null && out.length < (options.limit || 3)) {
      const title = cleanText_(m[1]);
      if (!isValidNewsTitle_(title, '')) continue;
      out.push({
        cat: options.cat || 'ข่าวสาร',
        title: title,
        date: cleanText_(m[2]),
        views: cleanText_(m[3]),
        icon: options.icon || '📢',
        image: '',
        href: sourceUrl
      });
    }
  }

  return out;
}

function extractDateViews_(text) {
  const dateMatch = text.match(/\[\s*(\d{1,2}\s+[ก-๙\.]+\s+\d{4})\s*\]/) ||
                    text.match(/(\d{1,2}\s+[ก-๙\.]+\s+\d{4})/);
  let viewsMatch = text.match(/อ่าน:\s*(\d{1,5})/);
  if (!viewsMatch && dateMatch) {
    const afterDate = text.substring(text.indexOf(dateMatch[1]) + dateMatch[1].length);
    viewsMatch = afterDate.match(/^\s*(\d{1,5})\b/);
  }

  return {
    date: dateMatch ? cleanText_(dateMatch[1]) : '',
    views: viewsMatch ? cleanText_(viewsMatch[1]) : ''
  };
}

function extractNearestImage_(beforeHtml) {
  let img = '';
  const imgRe = /<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = imgRe.exec(beforeHtml)) !== null) img = m[1];
  img = decodeHtml_(img || '').trim();
  if (!img || /blank|loading|spacer|icon/i.test(img)) return '';
  return absoluteBrnUrl_(img);
}

function isValidNewsTitle_(title, href) {
  if (!title || title.length < 8) return false;
  if (/^(ยกเลิกการค้นหา|Previous|Next|หน้าสุดท้าย|\d+)$/.test(title)) return false;
  if (/^(ข่าวประชาสัมพันธ์|ข่าวกิจกรรม|ข่าวจัดซื้อจัดจ้าง|กิจกรรม|ประกาศ|VDO|วีดิทัศน์)$/.test(title)) return false;
  if (/^(หน้าหลัก|ข้อมูลหน่วยงาน|บุคลากร|ข่าวสาร|แผน|รายงาน|ระเบียบ|บริการประชาชน)$/.test(title)) return false;
  if (href && /javascript:|^#/.test(href)) return false;
  return true;
}

function getBrnNewsFallback_() {
  return [
    {
      cat: 'กิจกรรม',
      title: 'เทศบาลเมืองบางรักน้อยลงพื้นที่ร่วมกับ รพ.สต. ดำเนินโครงการร้านค้าปลอดภัย ไร้สารปนเปื้อน',
      date: '10 ก.ค. 2569',
      views: '4',
      icon: '🎉',
      image: '',
      href: BRN_ACTIVITY_URL
    },
    {
      cat: 'กิจกรรม',
      title: 'ร่วมพิธีเปิดโครงการส่งเสริมการออกกำลังกายเพื่อสุขภาพ ด้วยท่าบริหารฤาษีดัดตน',
      date: '9 ก.ค. 2569',
      views: '4',
      icon: '🎉',
      image: '',
      href: BRN_ACTIVITY_URL
    },
    {
      cat: 'ข่าวสาร',
      title: 'ขอเชิญชวนพี่น้องชาวตำบลบางรักน้อย ร่วมเป็น “สมาชิกกองทุนแม่ของแผ่นดิน”',
      date: '9 ก.ค. 2569',
      views: '12',
      icon: '📢',
      image: '',
      href: BRN_ANNOUNCE_URL
    }
  ];
}


function absoluteBrnUrl_(url) {
  if (!url) return '';
  url = decodeHtml_(url).trim();
  if (/^https?:\/\//i.test(url)) return url;
  if (url.indexOf('//') === 0) return 'https:' + url;
  if (url.charAt(0) === '/') return 'https://www.brn.go.th' + url;
  return 'https://www.brn.go.th/' + url.replace(/^\.\//, '');
}

function cleanText_(html) {
  return decodeHtml_(String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

function decodeHtml_(s) {
  return String(s || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function getBrnNewsFallback_() {
  return [
    {
      cat: 'ข่าวสาร',
      title: 'ขอเชิญชวนพี่น้องชาวตำบลบางรักน้อย ร่วมเป็น “สมาชิกกองทุนแม่ของแผ่นดิน”',
      date: '9 ก.ค. 2569',
      views: '10',
      icon: '📢',
      image: '',
      href: BRN_NEWS_URL
    },
    {
      cat: 'ข่าวสาร',
      title: 'ประชาสัมพันธ์แจ้งตัดกระแสไฟฟ้าชั่วคราว',
      date: '7 ก.ค. 2569',
      views: '16',
      icon: '⚡',
      image: '',
      href: BRN_NEWS_URL
    },
    {
      cat: 'ข่าวสาร',
      title: 'ขอเชิญชวนเข้าร่วมการประชุมประชาคมท้องถิ่น',
      date: '22 มิ.ย. 2569',
      views: '23',
      icon: '🗣️',
      image: '',
      href: BRN_NEWS_URL
    }
  ];
}

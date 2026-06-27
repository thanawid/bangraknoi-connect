const SHEET_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'submissions';
const ADMIN_KEY = 'CHANGE_ME_1234';
const HEADERS = ['createdAt','status','category','name','contact','phone','social','hours','area','map','description'];
function doGet(e){
  const action = e.parameter.action || 'public';
  const sh = sheet_();
  const items = read_(sh);
  if(action === 'admin'){
    if(e.parameter.key !== ADMIN_KEY) return json_({ok:false,error:'unauthorized'});
    return json_({ok:true,items});
  }
  return json_({ok:true,items:items.filter(x => x.status === 'อนุมัติ' || x.status === 'approved')});
}
function doPost(e){
  const body = JSON.parse(e.postData.contents || '{}');
  const sh = sheet_();
  if(body.action === 'status'){
    if(body.key !== ADMIN_KEY) return json_({ok:false,error:'unauthorized'});
    const row = Number(body.row);
    if(row > 1) sh.getRange(row,2).setValue(body.status || 'รอตรวจสอบ');
    return json_({ok:true});
  }
  const d = body.data || body;
  sh.appendRow(HEADERS.map(h => h === 'status' ? (d.status || 'รอตรวจสอบ') : (d[h] || '')));
  return json_({ok:true,row:sh.getLastRow()});
}
function sheet_(){
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(SHEET_NAME);
  if(!sh){ sh = ss.insertSheet(SHEET_NAME); sh.appendRow(HEADERS); sh.setFrozenRows(1); sh.getRange(1,1,1,HEADERS.length).setBackground('#6b35c9').setFontColor('#fff').setFontWeight('bold'); }
  return sh;
}
function read_(sh){
  const last = sh.getLastRow();
  if(last < 2) return [];
  return sh.getRange(2,1,last-1,HEADERS.length).getValues().map((r,i)=>{
    const o = {row:i+2}; HEADERS.forEach((h,j)=>o[h]=r[j]); return o;
  }).reverse();
}
function json_(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

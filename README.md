# บางรักน้อย Connect Community v9

เวอร์ชันนี้ใช้ไฟล์ v8 ของผู้ใช้เป็นฐานภาพ/มาสคอต และใช้ระบบข้อมูลจริงเป็นแกนหลัก
โดยลดการผูกกับภาพลักษณ์เทศบาล เพื่อให้ใช้เป็นแพลตฟอร์มชุมชนอิสระได้ด้วย

## มีอะไรในแพ็ก
- `index.html` หน้าเว็บจริงแบบ PWA
- `admin.html` หลังบ้านตรวจสอบข้อมูล
- `app.js` ค้นหา หมวดหมู่ ฟอร์มสมัคร
- `admin.js` อนุมัติ / ไม่อนุมัติ
- `gas/Code.gs` Google Apps Script สำหรับ Google Sheet
- `assets/` ภาพจากเว็บ v8

## วิธีเชื่อม Google Sheet
1. สร้าง Google Sheet ใหม่
2. เปิด Extensions > Apps Script
3. วางโค้ดจาก `gas/Code.gs`
4. แก้ `SHEET_ID` เป็น ID ของ Google Sheet
5. แก้ `ADMIN_KEY` เป็นรหัสหลังบ้านจริง
6. Deploy > New deployment > Web app
   - Execute as: Me
   - Who has access: Anyone
7. นำ Web App URL ไปใส่ใน `app.js` และ `admin.js` ตรง `SHEET_URL`
8. อัปโหลดขึ้น GitHub Pages

## หมายเหตุ
หน้านี้ตั้งใจให้เป็น Community Platform ไม่ใช่เว็บราชการโดยตรง แต่ยังพร้อมปรับกลับไปเป็นเวอร์ชันเทศบาลได้ทุกเมื่อ

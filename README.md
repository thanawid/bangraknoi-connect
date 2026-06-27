# บางรักน้อย Connect — v5.1

## วิธีอัปโหลดขึ้น GitHub Pages

1. อัปโหลดไฟล์ **ทุกไฟล์** ในโฟลเดอร์นี้ไปยัง repository `thanawid/bangraknoi-connect`
2. ไปที่ Settings > Pages > Source: main branch / root

## วิธีเชื่อม Google Sheets (ทำครั้งเดียว)

**Sheet ID:** `1-t3GIdtxAzbfPeQlIDfQb-9poVqjiD8m8XRyf73NQDM`

1. เปิด Google Sheet นั้น → **Extensions > Apps Script**
2. ลบโค้ดเดิมทั้งหมด → วางโค้ดทั้งหมดจากไฟล์ `Code.gs`
3. **Deploy > New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. คัดลอก **Web app URL** ที่ได้
5. เปิดไฟล์ `index.html` ค้นหาบรรทัด:
   ```
   const SHEET_URL = "https://script.google.com/macros/s/PASTE_YOUR_SCRIPT_URL_HERE/exec";
   ```
   แทนที่ด้วย URL จริงที่ได้จากขั้นตอนที่ 4
6. อัปโหลด `index.html` ที่แก้ไขแล้วขึ้น GitHub อีกครั้ง

## โครงสร้างไฟล์

```
bangraknoi-connect/
├── index.html          ← เว็บหลัก (ภาพฝังอยู่ใน base64 ทั้งหมด)
├── manifest.json       ← PWA manifest
├── favicon.png         ← ไอคอน 32×32
├── icon-192.png        ← ไอคอน 192×192 (PWA / iOS)
├── Code.gs             ← Google Apps Script (วางใน Apps Script)
├── logo_BC.png         ← โลโก้ต้นฉบับ
├── mascot_hero.png     ← มาสคอต hero
├── mascot_chang.png    ← มาสคอต หาช่าง
├── mascot_food.png     ← มาสคอต ร้านอาหาร
├── mascot_career.png   ← มาสคอต ฝึกอาชีพ
├── mascot_news.png     ← มาสคอต ข่าวสาร
├── mascot_service.png  ← มาสคอต บริการชุมชน
├── mascot_product.png  ← มาสคอต สินค้าท้องถิ่น
├── mascot_event.png    ← มาสคอต กิจกรรมชุมชน
└── mascot_chat.png     ← มาสคอต พูดคุย
```

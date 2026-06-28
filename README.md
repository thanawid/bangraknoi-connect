# Bangraknoi Connect — Genesis V1

Interactive City Web App แบบ HTML + SVG + Vanilla JavaScript สำหรับ deploy บน GitHub Pages โดยไม่ใช้ framework และไม่พึ่ง CDN

## สิ่งที่ทำใน V1

- ใช้ `assets/master-scene.png` เป็นเมืองหลัก
- วาง SVG Hotspot ทับเมืองให้คลิกสถานที่ได้
- ข้อมูลทุกสถานที่อ่านจาก `data.js`
- มีข้อมูลตั้งต้น 13 จุด: วัด พระใหญ่ เทศบาล ตลาด ร้านอาหาร หาช่าง ท่องเที่ยว รถไฟฟ้า ชุมชน กิจกรรม ฝึกอาชีพ ข่าวสาร และสมัครเข้าร่วมระบบ
- เปิดข้อมูลแบบ bottom tray ไม่ใช้ popup กลางจอ และไม่ทำ card ใหญ่บังเมือง
- มีระบบเวลาอัตโนมัติจากเครื่องผู้ใช้: เช้า / กลางวัน / เย็น / กลางคืน
- มีระบบฤดูกาลเบื้องต้นจากเดือนของเครื่องผู้ใช้
- มีมาสคอต BC เดินเข้ามาและทักทาย
- รองรับ Desktop / Tablet / Mobile
- ใช้ได้กับ GitHub Pages ทันที

## โครงไฟล์

```txt
bangraknoi-connect-genesis-v1/
├── index.html
├── styles.css
├── app.js
├── data.js
├── README.md
└── assets/
    ├── master-scene.png
    ├── bc-guide.png
    ├── icon-repair.png
    ├── icon-food.png
    ├── icon-training.png
    ├── icon-news.png
    ├── icon-service.png
    ├── icon-local.png
    ├── icon-activity.png
    ├── icon-chat.png
    ├── icon-tourism.png
    └── favicon.svg
└── .nojekyll
```

## วิธีแก้ข้อมูลสถานที่

เปิดไฟล์ `data.js` แล้วแก้ใน `window.BC_DATA.places`

ตัวอย่างโครงข้อมูล:

```js
{
  id: "food",
  label: "ร้านอาหาร",
  title: "ร้านอาหาร",
  category: "กินอะไรดี",
  summary: "ข้อความแนะนำสถานที่",
  facts: ["ร้านอาหาร", "เมนูเด่น"],
  icon: "assets/icon-food.png",
  point: [1390, 537],
  hotspot: "1300,440 1456,432 1510,492 1500,654 1346,668 1276,610 1280,488",
  view: { x: 1395, y: 540, scale: 1.22 }
}
```

## วิธีแก้จุดคลิกบนภาพ

- ภาพ master มีขนาด 1672 x 941 px
- `point` คือพิกัดหมุด
- `hotspot` คือพิกัด polygon ของพื้นที่คลิก
- `view` คือจุดที่เมืองจะ zoom ไปเมื่อคลิก

ถ้าจะปรับพิกัด ให้เปิดภาพในโปรแกรมออกแบบที่ดูตำแหน่ง X/Y ได้ เช่น Figma, Photoshop, Photopea หรือเครื่องมือวัดพิกัดภาพ แล้วแก้เลขใน `data.js`

## หมวดข้อมูลตั้งต้น

V1 วางหมุดและพื้นที่คลิกสำหรับสถานที่หลักของเมือง ได้แก่ วัดบางรักน้อย, พระใหญ่, เทศบาลเมืองบางรักน้อย, ตลาด, ร้านอาหาร, หาช่าง, ท่องเที่ยวคลองอ้อมนนท์, รถไฟฟ้าสายสีม่วง, ชุมชน, กิจกรรม, ฝึกอาชีพ, ข่าวสารเทศบาล และสมัครเข้าร่วมระบบ

## วิธี deploy บน GitHub Pages

1. แตก ZIP นี้
2. อัปโหลดทุกไฟล์ขึ้น repository เช่น `bangraknoi-connect`
3. ไปที่ GitHub repository → Settings → Pages
4. เลือก Branch: `main` และ Folder: `/root`
5. กด Save
6. เปิด URL ที่ GitHub Pages ให้มา

## หมายเหตุสำคัญ

- อย่าเปลี่ยนชื่อไฟล์ `index.html` เพราะ GitHub Pages ใช้เป็นหน้าแรก
- เว็บนี้ไม่ใช้ React / Vue / Bootstrap / Tailwind / CDN
- ข้อมูลจริงควรเติมใน `data.js` ก่อนเปิดใช้งานจริง
- หากจะต่อ API ภายหลัง ให้คงหลักการเดิม: เมืองเป็นอินเทอร์เฟซ ข้อมูลโผล่เมื่อผู้ใช้ต้องการ

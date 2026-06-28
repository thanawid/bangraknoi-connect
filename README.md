# บางรักน้อย Connect — Genesis V1.1 Video City

Interactive City Web App สำหรับบางรักน้อย Connect ใช้คลิปเมืองเป็นฉากหลัก และวางจุดคลิกทับบนสถานที่สำคัญเพื่อเปิดข้อมูลจาก `data.js` โดยตรง

## แนวคิดหลัก

- เมืองคืออินเทอร์เฟซ ไม่ใช่แค่พื้นหลัง
- คลิกอาคาร/สถานที่ในเมืองเพื่อเปิดข้อมูลบริการ
- ข้อมูลมาจาก `data.js` แก้ไขได้จากไฟล์เดียว
- ใช้ HTML + CSS + JavaScript ล้วน ไม่พึ่ง framework
- Deploy ได้บน GitHub Pages

## สิ่งที่เพิ่มใน V1.1

- ใช้ `assets/city-loop.mp4` เป็นเมืองเคลื่อนไหวหน้าแรก
- เพิ่ม poster สำรอง `assets/city-video-poster.jpg`
- เพิ่มจุดคลิกบนเมือง 7 จุด: วัด/พระใหญ่, เทศบาล, ตลาด, ร้านอาหาร, หาช่าง, ฝึกอาชีพ, พูดคุย
- เพิ่มแผงข้อมูลล่างซ้ายแบบไม่บังเมืองมากเกินไป
- ปรับโลโก้ BC ตามไฟล์ล่าสุด
- ถอดสคริปต์ QR ภายนอกออก เหลือระบบ static ล้วน
- เพิ่ม `.nojekyll` สำหรับ GitHub Pages

## โครงสร้างสำคัญ

```text
index.html          โครงหน้าเว็บและจุดคลิกเมือง
styles.css          งานภาพ/Responsive/Animation
app.js              ระบบคลิกเมือง ค้นหา Drawer สมัครเข้าระบบ
data.js             ฐานข้อมูลหมวดหมู่และลิงก์บริการ
assets/city-loop.mp4
assets/city-video-poster.jpg
assets/bc-logo.png
.nojekyll
```

## วิธีแก้ข้อมูล

แก้ที่ `data.js` เป็นหลัก เช่น ชื่อหมวด รายการบริการ รายละเอียด และลิงก์ปลายทาง

## วิธี Deploy บน GitHub Pages

1. แตก ZIP
2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้น repository
3. ไปที่ Settings → Pages
4. เลือก branch `main` และ root
5. เปิดลิงก์ GitHub Pages ที่ระบบสร้างให้

## วิธีทดสอบในเครื่อง

```powershell
python -m http.server 4173
```

จากนั้นเปิด

```text
http://localhost:4173
```

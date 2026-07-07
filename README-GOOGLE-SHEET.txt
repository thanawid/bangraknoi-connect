วิธีต่อฟอร์มสมัครเข้ากับ Google Sheet
สำหรับบางรักน้อย Connect

ใช้ Google Sheet นี้แล้ว:
Sheet ID: 1-t3GIdtxAzbfPeQlIDfQb-9poVqjiD8m8XRyf73NQDM

ขั้นตอนที่ยังต้องทำเองอีกนิดเดียว เพราะต้องกด Deploy ในบัญชี Google ของคุณ

1) เปิด Google Sheet ที่ส่งลิงก์มา

2) ไปที่ Extensions > Apps Script

3) ลบโค้ดเดิมใน Apps Script แล้ววางโค้ดจากไฟล์:
   google-sheet-apps-script.gs

4) กด Save

5) Deploy เป็น Web App
   กด Deploy > New deployment
   เลือก Type: Web app
   Execute as: Me
   Who has access: Anyone
   แล้วกด Deploy

6) Google อาจถามสิทธิ์ ให้กดอนุญาตตามขั้นตอน

7) Copy Web App URL ที่ได้
   URL จะหน้าตาประมาณ:
   https://script.google.com/macros/s/xxxxxxxxxxxxxxxx/exec

8) เปิดไฟล์ index.html
   ค้นหาคำว่า:
   https://script.google.com/macros/s/AKfycbzv5WMeM5cSxl7Ot6QCjbqkxGaxPMAfsvc6lDj2rQe4UYKIjwnZMxa-Sxq6VtN9b51Q/exec

   แล้วแทนด้วย Web App URL ที่ copy มา

9) อัปไฟล์ขึ้น GitHub Pages ใหม่
   จากนั้นเปิดเว็บแล้วกด Ctrl + F5

หมายเหตุ:
- ฟอร์มสมัครเปิดในหน้าเว็บแล้ว
- ปุ่ม “ส่งข้อมูลสมัคร” จะส่งเข้าแท็บชื่อ “สมัครเข้าร่วม” ใน Google Sheet
- ถ้าไม่มีแท็บนี้ ระบบจะสร้างให้เอง
- ลิงก์ Google Sheet อย่างเดียว ยังไม่พอสำหรับหน้าเว็บ เพราะ GitHub Pages ส่งข้อมูลเข้าชีตโดยตรงไม่ได้ ต้องมี Google Apps Script Web App URL เป็นสะพานกลาง


สถานะ V5:
- ใส่ Web App URL ใน index.html เรียบร้อยแล้ว
- URL ที่ใช้: https://script.google.com/macros/s/AKfycbzv5WMeM5cSxl7Ot6QCjbqkxGaxPMAfsvc6lDj2rQe4UYKIjwnZMxa-Sxq6VtN9b51Q/exec
- หลังอัป GitHub Pages ให้กด Ctrl+F5 หรือรอสักครู่ให้ service worker เปลี่ยน cache


V8 Responsive Final:
- ไม่มี popup ต้อนรับตอนเข้าเว็บ
- Desktop/Tablet แสดง pin ตามตำแหน่งจริง
- Mobile ซ่อน pin เริ่มต้นและโชว์เฉพาะหมวดที่กด
- ฟอร์มสมัครใช้ modal/bottom sheet ตามขนาดจอ


V24 — Email Notify
- ฟอร์มสมัครส่งเข้า Google Sheet: 1-t3GIdtxAzbfPeQlIDfQb-9poVqjiD8m8XRyf73NQDM
- Apps Script จะส่งอีเมลแจ้งเตือนไปที่ Bangraknoi2022@gmail.com
- หลังวาง google-sheet-apps-script.gs ใหม่ ต้อง Deploy Web App ใหม่/แก้ deployment เดิม และอนุญาตสิทธิ์ MailApp


V7.8 PRODUCTION:
- Professional hero crop: train and Buddha are no longer cut awkwardly.
- Correct transparent phone mascot in Hero.
- Version shown only as tiny footer chip.
- 6 category cards use attached mascot assets and controlled Thai wrapping.
- News shows 3 cards as requested.
- Facebook feed remains, moved under news for balanced visual weight.
- Form / Google Sheet / buttons / drawer / search logic kept intact.


V7.9:
- แก้ section ข่าว/Facebook ใหม่
- Facebook Page Plugin ไม่ถูกบังคับให้เต็มแถวแล้ว จึงไม่มีพื้นที่ว่างเทาขนาดใหญ่
- จัดกลับเป็น 2 คอลัมน์: ซ้ายข่าว 3 ใบ, ขวา Facebook feed ขนาดพอดี
- ฟอร์ม / Google Sheet / ปุ่ม / drawer / search logic คงเดิม


V8.0 About Bridge Layout:
- เพิ่มการ์ด "เกี่ยวกับบางรักน้อย Connect" ใต้ข่าว 3 ใบ
- ใช้ About Bridge ลดช่องว่างฝั่งข่าว และเล่าเรื่องเว็บให้ชัดขึ้น
- Facebook feed ยังอยู่ฝั่งขวา
- ซ่อน About section เดิมด้านล่างเพื่อไม่ให้เนื้อหาซ้ำ
- ฟอร์ม / Google Sheet / ปุ่ม / drawer / search logic คงเดิม


V8.1 LINE + QR CTA Polish:
- ปรับกล่อง LINE CTA ให้เต็มและสมดุลขึ้น
- ใส่โลโก้ LINE แบบพอดี พร้อม animation เบา ๆ
- ใส่ QR Code สำหรับเข้าเว็บบางรักน้อย Connect
- ไม่ใส่รูปโปสเตอร์ในเว็บ
- ฟอร์ม / Google Sheet / ปุ่ม / drawer / search logic คงเดิม

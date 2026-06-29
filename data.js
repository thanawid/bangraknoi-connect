// Bangraknoi Connect — Genesis V1 Data
// ข้อมูลอาคารและโซนในเมืองบางรักน้อย

export const BUILDINGS = [
  {
    id: 'temple',
    label: 'วัดบางรักน้อย',
    labelEn: 'Wat Bangraknoi',
    icon: '🛕',
    mascot: 'assets/cat-07.png',
    color: '#f59e0b',
    description: 'วัดเก่าแก่คู่ชุมชนบางรักน้อย ศูนย์รวมจิตใจของผู้คน มีพระใหญ่ทองคำงดงาม และกิจกรรมทางศาสนาตลอดปี',
    // hotspot: percentage-based x,y,w,h of the master scene image
    hotspot: { x: 8, y: 30, w: 22, h: 55 },
    items: [
      { icon: '📅', title: 'ตารางทำบุญ', detail: 'วันพระ ทำบุญตักบาตร เวลา 07.00 น.', action: 'ดูปฏิทิน', href: '#' },
      { icon: '📍', title: 'ดูแผนที่', detail: 'วัดบางรักน้อย ถ.บางรักน้อย–ท่าอิฐ', action: 'เปิดแผนที่', href: 'https://maps.google.com/?q=วัดบางรักน้อย+นนทบุรี' },
      { icon: '☎️', title: 'ติดต่อวัด', detail: 'สำนักงานวัดบางรักน้อย', action: 'โทร', href: 'tel:025252727' },
    ]
  },
  {
    id: 'municipality',
    label: 'เทศบาลเมืองบางรักน้อย',
    labelEn: 'Bangraknoi City Hall',
    icon: '🏛',
    mascot: 'assets/cat-05.png',
    color: '#7c3aed',
    description: 'ศูนย์บริการชุมชน ให้บริการด้านทะเบียน สิ่งแวดล้อม โยธา สาธารณสุข และรับแจ้งเรื่องร้องทุกข์',
    hotspot: { x: 33, y: 28, w: 22, h: 52 },
    items: [
      { icon: '📋', title: 'แจ้งเรื่องร้องทุกข์', detail: 'ไฟดับ ถนนชำรุด ขยะ ระบายน้ำ', action: 'แจ้งเรื่อง', href: 'https://www.brn.go.th/home' },
      { icon: '💧', title: 'ประปาชุมชน', detail: 'แจ้งน้ำประปาขัดข้อง', action: 'โทร', href: 'tel:025261234' },
      { icon: '📰', title: 'ข่าวเทศบาล', detail: 'ข่าวสารและประกาศจากเทศบาล', action: 'อ่านข่าว', href: 'https://www.brn.go.th/home' },
      { icon: '🗺', title: 'แผนที่เทศบาล', detail: 'เปิดแผนที่ Google Maps', action: 'เปิดแผนที่', href: 'https://maps.google.com/?q=เทศบาลเมืองบางรักน้อย' },
      { icon: '☎️', title: 'ติดต่อสำนักงาน', detail: 'เบอร์โทร 02-193-4512', action: 'โทร', href: 'tel:021934512' },
    ]
  },
  {
    id: 'market',
    label: 'ตลาดบางรักน้อย',
    labelEn: 'Bangraknoi Market',
    icon: '🛒',
    mascot: 'assets/cat-06.png',
    color: '#ea580c',
    description: 'ตลาดสดใจกลางชุมชน สินค้าท้องถิ่น ผักผลไม้สด ของฝาก และสินค้าชุมชนอีกมากมาย',
    hotspot: { x: 56, y: 30, w: 18, h: 48 },
    items: [
      { icon: '🥬', title: 'ตลาดสดเช้า', detail: 'เปิดทุกวัน 06.00 – 10.00 น.', action: 'ดูแผนที่', href: 'https://maps.google.com/?q=ตลาดบางรักน้อย' },
      { icon: '🎁', title: 'สินค้าท้องถิ่น', detail: 'ของดีบางรักน้อย น้ำมันมะพร้าว น้ำปลาหวาน', action: 'ดูสินค้า', href: '#' },
      { icon: '🍜', title: 'ร้านอาหารในตลาด', detail: 'ข้าวต้ม โจ๊ก ก๋วยเตี๋ยว อาหารเช้า', action: 'ดูรายการ', href: '#' },
    ]
  },
  {
    id: 'restaurant',
    label: 'ร้านอาหาร',
    labelEn: 'Restaurants',
    icon: '🍛',
    mascot: 'assets/cat-02.png',
    color: '#dc2626',
    description: 'ร้านอาหารอร่อยในชุมชน ตั้งแต่อาหารตามสั่ง ส้มตำ ก๋วยเตี๋ยว ไปจนถึงร้านกาแฟ',
    hotspot: { x: 73, y: 32, w: 12, h: 45 },
    items: [
      { icon: '🍚', title: 'ร้านข้าวแกง ป้าแดง', detail: 'ข้าวแกงบ้านๆ อร่อย ราคาเป็นมิตร', action: 'โทร', href: 'tel:0812345678' },
      { icon: '🍜', title: 'ก๋วยเตี๋ยวเรือ ลุงสม', detail: 'ก๋วยเตี๋ยวเรือสูตรโบราณ ตั้งแต่รุ่นปู่', action: 'ดูแผนที่', href: 'https://maps.google.com/?q=ก๋วยเตี๋ยวเรือบางรักน้อย' },
      { icon: '☕', title: 'คาเฟ่บางรักน้อย', detail: 'กาแฟ ชา ขนม บรรยากาศริมคลอง', action: 'ดูรีวิว', href: '#' },
      { icon: '🌮', title: 'ส้มตำ ครัวอีสาน', detail: 'ส้มตำ ลาบ น้ำตก รสเด็ด', action: 'โทร', href: 'tel:0898765432' },
    ]
  },
  {
    id: 'craft',
    label: 'บ้านช่าง',
    labelEn: 'Craft & Repair',
    icon: '🔧',
    mascot: 'assets/cat-01.png',
    color: '#0284c7',
    description: 'รวมช่างฝีมือในชุมชน ช่างไฟ ช่างประปา ช่างแอร์ ช่างเชื่อม รับงานทุกประเภท',
    hotspot: { x: 84, y: 32, w: 14, h: 45 },
    items: [
      { icon: '⚡', title: 'ช่างไฟ', detail: 'ติดตั้ง ซ่อมระบบไฟฟ้า มีใบอนุญาต', action: 'โทร', href: 'tel:0891234567' },
      { icon: '💧', title: 'ช่างประปา', detail: 'ซ่อมก๊อก ท่อ โถส้วม', action: 'โทร', href: 'tel:0812233445' },
      { icon: '❄️', title: 'ช่างแอร์', detail: 'ล้างแอร์ ติดตั้ง ซ่อมแซม', action: 'โทร', href: 'tel:0855667788' },
      { icon: '🔩', title: 'ช่างเชื่อม-เหล็ก', detail: 'งานเหล็ก ราวบันได ประตู รั้ว', action: 'โทร', href: 'tel:0899988776' },
      { icon: '🎨', title: 'ช่างสี', detail: 'ทาสีบ้าน ตึก อาคาร', action: 'โทร', href: 'tel:0877665544' },
    ]
  },
  {
    id: 'canal',
    label: 'คลองอ้อมนนท์',
    labelEn: 'Klhong Om Non',
    icon: '🚤',
    mascot: 'assets/cat-09.png',
    color: '#0891b2',
    description: 'คลองสายหลักที่หล่อเลี้ยงชุมชนบางรักน้อยมาช้านาน แหล่งท่องเที่ยวเชิงธรรมชาติ มีเรือข้ามฟากและวิถีชีวิตริมน้ำ',
    hotspot: { x: 0, y: 75, w: 100, h: 25 },
    items: [
      { icon: '⛵', title: 'เรือข้ามฟาก', detail: 'บริการข้ามฟากตลอดวัน', action: 'ดูตารางเรือ', href: '#' },
      { icon: '🐟', title: 'ปล่อยปลา-ให้อาหารปลา', detail: 'บุญและกิจกรรมริมน้ำ', action: 'ดูกิจกรรม', href: '#' },
      { icon: '📸', title: 'ท่องเที่ยวริมคลอง', detail: 'วิถีชีวิต วัฒนธรรม ชุมชน', action: 'ดูเส้นทาง', href: '#' },
    ]
  },
  {
    id: 'bts',
    label: 'รถไฟฟ้าสายสีม่วง',
    labelEn: 'MRT Purple Line',
    icon: '🚇',
    mascot: 'assets/cat-04.png',
    color: '#7e22ce',
    description: 'รถไฟฟ้าสายสีม่วง เชื่อมต่อบางรักน้อยสู่กรุงเทพฯ และเมืองนนทบุรี สะดวก รวดเร็ว ไม่ติดรถ',
    hotspot: { x: 42, y: 0, w: 56, h: 22 },
    items: [
      { icon: '🗺', title: 'แผนที่สถานี', detail: 'สถานีใกล้เคียงในเส้นทาง MRT สายสีม่วง', action: 'เปิดแผนที่', href: 'https://maps.google.com/?q=MRT+สายสีม่วง' },
      { icon: '🕐', title: 'ตารางเดินรถ', detail: 'เวลาแรก 05.30 – สุดท้าย 24.00 น.', action: 'ดูตาราง', href: 'https://www.mrta.co.th' },
      { icon: '💳', title: 'ค่าโดยสาร', detail: 'ระยะทางตามจริง เริ่มต้น 14-42 บาท', action: 'คำนวณ', href: 'https://www.mrta.co.th' },
    ]
  },
];

export const CITY_ZONES = {
  temple:       BUILDINGS.find(b => b.id === 'temple'),
  municipality: BUILDINGS.find(b => b.id === 'municipality'),
  market:       BUILDINGS.find(b => b.id === 'market'),
  restaurant:   BUILDINGS.find(b => b.id === 'restaurant'),
  craft:        BUILDINGS.find(b => b.id === 'craft'),
  canal:        BUILDINGS.find(b => b.id === 'canal'),
  bts:          BUILDINGS.find(b => b.id === 'bts'),
};

// Legacy support for existing app.js zones format
export const ZONES = [
  {
    id: 'craft',
    label: 'หาช่าง',
    short: 'ช่าง',
    description: 'ช่าง 7 หมวด ครบทุกงานซ่อมในบ้าน',
    source: 'ข้อมูลช่างในชุมชนบางรักน้อย ปรับปรุง มิ.ย. 2569',
    items: BUILDINGS.find(b=>b.id==='craft').items,
  },
  {
    id: 'food',
    label: 'ร้านอาหาร',
    short: 'อาหาร',
    description: 'ร้านอร่อยในพื้นที่บางรักน้อยและใกล้เคียง',
    source: 'รวบรวมโดยชุมชน',
    items: BUILDINGS.find(b=>b.id==='restaurant').items,
  },
  {
    id: 'travel',
    label: 'ท่องเที่ยว',
    short: 'ท่องเที่ยว',
    description: 'สถานที่น่าสนใจในบางรักน้อย',
    source: 'เทศบาลเมืองบางรักน้อย',
    items: BUILDINGS.find(b=>b.id==='canal').items,
  },
  {
    id: 'learn',
    label: 'ฝึกอาชีพ',
    short: 'อาชีพ',
    description: 'หลักสูตรและโอกาสพัฒนาอาชีพ',
    source: 'กรมพัฒนาฝีมือแรงงาน',
    items: [
      { icon: '💻', title: 'ดิจิทัลเบื้องต้น', detail: 'คอมพิวเตอร์ โซเชียลมีเดีย ขายออนไลน์', action: 'สมัคร', href: '#' },
      { icon: '🍳', title: 'อาหารและเบเกอรี่', detail: 'ทำขนม ขนมปัง อาหารไทย-สากล', action: 'สมัคร', href: '#' },
      { icon: '✂️', title: 'ตัดผม-เสริมสวย', detail: 'ช่างผม สปา เสริมสวย', action: 'สมัคร', href: '#' },
    ],
  },
  {
    id: 'market',
    label: 'สินค้าท้องถิ่น',
    short: 'สินค้า',
    description: 'ของดีบางรักน้อย สินค้าชุมชน OTOP',
    source: 'ชุมชนบางรักน้อย',
    items: BUILDINGS.find(b=>b.id==='market').items,
  },
  {
    id: 'service',
    label: 'บริการชุมชน',
    short: 'บริการ',
    description: 'แจ้งเรื่อง ข่าว กิจกรรมชุมชน',
    source: 'เทศบาลเมืองบางรักน้อย',
    items: BUILDINGS.find(b=>b.id==='municipality').items,
  },
  {
    id: 'chat',
    label: 'พูดคุย-แลกเปลี่ยน',
    short: 'แชท',
    description: 'ทุกช่องทางการติดต่อชุมชน',
    source: 'บางรักน้อย Connect',
    items: [
      { icon: '📱', title: 'LINE OA', detail: 'ติดตาม LINE Official Account', action: 'เปิด LINE', href: 'https://line.me' },
      { icon: '💬', title: 'กลุ่ม Facebook', detail: 'ชุมชนบางรักน้อย Connect', action: 'เข้ากลุ่ม', href: 'https://facebook.com' },
      { icon: '☎️', title: 'โทรเทศบาล', detail: '02-193-4512 ถึง 3', action: 'โทร', href: 'tel:021934512' },
    ],
  },
];

export const getZone = (id) => ZONES.find(z => z.id === id);
export const getBuilding = (id) => BUILDINGS.find(b => b.id === id);

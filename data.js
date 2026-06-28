export const MUNICIPALITY = {
  name: 'เทศบาลเมืองบางรักน้อย',
  phoneLabel: '02-193-4512-3',
  phone: '021934512',
  address: '72/3 หมู่ 2 ตำบลบางรักน้อย อำเภอเมือง จังหวัดนนทบุรี 11000',
  website: 'https://www.brn.go.th/home',
  contact: 'https://www.brn.go.th/contact-rev2',
  line: 'https://lin.ee/UL0OXvK',
  messenger: 'https://www.m.me/557582624689660'
};

const maps = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const ZONES = [
  {
    id: 'craft', label: 'บ้านช่าง', short: 'หาช่าง', icon: '⚒', image: 'assets/categories/01.png',
    description: 'ค้นหาช่างซ่อมบ้านทุกประเภท ใกล้บ้านคุณ', source: 'โปรดตรวจสอบรีวิว ราคา และขอบเขตงานกับผู้ให้บริการก่อนตกลง',
    items: [
      { icon: '⚡', title: 'ช่างไฟฟ้า', detail: 'ค้นหาช่างไฟพร้อมเบอร์โทรและเส้นทาง', tag: 'งานซ่อม', action: 'ค้นหาช่าง', href: maps('ช่างไฟฟ้า บางรักน้อย นนทบุรี'), primary: true },
      { icon: '🚰', title: 'ช่างประปา', detail: 'ค้นหาผู้ให้บริการแก้ท่อรั่วและระบบน้ำ', tag: 'งานซ่อม', action: 'ค้นหาช่าง', href: maps('ช่างประปา บางรักน้อย นนทบุรี') },
      { icon: '❄️', title: 'ช่างแอร์ / เครื่องใช้ไฟฟ้า', detail: 'ค้นหาร้านซ่อมและบริการล้างแอร์ในพื้นที่', tag: 'บริการ', action: 'ค้นหาช่าง', href: maps('ช่างแอร์ ซ่อมเครื่องใช้ไฟฟ้า บางรักน้อย นนทบุรี') },
      { icon: '🔨', title: 'ช่างก่อสร้าง / รับเหมา', detail: 'ค้นหาช่างก่อสร้างและผู้รับเหมาในพื้นที่', tag: 'งานซ่อม', action: 'ค้นหาช่าง', href: maps('ช่างก่อสร้าง รับเหมา บางรักน้อย นนทบุรี') },
      { icon: '🎨', title: 'ช่างทาสี / ตกแต่งบ้าน', detail: 'ค้นหาช่างทาสีและบริการตกแต่งภายใน', tag: 'บริการ', action: 'ค้นหาช่าง', href: maps('ช่างทาสี ตกแต่งบ้าน บางรักน้อย นนทบุรี') }
    ]
  },
  {
    id: 'food', label: 'ร้านอาหาร', short: 'ของอร่อย', icon: '♨', image: 'assets/categories/02.png',
    description: 'ค้นหาร้านอาหาร คาเฟ่ และของกินใกล้บางรักน้อย', source: 'คะแนน เวลาเปิด และเส้นทางแสดงจากแผนที่ของคุณ',
    items: [
      { icon: '🍜', title: 'ร้านอาหารในบางรักน้อย', detail: 'ค้นหาร้านที่เปิดอยู่ ดูรีวิว และขอเส้นทาง', tag: 'ใกล้ฉัน', action: 'หาร้านอร่อย', href: maps('ร้านอาหาร บางรักน้อย นนทบุรี'), primary: true },
      { icon: '☕', title: 'คาเฟ่และร้านกาแฟ', detail: 'หาร้านนั่งสบายใกล้คลองอ้อมนนท์', tag: 'คาเฟ่', action: 'ค้นหาคาเฟ่', href: maps('คาเฟ่ บางรักน้อย นนทบุรี') },
      { icon: '🥡', title: 'ของกินและตลาดสด', detail: 'มองหาของกินและตลาดใกล้บ้าน', tag: 'ตลาด', action: 'ค้นหาของกิน', href: maps('ของกิน ตลาด บางรักน้อย นนทบุรี') },
      { icon: '🍰', title: 'เบเกอรี่และขนม', detail: 'ค้นหาร้านขนม เบเกอรี่ และของว่างในพื้นที่', tag: 'ขนม', action: 'ค้นหาร้านขนม', href: maps('เบเกอรี่ ขนม บางรักน้อย นนทบุรี') }
    ]
  },
  {
    id: 'travel', label: 'เที่ยวบางรักน้อย', short: 'ท่องเที่ยว', icon: '📷', image: 'assets/categories/03.png',
    description: 'วัด วิถีริมคลอง และสถานที่สำคัญในบางรักน้อย', source: 'เส้นทางเปิดด้วย Google Maps บนอุปกรณ์ของคุณ',
    items: [
      { icon: '🛕', title: 'วัดบางรักน้อย', detail: 'ชมวัดและบรรยากาศชุมชนริมคลอง', tag: 'สถานที่', action: 'เปิดแผนที่', href: maps('วัดบางรักน้อย นนทบุรี'), primary: true },
      { icon: '🙏', title: 'พระใหญ่บางรักน้อย', detail: 'จุดหมายสำคัญและสัญลักษณ์ของชุมชน', tag: 'แลนด์มาร์ก', action: 'ค้นหาเส้นทาง', href: maps('พระใหญ่ บางรักน้อย นนทบุรี') },
      { icon: '🌊', title: 'วิถีคลองอ้อมนนท์', detail: 'สำรวจจุดเที่ยวและร้านริมน้ำ', tag: 'ริมคลอง', action: 'สำรวจรอบคลอง', href: maps('คลองอ้อมนนท์ นนทบุรี') },
      { icon: '📸', title: 'จุดถ่ายรูปชุมชน', detail: 'ค้นหาจุดเช็คอินและมุมสวยในบางรักน้อย', tag: 'เช็คอิน', action: 'ค้นหาจุดถ่ายรูป', href: maps('จุดถ่ายรูป เช็คอิน บางรักน้อย นนทบุรี') }
    ]
  },
  {
    id: 'learn', label: 'ฝึกอาชีพ', short: 'เรียนรู้', icon: '✎', image: 'assets/categories/04.png',
    description: 'หลักสูตรรัฐ คู่มือประชาชน และแหล่งพัฒนาทักษะ', source: 'ลิงก์ไปยังหน่วยงานและข้อมูลทางการ',
    items: [
      { icon: '🧭', title: 'ศูนย์ฝึกอาชีพใกล้บ้าน', detail: 'ค้นหาสถานที่อบรมและศูนย์เรียนรู้บนแผนที่', tag: 'แผนที่', action: 'ค้นหาศูนย์', href: maps('ศูนย์ฝึกอาชีพ ใกล้ บางรักน้อย นนทบุรี'), primary: true },
      { icon: '🛠️', title: 'กรมพัฒนาฝีมือแรงงาน', detail: 'ค้นหาหลักสูตรและข่าวการฝึกอบรมจากหน่วยงานรัฐ', tag: 'ทางการ', action: 'ดูหลักสูตร', href: 'https://www.dsd.go.th/' },
      { icon: '📘', title: 'คู่มือประชาชน', detail: 'ขั้นตอน เอกสาร และมาตรฐานการรับบริการของเทศบาล', tag: 'ทางการ', action: 'เปิดคู่มือ', href: 'https://www.brn.go.th/service_guide.php' },
      { icon: '💡', title: 'แหล่งเรียนรู้ออนไลน์', detail: 'คอร์สออนไลน์ฟรีจากหน่วยงานรัฐบาล', tag: 'ออนไลน์', action: 'ดูคอร์ส', href: 'https://elearning.ocsc.go.th/' }
    ]
  },
  {
    id: 'market', label: 'สินค้าและตลาด', short: 'ตลาด', icon: '◒', image: 'assets/categories/05.png',
    description: 'ค้นหาตลาด สวนผลไม้ และสินค้าท้องถิ่นรอบบางรักน้อย', source: 'ผลการค้นหาเปิดด้วยแผนที่บนอุปกรณ์ของคุณ',
    items: [
      { icon: '🛍️', title: 'ตลาดใกล้บางรักน้อย', detail: 'ดูตลาด ร้านค้า เวลาเปิด และเส้นทาง', tag: 'ใกล้ฉัน', action: 'เปิดแผนที่', href: maps('ตลาด บางรักน้อย นนทบุรี'), primary: true },
      { icon: '🌳', title: 'สวนผลไม้และสวนทุเรียน', detail: 'ค้นหาสวนและผลผลิตตามฤดูกาลในพื้นที่', tag: 'ของดีชุมชน', action: 'ค้นหาสวน', href: maps('สวนทุเรียน บางรักน้อย นนทบุรี') },
      { icon: '🎁', title: 'สินค้า OTOP ชุมชน', detail: 'ค้นหาร้านของฝากและสินค้าชุมชนบนแผนที่', tag: 'ท้องถิ่น', action: 'ค้นหาสินค้า', href: maps('สินค้า OTOP บางรักน้อย นนทบุรี') },
      { icon: '🏪', title: 'ร้านค้าใกล้บ้าน', detail: 'ค้นหาร้านสะดวกซื้อ ร้านขายของชำ และร้านทั่วไป', tag: 'ทั่วไป', action: 'ค้นหาร้านค้า', href: maps('ร้านค้า บางรักน้อย นนทบุรี') }
    ]
  },
  {
    // รวม service + news + event ไว้ที่นี่
    id: 'service', label: 'บริการชุมชน', short: 'เทศบาล', icon: '🏛', image: 'assets/categories/06.png',
    description: 'แจ้งเรื่อง ข่าวสาร กิจกรรม และติดต่อเทศบาล ครบในที่เดียว', source: 'ข้อมูลจากเว็บไซต์ทางการเทศบาลเมืองบางรักน้อย',
    items: [
      // e-Service
      { icon: '📍', title: 'แจ้งเรื่องออนไลน์', detail: 'แจ้งปัญหา แนบภาพ ระบุพิกัด และติดตามสถานะได้', tag: 'e-Service', action: 'เริ่มแจ้งเรื่อง', href: 'https://www.brn.go.th/eService/service-general-group', primary: true },
      // ข่าวสาร
      { icon: '📣', title: 'ข่าวประชาสัมพันธ์', detail: 'ประกาศและข่าวสารล่าสุดจากเทศบาล', tag: 'ข่าว', action: 'อ่านข่าว', href: 'https://www.brn.go.th/news_obt.php?id=2' },
      // กิจกรรม
      { icon: '🗓️', title: 'ปฏิทินกิจกรรมชุมชน', detail: 'งานประเพณี กิจกรรม และวันสำคัญของเทศบาล', tag: 'กิจกรรม', action: 'เปิดปฏิทิน', href: 'https://www.brn.go.th/calendar.php' },
      // ติดต่อ
      { icon: '☎', title: 'โทรติดต่อเทศบาล', detail: '02-193-4512-3 ต่อ 0 / 111 / 112 (จ–ศ 08.30–16.30)', tag: 'โทรศัพท์', action: 'โทรตอนนี้', href: 'tel:021934512' },
      { icon: '🚨', title: 'สายด่วนสาธารณภัย', detail: 'ป้องกันและบรรเทาสาธารณภัย 089-920-3011', tag: 'เร่งด่วน', action: 'โทรสายด่วน', href: 'tel:0899203011' },
      { icon: '🌐', title: 'เว็บไซต์และโซเชียลเทศบาล', detail: 'ข่าว ประกาศ วารสาร และ Facebook ทางการ', tag: 'ออนไลน์', action: 'เปิดเว็บไซต์', href: MUNICIPALITY.website },
      { icon: '🗺️', title: 'เดินทางมาเทศบาล', detail: MUNICIPALITY.address, tag: 'แผนที่', action: 'เปิดแผนที่', href: maps('เทศบาลเมืองบางรักน้อย') }
    ]
  },
  {
    id: 'chat', label: 'ติดต่อ–แสดงความเห็น', short: 'ติดต่อ', icon: '💬', image: 'assets/categories/07.png',
    description: 'สอบถาม เสนอแนะ และแจ้งปัญหาผ่านทุกช่องทาง', source: 'คุณกำลังจะเปิดช่องทางสื่อสารภายนอกของเทศบาล',
    items: [
      { icon: '🟢', title: 'LINE เทศบาลบางรักน้อย', detail: 'เพิ่มเพื่อน รับแจ้งเตือน และส่งข้อความถึงเทศบาล', tag: 'LINE', action: 'เพิ่มเพื่อน LINE', href: MUNICIPALITY.line, primary: true },
      { icon: '🔵', title: 'Facebook Messenger', detail: 'ส่งข้อความถึงเพจเทศบาลเมืองบางรักน้อย', tag: 'Facebook', action: 'เปิด Messenger', href: MUNICIPALITY.messenger },
      { icon: '💬', title: 'กระดานสนทนาชุมชน', detail: 'อ่านและร่วมพูดคุยบนเว็บบอร์ดของเทศบาล', tag: 'เว็บบอร์ด', action: 'เปิดกระดาน', href: 'https://www.brn.go.th/webboard_obt.php' },
      { icon: '📝', title: 'แสดงความคิดเห็น', detail: 'ส่งความเห็นและข้อเสนอแนะผ่านเว็บไซต์ทางการ', tag: 'ข้อเสนอแนะ', action: 'แสดงความคิดเห็น', href: 'https://www.brn.go.th/contact5.php' }
    ]
  }
];

export const getZone = (id) => ZONES.find((zone) => zone.id === id);

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
    id: 'learn', label: 'ฝึกอาชีพ', short: 'เรียนรู้', icon: '✎', image: 'assets/categories/03.png',
    x: 17, y: 49, greeting: 'อยากเพิ่มสกิลใหม่ แวะบ้านเรียนรู้หลังนี้ได้เลยครับ',
    description: 'หาแหล่งเรียนรู้ คู่มือ และโอกาสพัฒนาทักษะ', source: 'ลิงก์ไปยังหน่วยงานและข้อมูลทางการ',
    items: [
      { icon: '🧭', title: 'ศูนย์ฝึกอาชีพใกล้บางรักน้อย', detail: 'ค้นหาสถานที่อบรมและศูนย์เรียนรู้บนแผนที่', tag: 'แผนที่', action: 'ค้นหาศูนย์', href: maps('ศูนย์ฝึกอาชีพ ใกล้ บางรักน้อย นนทบุรี') },
      { icon: '📘', title: 'คู่มือประชาชน', detail: 'ขั้นตอน เอกสาร และมาตรฐานการรับบริการของเทศบาล', tag: 'ทางการ', action: 'เปิดคู่มือ', href: 'https://www.brn.go.th/service_guide.php' },
      { icon: '🛠️', title: 'กรมพัฒนาฝีมือแรงงาน', detail: 'ค้นหาหลักสูตรและข่าวการฝึกอบรมจากหน่วยงานรัฐ', tag: 'ทางการ', action: 'ดูหลักสูตร', href: 'https://www.dsd.go.th/' }
    ]
  },
  {
    id: 'service', label: 'บริการชุมชน', short: 'เทศบาล', icon: '♥', image: 'assets/categories/05.png',
    x: 46, y: 47, greeting: 'อาคารเทศบาลอยู่ตรงนี้ครับ เรื่องสำคัญจัดการต่อได้ทันที',
    description: 'แจ้งเรื่อง ติดต่อหน่วยงาน และเข้าถึงบริการทางการ', source: 'ข้อมูลติดต่อจากเว็บไซต์เทศบาลเมืองบางรักน้อย',
    items: [
      { icon: '📍', title: 'แจ้งเรื่องออนไลน์', detail: 'แจ้งปัญหา แนบภาพ ระบุพิกัด และติดตามสถานะได้', tag: 'e-Service', action: 'เริ่มแจ้งเรื่อง', href: 'https://www.brn.go.th/eService/service-general-group', primary: true },
      { icon: '☎', title: 'งานประชาสัมพันธ์เทศบาล', detail: 'โทร 02-193-4512-3 ต่อ 0 / 111 / 112', tag: 'โทรศัพท์', action: 'โทรตอนนี้', href: 'tel:021934512' },
      { icon: '🚨', title: 'ป้องกันและบรรเทาสาธารณภัย', detail: 'สายด่วนเทศบาล 089-920-3011', tag: 'เร่งด่วน', action: 'โทรสายด่วน', href: 'tel:0899203011' },
      { icon: '🗺️', title: 'เดินทางไปเทศบาล', detail: MUNICIPALITY.address, tag: 'แผนที่', action: 'เปิดแผนที่', href: maps('เทศบาลเมืองบางรักน้อย') },
      { icon: '🌐', title: 'เว็บไซต์เทศบาล', detail: 'ข่าว ประกาศ เอกสาร และข้อมูลหน่วยงาน', tag: 'ทางการ', action: 'เปิดเว็บไซต์', href: MUNICIPALITY.website }
    ]
  },
  {
    id: 'news', label: 'ประกาศข่าวสาร', short: 'ข่าวสาร', icon: '!', image: 'assets/categories/04.png',
    x: 57, y: 28, greeting: 'ข่าวจากชุมชนมาถึงแล้วครับ ตรวจเรื่องใหม่ได้ที่นี่',
    description: 'ติดตามประกาศ ข่าวประชาสัมพันธ์ และเรื่องควรรู้', source: 'ข่าวล่าสุดเปิดจากเว็บไซต์เทศบาลเมืองบางรักน้อย',
    items: [
      { icon: '📣', title: 'ข่าวประชาสัมพันธ์ล่าสุด', detail: 'ประกาศและข่าวสารที่เทศบาลเผยแพร่', tag: 'อัปเดต', action: 'อ่านข่าว', href: 'https://www.brn.go.th/news_obt.php?id=2', primary: true },
      { icon: '📰', title: 'วารสารและจดหมายข่าว', detail: 'สรุปกิจกรรมและเรื่องราวของชุมชน', tag: 'วารสาร', action: 'เปิดวารสาร', href: 'https://www.brn.go.th/projectRev2.php?hd=23' },
      { icon: '💬', title: 'Facebook เทศบาล', detail: 'ติดตามโพสต์และประกาศผ่านเพจทางการ', tag: 'โซเชียล', action: 'เปิด Facebook', href: 'https://www.facebook.com/www.brn.go.th' }
    ]
  },
  {
    id: 'market', label: 'สินค้าและตลาด', short: 'ตลาด', icon: '◒', image: 'assets/categories/06.png',
    x: 66, y: 46, greeting: 'ของดีใกล้บ้านอยู่ทางนี้ครับ ไปอุดหนุนคนในชุมชนกัน',
    description: 'ค้นหาตลาด สวนผลไม้ และสินค้าท้องถิ่นรอบบางรักน้อย', source: 'ผลการค้นหาเปิดด้วยแผนที่บนอุปกรณ์ของคุณ',
    items: [
      { icon: '🛍️', title: 'ตลาดใกล้บางรักน้อย', detail: 'ดูตลาด ร้านค้า เวลาเปิด และเส้นทาง', tag: 'ใกล้ฉัน', action: 'เปิดแผนที่', href: maps('ตลาด บางรักน้อย นนทบุรี'), primary: true },
      { icon: '🌳', title: 'สวนทุเรียนและสวนผลไม้', detail: 'ค้นหาสวนและผลผลิตตามฤดูกาลในพื้นที่', tag: 'ของดีชุมชน', action: 'ค้นหาสวน', href: maps('สวนทุเรียน บางรักน้อย นนทบุรี') },
      { icon: '🎁', title: 'สินค้า OTOP ใกล้บ้าน', detail: 'ค้นหาร้านของฝากและสินค้าชุมชนบนแผนที่', tag: 'ท้องถิ่น', action: 'ค้นหาสินค้า', href: maps('สินค้า OTOP บางรักน้อย นนทบุรี') }
    ]
  },
  {
    id: 'food', label: 'ร้านอาหาร', short: 'ของอร่อย', icon: '♨', image: 'assets/categories/02.png',
    x: 75, y: 56, greeting: 'ได้กลิ่นของอร่อยแล้วครับ เลือกร้านแล้วเปิดเส้นทางได้เลย',
    description: 'ค้นหาร้านอาหาร คาเฟ่ และของกินใกล้บางรักน้อย', source: 'คะแนน เวลาเปิด และเส้นทางแสดงจากแผนที่ของคุณ',
    items: [
      { icon: '🍜', title: 'ร้านอาหารในบางรักน้อย', detail: 'ค้นหาร้านที่เปิดอยู่ ดูรีวิว และขอเส้นทาง', tag: 'ใกล้ฉัน', action: 'หาร้านอร่อย', href: maps('ร้านอาหาร บางรักน้อย นนทบุรี'), primary: true },
      { icon: '☕', title: 'คาเฟ่และร้านกาแฟ', detail: 'หาร้านนั่งสบายใกล้คลองอ้อมนนท์', tag: 'คาเฟ่', action: 'ค้นหาคาเฟ่', href: maps('คาเฟ่ บางรักน้อย นนทบุรี') },
      { icon: '🥡', title: 'ตลาดและอาหารพร้อมทาน', detail: 'มองหาของกินและตลาดใกล้บ้าน', tag: 'ตลาด', action: 'ค้นหาของกิน', href: maps('ของกิน ตลาด บางรักน้อย นนทบุรี') }
    ]
  },
  {
    id: 'craft', label: 'บ้านช่าง', short: 'หาช่าง', icon: '⚒', image: 'assets/categories/01.png',
    x: 86, y: 53, greeting: 'มีอะไรให้ซ่อมไหมครับ บ้านช่างอยู่ตรงนี้แล้ว',
    description: 'ค้นหาช่างและงานซ่อมใกล้บ้านผ่านแผนที่', source: 'โปรดตรวจสอบรีวิว ราคา และขอบเขตงานกับผู้ให้บริการก่อนตกลง',
    items: [
      { icon: '⚡', title: 'ช่างไฟฟ้าใกล้บ้าน', detail: 'ค้นหาช่างไฟพร้อมเบอร์โทรและเส้นทาง', tag: 'งานซ่อม', action: 'ค้นหาช่าง', href: maps('ช่างไฟฟ้า บางรักน้อย นนทบุรี'), primary: true },
      { icon: '🚰', title: 'ช่างประปา', detail: 'ค้นหาผู้ให้บริการแก้ท่อรั่วและระบบน้ำ', tag: 'งานซ่อม', action: 'ค้นหาช่าง', href: maps('ช่างประปา บางรักน้อย นนทบุรี') },
      { icon: '❄️', title: 'ช่างแอร์และเครื่องใช้ไฟฟ้า', detail: 'ค้นหาร้านซ่อมและบริการล้างแอร์ในพื้นที่', tag: 'บริการ', action: 'ค้นหาช่าง', href: maps('ช่างแอร์ ซ่อมเครื่องใช้ไฟฟ้า บางรักน้อย นนทบุรี') }
    ]
  },
  {
    id: 'event', label: 'กิจกรรมชุมชน', short: 'กิจกรรม', icon: '✦', image: 'assets/categories/07.png',
    x: 50, y: 69, greeting: 'ชุมชนมีนัดหมายอะไรบ้าง มาดูปฏิทินกันครับ',
    description: 'ดูกิจกรรม งานประเพณี และนัดหมายของชุมชน', source: 'กำหนดการล่าสุดเปิดจากเว็บไซต์เทศบาลเมืองบางรักน้อย',
    items: [
      { icon: '🗓️', title: 'ปฏิทินกิจกรรม', detail: 'ดูกำหนดการและวันจัดงานของเทศบาล', tag: 'ปฏิทิน', action: 'เปิดปฏิทิน', href: 'https://www.brn.go.th/calendar.php', primary: true },
      { icon: '🎉', title: 'ข่าวกิจกรรมชุมชน', detail: 'ภาพและรายละเอียดกิจกรรมล่าสุดในพื้นที่', tag: 'กิจกรรม', action: 'ดูกิจกรรม', href: 'https://www.brn.go.th/news_atv.php?id=1' },
      { icon: '🤝', title: 'ติดต่อเพื่อร่วมกิจกรรม', detail: `สอบถามงานประชาสัมพันธ์ ${MUNICIPALITY.phoneLabel}`, tag: 'ติดต่อ', action: 'โทรสอบถาม', href: 'tel:021934512' }
    ]
  },
  {
    id: 'chat', label: 'พูดคุยแลกเปลี่ยน', short: 'พูดคุย', icon: '…', image: 'assets/categories/08.png',
    x: 68, y: 77, greeting: 'ทุกเสียงช่วยให้เมืองดีขึ้นครับ เลือกช่องทางที่สะดวกได้เลย',
    description: 'สอบถาม เสนอแนะ และติดต่อชุมชนผ่านช่องทางทางการ', source: 'คุณกำลังจะเปิดช่องทางสื่อสารภายนอกของเทศบาล',
    items: [
      { icon: '💬', title: 'กระดานสนทนาชุมชน', detail: 'อ่านและร่วมพูดคุยบนกระดานของเทศบาล', tag: 'เว็บบอร์ด', action: 'เปิดกระดาน', href: 'https://www.brn.go.th/webboard_obt.php', primary: true },
      { icon: '🟢', title: 'LINE เทศบาล', detail: 'เพิ่มเพื่อนเพื่อรับข้อมูลและติดต่อผ่าน LINE', tag: 'LINE', action: 'เปิด LINE', href: MUNICIPALITY.line },
      { icon: '🔵', title: 'Messenger', detail: 'ส่งข้อความถึงเพจเทศบาลเมืองบางรักน้อย', tag: 'Facebook', action: 'เปิด Messenger', href: MUNICIPALITY.messenger },
      { icon: '📝', title: 'ช่องทางรับฟังความคิดเห็น', detail: 'ส่งความเห็นและข้อเสนอแนะผ่านเว็บไซต์ทางการ', tag: 'ข้อเสนอแนะ', action: 'แสดงความคิดเห็น', href: 'https://www.brn.go.th/contact5.php' }
    ]
  }
];

export const getZone = (id) => ZONES.find((zone) => zone.id === id);

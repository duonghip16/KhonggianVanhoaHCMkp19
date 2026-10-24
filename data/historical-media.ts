export type HistoricalImage = {
  id: string
  src: string
  width: number
  height: number
  alt: string
  caption: string
  credit: string
  shortCredit?: string
  source: string
  sourceUrl: string
  license: string
  licenseUrl: string
}

export const HISTORICAL_IMAGES = {
  portrait: {
    id: 'chan-dung-bac-1945',
    src: '/images/ho-chi-minh/chan-dung-1945.webp',
    width: 960,
    height: 1304,
    alt: 'Trang sách có chân dung Chủ tịch Hồ Chí Minh trong ấn phẩm Trang sử mới, xuất bản năm 1945',
    caption: 'Chân dung Chủ tịch Hồ Chí Minh trong sách Trang sử mới (1945).',
    credit: 'Hội Văn hóa cứu quốc Việt Nam · Bản số hóa: Gallica, Thư viện Quốc gia Pháp',
    shortCredit: 'Hội Văn hóa cứu quốc Việt Nam',
    source: 'Wikimedia Commons / Gallica',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Portrait_of_Hồ_Chí_Minh,_from_the_book_Trang_sử_mới,_1945.jpg',
    license: 'Phạm vi công cộng (theo hồ sơ nguồn)',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Portrait_of_Hồ_Chí_Minh,_from_the_book_Trang_sử_mới,_1945.jpg#Licensing',
  },
  independence: {
    id: 'tuyen-ngon-doc-lap-1945',
    src: '/images/ho-chi-minh/tuyen-ngon-doc-lap-1945.webp',
    width: 628,
    height: 855,
    alt: 'Chủ tịch Hồ Chí Minh trên lễ đài tại Quảng trường Ba Đình ngày 2 tháng 9 năm 1945',
    caption: 'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, ngày 02/09/1945.',
    credit: 'Front pour l’indépendance du Việt-Nam / VARCHIV · Bản đăng: Uaileann',
    shortCredit: 'Front pour l’indépendance du Việt-Nam / VARCHIV',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Président_Ho-chi-Minh_lit_la_Proclamation-d%27indépendance_sur_la_place_Ba-dinh_le_2nd_Sep_1945.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  children: {
    id: 'bac-voi-thieu-nhi-viet-bac',
    src: '/images/ho-chi-minh/bac-voi-thieu-nhi-1950.webp',
    width: 660,
    height: 436,
    alt: 'Chủ tịch Hồ Chí Minh ngồi giữa các em thiếu nhi đang biểu diễn văn nghệ tại Việt Bắc',
    caption: 'Chủ tịch Hồ Chí Minh với thiếu nhi trong buổi văn nghệ mừng sinh nhật tại Việt Bắc, thập niên 1950.',
    credit: 'Ảnh tư liệu · Bản đăng: Musée Annam',
    shortCredit: 'Trung ương Đoàn',
    source: 'Wikimedia Commons / Trung ương Đoàn',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ho-chi-Minh_with_children_(6).jpg',
    license: 'Phạm vi công cộng tại Việt Nam (theo hồ sơ nguồn)',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Ho-chi-Minh_with_children_(6).jpg#Licensing',
  },
} satisfies Record<string, HistoricalImage>

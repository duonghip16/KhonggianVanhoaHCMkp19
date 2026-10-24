import { HISTORICAL_IMAGES } from './historical-media'
import type { LibraryReading } from './library-readings'

export type LibraryMedia =
  | { kind: 'image'; src: string; alt: string; credit: string }
  | { kind: 'pdf'; src: string; credit: string }
  | { kind: 'book'; src: string; pages: number; pageImageTemplate: string; credit: string; license: string; licenseUrl: string }
  | { kind: 'book-guide'; src: string; author: string; period: string; credit: string }
  | { kind: 'video' | 'audio'; src: string; credit: string; provider?: 'youtube' }
  | { kind: 'infographic'; src: string; width: number; height: number; alt: string; credit: string }

export const BOOK_SOURCE = 'https://commons.wikimedia.org/wiki/File:Duong_Kach_Menh.pdf'
export const VIDEO_SOURCE = 'https://www.youtube.com/watch?v=AtbQeFo0c0U'
export const AUDIO_SOURCE = 'https://vov6.vov.vn/cau-chuyen-nghe-thuat/nhung-buc-anh-lich-su-buoi-le-tuyen-ngon-doc-lap-c153-29010.aspx'
export const MULTIMEDIA: Record<string, LibraryMedia> = {
  book: { kind: 'book', src: '/books/duong-kach-menh-1927.pdf', pages: 109, pageImageTemplate: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Duong_Kach_Menh.pdf/page{page}-960px-Duong_Kach_Menh.pdf.jpg', credit: 'Nguyễn Ái Quốc · Xuất bản năm 1927 · Bản quét từ hồ sơ Bảo vật quốc gia qua Wikimedia Commons', license: 'Phạm vi công cộng · Theo hồ sơ Wikimedia Commons', licenseUrl: BOOK_SOURCE },
  video: { kind: 'video', src: 'https://www.youtube-nocookie.com/embed/AtbQeFo0c0U', provider: 'youtube', credit: 'Báo Nhân Dân · Kênh YouTube chính thức @baonhandanmedia · Trình phát của cơ quan xuất bản' },
  audio: { kind: 'audio', src: 'https://quantrivov6.vov.vn/vov6/attachments/bbt/v2_0609_08h45-20h45_cau_chuyen_nghe_thuat_109201919.mp3', credit: 'VOV6 · Câu chuyện nghệ thuật 06/09/2019 · Phát từ nguồn gốc' },
  infographic: { kind: 'infographic', src: '/infographics/hanh-trinh-ho-chi-minh.svg', width: 1000, height: 1450, alt: 'Bốn mốc cuộc đời Chủ tịch Hồ Chí Minh: sinh năm 1890, ra đi tìm đường cứu nước năm 1911, đọc Tuyên ngôn Độc lập năm 1945, qua đời năm 1969.', credit: 'Khu phố 19 biên soạn và thiết kế theo tư liệu Sở KH&CN TP.HCM và Báo Điện tử Chính phủ' },
}
export const MULTIMEDIA_READINGS: Record<string, LibraryReading> = {
  book: { image: HISTORICAL_IMAGES.portrait, sections: [{ title: 'Giới thiệu bản quét', paragraphs: ['Đường Kách mệnh là tác phẩm của Nguyễn Ái Quốc, xuất bản năm 1927. Bản quét dưới đây gồm 109 trang, được lưu trữ trên Wikimedia Commons với nguồn gốc dẫn đến hồ sơ Bảo vật quốc gia. Bạn có thể lật từng trang trên điện thoại hoặc tải bản PDF để đọc đầy đủ.', 'Giữ nguyên chữ và cách trình bày của bản quét. Phần giới thiệu trên trang được biên soạn riêng; nội dung trong ảnh trang sách là tư liệu gốc.'] }] },
  video: { image: HISTORICAL_IMAGES.portrait, sections: [{ title: 'Về video', paragraphs: ['Video Chủ tịch Hồ Chí Minh và tư tưởng đại đoàn kết toàn dân tộc được xuất bản trên kênh YouTube chính thức của Báo Nhân Dân. Nội dung được xem qua trình phát của cơ quan xuất bản ngay trong popup, giữ nguyên video gốc.', 'Phần giới thiệu này được trang biên soạn riêng. Ảnh chân dung đi kèm là ảnh tư liệu liên quan, có hồ sơ nguồn và quyền sử dụng riêng.'] }] },
  audio: { image: HISTORICAL_IMAGES.independence, sections: [{ title: 'Về chương trình phát thanh', paragraphs: ['Chương trình Câu chuyện nghệ thuật của VOV6 giới thiệu các bức ảnh lịch sử về buổi lễ ngày 2 tháng 9 năm 1945, cùng những nhiếp ảnh gia có mặt tác nghiệp tại Quảng trường Ba Đình. Đây là chương trình phát thanh về tư liệu nhiếp ảnh, không phải bản ghi giọng Chủ tịch Hồ Chí Minh.', 'Ảnh đi kèm là ảnh tư liệu liên quan, có hồ sơ nguồn riêng. Bạn có thể nghe, tạm dừng và tua bằng trình phát ngay trong popup.'] }] },
}

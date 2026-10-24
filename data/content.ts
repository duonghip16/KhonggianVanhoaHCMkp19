import { HISTORICAL_IMAGES, type HistoricalImage } from './historical-media'
import { LIBRARY_READINGS, type LibraryReading } from './library-readings'
import { AUDIO_SOURCE, BOOK_SOURCE, VIDEO_SOURCE, MULTIMEDIA, MULTIMEDIA_READINGS, type LibraryMedia } from './library-multimedia'
import { LIBRARY_ADDITIONS } from './library-additions'

export type Status = 'draft' | 'pending' | 'verified' | 'published'
export const STATUS_LABEL: Record<Status, string> = { draft: 'NHÁP', pending: 'CHỜ XÁC MINH', verified: 'ĐÃ XÁC MINH', published: 'ĐÃ XUẤT BẢN' }

export const LIB_TYPES = ['Sách', 'Hình ảnh', 'Video', 'Audio', 'Infographic', 'Tài liệu'] as const
export type LibType = (typeof LIB_TYPES)[number]
export type LibItem = { id: string; title: string; type: LibType; source: string; status: Status; url: string; description?: string; image?: HistoricalImage; reading?: LibraryReading; media?: LibraryMedia; references?: { label: string; url: string }[] }
export const SOURCES = {
  biography: 'https://khcn.tphcm.gov.vn/khong-gian-van-hoa-ho-chi-minh/gioi-thieu/tieu-su',
  departure: 'https://baochinhphu.vn/ky-niem-100-nam-ngay-bac-ho-ra-di-tim-duong-cuu-nuoc-5-6-1911-5-6-2011-nguoi-tao-nen-buoc-ngoat-lich-su-cho-cach-mang-viet-nam-10281639.htm',
  ethics: 'https://tulieuvankien.dangcongsan.vn/c-mac-angghen-lenin-ho-chi-minh/ho-chi-minh/nghien-cuu-hoc-tap-tu-tuong/tu-tuong-ho-chi-minh-ve-dao-duc-cach-mang-can-kiem-liem-chinh-chi-cong-vo-tu-1785',
  solidarity: 'https://btllang.mod.gov.vn/tin-tuc/tin-tong-hop/11315-tu-tuong-ho-chi-minh-ve-doan-ket.html?showall=1',
  learning: 'https://hochiminh.vn/tu-tuong-dao-duc-ho-chi-minh/nghien-cuu-tu-tuong-dao-duc-ho-chi-minh/di-hoc-la-hanh-phuc-83',
  people: 'https://hochiminh.vn/tin-tuc/tu-tuong-dan-la-chu-va-dan-lam-chu-qua-bai-bao-dan-van-cua-chu-tich-ho-chi-minh-2199',
  children: 'https://en.nhandan.vn/in-photos-president-ho-chi-minhs-boundless-affection-for-vietnamese-children-post148209.html',
}
export const LIBRARY: LibItem[] = [
  { id: 'tieu-su', title: 'Tiểu sử Chủ tịch Hồ Chí Minh', description: 'Bản đọc 10 phần về cuộc đời, hoạt động và di sản của Người, có mục lục, ảnh tư liệu và nguồn đối chiếu từng giai đoạn.', type: 'Tài liệu', source: 'Sở Khoa học và Công nghệ TP.HCM', url: SOURCES.biography, status: 'published', reading: LIBRARY_READINGS['tieu-su'] },
  { id: 'dao-duc', title: 'Tư tưởng Hồ Chí Minh về đạo đức cách mạng', description: 'Đọc về cần, kiệm, liêm, chính, chí công vô tư và việc rèn luyện đạo đức.', type: 'Tài liệu', source: 'Hệ thống Tư liệu – Văn kiện Đảng', url: SOURCES.ethics, status: 'published', reading: LIBRARY_READINGS['dao-duc'] },
  { id: 'hoc-tap', title: 'Đi học là hạnh phúc', description: 'Một góc nhìn về tinh thần học tập trong tư tưởng, đạo đức Hồ Chí Minh.', type: 'Tài liệu', source: 'Chuyên trang Hồ Chí Minh', url: SOURCES.learning, status: 'published', reading: LIBRARY_READINGS['hoc-tap'] },
  { id: 'dan-van', title: 'Tư tưởng về dân qua bài báo Dân vận', description: 'Tìm hiểu vai trò của nhân dân và ý nghĩa của công tác dân vận.', type: 'Tài liệu', source: 'Chuyên trang Hồ Chí Minh', url: SOURCES.people, status: 'published', reading: LIBRARY_READINGS['dan-van'] },
  { id: 'doan-ket', title: 'Tư tưởng Hồ Chí Minh về đoàn kết', description: 'Tìm hiểu sức mạnh của sự gắn bó và cùng hướng tới mục tiêu chung.', type: 'Tài liệu', source: 'Ban Quản lý Lăng Chủ tịch Hồ Chí Minh', url: SOURCES.solidarity, status: 'published', reading: LIBRARY_READINGS['doan-ket'] },
  { id: 'ra-di-tim-duong-cuu-nuoc', title: 'Hành trình ra đi tìm đường cứu nước', description: 'Từ Bến Nhà Rồng năm 1911 đến những chuyển biến trong hành trình của Nguyễn Ái Quốc.', type: 'Tài liệu', source: 'Báo Điện tử Chính phủ', url: SOURCES.departure, status: 'published', reading: LIBRARY_READINGS['ra-di-tim-duong-cuu-nuoc'] },
  { id: 'bac-voi-thieu-nhi', title: 'Bác Hồ với thiếu nhi', description: 'Những cuộc gặp gỡ và sự quan tâm dành cho thế hệ trẻ qua tư liệu ảnh.', type: 'Tài liệu', source: 'Báo Nhân Dân', url: SOURCES.children, status: 'published', reading: LIBRARY_READINGS['bac-voi-thieu-nhi'] },
  { id: 'sach-duong-kach-menh', title: 'Đường Kách mệnh · 1927', description: 'Đọc bản quét 109 trang của tác phẩm Nguyễn Ái Quốc, giữ nguyên nội dung tư liệu.', type: 'Sách', source: 'Wikimedia Commons · Hồ sơ Bảo vật quốc gia', url: BOOK_SOURCE, status: 'published', reading: MULTIMEDIA_READINGS.book, media: MULTIMEDIA.book },
  { id: 'video-doan-ket', title: 'Chủ tịch Hồ Chí Minh và tư tưởng đại đoàn kết toàn dân tộc', description: 'Video từ kênh chính thức của Báo Nhân Dân, xem ngay trong thư viện.', type: 'Video', source: 'Báo Nhân Dân · Kênh YouTube chính thức', url: VIDEO_SOURCE, status: 'published', reading: MULTIMEDIA_READINGS.video, media: MULTIMEDIA.video },
  { id: 'audio-anh-lich-su', title: 'Những bức ảnh lịch sử buổi lễ Tuyên ngôn Độc lập', description: 'Nghe chương trình Câu chuyện nghệ thuật của VOV6 về những người ghi lại khoảnh khắc lịch sử.', type: 'Audio', source: 'VOV6 · Đài Tiếng nói Việt Nam', url: AUDIO_SOURCE, status: 'published', reading: MULTIMEDIA_READINGS.audio, media: MULTIMEDIA.audio },
  { id: 'infographic-hanh-trinh', title: 'Cuộc đời Chủ tịch Hồ Chí Minh · Bốn dấu mốc', description: 'Infographic do trang biên soạn từ tư liệu lịch sử, kèm nguồn để đối chiếu.', type: 'Infographic', source: 'Sở KH&CN TP.HCM · Báo Điện tử Chính phủ', url: SOURCES.biography, status: 'published', media: MULTIMEDIA.infographic, references: [{ label: 'Tư liệu về ngày ra đi tìm đường cứu nước · Báo Điện tử Chính phủ', url: SOURCES.departure }] },
  ...LIBRARY_ADDITIONS,
  ...Object.values(HISTORICAL_IMAGES).map((image): LibItem => ({ id: image.id, title: image.caption.replace(/\.$/, ''), description: image.caption, type: 'Hình ảnh', source: image.source, url: image.sourceUrl, status: 'published', image })),
]

export type Story = { slug: string; title: string; category: string; excerpt: string; body: string[]; sources: string[]; status: Status }
export const STORIES: Story[] = []
export const VALUES = [
  { title: 'Đạo đức', explanation: 'Đạo đức cần được rèn luyện trong công việc và đời sống; cần, kiệm, liêm, chính gắn với trách nhiệm trước nhân dân.', today: 'Giữ lời hứa, sử dụng tiết kiệm nguồn lực chung và làm việc minh bạch.', action: 'Hoàn thành một việc đã nhận; tắt thiết bị điện khi không dùng.', source: SOURCES.ethics },
  { title: 'Đoàn kết', explanation: 'Tư tưởng đoàn kết coi việc tập hợp sức dân và cùng hướng tới mục tiêu chung là nền tảng tạo nên sức mạnh.', today: 'Lắng nghe khác biệt, bàn bạc và phối hợp trong công việc chung.', action: 'Trao đổi bình tĩnh với hàng xóm và cùng tìm cách giải quyết.', source: SOURCES.solidarity },
  { title: 'Học tập', explanation: 'Học tập suốt đời gắn với thực hành, giúp mỗi người tiếp tục tiến bộ và đóng góp cho xã hội.', today: 'Chủ động học điều mới, kiểm tra nguồn thông tin và chia sẻ kiến thức.', action: 'Đọc một tư liệu có nguồn rõ ràng rồi chia sẻ điều học được.', source: SOURCES.learning },
  { title: 'Phục vụ cộng đồng', explanation: 'Trong tư tưởng dân vận, nhân dân là chủ thể; công việc cần dựa vào dân và hướng tới lợi ích của dân.', today: 'Tôn trọng ý kiến người dân và quan tâm đến nhu cầu cụ thể của người khác.', action: 'Hỏi một người cần giúp đỡ và hỗ trợ trong khả năng của mình.', source: SOURCES.people },
]
export const HISTORY = [
  { date: '19/05/1890', title: 'Ngày sinh Chủ tịch Hồ Chí Minh', text: 'Người sinh tại Nghệ An, tên lúc nhỏ là Nguyễn Sinh Cung.', source: SOURCES.biography },
  { date: '05/06/1911', title: 'Ra đi tìm đường cứu nước', text: 'Nguyễn Tất Thành rời Bến Nhà Rồng, bắt đầu hành trình tìm đường giải phóng dân tộc.', source: SOURCES.departure },
  { date: '02/09/1945', title: 'Đọc Tuyên ngôn Độc lập', text: 'Tại Quảng trường Ba Đình, Người đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa.', source: SOURCES.biography },
  { date: '02/09/1969', title: 'Chủ tịch Hồ Chí Minh qua đời', text: 'Người qua đời tại Hà Nội.', source: SOURCES.biography },
]
export const QUOTE = { text: 'Đoàn kết, đoàn kết, đại đoàn kết', context: 'Trích bài nói chuyện tại Đại hội đại biểu Mặt trận Tổ quốc Việt Nam lần thứ II (1961).', source: SOURCES.solidarity }

export type QA = { q: string; o: string[]; a: number; why: string }
// Câu hỏi tình huống thực hành (không trích dẫn/dữ kiện lịch sử).
export const QUIZ: QA[] = [
  { q: 'Bạn thấy rác nằm ở lối đi chung của khu phố. Bạn nên làm gì?', o: ['Đi qua, việc đó của người khác', 'Nhặt bỏ vào thùng rác nếu an toàn', 'Chụp ảnh đăng mạng để phê phán'], a: 1, why: 'Một việc nhỏ làm ngay tạo ra khác biệt thấy được và làm gương cho người xung quanh.' },
  { q: 'Một người hàng xóm lớn tuổi đang xách đồ nặng. Bạn nên làm gì?', o: ['Hỏi và giúp trong khả năng của mình', 'Giả vờ không thấy', 'Chờ người khác giúp'], a: 0, why: 'Quan tâm chủ động, đúng sức, là cách đơn giản nhất để cộng đồng gắn bó.' },
  { q: 'Khu phố tổ chức buổi dọn vệ sinh cuối tuần. Bạn nên làm gì?', o: ['Tham gia và rủ thêm người thân', 'Chỉ góp ý trong nhóm chat', 'Để lần sau'], a: 0, why: 'Hành động chung biến mong muốn thành kết quả cụ thể.' },
  { q: 'Bạn vừa học được một điều hữu ích. Bạn nên làm gì?', o: ['Giữ cho riêng mình', 'Chia sẻ lại cho người cần', 'Chỉ chia sẻ khi được hỏi'], a: 1, why: 'Học tập có ý nghĩa hơn khi được lan tỏa.' },
  { q: 'Bạn bất đồng ý kiến với hàng xóm. Bạn nên làm gì?', o: ['Trao đổi bình tĩnh, lắng nghe nhau', 'Nói xấu sau lưng', 'Cắt đứt liên lạc'], a: 0, why: 'Lắng nghe và đối thoại giữ được sự đoàn kết.' },
]

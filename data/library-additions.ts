import type { LibItem } from './content'
import { HISTORICAL_IMAGES } from './historical-media'

const ethicsSource = 'https://tulieuvankien.dangcongsan.vn/c-mac-angghen-lenin-ho-chi-minh/ho-chi-minh/nghien-cuu-hoc-tap-tu-tuong/tu-tuong-ho-chi-minh-ve-dao-duc-cach-mang-can-kiem-liem-chinh-chi-cong-vo-tu-1785'
const learningSource = 'https://hochiminh.vn/tu-tuong-dao-duc-ho-chi-minh/nghien-cuu-tu-tuong-dao-duc-ho-chi-minh/di-hoc-la-hanh-phuc-83'

export const LIBRARY_ADDITIONS: LibItem[] = [
  {
    id: 'sach-sua-doi-loi-lam-viec', title: 'Sửa đổi lối làm việc · 1947', type: 'Sách', status: 'published',
    source: 'Bảo tàng Hồ Chí Minh · Biên niên tiểu sử',
    url: 'https://baotanghochiminh.vn/chu-tich-ho-chi-minh-hoan-thanh-tac-pham-sua-doi-loi-lam-viec-ky-but-danh-x-y-z.htm',
    description: 'Hồ sơ tác phẩm: bối cảnh ra đời, cấu trúc sáu phần và gợi ý tìm hiểu. Bản đọc giới thiệu do trang biên soạn.',
    media: { kind: 'book-guide', src: '/books/sua-doi-loi-lam-viec.svg', author: 'Hồ Chí Minh · Bút danh X.Y.Z.', period: 'Hoàn thành tháng 10 năm 1947', credit: 'Khu phố 19 biên soạn phần giới thiệu và thiết kế bìa hồ sơ; bìa này không phải bìa một ấn bản gốc.' },
    reading: { image: HISTORICAL_IMAGES.portrait, sections: [
      { title: 'Tác giả và bối cảnh', paragraphs: ['Chủ tịch Hồ Chí Minh hoàn thành Sửa đổi lối làm việc vào tháng 10 năm 1947, ký bút danh X.Y.Z. Tác phẩm ra đời trong thời kỳ kháng chiến, đề cập việc rèn luyện cán bộ và cải tiến cách làm việc của tổ chức.'] },
      { title: 'Cấu trúc sáu phần', paragraphs: ['Sách gồm: Phê bình và sửa chữa; Mấy điều kinh nghiệm; Tư cách và đạo đức cách mạng; Vấn đề cán bộ; Cách lãnh đạo; Chống thói ba hoa. Các phần kết nối việc nhận diện khuyết điểm với trách nhiệm sửa chữa, học hỏi kinh nghiệm và nâng cao chất lượng công việc.'] },
      { title: 'Gợi ý tìm hiểu', paragraphs: ['Khi đọc, có thể theo dõi ba câu hỏi: tác giả chỉ ra vấn đề gì, đề nghị sửa bằng cách nào và đặt trách nhiệm vào ai? Đây là gợi ý đọc của trang. Hãy đối chiếu từng phần với nguyên tác và hoàn cảnh năm 1947 để hiểu đúng cách dùng từ, đối tượng và mục đích của tác phẩm.'] },
      { title: 'Về bản đọc này', paragraphs: ['Đây là hồ sơ giới thiệu, không phải toàn văn sách. Nguồn Bảo tàng Hồ Chí Minh bên dưới cung cấp sự kiện biên niên và nội dung khái quát để tiếp tục đối chiếu.'] },
    ] },
  },
  {
    id: 'sach-nhat-ky-trong-tu', title: 'Nhật ký trong tù · 1942–1943', type: 'Sách', status: 'published',
    source: 'Bảo tàng Lịch sử Quốc gia · Hồ sơ Bảo vật quốc gia',
    url: 'https://baotanglichsu.vn/vi/Articles/1001/13644/gioi-thieu-bao-vat-quoc-gia-11-nguc-trung-nhat-ky-nhat-ky-trong-tu.html',
    description: 'Tìm hiểu hoàn cảnh sáng tác, giá trị văn học và hành trình lưu giữ Ngục trung nhật ký. Bản đọc giới thiệu có nguồn.',
    media: { kind: 'book-guide', src: '/books/nhat-ky-trong-tu.svg', author: 'Hồ Chí Minh · Ngục trung nhật ký', period: 'Sáng tác tại Quảng Tây, 1942–1943', credit: 'Khu phố 19 biên soạn phần giới thiệu và thiết kế bìa hồ sơ; bìa này không phải bìa một ấn bản gốc.' },
    reading: { image: HISTORICAL_IMAGES.portrait, sections: [
      { title: 'Hoàn cảnh sáng tác', paragraphs: ['Nhật ký trong tù, tên chữ Hán là Ngục trung nhật ký, được Chủ tịch Hồ Chí Minh viết trong thời gian bị giam giữ tại Quảng Tây, Trung Quốc, từ tháng 8 năm 1942 đến tháng 9 năm 1943. Bản gốc là cuốn sổ nhỏ, ghi lại những bài thơ chữ Hán trong hoàn cảnh lao tù.'] },
      { title: 'Giá trị của tác phẩm', paragraphs: ['Tập thơ kết hợp ghi chép về cảnh sống, con người và thiên nhiên với tinh thần kiên trì, lạc quan và khát vọng tự do. Khi đọc bản dịch, nên xem rõ tên người dịch và ấn bản; lời thơ tiếng Việt cần được phân biệt với nguyên tác chữ Hán.'] },
      { title: 'Từ cuốn sổ tới bảo vật', paragraphs: ['Theo hồ sơ Bảo tàng Lịch sử Quốc gia, năm 1955 Người trao cuốn sổ để phục vụ trưng bày. Hiện vật được công nhận là Bảo vật quốc gia năm 2012. Hồ sơ bảo tàng giới thiệu nguồn gốc, hình ảnh bút tích và giá trị lịch sử của tác phẩm.'] },
      { title: 'Về bản đọc này', paragraphs: ['Trang cung cấp hồ sơ giới thiệu, không sao chép toàn tập thơ hoặc bản dịch. Liên kết nguồn bên dưới giúp bạn đối chiếu hình ảnh hiện vật và thông tin bảo tàng.'] },
    ] },
  },
  ...[
    { id: 'video-hanh-trinh-2021', year: '2021', youtubeId: 'kaSjxCa-XqA', title: 'Hồ Chí Minh – Hành trình khát vọng năm 2021', date: '06/12/2021' },
    { id: 'video-hanh-trinh-2022', year: '2022', youtubeId: 'qFNbNhE6EWo', title: 'Hồ Chí Minh – Hành trình khát vọng 2022', date: '30/10/2022' },
  ].map(video => ({
    id: video.id, title: video.title, type: 'Video' as const, status: 'published' as const,
    source: 'Báo Nhân Dân · Kênh YouTube chính thức', url: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    description: `Chương trình giao lưu năm ${video.year}, xem qua trình phát của kênh Báo Nhân Dân ngay trên website.`,
    media: { kind: 'video' as const, provider: 'youtube' as const, src: `https://www.youtube-nocookie.com/embed/${video.youtubeId}`, credit: `Báo Nhân Dân · @baonhandanmedia · Video đăng ngày ${video.date}` },
    reading: { image: HISTORICAL_IMAGES.portrait, sections: [{ title: 'Về chương trình', paragraphs: [`Chương trình Hồ Chí Minh – Hành trình khát vọng ${video.year} được giới thiệu trên kênh YouTube chính thức của Báo Nhân Dân. Bạn xem bản phát hành của cơ quan xuất bản qua trình phát trong popup, với các điều khiển âm lượng, phụ đề nếu có và toàn màn hình.`, 'Ảnh chân dung đi kèm là tư liệu liên quan, không phải ảnh chụp chương trình. Phần giới thiệu do trang biên soạn; tên kênh và liên kết video gốc được ghi bên dưới.'] }] },
  })),
  {
    id: 'audio-nghe-anh-tai-phap', title: 'Bác Hồ làm nghề ảnh tại Pháp', type: 'Audio', status: 'published',
    source: 'VOV6 · Đài Tiếng nói Việt Nam', url: 'https://vov6.vov.vn/cau-chuyen-nghe-thuat/bac-ho-lam-nghe-anh-tai-phap-c153-28621.aspx',
    description: 'Câu chuyện nghệ thuật ngày 26/04/2019: tìm hiểu một phần cuộc sống và công việc của Nguyễn Ái Quốc tại Pháp.',
    media: { kind: 'audio', src: 'https://quantrivov6.vov.vn/vov6/attachments/bbt/v2_2604_08h45-20h45_cau_chuyen_nghe_thuat_15201910.mp3', credit: 'VOV6 · Câu chuyện nghệ thuật 26/04/2019 · Phát từ nguồn gốc' },
    reading: { image: HISTORICAL_IMAGES.portrait, sections: [{ title: 'Nghề ảnh trong câu chuyện phát thanh', paragraphs: ['Chương trình của VOV6 tìm hiểu thời gian Nguyễn Ái Quốc làm nghề ảnh tại Pháp. Góc nhìn nghề nghiệp giúp người nghe tiếp cận đời sống lao động bên cạnh hành trình hoạt động cách mạng.', 'Đây là chương trình phát thanh do VOV6 sản xuất, không phải bản ghi giọng Chủ tịch Hồ Chí Minh. Ảnh chân dung minh họa có nguồn riêng và không được xem là ảnh chụp Người đang làm nghề ảnh.'] }] },
  },
  {
    id: 'audio-tron-tam-long', title: 'Trọn tấm lòng với Bác', type: 'Audio', status: 'published',
    source: 'VOV6 · Đài Tiếng nói Việt Nam', url: 'https://vov6.vov.vn/cau-chuyen-nghe-thuat/tron-tam-long-voi-bac-c153-31641.aspx',
    description: 'Câu chuyện nghệ thuật ngày 15/05/2020: tình cảm của nghệ sĩ Diệp Minh Châu qua các sáng tác về Bác.',
    media: { kind: 'audio', src: 'https://quantrivov6.vov.vn/vov6/attachments/bbt/2020_5/v2_1505_08h4520h45_cau_chuyen_nghe_thuat_175202020.mp3', credit: 'VOV6 · Câu chuyện nghệ thuật 15/05/2020 · Phát từ nguồn gốc' },
    reading: { image: HISTORICAL_IMAGES.portrait, sections: [{ title: 'Tình cảm của người nghệ sĩ', paragraphs: ['Chương trình Trọn tấm lòng với Bác của VOV6 giới thiệu tình cảm và những sáng tác của nghệ sĩ Diệp Minh Châu về Chủ tịch Hồ Chí Minh. Tư liệu phát thanh gợi mở cách nghệ thuật lưu giữ ký ức và sự kính trọng đối với Người.', 'Bạn có thể nghe, tạm dừng và tua ngay trong popup. Ảnh chân dung đi kèm là ảnh tư liệu liên quan, không phải ảnh một tác phẩm của Diệp Minh Châu.'] }] },
  },
  {
    id: 'infographic-dao-duc', title: 'Cần, kiệm, liêm, chính · Đọc và thực hành', type: 'Infographic', status: 'published', source: 'Tư liệu – Văn kiện Đảng · Khu phố 19 biên soạn', url: ethicsSource,
    description: 'Sơ đồ bốn phẩm chất đạo đức, kèm những việc thực hành do trang gợi ý và nguồn đối chiếu.',
    media: { kind: 'infographic', src: '/infographics/can-kiem-liem-chinh.svg', width: 1000, height: 1450, alt: 'Cần: chăm chỉ, có kế hoạch. Kiệm: dùng nguồn lực hợp lý. Liêm: giữ sự trong sạch. Chính: ngay thẳng, có trách nhiệm. Các ví dụ thực hành do trang gợi ý.', credit: 'Khu phố 19 biên soạn và thiết kế theo Hệ thống Tư liệu – Văn kiện Đảng; ví dụ thực hành là gợi ý của trang.' },
    reading: { image: HISTORICAL_IMAGES.portrait, sections: [{ title: 'Cách đọc infographic', paragraphs: ['Bốn phẩm chất cần, kiệm, liêm, chính được diễn giải ngắn để thuận tiện tìm hiểu. Những ví dụ về chuẩn bị công việc, tiết kiệm vật dụng, minh bạch và giữ lời hẹn là gợi ý thực hành của trang; chúng không phải lời trích dẫn của Chủ tịch Hồ Chí Minh.', 'Hãy mở bài nghiên cứu tại nguồn để tìm hiểu đầy đủ mối liên hệ giữa các phẩm chất này và chí công vô tư.'] }] },
  },
  {
    id: 'infographic-hoc-tap', title: 'Học tập suốt đời · Từ đọc tới hành động', type: 'Infographic', status: 'published', source: 'Chuyên trang Hồ Chí Minh · Khu phố 19 biên soạn', url: learningSource,
    description: 'Bốn bước học tập do trang gợi ý: đọc có nguồn, ghi điều hiểu, thử một việc và nhìn lại kết quả.',
    media: { kind: 'infographic', src: '/infographics/hoc-tap-suot-doi.svg', width: 1000, height: 1450, alt: 'Bốn bước gợi ý học tập của Khu phố 19: đọc có nguồn, ghi điều hiểu, thử một việc, nhìn lại kết quả. Tham khảo bài Đi học là hạnh phúc.', credit: 'Khu phố 19 biên soạn và thiết kế; gợi ý học tập tham khảo bài Đi học là hạnh phúc trên Chuyên trang Hồ Chí Minh.' },
    reading: { image: HISTORICAL_IMAGES.children, sections: [{ title: 'Một cách bắt đầu học và làm theo', paragraphs: ['Infographic đề xuất một chu trình nhỏ để chuyển việc đọc tư liệu thành hành động: chọn nguồn đáng tin cậy, ghi lại điều đã hiểu, thực hiện một việc phù hợp rồi tự nhìn lại kết quả.', 'Bốn bước là gợi ý của Khu phố 19, không phải một mô hình hoặc lời dạy được trích nguyên văn từ Chủ tịch Hồ Chí Minh. Bài Đi học là hạnh phúc là nguồn tham khảo về tinh thần học tập.'] }] },
  },
]

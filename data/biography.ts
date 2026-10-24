import { HISTORICAL_IMAGES } from './historical-media'
import type { LibraryReading } from './library-readings'

const biography = { label: 'Sở Khoa học và Công nghệ TP.HCM · Tiểu sử Chủ tịch Hồ Chí Minh', url: 'https://khcn.tphcm.gov.vn/khong-gian-van-hoa-ho-chi-minh/gioi-thieu/tieu-su' }
const childhood = { label: 'Bảo tàng Hồ Chí Minh · Hồ Chí Minh – Tiểu sử, NXB Chính trị Quốc gia, 2008', url: 'https://hochiminh.vn/book/cuoc-doi-su-nghiep/bien-nien-tieu-su-ho-chi-minh/ho-chi-minh-tieu-su-bao-tang-ho-chi-minh-nxb-chinh-tri-quoc-gia-ha-noi-nam-2008-20' }
const departure = { label: 'Báo Điện tử Chính phủ · Hành trình tìm đường cứu nước', url: 'https://baochinhphu.vn/ky-niem-100-nam-ngay-bac-ho-ra-di-tim-duong-cuu-nuoc-5-6-1911-5-6-2011-nguoi-tao-nen-buoc-ngoat-lich-su-cho-cach-mang-viet-nam-10281639.htm' }

// Original editorial account. Each stage links to the institution used to check it.
export const BIOGRAPHY_READING: LibraryReading = {
  image: HISTORICAL_IMAGES.portrait,
  sections: [
    { title: '1890–1910 · Quê hương, gia đình và tuổi trẻ', source: childhood, paragraphs: [
      'Chủ tịch Hồ Chí Minh sinh ngày 19 tháng 5 năm 1890 tại làng Hoàng Trù, quê ngoại của Người ở Nghệ An. Quê nội là làng Kim Liên. Tên lúc nhỏ là Nguyễn Sinh Cung, sau đổi thành Nguyễn Tất Thành. Thân phụ là Nguyễn Sinh Sắc, thân mẫu là Hoàng Thị Loan. Gia đình và quê hương đã góp phần nuôi dưỡng tinh thần hiếu học, lòng yêu nước và sự gần gũi với người lao động.',
      'Tuổi trẻ của Người gắn với những năm sống, học tập ở Nghệ An và Huế. Trước khi vào Sài Gòn, Nguyễn Tất Thành từng dạy học tại Trường Dục Thanh ở Phan Thiết. Trong bối cảnh đất nước thuộc địa, Người tìm hiểu các phong trào yêu nước và mong muốn tìm một con đường giải phóng dân tộc phù hợp.'
    ] },
    { title: '1911–1920 · Ra đi tìm đường cứu nước', source: departure, paragraphs: [
      'Ngày 5 tháng 6 năm 1911, Nguyễn Tất Thành rời bến cảng Nhà Rồng ở Sài Gòn trên tàu Đô đốc Latouche Tréville. Qua nhiều quốc gia, Người vừa lao động để sinh sống, vừa quan sát đời sống của nhân dân, đặc biệt là người lao động và các dân tộc thuộc địa. Hành trình ấy giúp Người tiếp cận những môi trường xã hội, văn hóa và tư tưởng khác nhau.',
      'Năm 1919, với tên Nguyễn Ái Quốc, Người đưa bản yêu sách của nhân dân An Nam tới Hội nghị Versailles, yêu cầu các quyền tự do, bình đẳng. Năm 1920, Người đọc luận cương của Lenin về vấn đề dân tộc và thuộc địa. Tháng 12 cùng năm, tại Đại hội Tours, Người tham gia thành lập Đảng Cộng sản Pháp; đây là bước chuyển quan trọng trong sự lựa chọn con đường cách mạng.'
    ] },
    { title: '1921–1930 · Chuẩn bị tư tưởng và tổ chức', source: { label: 'Chuyên trang Hồ Chí Minh · Hành trình 30 năm tìm đường cứu nước', url: 'https://hochiminh.vn/tin-tuc/chu-tich-ho-chi-minh-va-hanh-trinh-30-nam-tim-duong-cuu-nuoc-giai-phong-dan-toc-9013' }, paragraphs: [
      'Trong những năm hoạt động tại Pháp, Liên Xô và Trung Quốc, Nguyễn Ái Quốc tham gia phong trào cách mạng quốc tế, viết báo và nghiên cứu vấn đề giải phóng các dân tộc thuộc địa. Năm 1925, Người thành lập Hội Việt Nam Cách mạng Thanh niên tại Quảng Châu, tổ chức huấn luyện và chuẩn bị đội ngũ cán bộ cho phong trào trong nước. Các bài giảng được tập hợp trong tác phẩm Đường Kách mệnh, xuất bản năm 1927.',
      'Đầu năm 1930, tại Hồng Kông, Người chủ trì hội nghị hợp nhất các tổ chức cộng sản, dẫn đến sự ra đời của Đảng Cộng sản Việt Nam. Ngày 3 tháng 2 được lấy làm ngày kỷ niệm thành lập Đảng. Hoạt động giai đoạn này gắn liền việc truyền bá tư tưởng với xây dựng tổ chức và kết nối phong trào yêu nước.'
    ] },
    { title: '1941 · Trở về Tổ quốc, xây dựng lực lượng', source: { label: 'Bảo tàng Hồ Chí Minh · Mùa Xuân đầu tiên Bác Hồ trở về Pác Bó', url: 'https://baotanghochiminh.vn/mua-xuan-dau-tien-bac-ho-tro-ve-pac-bo.htm' }, paragraphs: [
      'Ngày 28 tháng 1 năm 1941, sau gần ba mươi năm hoạt động ở nước ngoài, Nguyễn Ái Quốc trở về Việt Nam. Người làm việc tại Pác Bó, Cao Bằng, cùng các đồng chí xây dựng cơ sở cách mạng, huấn luyện cán bộ và phát triển liên lạc với phong trào trong nước.',
      'Tháng 5 năm 1941, Người chủ trì Hội nghị Trung ương lần thứ tám. Hội nghị đặt nhiệm vụ giải phóng dân tộc lên hàng đầu và quyết định thành lập Mặt trận Việt Minh. Việc tập hợp các tầng lớp nhân dân vào một mặt trận chung là bước chuẩn bị quan trọng cho cuộc đấu tranh giành độc lập.'
    ] },
    { title: '1942–1943 · Những tháng năm trong tù', source: { label: 'Bảo tàng Lịch sử Quốc gia · Hoàn cảnh ra đời Nhật ký trong tù', url: 'https://baotanglichsu.vn/vi/Articles/2002/68055/cach-djay-71-nam-29-8-1942-29-8-2013-ho-chi-minh-bi-chinh-quyen-tuong-gioi-thach-bat-giu-tac-pham-nhat-ky-trong-tu-ra-djoi.html' }, paragraphs: [
      'Tháng 8 năm 1942, với tên Hồ Chí Minh, Người sang Trung Quốc để liên lạc và tranh thủ sự ủng hộ quốc tế cho cách mạng Việt Nam. Người bị chính quyền địa phương bắt giữ, trải qua thời gian giam cầm và chuyển qua nhiều nhà lao ở Quảng Tây.',
      'Trong hoàn cảnh ấy, Người viết những bài thơ chữ Hán, về sau được tập hợp thành Nhật ký trong tù. Tập thơ ghi lại đời sống lao tù, những cảm nhận về thiên nhiên và con người, đồng thời thể hiện nghị lực, tinh thần lạc quan và khát vọng tự do. Sau khi được trả tự do năm 1943, Người tiếp tục hoạt động cách mạng.'
    ] },
    { title: '1945 · Cách mạng Tháng Tám và nền độc lập', source: { label: 'Bảo tàng Hồ Chí Minh · Hành trình đến Độc lập, Tự do', url: 'https://baotanghochiminh.vn/hanh-trinh-den-doc-lap-tu-do.htm' }, image: HISTORICAL_IMAGES.independence, paragraphs: [
      'Năm 1945, tình hình trong nước và quốc tế thay đổi nhanh chóng. Từ căn cứ cách mạng, Hồ Chí Minh cùng Trung ương Đảng lãnh đạo việc chuẩn bị và phát động Tổng khởi nghĩa. Thắng lợi của Cách mạng Tháng Tám tạo nên bước ngoặt trong lịch sử Việt Nam, đưa nhân dân giành chính quyền.',
      'Ngày 2 tháng 9 năm 1945, tại Quảng trường Ba Đình, Hà Nội, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, tuyên bố sự ra đời của nước Việt Nam Dân chủ Cộng hòa. Dấu mốc này mở đầu thời kỳ xây dựng và bảo vệ một nhà nước độc lập, đồng thời đặt ra những nhiệm vụ lớn về đời sống, giáo dục và tổ chức chính quyền.'
    ] },
    { title: '1946–1954 · Xây dựng nhà nước và kháng chiến', source: { label: 'Bảo tàng Lịch sử Quốc gia · Hồ Chí Minh – cả cuộc đời vì nước, vì dân', url: 'https://baotanglichsu.vn/vi/Articles/3097/70803/ho-chi-minh-ca-cuoc-djoi-vi-nuoc-vi-dan.html' }, references: [{ label: 'Bảo tàng Lịch sử Quốc gia · Tổng tuyển cử và Quốc hội khóa I', url: 'https://baotanglichsu.vn/vi/Articles/1002/17555/chiec-hom-phieu-bau-cu-quoc-hoi-khoa-i.html' }], paragraphs: [
      'Cuộc Tổng tuyển cử ngày 6 tháng 1 năm 1946 bầu ra Quốc hội đầu tiên. Tại kỳ họp đầu tiên ngày 2 tháng 3 năm 1946, Quốc hội công nhận Chính phủ liên hiệp kháng chiến do Chủ tịch Hồ Chí Minh đứng đầu. Việc tổ chức chính quyền diễn ra trong hoàn cảnh đất nước phải đối mặt với nhiều khó khăn sau khi giành độc lập.',
      'Sau ngày Toàn quốc kháng chiến 19 tháng 12 năm 1946, Người cùng Trung ương Đảng và Chính phủ trở lại căn cứ Việt Bắc. Những năm kháng chiến gắn với việc củng cố lực lượng, vận động nhân dân và bảo vệ nền độc lập. Chiến thắng Điện Biên Phủ năm 1954 đánh dấu thắng lợi quan trọng của cuộc kháng chiến chống thực dân Pháp; sau đó, Người trở về Hà Nội.'
    ] },
    { title: '1954–1969 · Xây dựng miền Bắc, hướng tới thống nhất', source: biography, paragraphs: [
      'Từ năm 1954, Chủ tịch Hồ Chí Minh cùng Trung ương Đảng lãnh đạo công cuộc xây dựng miền Bắc và đấu tranh nhằm giải phóng miền Nam, thống nhất đất nước. Người quan tâm đến phát triển sản xuất, giáo dục, đời sống nhân dân, công tác xây dựng Đảng và quan hệ đối ngoại.',
      'Tháng 9 năm 1960, tại Đại hội đại biểu toàn quốc lần thứ ba, Người được bầu làm Chủ tịch Ban Chấp hành Trung ương Đảng. Trong những năm cuối đời, Người tiếp tục công việc lãnh đạo, động viên đồng bào và chiến sĩ, đồng thời dành sự quan tâm tới thế hệ trẻ và sự nghiệp xây dựng đất nước lâu dài.'
    ] },
    { title: '1965–1969 · Di chúc và ngày Người đi xa', source: { label: 'Bảo tàng Hồ Chí Minh · Hội thảo Di chúc: giá trị lý luận và thực tiễn', url: 'https://baotanghochiminh.vn/hoi-thao-di-chuc-cua-chu-tich-ho-chi-minh-gia-tri-ly-luan-va-thuc-tien-1969-2019.htm' }, references: [biography], paragraphs: [
      'Chủ tịch Hồ Chí Minh chuẩn bị Di chúc từ năm 1965 đến năm 1969, nhiều lần sửa chữa và bổ sung. Di chúc thể hiện sự quan tâm đến Đảng, nhân dân, thế hệ trẻ, đoàn kết quốc tế và tương lai đất nước. Khi tìm hiểu văn kiện này, cần phân biệt quá trình viết, các bản bổ sung và bản được công bố, đặt nội dung trong hoàn cảnh lịch sử cụ thể.',
      'Người qua đời ngày 2 tháng 9 năm 1969 tại Hà Nội, khi đất nước còn trong chiến tranh. Cuộc đời hoạt động của Người để lại một di sản về tư tưởng, đạo đức và phong cách, tiếp tục được nghiên cứu qua các văn kiện, tác phẩm và hiện vật lịch sử.'
    ] },
    { title: 'Tình cảm với nhân dân và thế hệ trẻ', source: { label: 'Báo Nhân Dân · Tư liệu ảnh về Chủ tịch Hồ Chí Minh với thiếu nhi', url: 'https://en.nhandan.vn/in-photos-president-ho-chi-minhs-boundless-affection-for-vietnamese-children-post148209.html' }, image: HISTORICAL_IMAGES.children, paragraphs: [
      'Bên cạnh các dấu mốc chính trị và lịch sử, ảnh tư liệu còn ghi lại những lần Chủ tịch Hồ Chí Minh gặp gỡ học sinh, thiếu nhi và đồng bào. Những cuộc gặp ở căn cứ Việt Bắc, Phủ Chủ tịch và nhiều địa phương cho thấy sự quan tâm của Người đến việc học, đời sống và tương lai của trẻ em.',
      'Bài tiểu sử này là bản đọc do Khu phố 19 biên soạn để hỗ trợ tìm hiểu. Bạn có thể đi từ từng giai đoạn tới nguồn đối chiếu, xem chú thích ảnh và mở những tác phẩm liên quan trong thư viện để tiếp tục đọc trong bối cảnh đầy đủ hơn.'
    ] },
  ],
}

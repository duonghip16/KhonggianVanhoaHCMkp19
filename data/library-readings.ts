import { HISTORICAL_IMAGES, type HistoricalImage } from './historical-media'
import { BIOGRAPHY_READING } from './biography'

export type LibraryReading = {
  image: HistoricalImage
  sections: { title: string; paragraphs: string[]; source?: { label: string; url: string }; references?: { label: string; url: string }[]; image?: HistoricalImage }[]
}

// Bản đọc biên soạn, không sao chép nguyên văn các bài ở nguồn tham khảo.
export const LIBRARY_READINGS: Record<string, LibraryReading> = {
  'doan-ket': {
    image: HISTORICAL_IMAGES.portrait,
    sections: [
      { title: 'Sức mạnh từ mục tiêu chung', paragraphs: ['Tư tưởng Hồ Chí Minh về đoàn kết coi việc tập hợp sức dân là nền tảng tạo nên sức mạnh. Sự gắn bó giữa con người và các lực lượng trong xã hội hướng tới mục tiêu chung của dân tộc.'] },
      { title: 'Đoàn kết trong thực hành', paragraphs: ['Đoàn kết cần được xây dựng bằng sự tôn trọng, lắng nghe và hợp tác. Những khác biệt cần được trao đổi để tìm điểm chung, cùng góp sức vào công việc có ích. Trang biên soạn phần đọc này để gợi mở cách vận dụng trong đời sống hằng ngày.'] },
      { title: 'Tư liệu trích dẫn trên trang', paragraphs: ['Câu trích ngắn về đoàn kết đang hiển thị trên website được dẫn từ bài nói chuyện tại Đại hội đại biểu Mặt trận Tổ quốc Việt Nam lần thứ II năm 1961. Liên kết nguồn bên dưới giúp người đọc đối chiếu bối cảnh và tìm hiểu thêm về tư tưởng đoàn kết.'] },
    ],
  },
  'ra-di-tim-duong-cuu-nuoc': {
    image: HISTORICAL_IMAGES.portrait,
    sections: [
      { title: 'Khởi đầu từ Bến Nhà Rồng', paragraphs: ['Ngày 5 tháng 6 năm 1911, Nguyễn Tất Thành rời bến cảng Nhà Rồng ở Sài Gòn trên tàu Đô đốc Latouche Tréville, bắt đầu hành trình tìm đường cứu nước. Người làm việc để sinh sống, đồng thời tìm hiểu xã hội và đời sống của nhân dân ở nhiều quốc gia.'] },
      { title: 'Học hỏi từ thực tiễn', paragraphs: ['Những năm ở nước ngoài giúp Người quan sát hoàn cảnh của người lao động và các dân tộc thuộc địa. Năm 1919, với tên Nguyễn Ái Quốc, Người gửi bản yêu sách tới Hội nghị Versailles, nêu yêu cầu về quyền tự do và bình đẳng của nhân dân Việt Nam.'] },
      { title: 'Một bước ngoặt trong hành trình', paragraphs: ['Năm 1920, Nguyễn Ái Quốc tiếp cận luận cương của Lenin về vấn đề dân tộc và thuộc địa. Tháng 12 cùng năm, Người tham gia thành lập Đảng Cộng sản Pháp. Bài viết của Báo Điện tử Chính phủ phân tích ý nghĩa của những dấu mốc này đối với con đường cách mạng Việt Nam.'] },
    ],
  },
  'bac-voi-thieu-nhi': {
    image: HISTORICAL_IMAGES.children,
    sections: [
      { title: 'Sự quan tâm dành cho thế hệ trẻ', paragraphs: ['Bộ ảnh của Báo Nhân Dân giới thiệu những lần Chủ tịch Hồ Chí Minh gặp gỡ, thăm hỏi thiếu nhi. Dù đảm nhiệm công việc lãnh đạo đất nước, Người vẫn dành thời gian cho trẻ em, thể hiện sự quan tâm đến thế hệ tiếp nối.'] },
      { title: 'Những khoảnh khắc qua tư liệu', paragraphs: ['Các chú thích ảnh ghi lại những cuộc gặp ở căn cứ Việt Bắc và Phủ Chủ tịch, trong những dịp sinh nhật, Tết Trung thu hoặc Ngày Quốc tế Thiếu nhi. Bộ ảnh cũng giới thiệu việc Người gặp học sinh và thiếu nhi miền Nam ra thăm miền Bắc.'] },
      { title: 'Gợi mở cho hôm nay', paragraphs: ['Từ những tư liệu này, trang gợi ý một cách thực hành gần gũi: lắng nghe trẻ em, quan tâm đến việc học và tạo điều kiện để các em tham gia sinh hoạt cộng đồng. Đây là gợi ý của trang, không phải lời trích dẫn của Chủ tịch Hồ Chí Minh.'] },
    ],
  },
  'tieu-su': BIOGRAPHY_READING,
  'dao-duc': {
    image: HISTORICAL_IMAGES.portrait,
    sections: [
      { title: 'Đạo đức trong công việc và đời sống', paragraphs: ['Trong tư tưởng Hồ Chí Minh, đạo đức là nền tảng của người cách mạng. Tài năng cần đi cùng trách nhiệm và cách ứng xử với con người. Việc rèn luyện thể hiện qua những hành động cụ thể, được duy trì hằng ngày.'] },
      { title: 'Cần, kiệm, liêm, chính', paragraphs: ['Cần là lao động chăm chỉ, có kế hoạch và sáng tạo. Kiệm là sử dụng hợp lý thời gian, công sức, tiền của; tránh lãng phí. Liêm là giữ sự trong sạch, không lợi dụng của công để mưu lợi riêng. Chính là ngay thẳng, biết tự sửa mình và tôn trọng người khác.'] },
      { title: 'Đặt lợi ích chung lên trước', paragraphs: ['Chí công vô tư đòi hỏi sự công bằng và ưu tiên lợi ích chung. Rèn luyện đạo đức cần gắn lời nói với việc làm, nêu gương và tiếp tục học hỏi suốt đời. Mỗi người có thể bắt đầu bằng sự trung thực và trách nhiệm trong việc mình đã nhận.'] },
    ],
  },
  'hoc-tap': {
    image: HISTORICAL_IMAGES.children,
    sections: [
      { title: 'Học để phát triển bản thân', paragraphs: ['Bài viết nhìn nhận học tập là cơ hội để con người tiến bộ và đóng góp cho đất nước. Tinh thần học hỏi đòi hỏi sự chủ động, khiêm tốn và bền bỉ; kiến thức có thể được tìm thấy ở thầy cô, bạn bè và thực tiễn.'] },
      { title: 'Giáo dục trong những ngày đầu độc lập', paragraphs: ['Ngay tại phiên họp Chính phủ ngày 3 tháng 9 năm 1945, Chủ tịch Hồ Chí Minh đề cập nhiệm vụ chống nạn mù chữ. Trong thư gửi học sinh và lời kêu gọi học chữ, Người quan tâm đến cơ hội học tập của nhân dân và vai trò của giáo dục đối với tương lai dân tộc.'] },
      { title: 'Tiếp tục học mỗi ngày', paragraphs: ['Học tập không dừng ở nhà trường. Đọc thêm một tài liệu, hỏi điều chưa hiểu và vận dụng kiến thức vào công việc đều là những cách tiếp tục học. Khi chia sẻ điều hữu ích, người học cũng góp phần mở rộng cơ hội cho người khác.'] },
    ],
  },
  'dan-van': {
    image: HISTORICAL_IMAGES.portrait,
    sections: [
      { title: 'Nhân dân là chủ thể', paragraphs: ['Bài báo Dân vận của Chủ tịch Hồ Chí Minh, ký tên X.Y.Z., đăng trên báo Sự thật số 120 ngày 15 tháng 10 năm 1949. Nội dung làm rõ vị trí của nhân dân trong đời sống đất nước: quyền lợi, trách nhiệm và hoạt động của chính quyền đều gắn với nhân dân.'] },
      { title: 'Lắng nghe và cùng làm', paragraphs: ['Công tác dân vận cần giúp người dân hiểu, tham gia bàn bạc và thực hiện công việc chung. Người làm công tác này phải gần dân, lắng nghe ý kiến và quan tâm đến kết quả thực tế. Lời nói chỉ có ý nghĩa khi đi cùng hành động.'] },
      { title: 'Gợi mở cho đời sống cộng đồng', paragraphs: ['Tinh thần đó gợi nhắc cách tổ chức công việc ở khu dân cư: thông tin rõ ràng, tôn trọng ý kiến và cùng đánh giá kết quả. Sự tham gia của mỗi người giúp hoạt động chung đáp ứng tốt hơn nhu cầu của cộng đồng.'] },
    ],
  },
}

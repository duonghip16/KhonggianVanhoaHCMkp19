import { HISTORY, SOURCES } from './content'

// Facts checked against the sources used in the biography reader.
export const BIOGRAPHY_MILESTONES = [
  HISTORY[0], HISTORY[1],
  { date: '12/1920', title: 'Bước chuyển tại Đại hội Tours', text: 'Nguyễn Ái Quốc tham dự Đại hội Tours và tham gia thành lập Đảng Cộng sản Pháp. Đây là bước chuyển quan trọng trong hành trình lựa chọn con đường cách mạng.', source: SOURCES.departure },
  { date: '1930', title: 'Hợp nhất các tổ chức cộng sản', text: 'Tại Hồng Kông, Nguyễn Ái Quốc chủ trì hội nghị hợp nhất các tổ chức cộng sản, dẫn đến sự ra đời của Đảng Cộng sản Việt Nam.', source: SOURCES.biography },
  { date: '28/01/1941', title: 'Trở về Tổ quốc', text: 'Sau gần ba mươi năm hoạt động ở nước ngoài, Nguyễn Ái Quốc trở về Việt Nam, làm việc tại Pác Bó, Cao Bằng, trực tiếp cùng các đồng chí xây dựng lực lượng cách mạng.', source: SOURCES.biography },
  HISTORY[2],
  { date: '1954', title: 'Một giai đoạn mới của đất nước', text: 'Sau thắng lợi của cuộc kháng chiến chống thực dân Pháp, Chủ tịch Hồ Chí Minh cùng Trung ương Đảng lãnh đạo công cuộc xây dựng miền Bắc và đấu tranh hướng tới thống nhất đất nước.', source: SOURCES.biography },
  HISTORY[3],
]

export const VE_BAC_PILLARS = [
  { number: '01', label: 'Tư tưởng', title: 'Nhân dân là chủ thể.', text: 'Tìm hiểu vai trò của nhân dân, ý nghĩa của dân vận và trách nhiệm hướng công việc tới lợi ích của dân. Từ đó, nhìn lại cách lắng nghe và cùng giải quyết những việc chung.', source: SOURCES.people, action: 'Đọc về tư tưởng dân vận' },
  { number: '02', label: 'Đạo đức', title: 'Rèn luyện từ mỗi ngày.', text: 'Cần, kiệm, liêm, chính, chí công vô tư gắn với trách nhiệm trong công việc và đời sống. Các phẩm chất cần được tìm hiểu trong mối liên hệ với nhau và với việc rèn luyện lâu dài.', source: SOURCES.ethics, action: 'Đọc về đạo đức cách mạng' },
  { number: '03', label: 'Phong cách học tập', title: 'Học để hiểu và làm.', text: 'Tinh thần học hỏi giúp mỗi người tiếp tục tiến bộ. Đọc tư liệu có nguồn, đối chiếu điều đã hiểu và gắn việc học với thực hành là một cách tiếp cận gần gũi cho hôm nay.', source: SOURCES.learning, action: 'Đọc về tinh thần học tập' },
]

export const VE_BAC_RESOURCE_IDS = ['sach-duong-kach-menh', 'sach-sua-doi-loi-lam-viec', 'sach-nhat-ky-trong-tu', 'video-doan-ket', 'audio-anh-lich-su', 'infographic-hanh-trinh']

import type { Metadata } from 'next'
import ExhibitionPage from '@/components/ExhibitionPage'

export const metadata: Metadata = { title: 'Quyền riêng tư', description: 'Thông tin gửi đóng góp, xét duyệt và phạm vi công khai trên website Khu phố 19.', alternates: { canonical: '/quyen-rieng-tu' } }

export default function PrivacyPage() {
  return <ExhibitionPage eyebrow="Thông tin dành cho người tham gia" title="Chia sẻ có sự đồng ý." description="Tìm hiểu nội dung nào được lưu và điều gì sẽ hiển thị khi bạn gửi một việc tốt hoặc lời nhắn.">
    <section className="on-light project-copy"><h2>Nội dung bạn gửi</h2><p>Biểu mẫu ghi nhận nội dung, tên hiển thị nếu bạn cung cấp, thời điểm gửi và sự đồng ý xét duyệt để công khai. Việc tốt còn có tiêu đề và ngày thực hiện. Bạn có thể bỏ trống tên hoặc dùng tên hiển thị không tiết lộ danh tính.</p><p>Bài được lưu chờ duyệt trên Firebase. Chỉ bài đã được quản trị viên công bố mới xuất hiện ở khu vực cộng đồng; tên hiển thị và nội dung bài có thể được mọi người đọc và chia sẻ.</p></section>
    <section className="on-light project-copy"><h2>Giữ thông tin riêng tư</h2><p>Không đưa số điện thoại, địa chỉ nhà, giấy tờ cá nhân, thông tin sức khỏe hoặc dữ liệu nhạy cảm vào bài. Chỉ chia sẻ thông tin, hình ảnh của người khác khi có quyền và sự đồng ý phù hợp.</p><p>Website dùng giới hạn tần suất để giảm spam. Nếu máy chủ được cấu hình nhận địa chỉ IP từ proxy tin cậy, IP được dùng tạo khóa giới hạn trong bộ nhớ máy chủ. Dịch vụ lưu trữ có thể xử lý thông tin kỹ thuật theo cấu hình và chính sách của nhà cung cấp.</p></section>
    <section className="on-light project-copy"><h2>Yêu cầu điều chỉnh hoặc gỡ nội dung</h2><p>Nếu cần sửa hoặc gỡ bài, hãy liên hệ người quản trị qua đầu mối bạn đã sử dụng khi tham gia hoạt động tại Khu phố 19. Cung cấp tên bài, ngày gửi và nội dung cần xử lý; không gửi thêm giấy tờ cá nhân qua lời nhắn công khai.</p><p>Website chưa công bố đầu mối liên hệ trực tuyến và thời hạn lưu bài cụ thể. Người tham gia nên cân nhắc điều này trước khi gửi thông tin có thể nhận diện cá nhân. Đơn vị vận hành cần bổ sung đầu mối, lịch lưu trữ và quy trình xử lý yêu cầu trước khi triển khai chính thức.</p></section>
  </ExhibitionPage>
}

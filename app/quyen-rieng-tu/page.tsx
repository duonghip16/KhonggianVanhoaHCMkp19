import type { Metadata } from 'next'
import ExhibitionPage from '@/components/ExhibitionPage'

export const metadata: Metadata = { title: 'Quyền riêng tư', description: 'Thông tin gửi đóng góp, xét duyệt và phạm vi công khai trên website Khu phố 19.', alternates: { canonical: '/quyen-rieng-tu' } }

export default function PrivacyPage() {
  return <ExhibitionPage eyebrow="Thông tin dành cho người tham gia" title="Chia sẻ có sự đồng ý." description="Tìm hiểu nội dung nào được lưu và điều gì sẽ hiển thị khi bạn gửi một việc tốt hoặc lời nhắn.">
    <section className="on-light project-copy"><h2>Bạn chia sẻ những gì?</h2><p>Khi gửi một việc tốt hoặc lời nhắn, website lưu nội dung bạn viết, ngày gửi và sự đồng ý cho phép xét duyệt, đăng bài. Với việc tốt, bài còn có tên việc và ngày thực hiện.</p><p>Tên của bạn không bắt buộc. Bạn có thể để trống hoặc dùng tên gọi quen thuộc thay cho họ tên đầy đủ.</p></section>
    <section className="on-light project-copy"><h2>Bài viết được đăng khi nào?</h2><p>Bài gửi sẽ được xem xét trước khi đăng. Gửi thành công có nghĩa là website đã nhận bài, chưa có nghĩa bài đã xuất hiện công khai.</p><p>Sau khi được duyệt đăng, mọi người có thể đọc và chia sẻ nội dung cùng tên bạn đã ghi. Vì vậy, hãy đọc lại bài và chỉ gửi những điều bạn đồng ý cho người khác biết.</p></section>
    <section className="on-light project-copy"><h2>Những điều nên giữ riêng</h2><p>Không ghi số điện thoại, địa chỉ nhà, số giấy tờ, thông tin sức khỏe hoặc chuyện riêng tư vào bài công khai.</p><p>Nếu bài nhắc đến hoặc có hình ảnh của người khác, hãy hỏi ý kiến họ trước khi chia sẻ. Đặc biệt, cần thận trọng với thông tin và hình ảnh của trẻ em.</p><p>Một số thông tin về lần truy cập có thể được dùng để bảo vệ website và hạn chế việc gửi bài liên tục. Khi gửi quá nhanh, bạn có thể được yêu cầu chờ một lúc rồi thử lại.</p></section>
    <section className="on-light project-copy"><h2>Bài được giữ bao lâu?</h2><p>Bài đã đăng có thể được giữ để mọi người tiếp tục đọc và lan tỏa việc tốt. Website hiện chưa công bố thời hạn lưu bài cụ thể. Bạn có thể đề nghị chỉnh sửa hoặc gỡ nội dung đã gửi.</p></section>
    <section className="on-light project-copy"><h2>Khi bạn muốn sửa hoặc gỡ bài</h2><p>Hãy liên hệ người quản trị qua đầu mối bạn đã sử dụng khi tham gia hoạt động tại Khu phố 19. Cho biết tên bài, ngày gửi và phần bạn muốn sửa hoặc gỡ để dễ tìm đúng bài.</p><p>Trang này hiện chưa có số điện thoại hoặc địa chỉ liên hệ trực tiếp. Không gửi giấy tờ cá nhân hay thông tin riêng tư qua phần lời nhắn công khai để yêu cầu sửa bài.</p></section>
  </ExhibitionPage>
}

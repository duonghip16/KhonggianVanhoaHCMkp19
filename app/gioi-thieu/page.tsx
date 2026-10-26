import type { Metadata } from 'next'
import Link from 'next/link'
import ExhibitionPage from '@/components/ExhibitionPage'

export const metadata: Metadata = { title: 'Giới thiệu dự án', description: 'Mục tiêu, nguồn tư liệu và cách tham gia Không gian Văn hóa Hồ Chí Minh – Khu phố 19.', alternates: { canonical: '/gioi-thieu' } }

export default function AboutPage() {
  return <ExhibitionPage eyebrow="Về không gian" title="Từ tư liệu đến việc làm mỗi ngày." description="Không gian Văn hóa Hồ Chí Minh – Khu phố 19 kết nối việc tìm hiểu, suy ngẫm và thực hành trong đời sống cộng đồng.">
    <section className="on-light project-copy"><h2>Một không gian để cùng học và làm.</h2><p>Website giới thiệu tư liệu về Chủ tịch Hồ Chí Minh, những giá trị có thể thực hành hằng ngày và hoạt động cộng đồng Khu phố 19, phường Tân Thới Hiệp, Thành phố Hồ Chí Minh.</p><p>Bạn có thể bắt đầu từ <Link href="/ve-bac">các mốc cuộc đời Bác</Link>, đọc <Link href="/thu-vien">thư viện số</Link> hoặc chọn một việc cụ thể trong phần <Link href="/hoc-va-lam-theo-bac">Học và làm theo Bác</Link>.</p></section>
    <section className="on-light project-copy"><h2>Nguồn rõ ràng, công bố có căn cứ.</h2><p>Tư liệu có liên kết nguồn đi kèm để người đọc đối chiếu. Bài giới thiệu và gợi ý thực hành do website biên soạn được phân biệt với bản quét và tư liệu gốc. Số liệu cộng đồng chỉ hiển thị khi có kỳ thống kê, nguồn và thông tin xác minh.</p><p>Ảnh và câu chuyện địa phương cần được người quản trị kiểm tra nguồn, quyền sử dụng và phạm vi đồng ý công khai trước khi xuất bản. Các tổ chức được giới thiệu trên website không mặc nhiên là đơn vị vận hành hoặc phê duyệt mọi nội dung.</p></section>
    <section className="on-light project-copy"><h2>Cùng góp một việc tốt.</h2><p>Chia sẻ việc bạn đã làm tại <Link href="/vuon-hoa-viec-tot">Vườn hoa việc tốt</Link> hoặc để lại <Link href="/tuong-tac#loi-nhan">lời nhắn</Link>. Nội dung được lưu chờ duyệt; gửi thành công chưa đồng nghĩa với đăng công khai.</p><p>Không gửi số điện thoại, địa chỉ riêng, thông tin nhạy cảm hoặc thông tin của người khác khi chưa được phép. Xem thêm <Link href="/quyen-rieng-tu">thông tin về quyền riêng tư</Link>.</p></section>
  </ExhibitionPage>
}

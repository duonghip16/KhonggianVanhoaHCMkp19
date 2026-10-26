# Vận hành website KP19

## Phân công trước phát hành

Chủ website cần ghi rõ người phụ trách nội dung, kỹ thuật, duyệt bài và đầu mối nhận yêu cầu quyền riêng tư. Chưa có thông tin xác nhận trong source; không tự gán trách nhiệm cho các đoàn thể được giới thiệu trên trang. Bổ sung đầu mối và thời hạn lưu bài tại `/quyen-rieng-tu` trước phát hành chính thức.

## Quy trình nội dung

1. Đăng nhập `/admin` bằng tài khoản Firebase có claim `admin: true`.
2. Tạo Nháp, bổ sung nguồn gốc, ngày, quyền sử dụng ảnh, người và ngày xác minh. Phân biệt bài biên soạn với tư liệu gốc.
3. Với bài cộng đồng, kiểm tra consent, xóa thông tin riêng tư không cần thiết và xác minh nội dung. Chỉ công bố khi đủ điều kiện.
4. Kiểm tra bản xem trước rồi chuyển Công bố. Mở trang công khai để đối chiếu tiêu đề, nguồn, hình ảnh và hiển thị mobile.
5. Để gỡ công khai, chuyển bài về Nháp. Rules không cho xóa trực tiếp. Việc xóa dữ liệu vĩnh viễn theo yêu cầu riêng tư cần người có quyền dự án xử lý sau khi xác minh, rà soát bản sao lưu và lưu dấu thao tác.

Không điền số ước lượng để làm đẹp thống kê. Bản ghi số liệu phải có kỳ, nguồn, người/ngày xác minh. Không dùng nội dung `[KIỂM THỬ]` làm hoạt động thật.

## Cấu hình và kiểm tra

- Sao chép `.env.example` thành `.env.local`; secret ImageKit chỉ ở máy chủ. Không đưa `.env.local`, service account hoặc token vào Git/log.
- `NEXT_PUBLIC_SITE_URL` ghi đè URL mặc định `https://kgvhhcmkp19.vercel.app`. Khi đổi miền phải cập nhật biến này và kiểm tra QR, canonical, Open Graph, sitemap.
- Vercel Preview có `VERCEL_ENV=preview` và được chặn index. Đặt cùng cấu hình Firebase phù hợp với môi trường; ưu tiên dự án thử nghiệm khi thử ghi dữ liệu.
- Trên Vercel (`VERCEL=1`), API tự dùng `x-vercel-forwarded-for`. Ngoài Vercel chỉ đặt `CONTRIBUTION_IP_HEADER` khi proxy thực sự ghi đè header; nếu không cấu hình thì dùng hạn mức chung cho khách chưa nhận diện. Giới hạn trong bộ nhớ không chia sẻ giữa các instance. Firestore còn có hạn mức chung 5 giây.
- Chạy `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run audit:files`, `npm run test:rules`. Windows có thể dùng `npm.cmd` nếu PowerShell chặn script.
- Kiểm thử Rules chạy demo-kp19 trong emulator. Không dùng production để thử vượt quyền.
- Bản nâng cấp bổ sung consent bắt buộc trong Rules cho việc tốt/lời nhắn khi xác minh/công bố. Triển khai Rules đã kiểm thử cùng đợt với API; các bản ghi cũ thiếu consent phải được rà soát trước khi công khai lại. Source đã sửa không đồng nghĩa Rules cloud đã cập nhật.
- Browser smoke: chạy production ở 3100, Edge/Chrome headless có cổng 9223, rồi `node tests/browser-smoke.mjs`. Fixture việc tốt chỉ được thay trong bộ nhớ trình duyệt, không ghi Firebase.

## Sao lưu trước thay đổi dữ liệu

1. Ghi commit nguồn, phiên bản Vercel, thời điểm và dự án Firebase. Xuất bản Rules đang dùng; ghi lại tên biến môi trường, giữ giá trị trong kho bí mật.
2. Người quản trị dự án xuất Firestore bằng Console hoặc công cụ Google Cloud vào bucket riêng đã phân quyền. Xác nhận các collection, thời điểm snapshot và khả năng khôi phục. Xuất CSV CMS chỉ phục vụ kiểm tra nội dung, không thay thế backup đầy đủ kiểu dữ liệu/timestamp.
3. Lập danh mục ảnh ImageKit, URL, chủ sở hữu và quyền sử dụng; sao lưu file gốc theo chính sách đơn vị. Không xóa file trước khi biết bản ghi nào tham chiếu.
4. Thử khôi phục snapshot vào dự án thử nghiệm trước khi thay đổi production. Kiểm tra số bản ghi và mẫu dữ liệu, quyền đọc/ghi và liên kết ảnh.
5. Xác định người được truy cập backup và hạn lưu, bao gồm cách xử lý yêu cầu xóa dữ liệu trong backup.

Các bước này là hướng dẫn; phiên nâng cấp source không tạo backup dữ liệu cloud.

## Preview và rollback

1. Tạo Vercel Preview từ thay đổi đã review; không đẩy production chỉ vì build đạt.
2. Kiểm tra gửi → chờ duyệt → admin xác minh → công bố → gỡ về Nháp bằng dữ liệu thử được nhận diện rõ trong dự án thử nghiệm. Thử mất mạng, gửi nhanh, phiên admin hết hạn và upload sai định dạng.
3. Mở trên iPhone/Android thật, quét QR, xoay màn hình và phóng to chữ. Đo Lighthouse; số đo lab không thay thế p75 LCP/INP/CLS của người dùng thực tế.
4. Khi lỗi source, quay về deployment Vercel trước. Khi API phụ thuộc Rules, khôi phục phiên bản tương thích của cả hai; không tự hạ Rules để bỏ qua lỗi.
5. Khôi phục dữ liệu chỉ khi thật sự có thay đổi dữ liệu cần đảo ngược, từ backup đã kiểm chứng và theo kế hoạch tránh ghi đè bài mới.

## Lịch kiểm tra

Hằng tuần: duyệt bài chờ, xử lý yêu cầu gỡ/sửa, kiểm tra lỗi tải tư liệu. Hằng tháng: kiểm tra liên kết, quyền tài khoản quản trị, backup, dependency và `npm audit`. Ghi thời điểm, người thực hiện và kết quả; log kỹ thuật không ghi nội dung người gửi, token hoặc secret.

API gửi bài và upload trả `code`, `requestId` khi gặp lỗi dịch vụ. Tìm `requestId` trong log máy chủ để xác định bước lỗi. Log chỉ ghi mã cố định, ID ngẫu nhiên và HTTP status phía dịch vụ nếu có; không ghi body, tên người gửi, IP, token hay khóa ImageKit. Chưa có dịch vụ cảnh báo tự động; cần đầu mối kỹ thuật theo dõi log hosting.

Mã lỗi gửi bài: `FIREBASE_NOT_CONFIGURED` (thiếu project), `CONTRIBUTION_GATE_UNAVAILABLE` (đọc bộ đếm thất bại), `CONTRIBUTION_WRITE_DENIED` (ghi bị từ chối), `CONTRIBUTION_WRITE_UNAVAILABLE` (dịch vụ ghi lỗi), `CONTRIBUTION_INVALID_RESPONSE` (chưa có xác nhận commit), `CONTRIBUTION_SERVICE_UNAVAILABLE` (mạng/timeout). Upload dùng `MEDIA_UPLOAD_UNAVAILABLE`. Không hạ quyền Rules để bỏ qua lỗi; kiểm tra project, phiên admin và cấu hình môi trường tương ứng.

## Demo 3–5 phút

Trang chủ → Về Bác → mở tư liệu có nguồn → chọn việc thực hành → làm quiz → Vườn hoa → giải thích chờ duyệt. Minh họa admin trong môi trường thử nghiệm; không công bố bài giả trên website thật.

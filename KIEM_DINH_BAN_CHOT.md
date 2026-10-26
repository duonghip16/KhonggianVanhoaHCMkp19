# Kiểm định theo bản chốt KP19

## Cập nhật nội dung và điều hướng theo góp ý

Quyền riêng tư được viết lại bằng ngôn ngữ dành cho người tham gia, bỏ tên dịch vụ và thuật ngữ kỹ thuật. Giới thiệu dự án và Quyền riêng tư chuyển sang nhóm “Thông tin website” riêng ở footer. Menu điện thoại có 8 trang chính chia theo nhóm, biểu tượng, chỉ dấu trang hiện tại và nút Đóng; desktop có mục Cộng đồng mở danh sách con.

Build, TypeScript, lint và kiểm tra định dạng thay đổi đều đạt. 10 trang tiếp tục không tràn ngang ở 7 độ rộng. Các kiểm tra tương tác đạt, gồm đủ 8 liên kết mobile, nhóm thông tin footer, nội dung quyền riêng tư không chứa các thuật ngữ kỹ thuật đã loại bỏ, menu desktop mở/đóng bằng Escape và menu khi xoay ngang. Ảnh kiểm tra: `.qa/new-menu-320.png`, `.qa/new-menu-390.png`, `.qa/new-menu-768.png`, `.qa/new-menu-1440.png` và `.qa/new-footer-320.png`. Log tương tác: `.qa/navigation-interactions.log`.

Các số đo Lighthouse bên dưới là phép đo ở đợt kiểm định trước cập nhật menu này; chưa đo lại Lighthouse cho giao diện menu mới.

Ngày kiểm tra: 26/10/2026. Phạm vi: source đang mở, bản build production chạy tại `http://localhost:3100`. Giữ kiến trúc Next.js, Firebase, ImageKit và GSAP. Không ghi thử dữ liệu người dân, không sửa Rules cloud, chưa tạo deployment Vercel mới.

## Các đợt thay đổi

1. **An toàn và vận hành:** mã lỗi cố định và request ID cho lỗi dịch vụ gửi bài/upload; log không chứa body, tên, IP hoặc secret. Chọn header proxy của Vercel khi `VERCEL=1`; ngoài Vercel không tin header đó chỉ vì client gửi lên. Unit/API test đạt sau thay đổi.
2. **Giao diện và tiếp cận:** sửa màu nhãn trên nền kem, dùng tên truy cập logo lấy từ chữ hiển thị, bỏ màn mở đầu che trang, giảm chiều cao hero mobile. Build/lint đạt.
3. **Tương tác:** hoa chỉ nở một lần; tư liệu lỗi có thử lại, iframe có thông báo chờ tối đa 15 giây và đường dẫn mở ngoài. Client kiểm tra cấu trúc phản hồi cộng đồng để tránh lỗi giao diện khi dữ liệu sai.
4. **Nội dung và tốc độ:** kiểm tra URL nguồn, đối chiếu một số mốc lịch sử chính; stream phần đầu trang trước dữ liệu Firebase, tải GSAP khi timeline đến gần viewport. Không tạo thống kê hoặc thành tích mới.
5. **Kiểm định/bàn giao:** Lighthouse trước/sau, kiểm tra trình duyệt, cập nhật báo cáo và tài liệu vận hành. Preview, thiết bị thật và đầu mối nội dung còn cần điều kiện bên ngoài.

Các đợt thay đổi cùng nằm trong working tree hiện tại; chưa tạo commit riêng cho từng đợt. Không xem đây là đã đạt toàn bộ Definition of Done của kế hoạch.

## Lighthouse

Lighthouse 13.5.0, Edge headless, bản build production local. Mobile dùng cấu hình mặc định của Lighthouse; desktop dùng `--preset=desktop`. Mỗi hàng là một phép đo độc lập, không phải trung vị hoặc p75 của người dùng thật.

| Phiên bản/phép đo | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS | Speed Index |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Trước đợt bổ sung, mobile | 95 | 96 | 100 | 100 | 2,3 s | 160 ms | 0,001 | 3,8 s |
| Sau sửa UI, chưa stream, mobile lần 1 | 90 | 100 | 100 | 100 | 2,3 s | 350 ms | 0 | 2,9 s |
| Sau sửa UI, chưa stream, mobile lần 2 | 91 | 100 | 100 | 100 | 3,1 s | 110 ms | 0 | 2,5 s |
| Bản cuối có streaming, mobile | 95 | 100 | 100 | 100 | 2,3 s | 200 ms | 0 | 2,0 s |
| Bản cuối có streaming, desktop | 100 | 100 | 100 | 100 | 0,6 s | 0 ms | 0 | 0,7 s |

Hai lỗi tiếp cận thực tế từ baseline: nhãn “Thư viện số” có tương phản 4,17:1 và tên truy cập của logo không khớp nhãn hiển thị. Bản cuối không còn hai lỗi này. Các điểm tự động không thay thế kiểm tra screen reader, điện thoại thật hoặc người dùng thực tế.

Tốc độ mạng tới Firebase có biến động; không kết luận toàn bộ hiệu năng từ một lần đo. Bản cuối trả phần tên trang và hai hành động chính trước khi chờ dữ liệu cộng đồng. Chưa có dữ liệu INP hoặc p75 LCP/CLS trên production; TBT không phải INP.

Báo cáo HTML/JSON nằm trong `.qa/`: `lighthouse-before.report.*`, `lighthouse-after.report.*`, `lighthouse-after-repeat.report.*`, `lighthouse-final-mobile.report.*`, `lighthouse-final-desktop.report.*`.

Kiểm tra stream độc lập ở một request local: phần hero nhận được sau 86 ms, phần nội dung cộng đồng sau 443 ms. Đây chỉ là quan sát một request, không phải cam kết tốc độ production.

## Kiểm thử source và trình duyệt

- `npm test`: **36/36 đạt**. Các test mới kiểm tra log không chứa dữ liệu request, khóa giới hạn theo môi trường proxy và phản hồi cộng đồng sai/mất mạng.
- `npm run lint`, `npm run typecheck`, `npm run build`, `git diff --check`: đạt. Audit tệp hoàn tất; các module/tài nguyên dự phòng chưa dùng vẫn được giữ lại như báo cáo trước.
- Rules không đổi thêm trong đợt bổ sung này; **12/12 test emulator đã đạt** cho phiên bản Rules sửa ở đợt trước, gồm consent và ranh giới admin/khách.
- Browser smoke bản cuối: **10 trang × 7 kích thước 320/375/390/430/768/1024/1440px đạt**, một H1, có đích skip link, không tràn ngang.
- Kiểm tra mở rộng đã đạt: CTA ở màn hình mobile đầu tiên, không có overlay intro, 120 việc tốt mô phỏng không tràn, mất mạng giữ nội dung nhập, gửi lại thành công chỉ xóa draft sau xác nhận và không tự thêm bài chờ duyệt vào vườn công khai.
- Chặn request ảnh infographic để tạo lỗi tải thật trong trình duyệt: thông báo lỗi/thử lại xuất hiện; bỏ chặn và thử lại tải ảnh thành công. Sáu định dạng thư viện, menu ngang, Escape, quiz, xuất PNG/HTML/QR và GSAP/reduced motion tiếp tục đạt.
- Không có runtime exception. Log: `.qa/browser-final-plan.log`. Việc tốt và kết quả gửi trong test chỉ được giả lập tại trình duyệt; không gửi bài giả tới Firebase.

Kiểm tra giả lập không thay thế zoom toàn hệ điều hành, bàn phím ảo, iPhone/Android thật hoặc request qua proxy Vercel production.

## Kiểm tra nguồn và liên kết

Lệnh `npm run audit:links` quét URL HTTPS khai báo trong `data/`, bỏ trùng fragment và thử trang 2 cho URL mẫu ảnh sách. Chỉ kiểm tra khả năng truy cập HTTP; không đánh đồng HTTP 200 với nội dung chính xác hoặc quyền sử dụng hợp lệ.

Kết quả: **32 URL, 31 truy cập được, 0 HTTP 404/410, 1 cần kiểm tra lại**. Nguồn `btllang.mod.gov.vn/.../11315-tu-tuong-ho-chi-minh-ve-doan-ket.html?showall=1` timeout trong đợt kiểm tra; kết quả tra cứu vẫn ghi nhận bài. Giữ nguyên nguồn, không thay bằng liên kết khác chưa đối chiếu. Báo cáo chi tiết: `.qa/source-links.json`.

Đã đối chiếu các điểm chính sau với nguồn ngoài:

| Nội dung | Nguồn đối chiếu | Kết quả |
|---|---|---|
| Ngày sinh 19/5/1890, tên Nguyễn Sinh Cung; ngày mất 2/9/1969 | [Tiểu sử – Sở KH&CN TP.HCM](https://khcn.tphcm.gov.vn/khong-gian-van-hoa-ho-chi-minh/gioi-thieu/tieu-su) | Phù hợp với các mốc trang chủ |
| Ra đi từ Bến Nhà Rồng ngày 5/6/1911 | [Báo Điện tử Chính phủ](https://baochinhphu.vn/ky-niem-100-nam-ngay-bac-ho-ra-di-tim-duong-cuu-nuoc-5-6-1911-5-6-2011-nguoi-tao-nen-buoc-ngoat-lich-su-cho-cach-mang-viet-nam-10281639.htm) | Phù hợp |
| Đọc Tuyên ngôn Độc lập tại Ba Đình ngày 2/9/1945 | [Tiểu sử – Sở KH&CN TP.HCM](https://khcn.tphcm.gov.vn/khong-gian-van-hoa-ho-chi-minh/gioi-thieu/tieu-su) | Phù hợp |
| Các giá trị cần, kiệm, liêm, chính, chí công vô tư | [Hệ thống Tư liệu – Văn kiện Đảng](https://tulieuvankien.dangcongsan.vn/c-mac-angghen-lenin-ho-chi-minh/ho-chi-minh/nghien-cuu-hoc-tap-tu-tuong/tu-tuong-ho-chi-minh-ve-dao-duc-cach-mang-can-kiem-liem-chinh-chi-cong-vo-tu-1785) | Chủ đề nguồn phù hợp phần biên soạn; gợi ý hành động hiện nay vẫn là đề xuất của website |

Chưa xác minh độc lập toàn bộ từng đoạn tư liệu, metadata ảnh, ngày hoạt động địa phương và quyền ảnh. Các bài địa phương biên soạn sẵn cần chủ nội dung xác nhận hồ sơ trước nghiệm thu chính thức.

## Proxy Vercel

[Tài liệu Vercel về request headers](https://vercel.com/docs/headers/request-headers#x-vercel-forwarded-for) mô tả `x-vercel-forwarded-for` là thông tin IP từ proxy của nền tảng. Code chỉ tự chọn header này khi có cấu hình máy chủ `VERCEL=1`, không dựa vào header nhận từ client để quyết định nền tảng. Môi trường khác giữ cơ chế proxy tin cậy cấu hình rõ ràng.

Test kiểm tra hai IP khác nhau tạo khóa khác nhau trên Vercel; sửa `x-forwarded-for` không thay khóa khi `x-vercel-forwarded-for` giữ nguyên; ngoài Vercel không tự tin header này. Chưa có kiểm chứng request qua deployment Vercel thật. Giới hạn bộ nhớ vẫn không chia sẻ giữa các instance; quota chung trong Firestore được giữ nguyên.

## Trước khi phát hành

- Vercel chưa được cài/kết nối trong phiên này; chưa có URL Preview mới. Cần cài và kết nối Vercel để tiếp tục kiểm tra trên tài khoản của chủ website.
- Kiểm tra iPhone/Android thật, QR, bàn phím ảo, zoom và mạng di động.
- Xác nhận đầu mối quản trị, thời hạn lưu bài, quyền ảnh và nguồn nội dung; tạo backup cloud và thử khôi phục.
- Thử admin/upload/email thật trên môi trường phù hợp, rồi triển khai API và Rules tương thích sau nghiệm thu.
- Chưa có giám sát cảnh báo tự động hoặc dữ liệu Core Web Vitals thực tế.

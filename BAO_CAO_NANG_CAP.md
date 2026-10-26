# Đối chiếu kế hoạch nâng cấp KP19

Ngày: 26/10/2026. Commit nền: `60087eb60a62bb88cd41486365a54a3d20fe47f6`.

Thay đổi nằm trong working tree, giữ các chỉnh sửa Firebase từ lượt trước. Không thay đổi dữ liệu, Rules cloud hoặc triển khai production. Không xác nhận website đạt 9,5/10 khi chưa có nghiệm thu thực tế.

| Hạng mục kế hoạch | Kết quả trong source / phần cần nghiệm thu |
|---|---|
| 01. Source, build, môi trường | Giữ Next.js/Firebase/ImageKit. Bổ sung URL HTTPS mặc định đúng website, vẫn cho ghi đè qua env. |
| 02. Firebase, API, quyền | Giữ kiểm tra admin, validation, origin, giới hạn request và commit nguyên tử. Bổ sung consent bắt buộc khi admin xác minh/công bố trực tiếp qua Rules và lọc consent ở API đọc công khai. Rules được thử trên emulator, chưa triển khai cloud. |
| 03. Gửi–duyệt–công bố | API quyết định cấu hình gửi, chỉ báo lưu khi commit được xác nhận; giữ nội dung khi lỗi. Luồng admin thật cần preview và tài khoản phù hợp. |
| 04. Lịch sử, nguồn | Giữ nguồn dẫn và tư liệu hiện có; chưa kiểm chứng độc lập mọi trích dẫn hoặc liên kết ngoài. |
| 05. Placeholder, thống kê | Bỏ số liệu dự phòng chưa có hồ sơ; chỉ hiển thị số liệu công bố có nguồn, kỳ và người/ngày xác minh. Bỏ dòng chờ xác minh lặp trong phần giá trị. |
| 06. Responsive | Bổ sung xuống dòng nội dung dài, nhãn form 16px, vùng thẻ hoa và vị trí cuộn form. Browser smoke có 320/375/390/430/768/1024/1440px; điện thoại thật cần nghiệm thu. |
| 07. Thiết kế | Giữ nhận diện triển lãm, dùng màu và nút hiện có cho trạng thái trống và thử lại. |
| 08. Trang chủ | Hai hành động: bắt đầu tham quan và khám phá hoạt động KP19. Giữ hành trình nội dung hiện tại. |
| 09. Vườn hoa | Bỏ 8 ô trống, có một lời mời gửi bài, đưa focus vào form; mỗi bài có tiêu đề/ngày/tên, mở chi tiết và đóng bằng Escape. |
| 10. Lời nhắn, thử thách | Thử tải lại khi lỗi, aria-busy, giữ bài khi lỗi. Quiz hiện có giải thích, làm lại và gợi ý hành động. |
| 11. Thư viện | Giữ tìm/lọc và trình đọc theo nhu cầu; bổ sung nút thử tải lại media khi phát hiện lỗi. PDF/iframe cần kiểm tra nhà cung cấp trên thiết bị thật. |
| 12. Hiệu năng | Sửa đường dẫn ảnh có dấu, bỏ intro che trang, stream hero trước dữ liệu Firebase, tải GSAP khi cần. Lighthouse local bản cuối: mobile Performance 95, desktop 100; xem KIEM_DINH_BAN_CHOT.md để biết điều kiện đo và giới hạn. |
| 13. SEO | Bổ sung trang giới thiệu/quyền riêng tư vào sitemap, canonical trang chủ, metadataBase dùng URL website; chặn index Vercel Preview. |
| 14. Tiếp cận | Giữ focus, bàn phím, reduced motion; thêm focus CTA trạng thái trống, thông báo lỗi và trạng thái gửi. Cần kiểm tra screen reader/tương phản toàn trang. |
| 15. Quản trị | Giữ transaction chống ghi đè, lọc/tìm/CSV, duyệt có consent và bằng chứng. Không thay schema. |
| 16. Bản sắc KP19 | Giữ ảnh/bài do chủ website cung cấp; không thêm số liệu/ảnh/thành tích giả. Ngày, quyền ảnh và danh tính người duyệt cần chủ nội dung xác nhận. |
| 17. Kiểm thử | Unit/API, lint, typecheck, production build, audit tệp, emulator Rules và browser smoke; xem kết quả ghi bên dưới. |
| 18. Bàn giao | Thêm VAN_HANH.md: quản trị, backup, rollback, kiểm tra định kỳ và demo. Chưa phát hành Vercel Preview. |

## Điều kiện còn lại trước phát hành

- Xác nhận đầu mối vận hành, người duyệt, quyền riêng tư và thời hạn lưu bài; cập nhật trang quyền riêng tư theo thông tin thật.
- Kiểm chứng nguồn lịch sử, ngày hoạt động, quyền ảnh và sự đồng ý; không coi bài biên soạn hiện có là hồ sơ xác minh đầy đủ.
- Tạo backup cloud và thử khôi phục ở dự án thử nghiệm. Phiên sửa source không thay thế bước này.
- Kiểm tra Vercel Preview, iPhone/Android thật, QR, bàn phím ảo, zoom, mạng di động, admin/upload/email thật.
- Đo lại trên Vercel Preview và theo dõi LCP/INP/CLS thực tế; Lighthouse local đã có nhưng chưa thay thế được dữ liệu p75.

## Kết quả kiểm tra

- `npm test`: 36/36 đạt, gồm gửi khi client thiếu cấu hình, lỗi cấu hình/mạng, dữ liệu API sai, lọc consent, khóa IP theo nền tảng, log an toàn, rate limit và upload.
- `npm run test:rules`: 12/12 đạt trên Firestore/Storage Emulator `demo-kp19`; gồm ghi trực tiếp của admin thiếu/từ chối consent, khách/ordinary bị chặn, chỉ đọc bài công bố và xung đột duyệt.
- `npm run lint`, `npm run typecheck`, `npm run build`: đạt. Bản build cuối không còn cảnh báo thiếu metadataBase.
- Browser: 10 trang × 7 độ rộng đều không tràn ngang, một H1 và có đích skip link. Kiểm tra tương tác đạt sau khi sửa lỗi focus CTA: trạng thái trống/chi tiết Vườn hoa bằng fixture trình duyệt, menu, Escape, quiz, tải PNG/HTML/QR, sáu định dạng thư viện, GSAP/reduced motion, OG, 404, API danh mục sai; không có runtime exception.
- `npm run firebase:check`: đọc công khai thành công cả 9 collection trên project cấu hình; hiện chưa có bản ghi công bố. Chỉ đọc, không gửi bài thật.
- `npm run audit:files`: hoàn tất; còn ActivityTimeline và file thống kê dự phòng không được dùng; các loading component giống nhau và một ảnh chưa có tham chiếu tĩnh. Giữ lại để tránh xóa tài nguyên ngoài phạm vi.
- Log emulator mới ở `.qa/rules-upgrade.log`; ảnh browser ở `.qa/`. Thư mục này được Git bỏ qua.
- Sau sửa đường dẫn có dấu, kiểm tra HTTP cho 10 thẻ ảnh câu chuyện đã thành công qua bộ tối ưu; canonical trang chủ trỏ đúng origin production.
- Đợt bản chốt: browser smoke đã chạy lại đầy đủ 10 trang × 7 kích thước, thêm 120 việc tốt mô phỏng, mất mạng/giữ draft/gửi lại, ảnh lỗi/thử lại và menu ngang. Không có runtime exception; xem `.qa/browser-final-plan.log`.

Các bằng chứng local không thay thế nghiệm thu Vercel Preview hoặc thiết bị thật. Chưa có commit/preview mới để truy vết theo đầy đủ Definition of Done.

Bổ sung theo văn bản “Bản chốt nâng cấp”: [KIEM_DINH_BAN_CHOT.md](KIEM_DINH_BAN_CHOT.md) ghi các đợt thay đổi, số đo Lighthouse trước/sau, kiểm tra URL nguồn và các điều kiện còn lại trước phát hành.

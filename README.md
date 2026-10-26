# Không gian Văn hóa Hồ Chí Minh - KP19

Website Next.js App Router, React, TypeScript; Firebase Auth/Firestore cho quản trị và nội dung, ImageKit cho upload ảnh, GSAP cho chuyển động.

## Cài và chạy

Yêu cầu Node.js 22 và npm. Dùng `npm ci` để cài đúng phiên bản trong `package-lock.json`. Sao chép [.env.example](.env.example) thành `.env.local` và điền cấu hình của bạn.

```sh
npm run dev
```

Production:

```sh
npm run build
npm run start
```

Dev dùng `.next-dev`, production dùng `.next`. Cần môi trường hỗ trợ Next.js server; không dùng static export vì có API và dữ liệu Firestore đọc khi tải trang. Trước khi triển khai, đặt `NEXT_PUBLIC_SITE_URL` thành tên miền HTTPS thật cho sitemap, canonical và ảnh chia sẻ.

## Kiểm tra

```sh
npm run typecheck
npm run lint
npm test
npm run test:rules
npm run audit:files
npm audit
```

`test:rules` cần Java 21, dùng project emulator `demo-kp19`, không tạo bài giả trong database thật. Nếu có runtime trong `.qa/java`, script dùng runtime đó. `audit:files` chỉ kiểm tra tham chiếu tĩnh; đường dẫn ghép động và module được giữ lại cần xem xét thủ công.

`node tests/browser-smoke.mjs` kiểm tra production tại `http://localhost:3100` qua Edge/Chrome headless mở cổng remote debugging 9223: 10 trang công khai ở 7 kích thước, popup, menu, quiz, tải PNG/HTML, QR, thư viện, ảnh tên tiếng Việt, ảnh chia sẻ và 404. File QA nằm trong `.qa/`, không commit.

## Nội dung và quản trị

- Trang công khai: `/`, `/ve-bac`, `/hoc-va-lam-theo-bac`, `/khu-pho-19`, `/cau-chuyen`, `/vuon-hoa-viec-tot`, `/thu-vien`, `/tuong-tac`, `/gioi-thieu`, `/quyen-rieng-tu`.
- Quản trị tại `/admin`. Firebase Auth phải bật Email/Password; tài khoản cần claim `admin: true`. Có khôi phục mật khẩu, tùy chọn phiên, đổi mật khẩu, biên tập, xem trước, tìm kiếm không dấu/ID, CSV, phân trang và duyệt hàng loạt.
- Bài cộng đồng lưu `pending`; chỉ `published` đọc công khai. Nháp và Đã xác minh vẫn riêng tư. Duyệt cần nguồn và thông tin xác minh; giao diện yêu cầu consent cho việc tốt/lời nhắn. Chuyển về Nháp để ẩn bài.
- Lưu và duyệt hàng loạt dùng transaction kiểm tra xung đột, tránh ghi đè thay đổi từ người khác.
- Kho ảnh: `/admin/hinh-anh`. Upload xác thực ID token và quyền admin, lưu ảnh ImageKit; bấm Lưu để lưu URL Firestore. Máy chủ cần project Firebase đúng, truy cập được dịch vụ xác thực Firebase và khóa ImageKit server. Không lưu service-account hoặc khóa bí mật vào Git.
- Ảnh trang chủ: `bento-1` = Câu chuyện nổi bật; `bento-2` = An sinh; `bento-3` = Môi trường; `bento-4` = Người tốt, việc tốt. Ưu tiên ảnh CMS xuất bản, dùng ảnh dự phòng nếu thiếu hoặc tải lỗi.
- 8 bài biên soạn ở `data/community-stories.ts` được ghép cùng các bài CMS xuất bản. Ảnh dự phòng là tư liệu chủ website cung cấp; cần đối chiếu ngày, quyền ảnh và sự đồng ý trước phát hành. Số liệu chỉ hiển thị từ CMS ở trạng thái công bố, có kỳ, nguồn và thông tin xác minh; không dùng số liệu dự phòng trong `data/community-stats.ts`.
- Tên website dùng chung tại `data/site.ts`. Kế hoạch tải HTML dùng offline, hỗ trợ in/lưu PDF; huy hiệu PNG 800×1000.

## Firebase và chống spam

Project nằm trong `.firebaserc`; Rules trong `firebase/`. Kiểm tra project trước khi dùng seed, setup hoặc deploy. `npm run firebase:check` chỉ đọc. Script setup/seed có thể thay đổi cloud, chỉ chạy khi chủ động chọn đúng dự án và mục đích.

API giới hạn 1 lần/phút, tối đa 5 lần/15 phút theo khóa IP trong bộ nhớ. Trên Vercel (`VERCEL=1`), mặc định dùng `x-vercel-forwarded-for`; header này không được tin ở môi trường khác chỉ vì client tự gửi nó. Chỉ ghi đè `CONTRIBUTION_IP_HEADER` khi hosting ghi đè và xác thực header đó. Ngoài Vercel nếu chưa cấu hình thì khách chưa nhận diện chia sẻ cùng hạn mức. Lớp IP không chia sẻ giữa các instance; Firestore duy trì hạn mức chung 1 bài/5 giây bằng commit nguyên tử của bài và `submission_limits/public`.

Cập nhật API và Rules tương ứng trong cùng đợt: API cũ không tạo bộ đếm, Rules cũ không hỗ trợ bộ đếm. Push Git không tự cập nhật Rules cloud. Lệnh: `npm run firebase:deploy:firestore`.

## Trước khi đưa lên Git

- Commit nguồn, tài nguyên cần thiết, cấu hình, `package.json`, **`package-lock.json`** và `.env.example`.
- Không commit `.env.local`, `.qa/`, `node_modules/`, `.next/`, `.next-dev/`, log, file khóa riêng hoặc thông tin đăng nhập. `.gitignore` đã có quy tắc; file từng được Git theo dõi không tự được bỏ theo dõi.
- `.firebaserc` và Firebase Web config là định danh/cấu hình dự án; bảo vệ dữ liệu bằng Rules và giữ kín khóa server.
- Nếu từng commit bí mật, cần đổi/thu hồi khóa và xử lý lịch sử; chỉ sửa `.gitignore` chưa đủ.
- Push Git không đồng nghĩa đã triển khai website hoặc cấu hình môi trường hosting.

Giới hạn xác minh: email khôi phục, đổi mật khẩu, upload ImageKit và toàn bộ giao diện quản trị bằng tài khoản thật cần kiểm tra trên môi trường triển khai phù hợp. Giữ các bài kỹ thuật `[KIỂM THỬ]` riêng tư, không xuất bản như việc tốt thật.

Hướng dẫn vận hành, sao lưu, khôi phục và các điều kiện phát hành: [VAN_HANH.md](VAN_HANH.md). Tiến độ đối chiếu kế hoạch: [BAO_CAO_NANG_CAP.md](BAO_CAO_NANG_CAP.md).

`npm run audit:links` kiểm tra URL khai báo trong `data/` bằng request chỉ đọc, lưu `.qa/source-links.json`. HTTP 404/410 là liên kết hỏng; timeout hoặc bị chặn cần kiểm tra thủ công, không tự kết luận nội dung đã bị xóa. Báo cáo Lighthouse và đối chiếu nguồn: [KIEM_DINH_BAN_CHOT.md](KIEM_DINH_BAN_CHOT.md).

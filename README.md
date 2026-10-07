Đóng vai trò là Full-Stack Tech Lead. Tôi bắt đầu dự án "Pet Passport" với cấu trúc monorepo gồm:
- client/ (React.js + Vite + Tailwind CSS)
- server/ (Node.js + Express.js + MongoDB Mongoose)

Hãy cung cấp:
1. Toàn bộ câu lệnh Terminal (Bash/CMD) để:
   - Tạo thư mục gốc `pet-passport`.
   - Khởi tạo `server/` và cài đặt: express, mongoose, jsonwebtoken, bcryptjs, qrcode, cors, dotenv, nodemon.
   - Khởi tạo `client/` bằng Vite và cài đặt: tailwindcss, postcss, autoprefixer, lucide-react, axios, react-router-dom, html2canvas, jspdf.
2. Cây thư mục hoàn chỉnh (Folder Structure) tách bạch giữa Client và Server.
3. Nội dung file cấu hình:
   - `server/.env.example` và `server/.env`
   - `server/src/config/db.js` (kết nối MongoDB có try/catch)
   - `client/tailwind.config.js` mở rộng màu chủ đạo: Pastel Sky Blue (#66CCFF) và Trắng (#FFFFFF).
Tôi đang ở thư mục `server/`. Hãy viết mã nguồn JavaScript hoàn chỉnh cho các Mongoose Schema theo đúng cấu trúc sau:

1. Hệ thống chỉ có đúng 2 Role: ADMIN và PET_OWNER.
2. Tạo các model riêng biệt trong `server/src/models/`:
   - `Role.js`: name ("ADMIN", "PET_OWNER"), description.
   - `Account.js`: username, email, passwordHash, roleId (ref: Role), isBanned (Boolean), banReason.
   - `Profile.js`: accountId (ref: Account), fullName, phone, socialLink, address.
   - `Pet.js`: petCode (chuỗi duy nhất có index), ownerId (ref: Account), name, species, breed, sex, birthday, weight, avatarUrl, bio.
   - `EmergencyAlert.js`: petId (ref: Pet), allergies (array string), medications (array string), specialNote.
   - `QRCode.js`: petId (ref: Pet), qrUrl, qrImageUrl (Base64 hoặc link ảnh), scanCount (Number), isPublicContact (Boolean).
3. Viết 1 file script `server/src/utils/seedRoles.js` để tự động khởi tạo 2 role mặc định vào database khi khởi động server lần đầu nếu chưa có.
Tôi đang ở thư mục `server/src/middlewares/`. Hãy viết các middleware bảo mật cho Express.js:

1. `authMiddleware.js`:
   - Bắt và giải mã Bearer Token từ header Authorization.
   - Kiểm tra tài khoản trong database, nếu `isBanned === true` thì trả về lỗi 403 Forbidden kèm lý do khóa tài khoản.
   - Gắn payload người dùng vào `req.user`.
2. `rbacMiddleware.js`:
   - Hàm `authorizeRoles(...allowedRoles)` nhận vào danh sách role hợp lệ, chặn truy cập nếu role của người dùng không thỏa mãn.
3. `ownerCheckMiddleware.js`:
   - Kiểm tra quyền sở hữu thú cưng trước khi Update/Delete: Nếu là PET_OWNER thì `ownerId` của Pet phải khớp với `req.user._id`. Nếu là ADMIN thì tự động cho phép bỏ qua bước kiểm tra này.
Tôi đang ở thư mục `server/`. Hãy viết đầy đủ mã nguồn cho Controllers và Routes:

1. `authController.js` & `authRoutes.js`:
   - Đăng ký: Băm mật khẩu bằng `bcryptjs`, gán role mặc định PET_OWNER, tạo profile rỗng.
   - Đăng nhập: Kiểm tra password, sinh JWT token thời hạn 7 ngày.
2. `petController.js` & `petRoutes.js`:
   - Tạo thú cưng mới: Tự sinh mã định danh duy nhất (ví dụ format: `VN-PAW-XXXXXX`), dùng thư viện `qrcode` sinh ảnh Base64 trỏ về URL `/p/:petCode`, lưu đồng thời vào collection `pets`, `emergency_alerts` và `qr_codes`.
   - API CRUD (Get list, Get by ID, Update, Delete) có áp dụng middleware kiểm tra quyền sở hữu.
3. `publicController.js` & `publicRoutes.js`:
   - GET `/api/public/pets/:petCode`: Dành riêng cho người quét camera, không yêu cầu đăng nhập (No-auth). Tự động tăng `scanCount` thêm 1, chỉ trả về: thông tin cơ bản của Pet, cảnh báo khẩn cấp, tên và SĐT của chủ nuôi.
4. `adminController.js` & `adminRoutes.js`:
   - GET `/api/admin/accounts`: Xem danh sách tất cả tài khoản.
   - PATCH `/api/admin/accounts/:id/ban`: Khóa hoặc mở khóa tài khoản (toggle ban/unban kèm lý do).
5. `server/server.js` và `server/src/app.js`: Ghép nối tất cả các route lại với nhau kèm CORS và Error Handler middleware.
Tôi chuyển sang thư mục `client/`. Giao diện cần thiết kế hiện đại, sạch sẽ, bo góc mềm mại, tông màu chủ đạo Xanh Pastel (#66CCFF) và Trắng (#FFFFFF), sử dụng icon từ `lucide-react`.

Hãy viết các component React sau:
1. `PassportCard.jsx`:
   - Thiết kế hiệu ứng thẻ 3D lật 2 mặt (Flip card) khi click nút "Lật thẻ".
   - Mặt trước (Identification): Ảnh đại diện thú cưng, Pet Code, huy hiệu số, loài, giống, giới tính, ngày sinh, cân nặng, dải mã vạch MRZ ở đáy thẻ chuẩn hộ chiếu quốc tế.
   - Mặt sau (Medical & Rescue): Khung cảnh báo dị ứng màu cam/đỏ dịu, thuốc men điều trị, ghi chú tính cách, mã QR cứu hộ độc bản ở giữa và thông tin microchip.
2. Tích hợp tính năng xuất file:
   - Thêm nút "Tải hộ chiếu" sử dụng thư viện `html2canvas` và `jspdf` để render và tải cả 2 mặt thẻ về máy dưới dạng ảnh `.PNG` hoặc file `.PDF` sắc nét.
Tôi đang ở thư mục `client/src/pages/`. Hãy viết 2 trang giao diện hoàn chỉnh:

1. `PublicRescuePage.jsx` (Đường dẫn: `/p/:petCode`):
   - Màn hình hiển thị khi người qua đường dùng điện thoại quét mã QR trên vòng cổ thú cưng đi lạc.
   - Tối ưu 100% cho màn hình di động: Ảnh thú cưng, tên, thông báo trạng thái "Bé đang bị lạc".
   - Khung cảnh báo dị ứng y tế khẩn cấp được đẩy lên vị trí dễ thấy nhất.
   - Hai nút bấm lớn ở đáy màn hình: "Gọi điện ngay cho chủ" (thẻ `<a href="tel:...">`) và "Nhắn tin Zalo/SMS".
2. `AdminDashboardPage.jsx` (Đường dẫn: `/admin`):
   - Bảng danh sách tài khoản (Avatar, Username, Email, Role, Số lượng pet đã tạo, Trạng thái Active/Banned).
   - Nút thao tác Khóa (Ban) kèm hộp thoại nhập lý do, và nút Mở khóa (Unban).
   - Bộ lọc tìm kiếm tài khoản theo email hoặc username.
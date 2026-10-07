# 📘 HƯỚNG DẪN CÀI ĐẶT VÀ KHỞI CHẠY DỰ ÁN PET PASSPORT

Dự án **Pet Passport** được xây dựng theo cấu trúc **Monorepo** gồm 2 phần độc lập:
- **`client/`**: Ứng dụng Frontend (React.js + Vite + Tailwind CSS + Lucide Icons).
- **`server/`**: Ứng dụng Backend API (Node.js + Express.js + MongoDB Mongoose).

---

## 1. Yêu cầu môi trường (Prerequisites)

Trước khi chạy, hãy đảm bảo máy tính đã cài đặt:
- **Node.js**: Phiên bản `18.x` trở lên (Khuyến nghị `20.x` hoặc `22.x`). Kiểm tra bằng lệnh: `node -v`
- **npm**: Phiên bản `9.x` trở lên. Kiểm tra bằng lệnh: `npm -v`
- **MongoDB**: MongoDB Server chạy cục bộ (`mongodb://127.0.0.1:27017`) hoặc chuỗi kết nối MongoDB Atlas Cloud.

---

## 2. Cấu trúc thư mục dự án

```text
pet-passport/
├── package.json              # Quản lý scripts chạy monorepo
├── HUONG_DAN_CHAY.md         # File tài liệu hướng dẫn này
├── README.md                 # Yêu cầu & đặc tả dự án
│
├── server/                   # Backend Express & MongoDB
│   ├── .env.example          # Mẫu biến môi trường server
│   ├── .env                  # Biến môi trường thực tế (đã tạo)
│   ├── package.json          # Quản lý thư viện backend
│   └── src/
│       ├── config/           # Cấu hình kết nối DB (db.js)
│       ├── controllers/      # (.gitkeep) Chứa controller xử lý nghiệp vụ
│       ├── middlewares/      # (.gitkeep) Chứa middleware xác thực, phân quyền
│       ├── models/           # (.gitkeep) Chứa các Mongoose Schema
│       ├── routes/           # (.gitkeep) Chứa router endpoints
│       ├── services/         # (.gitkeep) Chứa business service logic
│       └── utils/            # (.gitkeep) Chứa helper & seed script
│
└── client/                   # Frontend React & Vite
    ├── .env.example          # Mẫu biến môi trường client
    ├── .env                  # Biến môi trường thực tế (đã tạo)
    ├── index.html            # File HTML gốc
    ├── package.json          # Quản lý thư viện frontend
    ├── postcss.config.js     # Cấu hình PostCSS cho Tailwind
    ├── tailwind.config.js    # Cấu hình mở rộng màu chủ đạo pastelSky & pastelWhite
    ├── vite.config.js        # Cấu hình Vite
    └── src/
        ├── assets/images/    # (.gitkeep) Chứa ảnh tĩnh
        ├── components/
        │   ├── common/       # (.gitkeep) UI components tái sử dụng
        │   ├── layout/       # (.gitkeep) Header, Footer, Navbar...
        │   └── passport/     # (.gitkeep) Thẻ hộ chiếu Flip Card
        ├── context/          # (.gitkeep) Quản lý state toàn cục
        ├── hooks/            # (.gitkeep) Custom hooks
        ├── pages/            # (.gitkeep) Màn hình giao diện
        ├── routes/           # (.gitkeep) Cấu hình định tuyến React Router
        ├── services/         # (.gitkeep) Gọi API Backend
        └── utils/            # (.gitkeep) Helper functions & PDF export
```

---

## 3. Cài đặt Dependencies

> *Lưu ý: Dependencies đã được cài đặt sẵn trong workspace. Nếu cần cài đặt lại từ đầu, chạy các lệnh sau:*

### Cách 1: Cài đặt từ thư mục gốc
```bash
npm run install:all
```

### Cách 2: Cài đặt riêng cho từng phía
```bash
# Cài đặt cho Server
cd server
npm install

# Cài đặt cho Client
cd ../client
npm install
```

---

## 4. Cấu hình biến môi trường (`.env`)

### 4.1. Server (`server/.env`)
File này đã được khởi tạo sẵn với nội dung:
```ini
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/pet_passport_db
JWT_SECRET=pet_passport_jwt_secret_key_2026_super_secure
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```
*(Nếu sử dụng MongoDB Atlas, thay thế `MONGO_URI` bằng chuỗi kết nối từ Atlas)*.

### 4.2. Client (`client/.env`)
File này đã được khởi tạo sẵn với nội dung:
```ini
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 5. Hướng dẫn khởi chạy ứng dụng

### 🔹 Cách 1: Chạy từ thư mục gốc (Khuyên dùng)
Mở 2 cửa sổ Terminal độc lập tại thư mục gốc:

- **Terminal 1 (Chạy Backend Server):**
  ```bash
  npm run server
  ```
  *Server chạy tại: `http://localhost:5000`*

- **Terminal 2 (Chạy Frontend Client):**
  ```bash
  npm run client
  ```
  *Client chạy tại: `http://localhost:5173`*

---

### 🔹 Cách 2: Chạy trực tiếp trong từng thư mục

- **Khởi động Server:**
  ```bash
  cd server
  npm run dev
  ```

- **Khởi động Client:**
  ```bash
  cd client
  npm run dev
  ```

---

## 6. Danh sách các thư viện đã tích hợp

| Phía | Thư viện chính | Mục đích sử dụng |
| :--- | :--- | :--- |
| **Server** | `express` | Web framework xây dựng RESTful API |
| | `mongoose` | ODM thao tác với cơ sở dữ liệu MongoDB |
| | `jsonwebtoken` | Xác thực người dùng bằng JWT Token |
| | `bcryptjs` | Mã hóa và băm mật khẩu bảo mật |
| | `qrcode` | Sinh mã QR code cho từng hộ chiếu thú cưng |
| | `cors` | Cấp phép chia sẻ tài nguyên cross-origin cho Client |
| | `dotenv` | Nạp biến môi trường từ file `.env` |
| | `nodemon` (dev) | Tự động reload server khi có thay đổi code |
| **Client** | `vite` + `react` | Bộ công cụ phát triển UI tốc độ cao |
| | `tailwindcss` | Utility-first CSS framework (kèm theme màu `#66CCFF` & `#FFFFFF`) |
| | `lucide-react` | Bộ icon SVG hiện đại, mượt mà |
| | `axios` | HTTP Client gọi API về phía backend |
| | `react-router-dom` | Định tuyến trang (SPA Routing) |
| | `html2canvas` & `jspdf` | Chụp và xuất thẻ hộ chiếu thành ảnh PNG hoặc file PDF |

---

## 7. Các bước triển khai tiếp theo (Roadmap)

1. **Bước 1 (Đã hoàn thành):** Khởi tạo khung monorepo, cài đặt dependencies, tạo file cấu hình `.env`, `db.js`, `tailwind.config.js` và các thư mục kèm `.gitkeep`.
2. **Bước 2 (Tiếp theo):** Viết Mongoose Models (`Role.js`, `Account.js`, `Profile.js`, `Pet.js`, `EmergencyAlert.js`, `QRCode.js`) và script `seedRoles.js`.
3. **Bước 3:** Viết bảo mật Middlewares (`authMiddleware.js`, `rbacMiddleware.js`, `ownerCheckMiddleware.js`).
4. **Bước 4:** Viết Controllers & Routes (Auth, Pet, Public, Admin) và hoàn thiện `server.js` / `app.js`.
5. **Bước 5:** Xây dựng giao diện Client (`PassportCard.jsx` hiệu ứng 3D flip + xuất PDF, `PublicRescuePage.jsx`, `AdminDashboardPage.jsx`).

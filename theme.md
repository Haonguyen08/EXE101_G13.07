# 🎨 HỆ THỐNG MÀU SẮC (THEME COLOR PALETTE) - PET PASSPORT

Tài liệu này lưu trữ toàn bộ mã màu chuẩn được thiết kế cho hệ thống **Pet Passport**, tuân thủ phong cách hiện đại, bo góc mềm mại, tạo cảm giác thân thiện, y tế sạch sẽ và đáng tin cậy.

---

## 1. Màu sắc chủ đạo (Primary & Secondary)

| Tên màu | Mã HEX | Tailwind Class | Minh họa & Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| **Pastel Sky Blue (Chủ đạo)** | `#66CCFF` | `bg-[#66CCFF]`, `text-[#66CCFF]`, `bg-pastelSky` | Màu nhận diện thương hiệu, nút bấm chính, viền thẻ hộ chiếu, header |
| **Pastel Sky Light** | `#E6F7FF` | `bg-[#E6F7FF]`, `bg-pastelSky-light` | Màu nền phụ, badge trạng thái, hover background |
| **Pastel Sky Dark** | `#3399CC` | `bg-[#3399CC]`, `text-[#3399CC]` | Màu text tiêu đề chính, viền active, hover button |
| **Pure White (Trắng chuẩn)** | `#FFFFFF` | `bg-white`, `text-white` | Màu nền thẻ card, nền input, chữ trên nền xanh |
| **Soft Background (Nền dịu)** | `#F8FAFC` | `bg-slate-50` | Nền toàn trang, giúp các thẻ nổi khối 3D rõ nét |

---

## 2. Bảng phân rã sắc độ Pastel Sky (`pastelSky`)

```css
/* Tailwind Configuration Tokens */
--pastel-sky-50:  #F0F9FF; /* Nền khối tin nhắn, card info */
--pastel-sky-100: #E0F2FE; /* Nền chip / badge */
--pastel-sky-200: #BAE6FD; /* Border mềm */
--pastel-sky-300: #7DD3FC; /* Border hover */
--pastel-sky-400: #66CCFF; /* MÀU GỐC CHỦ ĐẠO (Brand Primary) */
--pastel-sky-500: #0EA5E9; /* Icon highlight, link */
--pastel-sky-600: #0284C7; /* Nút hover state */
--pastel-sky-700: #0369A1; /* Chữ nhấn mạnh */
```

---

## 3. Màu cảnh báo y tế & Cứu hộ (Medical & Emergency Alert)

Dành cho khung cảnh báo dị ứng, thú cưng thất lạc, bệnh án đặc biệt:

| Trạng thái | Mã HEX | Tailwind Class | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| **Emergency Red/Coral** | `#EF4444` | `bg-red-500`, `text-red-500` | Banner "Bé đang bị lạc", nút gọi khẩn cấp |
| **Soft Alert Orange** | `#FF8A65` | `bg-[#FF8A65]`, `text-[#FF8A65]` | Khung cảnh báo dị ứng (mềm mại, không gây hoảng loạn) |
| **Alert Box Bg** | `#FFF5F2` | `bg-[#FFF5F2]` | Nền khung cảnh báo y tế mặt sau thẻ |
| **Alert Border** | `#FED7AA` | `border-orange-200` | Viền khung cảnh báo |
| **Medication Pill** | `#FEF3C7` | `bg-amber-100`, `text-amber-800` | Badge danh sách thuốc men điều trị |

---

## 4. Màu trạng thái hệ thống (Status Badges)

| Trạng thái | Mã Nền (Bg) | Mã Chữ (Text) | Mô tả |
| :--- | :--- | :--- | :--- |
| **Active / Verified** | `#ECFDF5` (`bg-emerald-50`) | `#059669` (`text-emerald-600`) | Tài khoản hoạt động, Đã cấy Microchip |
| **Banned / Locked** | `#FEF2F2` (`bg-rose-50`) | `#DC2626` (`text-rose-600`) | Tài khoản bị khóa |
| **Admin Role** | `#EEF2FF` (`bg-indigo-50`) | `#4F46E5` (`text-indigo-600`) | Huy hiệu Quản trị viên |
| **Pet Owner Role** | `#F0FDF4` (`bg-green-50`) | `#16A34A` (`text-green-600`) | Huy hiệu Chủ nuôi |

---

## 5. Màu trung tính & Chữ (Neutral & Typography)

| Tên màu | Mã HEX | Tailwind Class | Sử dụng |
| :--- | :--- | :--- | :--- |
| **Heading / Primary Text** | `#0F172A` | `text-slate-900` | Tiêu đề lớn, thông tin quan trọng |
| **Body Text** | `#334155` | `text-slate-700` | Nội dung mô tả, nhãn trường |
| **Muted Text** | `#64748B` | `text-slate-500` | Phụ đề, ngày sinh, petCode nhỏ |
| **Border / Divider** | `#E2E8F0` | `border-slate-200` | Đường kẻ phân tách, viền bảng |
| **Card Shadow** | `rgba(102, 204, 255, 0.25)` | `shadow-sky` | Đổ bóng mềm tạo chiều sâu |

---

## 6. Hướng dẫn áp dụng trong mã nguồn

### Khi dùng Tailwind Utility Class:
- Nút bấm chính: `bg-[#66CCFF] hover:bg-[#52B8EB] text-white shadow-md rounded-2xl`
- Khung thẻ hộ chiếu: `bg-white border-2 border-[#66CCFF]/30 rounded-3xl shadow-xl`
- Khung y tế khẩn cấp: `bg-[#FFF5F2] border border-[#FF8A65]/40 text-[#C2410C] rounded-2xl`

### Trong CSS / Custom Styling:
```css
:root {
  --color-primary: #66CCFF;
  --color-primary-dark: #3399CC;
  --color-primary-light: #E6F7FF;
  --color-white: #FFFFFF;
  --color-alert: #FF8A65;
  --color-alert-bg: #FFF5F2;
}
```

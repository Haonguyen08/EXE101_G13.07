import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PassportCard from '../components/passport/PassportCard';
import {
  PawPrint,
  ShieldCheck,
  QrCode,
  LayoutDashboard,
  ExternalLink,
  Sparkles,
  Heart,
  FileCheck,
  CheckCircle2,
  Share2
} from 'lucide-react';

const Home = () => {
  const [activePet, setActivePet] = useState({
    petCode: 'VN-PAW-882341',
    name: 'Bơ (Avocado)',
    species: 'Chó (Canine)',
    breed: 'Corgi Pembroke Welsh',
    sex: 'Đực (Male)',
    birthday: '15/06/2022',
    weight: '11.5 kg',
    avatarUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    bio: 'Bé rất thân thiện, thích ăn táo và thích được vuốt cằm. Rất quấn người.',
    microchip: '981098108427192',
    issueDate: '01/01/2024',
    expiryDate: 'Vô thời hạn',
    owner: {
      fullName: 'Nguyễn Văn Hào',
      phone: '0901234567',
      address: 'Quận 7, TP. Hồ Chí Minh'
    },
    emergency: {
      allergies: ['Dị ứng tôm/cua (Hải sản)', 'Dị ứng kháng sinh Penicillin'],
      medications: ['Bổ sung men tiêu hóa định kỳ', 'Thuốc xịt dị ứng ngoài da'],
      specialNote: 'Bé sợ sấm sét và tiếng pháo hoa lớn. Nhát nước.'
    },
    qrCode: {
      qrUrl: `${window.location.origin}/p/VN-PAW-882341`,
      qrImageUrl: ''
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-[#E6F7FF]/30 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#66CCFF] flex items-center justify-center text-white shadow-md shadow-[#66CCFF]/30">
              <PawPrint className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">
                PET PASSPORT
              </h1>
              <span className="text-[10px] font-bold text-[#0284C7] tracking-wider uppercase">
                HỆ THỐNG HỘ CHIẾU ĐIỆN TỬ
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/p/VN-PAW-882341"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Trang Quét Cứu Hộ (/p)</span>
            </Link>

            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-2xs transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#66CCFF]" />
              <span>Quản Trị (/admin)</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Intro */}
      <section className="pt-8 pb-4 text-center px-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F7FF] text-[#0284C7] text-xs font-bold border border-[#66CCFF]/30 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#66CCFF]" />
          <span>Công Nghệ Hộ Chiếu Số Thú Cưng Đạt Chuẩn ICAO</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Hộ Chiếu Điện Tử & Mã QR Cứu Hộ Độc Bản
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Bảo vệ thú cưng toàn diện với thẻ hộ chiếu 3D, mã định danh duy nhất, hồ sơ y tế khẩn cấp và công cụ xuất file PDF in ấn chuẩn quốc tế.
        </p>
      </section>

      {/* Main Interactive Demo Component: PassportCard */}
      <section className="flex-1 flex flex-col items-center justify-center py-4">
        <PassportCard pet={activePet} />
      </section>

      {/* Quick Navigation Cards */}
      <section className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-[#66CCFF] transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                Trang Cứu Hộ Di Động (Rescue Page)
              </h3>
              <p className="text-xs text-slate-500">Đường dẫn: <code>/p/:petCode</code></p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Màn hình hiển thị tức thì khi người qua đường dùng camera điện thoại quét mã QR trên vòng cổ thú cưng đi lạc. Đẩy cảnh báo dị ứng lên đầu và có nút gọi điện/nhắn tin khẩn cấp.
          </p>
          <Link
            to="/p/VN-PAW-882341"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:underline"
          >
            <span>Trải nghiệm màn hình cứu hộ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-[#66CCFF] transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Bảng Quản Trị Hệ Thống (Admin Console)
              </h3>
              <p className="text-xs text-slate-500">Đường dẫn: <code>/admin</code></p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Giao diện dành riêng cho Admin quản lý danh sách tài khoản, tìm kiếm theo email/username, kiểm soát số lượng thú cưng và thực hiện Khóa (Ban) / Mở khóa (Unban).
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
          >
            <span>Trải nghiệm trang quản trị</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/80 text-center text-xs text-slate-400 bg-white">
        © 2026 Pet Passport System. Được thiết kế với tông màu Pastel Sky Blue (#66CCFF) và Trắng (#FFFFFF).
      </footer>
    </div>
  );
};

export default Home;

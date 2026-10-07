import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Sparkles,
  Share2,
  PawPrint,
  CheckCircle2,
  Pill,
  Calendar,
  Scale,
  Dna,
  Cpu,
  Heart,
  QrCode,
  AlertCircle,
  FileBadge
} from 'lucide-react';

/**
 * PublicPetProfilePage (/p/:petCode)
 * - Màn hình hiển thị đầy đủ thông tin của chú thú cưng khi quét mã QR
 * - Tối ưu giao diện mobile-first, hiện đại, tông màu Pastel Sky Blue (#66CCFF) và Trắng (#FFFFFF)
 * - Hiển thị: Định danh, Microchip, Y tế & Dị ứng, Thông tin chủ nuôi
 */
const PublicRescuePage = () => {
  const { petCode } = useParams();
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Dữ liệu mẫu chuẩn khi backend chưa chạy
  const mockPetData = {
    petCode: petCode || 'VN-PAW-882341',
    name: 'Bơ (Avocado)',
    species: 'Chó (Canine)',
    breed: 'Corgi Pembroke Welsh',
    sex: 'Đực (Male)',
    birthday: '15/06/2022',
    weight: '11.5 kg',
    avatarUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    bio: 'Bé Bơ rất thân thiện, quấn người và thích được gãi cằm. Thức ăn yêu thích là cà rốt luộc và ức gà.',
    microchip: '981098108427192',
    issueDate: '01/01/2024',
    owner: {
      fullName: 'Nguyễn Văn Hào',
      phone: '0901234567',
      address: 'Khu dân cư Him Lam, P. Tân Hưng, Quận 7, TP.HCM'
    },
    emergency: {
      allergies: ['Dị ứng tôm/cua (Hải sản)', 'Dị ứng kháng sinh Penicillin'],
      medications: ['Bổ sung men tiêu hóa định kỳ theo hướng dẫn bác sĩ thú y'],
      specialNote: 'Bé sợ tiếng sấm sét và pháo hoa. Thích được vuốt ve nhẹ nhàng.'
    }
  };

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        setLoading(true);
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${apiBaseUrl}/public/pets/${petCode}`);
        if (res.data && res.data.data) {
          setPetData(res.data.data);
        } else {
          setPetData(mockPetData);
        }
      } catch (err) {
        console.warn('Backend API chưa kết nối, nạp dữ liệu thú cưng mẫu:', err.message);
        setPetData(mockPetData);
      } finally {
        setLoading(false);
      }
    };

    fetchPetData();
  }, [petCode]);

  const pet = petData || mockPetData;
  const ownerPhone = pet.owner?.phone || '0901234567';
  const cleanPhone = ownerPhone.replace(/[^0-9+]/g, '');
  const zaloLink = `https://zalo.me/${cleanPhone}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Hồ chiếu số của bé ${pet.name}`,
        text: `Xem thông tin hộ chiếu điện tử của bé ${pet.name} (Mã: ${pet.petCode})`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#66CCFF] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-slate-500 font-medium text-sm">Đang tải thông tin thú cưng...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F7FF]/50 via-slate-50 to-slate-100 flex flex-col items-center justify-between pb-28">
      {/* Top App Header */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 py-3.5 px-4 sticky top-0 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#66CCFF] flex items-center justify-center text-white shadow-md shadow-[#66CCFF]/30">
              <PawPrint className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm tracking-tight block leading-none">
                PET PASSPORT
              </span>
              <span className="text-[10px] font-semibold text-[#0284C7] tracking-wider uppercase">
                HỒ SƠ ĐIỆN TỬ
              </span>
            </div>
          </Link>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-[#E6F7FF] text-slate-600 hover:text-[#0284C7] text-xs font-semibold border border-slate-200 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#66CCFF]" />
            <span>{copiedLink ? 'Đã sao chép' : 'Chia sẻ'}</span>
          </button>
        </div>
      </header>

      {/* Main Content (Mobile-First Container) */}
      <main className="w-full max-w-md px-4 pt-4 pb-6 space-y-4">
        {/* 1. Hero Identity Card */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 relative overflow-hidden">
          {/* Subtle brand background glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-radial from-[#66CCFF]/20 to-transparent rounded-full -mr-12 -mt-12 pointer-events-none" />

          <div className="flex flex-col items-center text-center">
            {/* Avatar with Verified Ring */}
            <div className="relative">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-white shadow-xl ring-4 ring-[#66CCFF]/40 bg-slate-100">
                <img
                  src={pet.avatarUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 right-1 bg-white p-1 rounded-full shadow-md border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-[#0284C7]" />
              </div>
            </div>

            {/* Pet Name & Badge */}
            <div className="mt-3.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E6F7FF] text-[#0284C7] text-xs font-bold border border-[#66CCFF]/30 mb-1">
                <FileBadge className="w-3.5 h-3.5 text-[#66CCFF]" />
                <span>Hộ Chiếu Đã Xác Thực</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {pet.name}
              </h1>
              <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                Mã số: <span className="text-[#0284C7]">{pet.petCode}</span>
              </p>
            </div>

            {/* Bio / Giới thiệu */}
            {pet.bio && (
              <p className="mt-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed italic text-left w-full">
                "{pet.bio}"
              </p>
            )}
          </div>
        </div>

        {/* 2. Bảng thông số sinh học & định danh */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Dna className="w-4 h-4 text-[#66CCFF]" />
            <span>Thông Tin Định Danh</span>
          </h2>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Loài</span>
              <span className="font-bold text-slate-800 text-sm">{pet.species}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Giới tính</span>
              <span className="font-bold text-slate-800 text-sm">{pet.sex}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Giống loài</span>
              <span className="font-bold text-slate-800 text-sm truncate block">{pet.breed}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Cân nặng</span>
              <span className="font-bold text-slate-800 text-sm">{pet.weight}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Ngày sinh</span>
              <span className="font-bold text-slate-800 text-sm">{pet.birthday}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Số Microchip</span>
              <span className="font-mono font-bold text-slate-800 text-xs truncate block">
                {pet.microchip || 'Chưa gắn'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Hồ sơ y tế, dị ứng & lưu ý */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-[#FF8A65]" />
            <span>Hồ Sơ Y Tế & Chăm Sóc</span>
          </h2>

          {/* Dị ứng */}
          <div className="bg-[#FFF5F2] border border-[#FF8A65]/40 rounded-2xl p-3">
            <span className="text-xs font-bold text-[#C2410C] block mb-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-[#FF8A65]" />
              Tiền sử dị ứng cần lưu ý:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {pet.emergency?.allergies?.length > 0 ? (
                pet.emergency.allergies.map((allergy, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold bg-white text-orange-800 px-2.5 py-1 rounded-xl border border-orange-200/80 shadow-2xs"
                  >
                    ⚠️ {allergy}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">Không có tiền sử dị ứng</span>
              )}
            </div>
          </div>

          {/* Thuốc men */}
          {pet.emergency?.medications?.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3 text-xs">
              <span className="font-bold text-amber-900 block mb-1">💊 Thuốc đang sử dụng:</span>
              <p className="text-slate-700">{pet.emergency.medications.join(', ')}</p>
            </div>
          )}

          {/* Ghi chú tính cách */}
          {pet.emergency?.specialNote && (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-xs text-slate-600">
              <span className="font-bold text-slate-800">📌 Lưu ý chăm sóc: </span>
              {pet.emergency.specialNote}
            </div>
          )}
        </div>

        {/* 4. Thông tin liên hệ chủ nuôi */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            <span>Chủ Nuôi Đăng Ký</span>
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-medium">Họ tên:</span>
              <span className="font-bold text-slate-800">{pet.owner?.fullName || 'Chưa cập nhật'}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-medium">Số điện thoại:</span>
              <span className="font-mono font-bold text-sm text-[#0284C7]">{ownerPhone}</span>
            </div>

            <div className="flex items-start justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Địa chỉ:
              </span>
              <span className="font-semibold text-slate-800 text-right max-w-[200px]">
                {pet.owner?.address || 'Việt Nam'}
              </span>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400 pt-1">
          Hệ thống Hộ Chiếu Điện Tử Thú Cưng Pet Passport • Bản quyền 2026
        </p>
      </main>

      {/* ========================================================================= */}
      {/* THANH LIÊN HỆ CHỦ NUÔI CỐ ĐỊNH Ở ĐÁY MÀN HÌNH                             */}
      {/* ========================================================================= */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-4 py-3 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          {/* Nút Gọi điện thoại */}
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#66CCFF] hover:bg-[#3399CC] active:scale-95 text-white font-bold text-sm shadow-md shadow-[#66CCFF]/30 transition-all duration-200"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Gọi Cho Chủ</span>
          </a>

          {/* Nút Nhắn tin Zalo */}
          <a
            href={zaloLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-sm border border-slate-200 transition-all duration-200"
          >
            <MessageSquare className="w-4 h-4 text-[#0284C7]" />
            <span>Nhắn Tin Zalo</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default PublicRescuePage;

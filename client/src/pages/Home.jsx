import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PassportCard from '../components/passport/PassportCard';
import { useAuth } from '../context/AuthContext';
import { petService } from '../services/petService';
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
  Share2,
  LogIn,
  LogOut,
  User,
  Database,
  Loader2
} from 'lucide-react';

const Home = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dbPets, setDbPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [selectedPetIndex, setSelectedPetIndex] = useState(0);

  // Tải danh sách thú cưng thực tế từ MongoDB
  useEffect(() => {
    const fetchPetsFromDB = async () => {
      try {
        setLoadingPets(true);
        const res = await petService.getAllPublicPets();
        if (res.success && res.data) {
          setDbPets(res.data);
        }
      } catch (err) {
        console.error('Lỗi nạp thú cưng từ MongoDB:', err);
      } finally {
        setLoadingPets(false);
      }
    };
    fetchPetsFromDB();
  }, []);

  // Danh sách thú cưng hiển thị: ưu tiên thú cưng của user nếu đã đăng nhập, ngược lại hiển thị thú cưng từ DB
  const displayPets = (isAuthenticated && user?.pets && user.pets.length > 0)
    ? user.pets.map((p) => ({
        _id: p._id,
        petCode: p.petCode,
        name: p.name,
        species: p.species || 'Chó / Mèo',
        breed: p.breed || 'Chưa cập nhật',
        sex: p.sex || 'Đực',
        birthday: p.birthday ? new Date(p.birthday).toLocaleDateString('vi-VN') : 'Chưa cập nhật',
        weight: `${p.weight || 10} kg`,
        avatarUrl: p.avatarUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
        bio: p.bio || 'Thú cưng được cấp hộ chiếu chính chủ.',
        microchip: '98109810' + (p.petCode.replace(/\D/g, '') || '001'),
        issueDate: '07/10/2026',
        expiryDate: 'Vô thời hạn',
        owner: {
          fullName: user.profile?.fullName || user.username,
          phone: user.profile?.phone || '0901234567',
          address: user.profile?.address || 'Việt Nam'
        },
        emergency: {
          allergies: ['Dị ứng thức ăn lạ'],
          medications: ['Bổ sung men tiêu hóa'],
          specialNote: p.bio || 'Bé rất thân thiện và quấn người.'
        },
        qrCode: {
          qrUrl: `${window.location.origin}/p/${p.petCode}`,
          qrImageUrl: ''
        }
      }))
    : dbPets;

  const activePet = displayPets[selectedPetIndex] || displayPets[0] || null;

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
              to={activePet?.petCode ? `/p/${activePet.petCode}` : '/p/VN-MOCHI-001'}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#0284C7] bg-[#E6F7FF] hover:bg-[#BAE6FD]/40 rounded-xl border border-[#66CCFF]/40 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-[#66CCFF]" />
              <span className="hidden sm:inline">Hồ Sơ QR</span>
            </Link>

            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 shadow-2xs transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">Quản Trị (/admin)</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors"
                  title="Xem thông tin tài khoản và danh sách thú cưng"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#66CCFF] text-white flex items-center justify-center text-[11px] font-black">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.username}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl shadow-md transition-all active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng Nhập</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Intro */}
      <section className="pt-8 pb-4 text-center px-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F7FF] text-[#0284C7] text-xs font-bold border border-[#66CCFF]/30 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#66CCFF]" />
          <span>Hệ Thống Định Danh & Hộ Chiếu Số Thú Cưng</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Hộ Chiếu Điện Tử & Mã QR Thông Tin Thú Cưng
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Quản lý thông tin thú cưng toàn diện với thẻ hộ chiếu 3D, mã QR quét xem hồ sơ y tế, tiêm chủng và liên hệ chủ nuôi nhanh chóng.
        </p>
      </section>

      {/* Main Interactive Demo Component: PassportCard */}
      <section className="flex-1 flex flex-col items-center justify-center py-4">
        {loadingPets ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 text-[#0284C7] animate-spin" />
            <span className="text-xs font-bold">Đang tải dữ liệu thú cưng từ MongoDB...</span>
          </div>
        ) : displayPets.length > 0 ? (
          <>
            <div className="flex items-center justify-center gap-2 mb-4 px-4 flex-wrap animate-in fade-in">
              <div className="flex items-center gap-1.5 mr-1 text-slate-500 text-xs font-bold">
                <Database className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>
                  {isAuthenticated && user?.pets?.length > 0 ? 'Thú cưng của bạn:' : 'Thú cưng từ Database:'}
                </span>
              </div>
              {displayPets.map((pet, idx) => (
                <button
                  key={pet._id || pet.petCode}
                  onClick={() => setSelectedPetIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedPetIndex === idx
                      ? 'bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/20 scale-105'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 shadow-2xs'
                  }`}
                >
                  <span>🐾</span>
                  <span>{pet.name}</span>
                  <span className="text-[10px] opacity-80">({pet.petCode})</span>
                </button>
              ))}
            </div>

            {activePet && <PassportCard pet={activePet} />}
          </>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            <PawPrint className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            Không có dữ liệu thú cưng trong cơ sở dữ liệu.
          </div>
        )}
      </section>

      {/* Quick Navigation Cards */}
      <section className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-[#66CCFF] transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#E6F7FF] text-[#0284C7] flex items-center justify-center">
              <QrCode className="w-5 h-5 text-[#66CCFF]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                Trang Thông Tin Khi Quét QR
              </h3>
              <p className="text-xs text-slate-500">Đường dẫn: <code>/p/:petCode</code></p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Màn hình hiển thị đầy đủ hồ sơ của chú thú cưng khi ai đó quét mã QR trên vòng cổ hoặc thẻ hộ chiếu: thông tin định danh, sổ tiêm phòng, lưu ý dị ứng và thông tin liên hệ chủ nuôi.
          </p>
          <Link
            to={activePet ? `/p/${activePet.petCode}` : '/p/VN-MOCHI-001'}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:underline"
          >
            <span>Trải nghiệm trang thông tin QR bé {activePet?.name || ''}</span>
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

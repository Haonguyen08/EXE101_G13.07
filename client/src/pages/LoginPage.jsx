import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import {
  PawPrint,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Heart,
  ChevronRight,
  Phone,
  MapPin,
  ExternalLink,
  Database
} from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, login, register, logout, isAuthenticated } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Danh sách tài khoản động lấy trực tiếp từ MongoDB
  const [dbAccounts, setDbAccounts] = useState([]);
  const [fetchingAccounts, setFetchingAccounts] = useState(true);

  useEffect(() => {
    const fetchRealAccounts = async () => {
      try {
        setFetchingAccounts(true);
        const res = await authService.getPetAccounts();
        if (res.success && res.data) {
          setDbAccounts(res.data);
        }
      } catch (err) {
        console.error('Lỗi nạp tài khoản từ MongoDB:', err);
      } finally {
        setFetchingAccounts(false);
      }
    };
    fetchRealAccounts();
  }, []);

  // Form states
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    username: '',
    email: '',
    fullName: '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage('');
  };

  // Quick Login Helper
  const handleQuickLogin = async (username, password = '123456') => {
    setFormData((prev) => ({
      ...prev,
      identifier: username,
      password: password,
    }));
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await login(username, password);
      setSuccessMessage(`Đăng nhập thành công với tài khoản ${username}! Đang chuyển hướng...`);
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (err) {
      setErrorMessage(err.message || 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isRegisterMode) {
        if (!formData.username || !formData.email || !formData.password) {
          throw new Error('Vui lòng điền đầy đủ tên đăng nhập, email và mật khẩu.');
        }
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
        });
        setSuccessMessage('Đăng ký tài khoản thành công!');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        if (!formData.identifier || !formData.password) {
          throw new Error('Vui lòng nhập tên đăng nhập hoặc email và mật khẩu.');
        }
        await login(formData.identifier, formData.password);
        setSuccessMessage('Đăng nhập thành công!');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Nếu người dùng đã đăng nhập, hiển thị thông tin Profile & Pet của họ
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-[#E6F7FF]/40 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header Back */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0284C7] bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <PawPrint className="w-4 h-4 text-[#66CCFF]" />
              <span>Quay lại Trang Chủ</span>
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl border border-rose-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng Xuất</span>
            </button>
          </div>

          {/* User Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 mb-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#66CCFF] to-[#0284C7] flex items-center justify-center text-white text-2xl font-black shadow-md shadow-[#66CCFF]/30">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">{user.username}</h2>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-[#E6F7FF] text-[#0284C7] border border-[#66CCFF]/40'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                </div>
              </div>

              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 hover:bg-purple-100 transition-colors"
                >
                  Quản Trị Hệ Thống
                </Link>
              )}
            </div>

            {/* Profile Detail */}
            {user.profile && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Họ tên: <b>{user.profile.fullName || 'Chưa cập nhật'}</b></span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>SĐT: <b>{user.profile.phone || 'Chưa cập nhật'}</b></span>
                </div>
                {user.profile.address && (
                  <div className="sm:col-span-2 flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Địa chỉ: <b>{user.profile.address}</b></span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User's Pets Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E6F7FF] text-[#0284C7] flex items-center justify-center">
                  <PawPrint className="w-4 h-4 text-[#66CCFF]" />
                </div>
                <h3 className="font-black text-slate-900 text-base">
                  Thú Cưng Của Bạn ({user.pets?.length || 0})
                </h3>
              </div>
            </div>

            {user.pets && user.pets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.pets.map((pet) => (
                  <div
                    key={pet._id || pet.petCode}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-[#66CCFF] bg-gradient-to-br from-white to-[#F0F9FF] shadow-xs transition-all flex items-center gap-3.5 group"
                  >
                    <img
                      src={
                        pet.avatarUrl ||
                        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={pet.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-slate-900 text-sm truncate">
                          {pet.name}
                        </h4>
                        <span className="text-[10px] font-bold text-[#0284C7] bg-[#E6F7FF] px-2 py-0.5 rounded-full">
                          {pet.species}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{pet.breed}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Link
                          to={`/p/${pet.petCode}`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284C7] hover:underline"
                        >
                          <span>Xem QR cứu hộ</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                <PawPrint className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                Tài khoản này chưa tạo thú cưng nào.
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center">
              <Link
                to="/"
                className="px-6 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Xem Thẻ Hộ Chiếu 3D</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-[#E6F7FF]/40 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-3 group">
          <div className="w-12 h-12 rounded-2xl bg-[#66CCFF] flex items-center justify-center text-white shadow-lg shadow-[#66CCFF]/30 group-hover:scale-105 transition-transform">
            <PawPrint className="w-7 h-7" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
              PET PASSPORT
            </h1>
            <span className="text-[10px] font-bold text-[#0284C7] tracking-wider uppercase">
              HỆ THỐNG HỘ CHIẾU ĐIỆN TỬ
            </span>
          </div>
        </Link>

        <h2 className="text-center text-2xl font-black text-slate-900 tracking-tight">
          {isRegisterMode ? 'Đăng Ký Tài Khoản Chủ Nuôi' : 'Đăng Nhập Hệ Thống'}
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          {isRegisterMode
            ? 'Tạo tài khoản để bắt đầu cấp hộ chiếu điện tử cho thú cưng của bạn'
            : 'Đăng nhập để xem và quản lý sổ hộ chiếu thú cưng của bạn'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-2xl rounded-3xl border border-slate-200/80">
          {/* Tabs */}
          <div className="flex rounded-2xl bg-slate-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                !isRegisterMode
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                isRegisterMode
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Đăng Ký Mới
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isRegisterMode ? (
              // Login Fields
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tên đăng nhập hoặc Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="haonguyen hoặc email..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#66CCFF] transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Mật khẩu
                    </label>
                    <span className="text-[11px] text-[#0284C7] hover:underline cursor-pointer">
                      Mặc định: 123456
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#66CCFF] transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Register Fields
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="myusername"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mật khẩu *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0901234567"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Địa chỉ liên hệ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Quận/Huyện, Tỉnh/TP..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] font-bold text-white text-sm shadow-md shadow-[#0284C7]/20 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegisterMode ? 'Đăng Ký Ngay' : 'Đăng Nhập'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Fast Login Section loaded dynamically from MongoDB database */}
          {!isRegisterMode && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Database className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span className="text-[11px] font-black uppercase tracking-wider">
                    Tài khoản từ MongoDB ({dbAccounts.length})
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Dữ liệu trực tiếp từ Database
                </span>
              </div>

              {fetchingAccounts ? (
                <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
                  <div className="w-5 h-5 border-2 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
                  <span>Đang tải danh sách tài khoản từ MongoDB...</span>
                </div>
              ) : dbAccounts.length > 0 ? (
                <div className="space-y-2">
                  {dbAccounts.map((acc) => {
                    const isAdmin = acc.role === 'ADMIN';
                    const petNames = acc.pets && acc.pets.length > 0
                      ? acc.pets.map((p) => p.name).join(' & ')
                      : null;

                    return (
                      <div
                        key={acc._id || acc.username}
                        className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                          isAdmin
                            ? 'bg-purple-50/60 border-purple-200'
                            : 'bg-[#E6F7FF]/50 border-[#66CCFF]/40'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl text-white flex items-center justify-center font-black text-xs shadow-2xs shrink-0 ${
                              isAdmin ? 'bg-purple-600' : 'bg-[#0284C7]'
                            }`}
                          >
                            {isAdmin ? <ShieldCheck className="w-4 h-4" /> : '🐾'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-black text-slate-900">
                                {acc.username}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  isAdmin
                                    ? 'text-purple-700 bg-white border-purple-200'
                                    : 'text-[#0284C7] bg-white border-[#66CCFF]/30'
                                }`}
                              >
                                {petNames ? `Chủ bé ${petNames}` : acc.role}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {acc.email} • Pass: <b>123456</b>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                identifier: acc.username,
                                password: '123456',
                              }));
                            }}
                            className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-colors shadow-2xs"
                            title="Điền vào ô nhập liệu ở trên"
                          >
                            Điền Form
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickLogin(acc.username, '123456')}
                            disabled={loading}
                            className={`px-3 py-1 rounded-xl text-[10px] font-black text-white shadow-2xs transition-all active:scale-95 ${
                              isAdmin
                                ? 'bg-purple-600 hover:bg-purple-700'
                                : 'bg-[#0284C7] hover:bg-[#0369A1]'
                            }`}
                          >
                            Đăng Nhập
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-400">
                  Không tìm thấy tài khoản nào trong database.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

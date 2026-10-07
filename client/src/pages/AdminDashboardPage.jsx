import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  PawPrint,
  Filter,
  RefreshCw,
  MoreVertical,
  X,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * AdminDashboardPage (/admin)
 * - Quản lý tài khoản người dùng và phân quyền hệ thống
 * - Bảng danh sách tài khoản kèm bộ lọc tìm kiếm
 * - Modal nhập lý do khóa tài khoản (Ban) và Mở khóa (Unban)
 */
const AdminDashboardPage = () => {
  // Mock accounts data for instant demo / fallback
  const initialAccounts = [
    {
      _id: 'acc_01',
      username: 'admin_sys',
      email: 'admin@petpassport.vn',
      role: 'ADMIN',
      petCount: 0,
      isBanned: false,
      banReason: '',
      createdAt: '2025-01-10',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      profile: { fullName: 'Trần Quản Trị', phone: '0988776655' }
    },
    {
      _id: 'acc_02',
      username: 'haonguyen_dev',
      email: 'hao.nguyen@gmail.com',
      role: 'PET_OWNER',
      petCount: 3,
      isBanned: false,
      banReason: '',
      createdAt: '2025-02-14',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      profile: { fullName: 'Nguyễn Văn Hào', phone: '0901234567' }
    },
    {
      _id: 'acc_03',
      username: 'lananh_corgi',
      email: 'lananh.corgi@petlover.com',
      role: 'PET_OWNER',
      petCount: 2,
      isBanned: false,
      banReason: '',
      createdAt: '2025-02-28',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      profile: { fullName: 'Hoàng Lan Anh', phone: '0912345678' }
    },
    {
      _id: 'acc_04',
      username: 'spam_account_99',
      email: 'spammer999@fake.net',
      role: 'PET_OWNER',
      petCount: 0,
      isBanned: true,
      banReason: 'Vi phạm điều khoản: Đăng tải nội dung quảng cáo rác và spam thông tin cứu hộ.',
      createdAt: '2025-03-01',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      profile: { fullName: 'Spam User', phone: '0933333333' }
    },
    {
      _id: 'acc_05',
      username: 'minhtri_vet',
      email: 'tri.bacsithuy@petcare.org',
      role: 'PET_OWNER',
      petCount: 5,
      isBanned: false,
      banReason: '',
      createdAt: '2025-03-12',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      profile: { fullName: 'Bác sĩ Minh Trí', phone: '0977889900' }
    }
  ];

  const [accounts, setAccounts] = useState(initialAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  // Ban Dialog Modal state
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [banReasonInput, setBanReasonInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch accounts from API
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiBaseUrl}/admin/accounts`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data && res.data.data) {
        setAccounts(res.data.data);
      }
    } catch (err) {
      console.warn('Backend API chưa bật hoặc chưa đăng nhập Admin. Hiển thị dữ liệu quản trị giả lập:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchSearch =
        acc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (acc.profile?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole = roleFilter === 'ALL' || acc.role === roleFilter;
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && !acc.isBanned) ||
        (statusFilter === 'BANNED' && acc.isBanned);

      return matchSearch && matchRole && matchStatus;
    });
  }, [accounts, searchTerm, roleFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = accounts.length;
    const active = accounts.filter((a) => !a.isBanned).length;
    const banned = accounts.filter((a) => a.isBanned).length;
    const totalPets = accounts.reduce((sum, a) => sum + (a.petCount || 0), 0);
    return { total, active, banned, totalPets };
  }, [accounts]);

  // Handle open Ban Modal
  const handleOpenBanModal = (acc) => {
    setSelectedAccount(acc);
    setBanReasonInput(acc.banReason || '');
    setBanModalOpen(true);
  };

  // Submit Ban / Unban
  const handleConfirmBanToggle = async () => {
    if (!selectedAccount) return;
    setIsSubmitting(true);

    const willBeBanned = !selectedAccount.isBanned;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      await axios.patch(
        `${apiBaseUrl}/admin/accounts/${selectedAccount._id}/ban`,
        {
          isBanned: willBeBanned,
          banReason: willBeBanned ? banReasonInput.trim() || 'Vi phạm chính sách cộng đồng' : ''
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
    } catch (err) {
      console.warn('API PATCH /admin/accounts/:id/ban lỗi (sẽ áp dụng cập nhật cục bộ):', err.message);
    }

    // Update state locally
    setAccounts((prev) =>
      prev.map((acc) =>
        acc._id === selectedAccount._id
          ? {
              ...acc,
              isBanned: willBeBanned,
              banReason: willBeBanned ? banReasonInput.trim() || 'Vi phạm chính sách cộng đồng' : ''
            }
          : acc
      )
    );

    setIsSubmitting(false);
    setBanModalOpen(false);
    setSelectedAccount(null);
    setBanReasonInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#66CCFF] flex items-center justify-center text-white shadow-md shadow-[#66CCFF]/25">
                <PawPrint className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">
                  PET PASSPORT
                </h1>
                <span className="text-xs font-semibold text-[#0284C7] tracking-wider uppercase">
                  ADMIN CONSOLE
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-600 hover:text-[#0284C7] px-3 py-1.5 rounded-xl hover:bg-[#E6F7FF] transition-colors"
            >
              Về Trang Chủ
            </Link>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs ring-2 ring-indigo-200">
                AD
              </div>
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">Quản Trị Viên</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Page Title & Subtitle */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Quản Lý Tài Khoản Người Dùng
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Tra cứu tài khoản, kiểm soát quyền truy cập và xử lý khóa tài khoản vi phạm.
            </p>
          </div>

          <button
            onClick={fetchAccounts}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#66CCFF]' : ''}`} />
            <span>Làm mới danh sách</span>
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Tổng Tài Khoản</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.total}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#E6F7FF] text-[#0284C7] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Đang Hoạt Động</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{stats.active}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Tài Khoản Bị Khóa</p>
              <h3 className="text-2xl font-black text-rose-600 mt-1">{stats.banned}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Ban className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Tổng Pet Đã Tạo</p>
              <h3 className="text-2xl font-black text-[#0284C7] mt-1">{stats.totalPets}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#66CCFF] flex items-center justify-center">
              <PawPrint className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Input Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm tài khoản theo email, username, họ tên..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#66CCFF] focus:border-transparent transition-all placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2.5">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="ADMIN">ADMIN</option>
              <option value="PET_OWNER">PET_OWNER</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="BANNED">Đã bị khóa</option>
            </select>
          </div>
        </div>

        {/* Table of Accounts */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Tài khoản</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Vai trò</th>
                  <th className="py-3.5 px-4 text-center">Số Pet</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((account) => {
                    return (
                      <tr key={account._id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Avatar & Username */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={account.avatarUrl}
                              alt={account.username}
                              className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shadow-xs"
                            />
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{account.username}</span>
                                {account.role === 'ADMIN' && (
                                  <ShieldCheck className="w-4 h-4 text-indigo-600" title="Quản trị viên" />
                                )}
                              </div>
                              <span className="text-xs text-slate-400 block">
                                {account.profile?.fullName || 'Chưa cập nhật tên'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-4 px-4 text-slate-600 font-mono text-xs">
                          {account.email}
                        </td>

                        {/* Role Badge */}
                        <td className="py-4 px-4">
                          {account.role === 'ADMIN' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              ADMIN
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              PET_OWNER
                            </span>
                          )}
                        </td>

                        {/* Pet Count */}
                        <td className="py-4 px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#E6F7FF] text-[#0284C7]">
                            {account.petCount || 0} pet
                          </span>
                        </td>

                        {/* Status Active / Banned */}
                        <td className="py-4 px-4">
                          {account.isBanned ? (
                            <div className="group relative inline-block">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 cursor-help">
                                <Ban className="w-3.5 h-3.5 text-rose-600" />
                                <span>Bị Khóa</span>
                              </span>
                              {account.banReason && (
                                <div className="hidden group-hover:block absolute bottom-full left-0 mb-1 z-30 w-64 p-2 bg-slate-900 text-white text-xs rounded-xl shadow-xl">
                                  <b>Lý do khóa:</b> {account.banReason}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Hoạt động</span>
                            </span>
                          )}
                        </td>

                        {/* Actions: Ban / Unban Button */}
                        <td className="py-4 px-4 text-right">
                          {account.role === 'ADMIN' ? (
                            <span className="text-xs text-slate-400 italic">Hệ thống</span>
                          ) : account.isBanned ? (
                            <button
                              onClick={() => handleOpenBanModal(account)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all shadow-2xs active:scale-95"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Mở khóa (Unban)</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenBanModal(account)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 transition-all shadow-2xs active:scale-95"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Khóa (Ban)</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-slate-400">
                      Không tìm thấy tài khoản nào khớp với điều kiện tìm kiếm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL DIALOG NHẬP LÝ DO KHÓA / XÁC NHẬN MỞ KHÓA                          */}
      {/* ========================================================================= */}
      {banModalOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setBanModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  selectedAccount.isBanned
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-rose-100 text-rose-600'
                }`}
              >
                {selectedAccount.isBanned ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedAccount.isBanned
                    ? 'Xác nhận mở khóa tài khoản'
                    : 'Khóa tài khoản người dùng'}
                </h3>
                <p className="text-xs text-slate-500">
                  Tài khoản: <span className="font-bold text-slate-800">{selectedAccount.username}</span> ({selectedAccount.email})
                </p>
              </div>
            </div>

            {selectedAccount.isBanned ? (
              <p className="text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                Bạn có chắc chắn muốn <b>mở khóa</b> cho tài khoản này? Người dùng sẽ lấy lại toàn bộ quyền truy cập và quản lý hộ chiếu thú cưng.
              </p>
            ) : (
              <div className="space-y-3 mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Lý do khóa tài khoản <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="3"
                  value={banReasonInput}
                  onChange={(e) => setBanReasonInput(e.target.value)}
                  placeholder="Ví dụ: Đăng tải nội dung sai sự thật, spam hoặc vi phạm quy định..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all placeholder:text-slate-400"
                />
                <span className="text-[11px] text-slate-400 block">
                  Lý do này sẽ được hiển thị khi người dùng cố gắng đăng nhập.
                </span>
              </div>
            )}

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setBanModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmBanToggle}
                disabled={isSubmitting || (!selectedAccount.isBanned && !banReasonInput.trim())}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50 ${
                  selectedAccount.isBanned
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isSubmitting
                  ? 'Đang xử lý...'
                  : selectedAccount.isBanned
                  ? 'Xác nhận Mở Khóa'
                  : 'Xác nhận Khóa Tài Khoản'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;

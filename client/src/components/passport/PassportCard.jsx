import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  PawPrint,
  Download,
  PlusCircle,
  Upload,
  Calendar,
  Scale,
  User,
  Heart,
  AlertTriangle,
  Phone,
  QrCode,
  Sparkles,
  X,
  Check,
  Cat,
  Dog,
  ShieldCheck,
  FileText,
  Edit3,
  Trash2,
  ChevronRight,
  Plus,
  Layers
} from 'lucide-react';

// Dữ liệu thú cưng mặc định ban đầu
const DEFAULT_PETS = [
  {
    id: 'pet_01',
    name: 'Mochi',
    petCode: 'VN-MOCHI-001',
    species: 'Cat',
    breed: 'British Shorthair',
    sex: 'Female',
    birthday: '12 May 2024',
    weight: '3.8 kg',
    quote: 'Small cat,\nBig personality.',
    ownerName: 'Scarlett Nguyen',
    ownerPhone: '0901234567',
    avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    emergency: {
      allergy: 'Seafood',
      medication: 'None',
      specialNote: 'Shy but affectionate'
    }
  },
  {
    id: 'pet_02',
    name: 'Bơ (Avocado)',
    petCode: 'VN-AVOCADO-002',
    species: 'Dog',
    breed: 'Corgi Pembroke Welsh',
    sex: 'Male',
    birthday: '15 Jun 2023',
    weight: '11.5 kg',
    quote: 'Always smiling,\nLoves walking in rain.',
    ownerName: 'Scarlett Nguyen',
    ownerPhone: '0901234567',
    avatarUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    emergency: {
      allergy: 'Chicken bones',
      medication: 'Digestive enzyme',
      specialNote: 'Afraid of thunder & loud fireworks'
    }
  }
];

const PassportCard = () => {
  // Lấy danh sách thú cưng từ localStorage hoặc khởi tạo danh sách mặc định
  const [pets, setPets] = useState(() => {
    try {
      const saved = localStorage.getItem('pet_passport_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Lỗi đọc localStorage:', e);
    }
    return DEFAULT_PETS;
  });

  // ID của thú cưng đang được chọn để hiển thị hộ chiếu
  const [selectedPetId, setSelectedPetId] = useState(() => {
    return pets[0]?.id || '';
  });

  // Tự động lưu vào localStorage khi danh sách pets thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('pet_passport_list', JSON.stringify(pets));
    } catch (e) {
      console.warn('Lỗi lưu localStorage:', e);
    }
  }, [pets]);

  // Tìm thú cưng hiện tại đang được chọn
  const currentPet = pets.find((p) => p.id === selectedPetId) || pets[0] || null;

  // State Modal (Thêm / Sửa)
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    petCode: '',
    species: 'Cat',
    breed: '',
    sex: 'Female',
    birthday: '',
    weight: '',
    quote: '',
    ownerName: '',
    ownerPhone: '',
    allergy: 'None',
    medication: 'None',
    specialNote: 'Friendly',
    avatarUrl: ''
  });

  const [previewImage, setPreviewImage] = useState('');
  const fileInputRef = useRef(null);
  const passportBookletRef = useRef(null);

  // Mở modal Thêm thú cưng mới
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData({
      id: `pet_${Date.now()}`,
      name: '',
      petCode: '',
      species: 'Cat',
      breed: '',
      sex: 'Female',
      birthday: '01 Jan 2024',
      weight: '3.5 kg',
      quote: 'Small cutie,\nSweet companion.',
      ownerName: currentPet?.ownerName || 'Chủ nuôi',
      ownerPhone: currentPet?.ownerPhone || '0901234567',
      allergy: 'None',
      medication: 'None',
      specialNote: 'Friendly',
      avatarUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
    });
    setPreviewImage('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80');
    setIsModalOpen(true);
  };

  // Mở modal Chỉnh sửa thú cưng hiện tại
  const handleOpenEditModal = () => {
    if (!currentPet) return;
    setModalMode('edit');
    setFormData({
      id: currentPet.id,
      name: currentPet.name,
      petCode: currentPet.petCode,
      species: currentPet.species,
      breed: currentPet.breed,
      sex: currentPet.sex,
      birthday: currentPet.birthday,
      weight: currentPet.weight,
      quote: currentPet.quote,
      ownerName: currentPet.ownerName,
      ownerPhone: currentPet.ownerPhone,
      allergy: currentPet.emergency?.allergy || 'None',
      medication: currentPet.emergency?.medication || 'None',
      specialNote: currentPet.emergency?.specialNote || 'Friendly',
      avatarUrl: currentPet.avatarUrl
    });
    setPreviewImage(currentPet.avatarUrl);
    setIsModalOpen(true);
  };

  // Xử lý khi upload file ảnh từ máy tính
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Vui lòng chọn ảnh dung lượng dưới 5MB!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Lưu thông tin khi Submit form (Thêm hoặc Cập nhật)
  const handleSubmitPet = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên thú cưng!');
      return;
    }

    const cleanName = formData.name.trim();
    const formattedCode =
      formData.petCode.trim() ||
      `VN-${cleanName.toUpperCase().replace(/\s+/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    const petObject = {
      id: modalMode === 'edit' ? formData.id : `pet_${Date.now()}`,
      name: cleanName,
      petCode: formattedCode,
      species: formData.species || 'Cat',
      breed: formData.breed || 'Chưa rõ',
      sex: formData.sex || 'Female',
      birthday: formData.birthday || '01 Jan 2024',
      weight: formData.weight || '3.5 kg',
      quote: formData.quote || 'Small cutie,\nSweet companion.',
      ownerName: formData.ownerName || 'Chủ nuôi',
      ownerPhone: formData.ownerPhone || '0901234567',
      avatarUrl: previewImage || formData.avatarUrl,
      emergency: {
        allergy: formData.allergy || 'None',
        medication: formData.medication || 'None',
        specialNote: formData.specialNote || 'Friendly'
      }
    };

    if (modalMode === 'create') {
      setPets((prev) => [...prev, petObject]);
      setSelectedPetId(petObject.id);
    } else {
      setPets((prev) =>
        prev.map((item) => (item.id === petObject.id ? petObject : item))
      );
    }

    setIsModalOpen(false);
  };

  // Xóa thú cưng đang chọn
  const handleConfirmDelete = () => {
    if (!currentPet) return;
    const remaining = pets.filter((p) => p.id !== currentPet.id);
    setPets(remaining);
    if (remaining.length > 0) {
      setSelectedPetId(remaining[0].id);
    } else {
      setSelectedPetId('');
    }
    setIsDeleteModalOpen(false);
  };

  // Tạo URL cho QR code
  const qrTargetUrl = currentPet
    ? `${window.location.origin}/p/${currentPet.petCode}`
    : window.location.origin;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    qrTargetUrl
  )}&color=1e3a5f`;

  // Xuất file PDF / PNG
  const handleExport = async (type = 'pdf') => {
    if (!passportBookletRef.current || !currentPet) return;
    setIsExporting(true);

    try {
      const element = passportBookletRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0F2644',
      });

      if (type === 'pdf') {
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a5',
        });
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 10, 8, 190, 132);
        pdf.save(`PetPassport_${currentPet.petCode}.pdf`);
      } else {
        const link = document.createElement('a');
        link.download = `PetPassport_${currentPet.petCode}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (err) {
      console.error('Lỗi khi xuất hộ chiếu:', err);
      alert('Có lỗi khi xuất file. Vui lòng thử lại!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-2 sm:p-6 space-y-6">
      {/* ========================================================================= */}
      {/* THANH QUẢN LÝ NHIỀU PET (PET SELECTOR TABS)                               */}
      {/* ========================================================================= */}
      <div className="w-full bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0284C7]" />
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
              Danh Sách Thú Cưng Của Bạn
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E6F7FF] text-[#0284C7] font-bold">
              {pets.length} bé
            </span>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Thú Cưng Mới</span>
          </button>
        </div>

        {/* Danh sách các bé cuộn ngang */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {pets.map((p) => {
            const isSelected = p.id === selectedPetId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPetId(p.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl border transition-all shrink-0 text-left ${
                  isSelected
                    ? 'bg-[#E6F7FF] border-[#66CCFF] shadow-sm ring-2 ring-[#66CCFF]/30'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border border-white shadow-xs shrink-0">
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {p.species} • {p.petCode}
                  </div>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-[#0284C7] ml-1" />
                )}
              </button>
            );
          })}

          {/* Nút thêm nhanh ở cuối list */}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#66CCFF] hover:bg-[#E6F7FF]/50 text-slate-500 hover:text-[#0284C7] transition-all shrink-0 text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Bé Khác</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACTION TOOLBAR CHO BÉ ĐANG CHỌN (CHỈNH SỬA / XÓA / TẢI IN ẤN)              */}
      {/* ========================================================================= */}
      {currentPet && (
        <div className="flex flex-wrap items-center justify-between gap-3 w-full bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Đang xem:</span>
            <span className="font-black text-slate-900 text-sm sm:text-base">
              {currentPet.name}
            </span>
            <span className="text-xs font-mono font-bold text-[#0284C7] bg-[#E6F7FF] px-2 py-0.5 rounded-lg border border-[#66CCFF]/30">
              {currentPet.petCode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút Chỉnh Sửa */}
            <button
              onClick={handleOpenEditModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-[#E6F7FF] hover:text-[#0284C7] border border-slate-200 rounded-xl transition-all shadow-2xs active:scale-95"
              title="Chỉnh sửa thông tin bé này"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Chỉnh Sửa</span>
            </button>

            {/* Nút Xóa Hộ Chiếu */}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all shadow-2xs active:scale-95"
              title="Xóa hộ chiếu thú cưng này"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa Bé Này</span>
            </button>

            {/* Nút Tải PDF */}
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl transition-all shadow-xs active:scale-95 disabled:opacity-60"
            >
              {isExporting ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isExporting ? 'Đang xuất...' : 'Tải PDF'}</span>
            </button>

            <button
              onClick={() => handleExport('png')}
              disabled={isExporting}
              className="hidden sm:inline-flex px-3 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
            >
              PNG
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CUỐN SỔ HỘ CHIẾU MỞ 2 TRANG                                               */}
      {/* ========================================================================= */}
      {currentPet ? (
        <div
          ref={passportBookletRef}
          className="w-full bg-[#162D4A] p-2.5 sm:p-5 rounded-[28px] sm:rounded-[36px] shadow-2xl border-4 border-[#0F2238] overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 relative bg-[#EAF3FA] rounded-[20px] sm:rounded-[26px] p-4 sm:p-8 overflow-hidden">
            {/* Đường gáy sổ ở giữa */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[6px] -translate-x-1/2 bg-gradient-to-r from-slate-400/30 via-slate-500/20 to-slate-400/30 shadow-inner z-20 pointer-events-none" />

            {/* ================= TRANG TRÁI: PET PASSPORT ================= */}
            <div className="relative flex flex-col justify-between bg-gradient-to-b from-[#F2F8FD] via-[#F6FAFD] to-[#E5F1FA] rounded-2xl p-4 sm:p-6 border border-[#CDE1F0] min-h-[460px] sm:min-h-[500px]">
              {/* Watermarks */}
              <div className="absolute top-3 left-4 text-slate-300/40 pointer-events-none">
                <PawPrint className="w-8 h-8 rotate-[-15deg]" />
              </div>
              <div className="absolute bottom-4 right-6 text-slate-300/30 pointer-events-none">
                <PawPrint className="w-12 h-12 rotate-[25deg]" />
              </div>

              {/* Header Trang Trái */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <PawPrint className="w-5 h-5 text-[#1E3A5F]" />
                <h3 className="text-base sm:text-lg font-black tracking-widest text-[#1E3A5F] uppercase">
                  PET PASSPORT
                </h3>
              </div>

              {/* Body Trang Trái */}
              <div className="grid grid-cols-12 gap-3 sm:gap-4 my-auto items-start">
                {/* Cột Trái: Ảnh & Quote */}
                <div className="col-span-5 flex flex-col items-center">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-200">
                    <img
                      src={currentPet.avatarUrl}
                      alt={currentPet.name}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-xs sm:text-sm font-medium italic text-[#1E3A5F] font-serif leading-tight whitespace-pre-line">
                      "{currentPet.quote}"
                    </p>
                    <div className="flex items-center justify-center text-[#0284C7] mt-1">
                      <Heart className="w-3.5 h-3.5 fill-[#0284C7]" />
                    </div>
                  </div>
                </div>

                {/* Cột Phải: Các thông số định danh */}
                <div className="col-span-7 space-y-2 text-xs sm:text-sm pl-1">
                  <div className="mb-2">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-xl sm:text-2xl font-black text-[#1E3A5F] tracking-tight">
                        {currentPet.name}
                      </h2>
                      <PawPrint className="w-4 h-4 text-[#1E3A5F]" />
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      PET ID <span className="font-mono text-[#0284C7] font-bold">{currentPet.petCode}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Cat className="w-4 h-4 text-[#1E3A5F] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">
                        Species
                      </span>
                      <span className="font-bold text-[#1E3A5F]">{currentPet.species}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <PawPrint className="w-4 h-4 text-[#1E3A5F] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">
                        Breed
                      </span>
                      <span className="font-bold text-[#1E3A5F] leading-tight block truncate">
                        {currentPet.breed}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-sm font-bold text-[#1E3A5F] leading-none">⚥</span>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">
                        Sex
                      </span>
                      <span className="font-bold text-[#1E3A5F]">{currentPet.sex}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-[#1E3A5F] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">
                        Birthday
                      </span>
                      <span className="font-bold text-[#1E3A5F]">{currentPet.birthday}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Scale className="w-4 h-4 text-[#1E3A5F] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">
                        Weight
                      </span>
                      <span className="font-bold text-[#1E3A5F]">{currentPet.weight}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chân Trang Trái: Owner & Footer */}
              <div className="mt-4 pt-3 border-t border-[#CDE1F0]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[#1E3A5F]">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">
                      OWNER
                    </span>
                    <span className="text-xs sm:text-sm font-black text-[#1E3A5F]">
                      {currentPet.ownerName}
                    </span>
                  </div>
                </div>

                <div className="text-center text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                  - PET PASSPORT -
                </div>
              </div>
            </div>

            {/* ================= TRANG PHẢI: DIGITAL PET ID ================= */}
            <div className="relative flex flex-col justify-between bg-gradient-to-b from-[#F2F8FD] via-[#F6FAFD] to-[#E5F1FA] rounded-2xl p-4 sm:p-6 border border-[#CDE1F0] min-h-[460px] sm:min-h-[500px]">
              <div className="absolute bottom-4 right-4 text-slate-300/30 pointer-events-none">
                <PawPrint className="w-10 h-10 rotate-[15deg]" />
              </div>

              {/* Header Trang Phải */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#1E3A5F]" />
                <h3 className="text-base sm:text-lg font-black tracking-widest text-[#1E3A5F] uppercase">
                  DIGITAL PET ID
                </h3>
              </div>

              {/* Phần 1: Khối QR Code */}
              <div className="grid grid-cols-12 gap-3 items-center bg-white/80 p-3.5 rounded-2xl border border-[#D5E6F3] shadow-xs">
                <div className="col-span-5 flex justify-center">
                  <div className="p-1.5 bg-white rounded-xl shadow-xs border border-slate-200">
                    <img
                      src={qrImageUrl}
                      alt="Pet Owner QR Code"
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>

                <div className="col-span-7 pl-1">
                  <p className="text-xs sm:text-sm font-bold text-[#1E3A5F] leading-snug">
                    Scan QR to view pet profile & owner contact
                  </p>
                  <div className="flex items-center text-[#0284C7] mt-1.5">
                    <Heart className="w-4 h-4 fill-[#0284C7]" />
                  </div>
                </div>
              </div>

              {/* Phần 2: Khung EMERGENCY ALERT */}
              <div className="my-3 bg-[#F0F6FB] border border-[#D0E2F0] rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#D9383A] font-black text-xs sm:text-sm uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 text-[#D9383A]" />
                  <span>EMERGENCY ALERT</span>
                </div>

                <div className="text-xs text-[#1E3A5F] space-y-1 pt-1 font-medium">
                  <div>
                    <span className="font-bold text-[#1E3A5F]">Allergy: </span>
                    <span>{currentPet.emergency?.allergy || 'None'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#1E3A5F]">Medication: </span>
                    <span>{currentPet.emergency?.medication || 'None'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#1E3A5F]">Special Note: </span>
                    <span>{currentPet.emergency?.specialNote || 'Friendly'}</span>
                  </div>
                </div>
              </div>

              {/* Phần 3: Khung Contact Owner */}
              <div className="bg-white/80 border border-[#D5E6F3] rounded-2xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-[#1E3A5F] truncate">
                    Contact Owner: <span className="font-mono text-[#0284C7]">{currentPet.ownerPhone}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Scan QR or visit petpassport.com
                  </div>
                </div>
              </div>

              {/* Chân Trang Phải */}
              <div className="mt-4 pt-2 text-center">
                <p className="text-sm font-serif italic text-[#1E3A5F] font-semibold flex items-center justify-center gap-1">
                  Help me get home ♡
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State nếu đã xóa hết pet */
        <div className="w-full bg-white p-12 rounded-3xl border-2 border-dashed border-slate-300 text-center">
          <PawPrint className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">
            Bạn chưa có thú cưng nào trong sổ
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Hãy tạo hộ chiếu điện tử đầu tiên cho chú thú cưng của bạn để bắt đầu lưu trữ hồ sơ và tạo mã QR.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Hộ Chiếu Ngay</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL THÊM / CHỈNH SỬA THÔNG TIN THÚ CƯNG                                 */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#66CCFF] text-white flex items-center justify-center">
                  <PawPrint className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {modalMode === 'create'
                      ? 'Thêm Hộ Chiếu Thú Cưng Mới'
                      : `Chỉnh Sửa Hộ Chiếu Bé ${formData.name}`}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {modalMode === 'create'
                      ? 'Nhập thông tin và tải ảnh để bổ sung bé mới vào sổ hộ chiếu'
                      : 'Cập nhật lại thông tin định danh và hồ sơ y tế của bé'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPet} className="space-y-4 text-xs sm:text-sm">
              {/* Tải ảnh từ thư mục máy tính */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Ảnh đại diện thú cưng <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 shrink-0">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-[#E6F7FF] text-slate-700 hover:text-[#0284C7] font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-[#66CCFF]" />
                      <span>Chọn ảnh từ thư mục máy tính</span>
                    </button>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Hỗ trợ PNG, JPG, JPEG (Tối đa 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Tên & Pet ID */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tên thú cưng <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: Mochi, Bơ..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pet ID (Mã hộ chiếu)
                  </label>
                  <input
                    type="text"
                    value={formData.petCode}
                    onChange={(e) => setFormData({ ...formData, petCode: e.target.value })}
                    placeholder="Ví dụ: VN-MOCHI-001"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
                  />
                </div>
              </div>

              {/* Loài, Giống, Giới tính */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Loài (Species)
                  </label>
                  <select
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
                  >
                    <option value="Cat">Mèo (Cat)</option>
                    <option value="Dog">Chó (Dog)</option>
                    <option value="Rabbit">Thỏ (Rabbit)</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Giống loài (Breed)
                  </label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    placeholder="British Shorthair, Corgi..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Giới tính (Sex)
                  </label>
                  <select
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
                  >
                    <option value="Female">Female (Cái)</option>
                    <option value="Male">Male (Đực)</option>
                  </select>
                </div>
              </div>

              {/* Ngày sinh & Cân nặng */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Ngày sinh (Birthday)
                  </label>
                  <input
                    type="text"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                    placeholder="Ví dụ: 12 May 2024"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Cân nặng (Weight)
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="Ví dụ: 3.8 kg"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
                  />
                </div>
              </div>

              {/* Quote */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Câu nói / Giới thiệu tính cách (Quote)
                </label>
                <input
                  type="text"
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Ví dụ: Small cat, Big personality."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
                />
              </div>

              {/* Chủ sở hữu */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <span className="text-xs font-black text-[#1E3A5F] block uppercase">
                  Thông Tin Chủ Sở Hữu (Tạo Mã QR)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Họ tên chủ nuôi
                    </label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="Scarlett Nguyen"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Số điện thoại liên hệ
                    </label>
                    <input
                      type="text"
                      value={formData.ownerPhone}
                      onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                      placeholder="0901234567"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#66CCFF]"
                    />
                  </div>
                </div>
              </div>

              {/* Dị ứng & Y tế */}
              <div className="p-3 bg-[#FFF5F2] rounded-2xl border border-[#FED7AA] space-y-2">
                <span className="text-xs font-black text-[#D9383A] block uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Cảnh Báo Y Tế & Dị Ứng (Emergency Alert)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Dị ứng (Allergy)
                    </label>
                    <input
                      type="text"
                      value={formData.allergy}
                      onChange={(e) => setFormData({ ...formData, allergy: e.target.value })}
                      placeholder="Seafood, None..."
                      className="w-full px-3 py-2 rounded-xl border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF8A65]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Thuốc men (Medication)
                    </label>
                    <input
                      type="text"
                      value={formData.medication}
                      onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                      placeholder="None, Thuốc men..."
                      className="w-full px-3 py-2 rounded-xl border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF8A65]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Ghi chú đặc biệt (Special Note)
                  </label>
                  <input
                    type="text"
                    value={formData.specialNote}
                    onChange={(e) => setFormData({ ...formData, specialNote: e.target.value })}
                    placeholder="Shy but affectionate..."
                    className="w-full px-3 py-2 rounded-xl border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF8A65]"
                  />
                </div>
              </div>

              {/* Submit buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] font-bold text-white shadow-md transition-all active:scale-95"
                >
                  {modalMode === 'create' ? 'Tạo Hộ Chiếu Ngay' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL XÁC NHẬN XÓA THÚ CƯNG                                              */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && currentPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-black text-slate-900">
              Xác Nhận Xóa Hộ Chiếu?
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Bạn có chắc chắn muốn xóa hộ chiếu của bé{' '}
              <b className="text-slate-900">{currentPet.name}</b> (Mã: {currentPet.petCode})? Dữ liệu này sẽ bị gỡ bỏ khỏi sổ hộ chiếu của bạn.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-xs text-white shadow-md transition-all active:scale-95"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassportCard;

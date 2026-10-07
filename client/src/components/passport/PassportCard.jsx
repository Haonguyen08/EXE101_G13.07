import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  RotateCw,
  Download,
  ShieldCheck,
  QrCode,
  AlertTriangle,
  HeartPulse,
  Cpu,
  FileText,
  Sparkles,
  PawPrint,
  CheckCircle2,
  Calendar,
  Scale,
  BadgeAlert,
  Printer
} from 'lucide-react';

/**
 * PassportCard Component
 * - 3D Flip Card: Front (Identification) & Back (Medical & Rescue)
 * - Tông màu Pastel Sky Blue (#66CCFF) và Trắng (#FFFFFF)
 * - Xuất file PNG / PDF chất lượng cao bằng html2canvas & jspdf
 */
const PassportCard = ({
  pet = {
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
    expiryDate: 'Vô thời hạn (Lifetime)',
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
      qrUrl: 'https://petpassport.vn/p/VN-PAW-882341',
      qrImageUrl: ''
    }
  }
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState('pdf'); // 'pdf' | 'png'
  const [copied, setCopied] = useState(false);

  // Hidden print container refs for crisp 2-face export
  const exportContainerRef = useRef(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pet.petCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to generate MRZ lines
  const cleanCode = (pet.petCode || 'VN-PAW-000000').replace(/[^a-zA-Z0-9]/g, '');
  const cleanName = (pet.name || 'PET').toUpperCase().replace(/[^A-Z]/g, '');
  const mrzLine1 = `P<VNM${cleanCode}<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`.slice(0, 36);
  const mrzLine2 = `VN${cleanCode}9VNM2206154M9912318<<<${cleanName}<<<<<<<02`.slice(0, 36);

  // Export using html2canvas & jsPDF
  const handleDownload = async (type = 'pdf') => {
    if (!exportContainerRef.current) return;
    setIsExporting(true);

    try {
      const container = exportContainerRef.current;
      // Show container off-screen temporarily with visible display
      container.style.display = 'flex';

      const frontEl = container.querySelector('#export-card-front');
      const backEl = container.querySelector('#export-card-back');

      const canvasFront = await html2canvas(frontEl, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
      });

      const canvasBack = await html2canvas(backEl, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
      });

      container.style.display = 'none';

      if (type === 'pdf') {
        // PDF Landscape A5 (210mm x 148mm)
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a5',
        });

        const imgDataFront = canvasFront.toDataURL('image/png');
        const imgDataBack = canvasBack.toDataURL('image/png');

        // Page 1: Mặt trước
        pdf.addImage(imgDataFront, 'PNG', 12, 10, 186, 128);
        
        // Page 2: Mặt sau
        pdf.addPage('a5', 'landscape');
        pdf.addImage(imgDataBack, 'PNG', 12, 10, 186, 128);

        pdf.save(`PetPassport_${pet.petCode}.pdf`);
      } else {
        // PNG export: Merge both cards onto a single combined canvas
        const combinedCanvas = document.createElement('canvas');
        const gap = 30;
        combinedCanvas.width = canvasFront.width;
        combinedCanvas.height = canvasFront.height * 2 + gap;

        const ctx = combinedCanvas.getContext('2d');
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
        ctx.drawImage(canvasFront, 0, 0);
        ctx.drawImage(canvasBack, 0, canvasFront.height + gap);

        const link = document.createElement('a');
        link.download = `PetPassport_${pet.petCode}.png`;
        link.href = combinedCanvas.toDataURL('image/png');
        link.click();
      }
    } catch (err) {
      console.error('Lỗi khi xuất thẻ hộ chiếu:', err);
      alert('Có lỗi xảy ra trong quá trình xuất thẻ. Vui lòng thử lại!');
    } finally {
      if (exportContainerRef.current) {
        exportContainerRef.current.style.display = 'none';
      }
      setIsExporting(false);
    }
  };

  // Fallback QR code SVG rendering if qrImageUrl is not provided
  const rescueUrl = pet.qrCode?.qrUrl || `${window.location.origin}/p/${pet.petCode}`;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 sm:p-6">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full mb-6 bg-white/90 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 text-slate-700">
          <PawPrint className="w-5 h-5 text-[#66CCFF]" />
          <span className="font-semibold text-sm sm:text-base">Hộ Chiếu Điện Tử</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#E6F7FF] text-[#0284C7] font-medium border border-[#66CCFF]/30">
            {isFlipped ? 'Mặt Sau: Y Tế & Cứu Hộ' : 'Mặt Trước: Định Danh'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Nút Lật Thẻ 3D */}
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-[#E6F7FF] hover:text-[#0284C7] border border-slate-200 hover:border-[#66CCFF] rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
            title="Lật sang mặt còn lại của thẻ"
          >
            <RotateCw className={`w-4 h-4 text-[#66CCFF] transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
            <span>Lật thẻ</span>
          </button>

          {/* Menu / Nút Tải Hộ Chiếu */}
          <div className="relative group">
            <button
              onClick={() => handleDownload('pdf')}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#66CCFF] hover:bg-[#3399CC] rounded-xl transition-all duration-200 shadow-md hover:shadow-sky-soft active:scale-95 disabled:opacity-60"
            >
              {isExporting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isExporting ? 'Đang xuất...' : 'Tải hộ chiếu (PDF)'}</span>
            </button>
            
            {/* Quick dropdown for PNG option */}
            <button
              onClick={() => handleDownload('png')}
              disabled={isExporting}
              className="hidden sm:inline-flex ml-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-sm"
              title="Tải ảnh PNG 2 mặt sắc nét"
            >
              PNG
            </button>
          </div>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div className="w-full perspective-1000">
        <div
          className={`relative w-full aspect-[1.586/1] min-h-[380px] sm:min-h-[420px] transition-transform duration-700 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* ========================================================= */}
          {/* MẶT TRƯỚC (IDENTIFICATION)                                */}
          {/* ========================================================= */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#E6F7FF]/50 border-2 border-[#66CCFF]/40 shadow-xl overflow-hidden flex flex-col justify-between p-5 sm:p-7">
            {/* Background Decorative Guilloche / Wave Patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#66CCFF]/15 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-radial from-[#66CCFF]/10 to-transparent rounded-full -ml-16 -mb-16 pointer-events-none" />

            {/* Header Thẻ */}
            <div className="relative z-10 flex items-start justify-between border-b border-[#66CCFF]/20 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#66CCFF] to-[#BAE6FD] flex items-center justify-center shadow-md shadow-[#66CCFF]/20">
                  <PawPrint className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold tracking-wider text-[#0284C7] uppercase">
                    SOCIALIST REPUBLIC OF VIETNAM
                  </h3>
                  <h1 className="text-base sm:text-lg font-black tracking-wide text-slate-900 flex items-center gap-1.5">
                    HỘ CHIẾU THÚ CƯNG
                    <span className="text-xs font-normal text-slate-500">/ PET PASSPORT</span>
                  </h1>
                </div>
              </div>

              {/* Digital Chip Badge */}
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#E6F7FF] border border-[#66CCFF]/40 text-[#0284C7] text-xs font-semibold">
                  <Cpu className="w-3.5 h-3.5 text-[#66CCFF]" />
                  <span>BIOMETRIC CHIP</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">ISO 11784/11785</span>
              </div>
            </div>

            {/* Thân thẻ: Ảnh + Thông tin chi tiết */}
            <div className="relative z-10 grid grid-cols-12 gap-4 sm:gap-6 my-auto pt-2">
              {/* Cột Trái: Ảnh đại diện + Pet Code */}
              <div className="col-span-4 sm:col-span-4 flex flex-col items-center">
                <div className="relative w-24 h-28 sm:w-32 sm:h-36 rounded-2xl overflow-hidden border-2 border-white shadow-lg ring-2 ring-[#66CCFF]/50 bg-slate-100 group">
                  <img
                    src={pet.avatarUrl}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    crossOrigin="anonymous"
                  />
                  {/* Verified Watermark Badge */}
                  <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-[#0EA5E9]" />
                  </div>
                </div>

                {/* Pet Code badge with copy */}
                <button
                  onClick={handleCopyCode}
                  className="mt-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#E6F7FF] text-slate-800 text-xs font-mono font-bold tracking-wider border border-slate-200 transition-colors"
                  title="Click để sao chép mã hộ chiếu"
                >
                  <span>{pet.petCode}</span>
                  {copied && <CheckCircle2 className="w-3 h-3 text-emerald-600 ml-0.5" />}
                </button>
              </div>

              {/* Cột Phải: Bảng thông số định danh */}
              <div className="col-span-8 sm:col-span-8 grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:text-sm">
                <div className="col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Tên / Given Name</span>
                  <span className="text-base sm:text-lg font-black text-slate-900 tracking-wide">{pet.name}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Loài / Species</span>
                  <span className="font-semibold text-slate-800">{pet.species}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Giới tính / Sex</span>
                  <span className="font-semibold text-slate-800">{pet.sex}</span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Giống / Breed</span>
                  <span className="font-semibold text-slate-800 truncate block">{pet.breed}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Cân nặng / Weight</span>
                  <span className="font-semibold text-slate-800">{pet.weight}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Ngày sinh / Date of Birth</span>
                  <span className="font-semibold text-slate-800">{pet.birthday}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Chủ sở hữu / Owner</span>
                  <span className="font-semibold text-slate-800 truncate block">{pet.owner?.fullName || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Dải mã vạch MRZ (Machine Readable Zone) chuẩn hộ chiếu quốc tế */}
            <div className="relative z-10 mt-auto pt-2 border-t border-slate-200/80 bg-slate-50/70 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 px-5 py-2 sm:px-7 rounded-b-3xl">
              <div className="font-mono text-[10px] sm:text-[11px] leading-tight text-slate-600 tracking-[0.22em] font-semibold select-none overflow-hidden text-center sm:text-left">
                <div>{mrzLine1}</div>
                <div>{mrzLine2}</div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* MẶT SAU (MEDICAL & RESCUE)                                 */}
          {/* ========================================================= */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-white via-white to-[#FFF5F2] border-2 border-[#FF8A65]/30 shadow-xl overflow-hidden flex flex-col justify-between p-5 sm:p-7">
            {/* Header Mặt Sau */}
            <div className="relative z-10 flex items-center justify-between border-b border-orange-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF8A65] to-amber-300 flex items-center justify-center shadow-md shadow-[#FF8A65]/20">
                  <HeartPulse className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                    MEDICAL & EMERGENCY RESCUE
                  </h3>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                    HỒ SƠ Y TẾ & CỨU HỘ KHẨN CẤP
                  </h2>
                </div>
              </div>

              {/* Microchip Badge */}
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Số Microchip</span>
                <span className="font-mono text-xs sm:text-sm font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                  {pet.microchip}
                </span>
              </div>
            </div>

            {/* Nội dung trung tâm: Cảnh báo y tế + QR cứu hộ */}
            <div className="relative z-10 grid grid-cols-12 gap-4 my-auto pt-2 items-center">
              {/* Khung bên trái: Cảnh báo dị ứng & thuốc men */}
              <div className="col-span-7 sm:col-span-8 space-y-2.5">
                {/* Khung cảnh báo dị ứng màu cam/đỏ dịu */}
                <div className="bg-[#FFF5F2] border border-[#FF8A65]/40 rounded-2xl p-3 shadow-xs">
                  <div className="flex items-center gap-1.5 text-orange-700 font-bold text-xs mb-1">
                    <BadgeAlert className="w-4 h-4 text-[#FF8A65]" />
                    <span>CẢNH BÁO DỊ ỨNG (ALLERGIES)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {pet.emergency?.allergies?.length > 0 ? (
                      pet.emergency.allergies.map((allergy, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium bg-white text-orange-800 px-2 py-0.5 rounded-lg border border-orange-200/80 shadow-xs"
                        >
                          ⚠️ {allergy}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">Không có tiền sử dị ứng</span>
                    )}
                  </div>
                </div>

                {/* Thuốc men & điều trị */}
                <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-2.5 text-xs">
                  <div className="font-bold text-amber-900 text-[11px] mb-1 flex items-center gap-1">
                    <span>💊 Thuốc đang điều trị:</span>
                  </div>
                  <div className="text-slate-700 space-y-0.5 text-[11px]">
                    {pet.emergency?.medications?.map((med, idx) => (
                      <div key={idx} className="flex items-start gap-1">
                        <span className="text-amber-500">•</span>
                        <span>{med}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ghi chú tính cách */}
                <div className="text-xs bg-slate-50 border border-slate-200/80 rounded-xl p-2 text-slate-600">
                  <span className="font-semibold text-slate-700">Ghi chú tính cách: </span>
                  <span>{pet.emergency?.specialNote || pet.bio}</span>
                </div>
              </div>

              {/* Khung bên phải: Mã QR Cứu hộ độc bản */}
              <div className="col-span-5 sm:col-span-4 flex flex-col items-center justify-center text-center pl-2">
                <div className="p-2.5 bg-white rounded-2xl shadow-md border-2 border-[#66CCFF]/40 ring-4 ring-[#E6F7FF] flex flex-col items-center">
                  {/* Generated QR Placeholder / Real QR img */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-slate-900 rounded-xl p-1 relative overflow-hidden">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                        rescueUrl
                      )}`}
                      alt="Rescue QR Code"
                      className="w-full h-full object-contain bg-white rounded-lg p-1"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-[10px] font-black text-[#0284C7] uppercase tracking-wide block">
                    QUÉT ĐỂ CỨU HỘ
                  </span>
                  <span className="text-[9px] text-slate-500 block leading-tight">
                    Scan when pet is lost
                  </span>
                </div>
              </div>
            </div>

            {/* Chân thẻ mặt sau: Thông tin liên lạc khẩn cấp */}
            <div className="relative z-10 mt-auto pt-2 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Liên hệ khẩn cấp (SĐT Chủ)</span>
                <span className="font-bold text-slate-900 text-sm">{pet.owner?.phone || '0901234567'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Địa chỉ đăng ký</span>
                <span className="text-xs font-semibold text-slate-700">{pet.owner?.address || 'Việt Nam'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Helper text */}
      <div className="flex items-center gap-1.5 mt-4 text-xs text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-[#66CCFF]" />
        <span>Click <b>"Lật thẻ"</b> để xem 2 mặt hộ chiếu. Nhấn <b>"Tải hộ chiếu"</b> để xuất file PDF in ấn chuẩn quốc tế.</span>
      </div>

      {/* ========================================================================= */}
      {/* HIDDEN OFFLINE CONTAINER DÙNG ĐỂ RENDER HTML2CANVAS 2 MẶT SẮC NÉT KHÔNG BỊ XOAY 3D */}
      {/* ========================================================================= */}
      <div
        ref={exportContainerRef}
        style={{ display: 'none', position: 'fixed', left: '-9999px', top: 0, flexDirection: 'column', gap: '30px' }}
      >
        {/* Export Face 1: Mặt trước (Flat 2D, width 680px) */}
        <div
          id="export-card-front"
          style={{
            width: '680px',
            height: '430px',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '2px solid rgba(102, 204, 255, 0.5)',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: 'Inter, sans-serif',
            boxSizing: 'border-box',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(102, 204, 255, 0.3)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', backgroundColor: '#66CCFF', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: '24px' }}>🐾</span>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0284C7', letterSpacing: '1px' }}>SOCIALIST REPUBLIC OF VIETNAM</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A' }}>HỘ CHIẾU THÚ CƯNG <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#64748B' }}>/ PET PASSPORT</span></div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0284C7', backgroundColor: '#E6F7FF', padding: '4px 10px', borderRadius: '8px' }}>BIOMETRIC CHIP</div>
              <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>ISO 11784/11785</div>
            </div>
          </div>

          {/* Body */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', margin: 'auto 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={pet.avatarUrl}
                alt={pet.name}
                style={{ width: '130px', height: '145px', objectFit: 'cover', borderRadius: '16px', border: '2px solid #66CCFF' }}
                crossOrigin="anonymous"
              />
              <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>
                {pet.petCode}
              </div>
            </div>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94A3B8' }}>TÊN / GIVEN NAME</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A' }}>{pet.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94A3B8' }}>LOÀI / SPECIES</div>
                <div style={{ fontWeight: '600', color: '#1E293B' }}>{pet.species}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94A3B8' }}>GIỚI TÍNH / SEX</div>
                <div style={{ fontWeight: '600', color: '#1E293B' }}>{pet.sex}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94A3B8' }}>GIỐNG / BREED</div>
                <div style={{ fontWeight: '600', color: '#1E293B' }}>{pet.breed}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94A3B8' }}>CÂN NẶNG / WEIGHT</div>
                <div style={{ fontWeight: '600', color: '#1E293B' }}>{pet.weight}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94A3B8' }}>NGÀY SINH / BIRTHDAY</div>
                <div style={{ fontWeight: '600', color: '#1E293B' }}>{pet.birthday}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94A3B8' }}>CHỦ NUÔI / OWNER</div>
                <div style={{ fontWeight: '600', color: '#1E293B' }}>{pet.owner?.fullName || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* MRZ footer */}
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '8px', backgroundColor: '#F8FAFC', margin: '-10px -28px -28px -28px', padding: '10px 28px', borderRadius: '0 0 24px 24px', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '3px', color: '#475569' }}>
            <div>{mrzLine1}</div>
            <div>{mrzLine2}</div>
          </div>
        </div>

        {/* Export Face 2: Mặt sau (Medical & Rescue) */}
        <div
          id="export-card-back"
          style={{
            width: '680px',
            height: '430px',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '2px solid rgba(255, 138, 101, 0.4)',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: 'Inter, sans-serif',
            boxSizing: 'border-box',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #FED7AA', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', backgroundColor: '#FF8A65', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: '22px' }}>🩺</span>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#EA580C', letterSpacing: '1px' }}>MEDICAL & EMERGENCY RESCUE</div>
                <div style={{ fontSize: '17px', fontWeight: '900', color: '#0F172A' }}>HỒ SƠ Y TẾ & CỨU HỘ KHẨN CẤP</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94A3B8' }}>MICROCHIP NUMBER</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', fontFamily: 'monospace', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>{pet.microchip}</div>
            </div>
          </div>

          {/* Center Content */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', margin: 'auto 0' }}>
            <div style={{ flex: 1 }}>
              {/* Alert Box */}
              <div style={{ backgroundColor: '#FFF5F2', border: '1px solid #FED7AA', borderRadius: '14px', padding: '10px 14px', marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#C2410C', marginBottom: '4px' }}>⚠️ CẢNH BÁO DỊ ỨNG (ALLERGIES)</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {pet.emergency?.allergies?.map((item, i) => (
                    <span key={i} style={{ fontSize: '11px', backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', border: '1px solid #FED7AA', color: '#9A3412' }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Medication */}
              <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '12px', padding: '8px 12px', fontSize: '11px', marginBottom: '8px' }}>
                <div style={{ fontWeight: 'bold', color: '#92400E' }}>💊 Thuốc điều trị:</div>
                <div style={{ color: '#78350F' }}>{pet.emergency?.medications?.join(', ')}</div>
              </div>

              {/* Note */}
              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '8px 12px', fontSize: '11px', color: '#475569' }}>
                <b>Ghi chú:</b> {pet.emergency?.specialNote || pet.bio}
              </div>
            </div>

            {/* QR Code */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ padding: '8px', backgroundColor: '#fff', borderRadius: '16px', border: '2px solid #66CCFF', boxShadow: '0 4px 12px rgba(102, 204, 255, 0.2)' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(rescueUrl)}`}
                  alt="QR Code"
                  style={{ width: '105px', height: '105px', display: 'block' }}
                  crossOrigin="anonymous"
                />
              </div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#0284C7', marginTop: '6px' }}>QUÉT ĐỂ CỨU HỘ</div>
            </div>
          </div>

          {/* Bottom */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '8px', fontSize: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 'bold' }}>LIÊN HỆ CHỦ NUÔI: </span>
              <span style={{ fontWeight: 'bold', color: '#0F172A' }}>{pet.owner?.phone}</span>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 'bold' }}>ĐỊA CHỈ: </span>
              <span style={{ color: '#475569' }}>{pet.owner?.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassportCard;

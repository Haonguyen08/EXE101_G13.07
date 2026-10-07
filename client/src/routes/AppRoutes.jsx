import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import PublicRescuePage from '../pages/PublicRescuePage';
import AdminDashboardPage from '../pages/AdminDashboardPage';

/**
 * AppRoutes
 * Định tuyến toàn bộ ứng dụng Client
 * - / : Trang chủ & Thẻ hộ chiếu 3D Flip Card
 * - /p/:petCode : Trang quét mã QR cứu hộ di động
 * - /admin : Bảng điều khiển quản trị viên
 */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/p/:petCode" element={<PublicRescuePage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

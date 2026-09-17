import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import { useAuthStore } from './store/useAuthStore';

import { AdminLayout } from './features/admin/AdminLayout';
import { Login } from './features/admin/Login';
import { OrdersDashboard } from './features/admin/OrdersDashboard';
import { InventoryDashboard } from './features/admin/InventoryDashboard';

import { CatalogDashboard } from './features/admin/CatalogDashboard';
import { SettingsDashboard } from './features/admin/SettingsDashboard';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/admin/login" element={<Login />} />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="orders" element={<OrdersDashboard />} />
          <Route path="inventory" element={<InventoryDashboard />} />
          <Route path="catalog" element={<CatalogDashboard />} />
          <Route path="settings" element={<SettingsDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

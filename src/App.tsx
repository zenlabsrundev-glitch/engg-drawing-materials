import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useDataStore } from './store/dataStore';

// Layouts
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { Login } from './components/auth/login/login';
import { StudentCartPage } from './components/student/cart/StudentCartPage';
import { StudentOrdersPage } from './components/student/orders/StudentOrdersPage';
import { StudentProfilePage } from './components/student/profile/StudentProfilePage';
import { AdminDashboard } from './components/admin/dashboard/AdminDashboard';
import { ManageOrdersPage } from './components/admin/orders/ManageOrdersPage';
import { ManageUsersPage } from './components/admin/users/ManageUsersPage';
import { ManageKitsPage } from './components/admin/kits/ManageKitsPage';
import { AdminReportsPage } from './components/admin/reports/AdminReportsPage';
import { AdminSettingsPage } from './components/admin/settings/AdminSettingsPage';
import { StudentKitsPage } from './components/student/kits/StudentKitsPage';


const App: React.FC = () => {
  const initData = useDataStore(state => state.initData);
  const { role, isAuthenticated } = useAuthStore();

  useEffect(() => {
    initData();
  }, [initData]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>

        {/* Student Routes */}
        <Route 
          path="/student" 
          element={
            isAuthenticated && role === 'student' 
              ? <DashboardLayout /> 
              : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to="kits" replace />} />
          <Route path="kits" element={<StudentKitsPage />} />
          <Route path="cart" element={<StudentCartPage />} />
          <Route path="orders" element={<StudentOrdersPage />} />
          <Route path="profile" element={<StudentProfilePage />} />
        </Route>

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            isAuthenticated && role === 'admin' 
              ? <DashboardLayout /> 
              : <Navigate to="/login" replace />
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<ManageOrdersPage />} />
          <Route path="users" element={<ManageUsersPage />} />
          <Route path="kits" element={<ManageKitsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
